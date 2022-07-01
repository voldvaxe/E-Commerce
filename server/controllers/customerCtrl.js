const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../models/customerModel");

const customerCtrl = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password, address } = req.body;
      const image = req.file.filename;

      if (!firstName || !lastName || !email || !password || !image || !address)
        return res.status(400).json({ msg: "some parameters are missing" });

      const emailExists = await Customer.findOne({ email });

      if (emailExists)
        return res.status(400).json({ msg: "this email already exists" });

      if (password.length < 6)
        return res.status(400).json({ msg: "this password is too short" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newCustomer = new Customer({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        image,
        address,
      });

      await newCustomer.save();

      const accesstoken = createAccessToken({
        id: newCustomer._id,
        rule: "customer",
      });
      const refreshtoken = createRefreshToken({
        id: newCustomer._id,
        rule: "customer",
      });

      res.cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ msg: "some parameters are missing" });
      const customer = await Customer.findOne({ email });
      if (!customer) return res.status(400).json({ msg: "email is not exist" });

      const isMatch = await bcrypt.compare(password, customer.password);

      if (!isMatch)
        return res.status(400).json({ msg: "this is a wrong password" });

      const accesstoken = createAccessToken({
        id: customer._id,
        rule: "customer",
      });
      const refreshtoken = createRefreshToken({
        id: customer._id,
        rule: "customer",
      });

      res.cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", { path: "/" });
      return res.json({ msg: "logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please login or Register1" });

      jwt.verify(
        rf_token,
        process.env.REFRESH_TOKEN_SECRET,
        (err, customer) => {
          if (err)
            return res.status(400).json({ msg: "Please Login or Register2" });

          const accesstoken = createAccessToken({
            id: customer.id,
            rule: "customer",
          });
          res.json({ accesstoken });
        }
      );
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getInfo: async (req, res) => {
    try {
      const customer = await Customer.findById(req.user.id)
        .select("-password")
        .populate({ path: "cart.product" });
      res.json(customer);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (customer) => {
  return jwt.sign(customer, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (customer) => {
  return jwt.sign(customer, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = customerCtrl;
