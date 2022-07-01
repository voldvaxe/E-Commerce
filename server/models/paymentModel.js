const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    paymentID: {
      type: String,
      required: true,
    },
    cartDetails: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        default: [],
      },
    ],
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
