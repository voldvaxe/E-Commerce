const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");

const adminCtrl = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password, adminPassword } = req.body;

      if (!firstName || !lastName || !email || !password || !adminPassword)
        return res.status(400).json({ msg: "some parameters are missing" });

      const emailExists = await Admin.findOne({ email });

      if (emailExists)
        return res.status(400).json({ msg: "this email already exists" });

      if (password.length < 6)
        return res.status(400).json({ msg: "this password is too short" });

      if (adminPassword != process.env.ADMIN_PASSWORD)
        return res.status(400).json({ msg: "admin password is not correct" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new Admin({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await newAdmin.save();

      const accesstoken = createAccessToken({
        id: newAdmin._id,
        rule: "admin",
      });
      const refreshtoken = createRefreshToken({
        id: newAdmin._id,
        rule: "admin",
      });

      res.cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        path: "api/admin/refresh_token",
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

      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(400).json({ msg: "email is not exist" });

      const isMatch = await bcrypt.compare(password, admin.password);

      if (!isMatch)
        return res.status(400).json({ msg: "this is a wrong password" });

      const accesstoken = createAccessToken({
        id: admin._id,
        rule: "admin",
      });
      const refreshtoken = createRefreshToken({
        id: admin._id,
        rule: "admin",
      });

      res.cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        path: "api/admin/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", { path: "/admin/refresh_token" });
      return res.json({ msg: "logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;
      if (!rf_token)
        return res.status(400).json({ msg: "please login or register1" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, admin) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register2" });

        const accesstoken = createAccessToken({
          id: admin.id,
          rule: "admin",
        });
        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (admin) => {
  return jwt.sign(admin, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (admin) => {
  return jwt.sign(admin, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = adminCtrl;
