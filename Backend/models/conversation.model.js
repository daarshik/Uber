const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ride",
      required: true,
      unique: true, // One conversation per ride
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "captain",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("conversation", conversationSchema);
