const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const paypal = require("paypal-rest-sdk");

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:3000",
      "http://192.168.1.11:3000",
    ],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "Images")));

paypal.configure({
  mode: "sandbox",
  client_id:
    "AU6bLTjav043hAGxXvtM-2s9wio1BnPP35gd_Gq5kD_Jnxx2uQWD10Mb8FPG6oe5MbSmmIIgT3Yw1ZWG",
  client_secret:
    "EIfs5ztg8OH3aM8EdTd7IPK5pF25CJEkg3IRZwz6pbzXb8jmrTabyJlsabr5k5moDamnCeXa6fi4W0nW",
});

//upload.single('image')

// Routes
app.use("/api", require("./routes/api"));

// Connect to mongodb
mongoose.connect("mongodb://localhost:27017", (err) => {
  if (err) throw err;
  console.log("Connected to MongoDB");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
