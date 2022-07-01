const Admin = require("../models/adminModel");

const authIsAdmin = async (req, res, next) => {
  try {
    if (req.user.rule === "admin") next();
    else return res.status(400).json({ msg: "you are a customer" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = authIsAdmin;
