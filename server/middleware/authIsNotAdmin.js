const Admin = require("../models/adminModel");

const authIsNotAdmin = async (req, res, next) => {
  try {
    if (req.user.rule === "customer") next();
    else return res.status(400).json({ msg: "you are an admin" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = authIsNotAdmin;
