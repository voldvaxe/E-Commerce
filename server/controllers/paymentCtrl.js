const Customer = require("../models/customerModel");
const paypal = require("paypal-rest-sdk");

const paymentCtrl = {
  pay: async (req, res) => {
    try {
      let cart = [];
      const user = await Customer.findById(req.user.id)
        .populate("cart.product")
        .select()
        .then((docs) => {
          cart = docs.cart;
        });

      let products = [];
      cart.forEach((element) => {
        const obj = {};
        obj.name = element.product.name;
        obj.sku = element.product.sku;
        obj.price = element.product.price;
        obj.currency = element.product.currency;
        obj.quantity = element.quantity;
        products.push(obj);
      });
      let total = 0;
      for (i = 0; i < cart.length; i++) {
        total += cart[i].product.price * cart[i].quantity;
      }

      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:4000/api/success?id=" + req.user.id,
          cancel_url: "http://localhost:4000/api/cancel",
        },
        transactions: [
          {
            item_list: {
              items: products,
            },
            amount: {
              currency: "USD",
              total: total,
            },
            description: "an order for the best customer ever",
          },
        ],
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              res.json({ forwardLink: payment.links[i].href });
            }
          }
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  success: async (req, res) => {
    try {
      const payerId = req.query.PayerID;
      const paymentId = req.query.paymentId;
      const id = req.query.id;
      let cart = [];
      await Customer.findById(id)
        .populate("cart.product")
        .then((docs) => {
          cart = docs.cart;
        });

      let total = 0;
      for (i = 0; i < cart.length; i++) {
        total += cart[i].product.price * cart[i].quantity;
      }

      const execute_payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              currency: "USD",
              total: total,
            },
          },
        ],
      };
      await Customer.findByIdAndUpdate(id, { cart: [] });

      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        function (error, payment) {
          if (error) {
            console.log(error.response);
            throw error;
          } else {
            console.log(JSON.stringify(payment));
            res.redirect("http://localhost:3000");
          }
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  cancel: async (req, res) => {
    try {
      res.send("Cancelled");
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = paymentCtrl;
