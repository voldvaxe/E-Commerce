const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Customer = require("../models/customerModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    if (this.queryString.filter) {
      this.queryString.filter = JSON.parse(this.queryString.filter);
      if (
        this.queryString.filter.price.$gte === "" &&
        this.queryString.filter.price.$lte === ""
      ) {
        delete this.queryString.filter.price;
      } else {
        if (this.queryString.filter.price.$gte === "")
          delete this.queryString.filter.price.$gte;
        if (this.queryString.filter.price.$lte === "")
          delete this.queryString.filter.price.$lte;
      }
      if (this.queryString.filter.price) {
        if (this.queryString.filter.price.$gte !== undefined)
          this.queryString.filter.price.$gte = parseInt(
            this.queryString.filter.price.$gte
          );
        if (this.queryString.filter.price.$lte !== undefined)
          this.queryString.filter.price.$lte = parseInt(
            this.queryString.filter.price.$lte
          );
      }

      if (this.queryString.filter.category === "")
        delete this.queryString.filter.category;

      if (this.queryString.filter.name.$regex === "")
        delete this.queryString.filter.name;

      this.query.find(this.queryString.filter);
    } else this.query.find();
    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      this.query = this.query.sort(this.queryString.sort);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Product.find().populate("category comments"),
        req.query
      )
        .filtering()
        .sorting()
        .paginating();

      const Products = await features.query;

      res.json({
        status: "success",
        result: Products.length,
        products: Products,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addProductToCart: async (req, res) => {
    try {
      const { quantity } = req.body;
      const product = req.params.id;
      Customer.findByIdAndUpdate(
        req.user.id,
        { $push: { cart: { product, quantity } } },
        (err) => {
          if (err) res.json(err);
        }
      );
      res.json({ msg: "you added this product to your cart" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const { name, sku, price, description, category } = req.body;
      let images = [];
      req.files.forEach((element) => {
        images.push(element.filename);
      });

      const product = new Product({
        name,
        sku,
        price,
        description,
        category,
        images,
      });
      Category.findByIdAndUpdate(
        category,
        { $push: { products: product._id } },
        (err) => {
          if (err) return res.json(err);
        }
      );
      await product.save();
      res.json({ msg: "Product is added" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id).then(async (docs) => {
        await Category.findByIdAndUpdate(docs.category, {
          $pull: { products: req.params.id },
        });
      });
      await Customer.find({ "cart.product": req.params.id }).then(
        async (docs) => {
          for (let i = 0; i < docs.length; i++) {
            await Customer.findByIdAndUpdate(
              docs[i]._id,
              {
                $pull: { cart: { product: req.params.id } },
              },
              { safe: true, multi: true }
            );
          }
        }
      );

      res.json({ msg: "Product is Deleted" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { name, sku, price, description, category } = req.body;
      let images = [];
      req.files.forEach((element) => {
        images.push(element.filename);
      });
      await Product.findOneAndUpdate(
        { _id: req.params.id },
        { name, sku, price, description, category, images }
      )
        .then(async (docs) => {
          await Category.findByIdAndUpdate(docs.category, {
            $pull: { products: docs._id },
          });
          return docs;
        })
        .then(async (docs) => {
          await Category.findByIdAndUpdate(category, {
            $push: { products: docs._id },
          });
        });

      res.json({ msg: "Product is updated" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productCtrl;
