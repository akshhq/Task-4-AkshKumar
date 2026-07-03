// models/Assignment.js

const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Submitted", "Overdue"],
        message: "Status must be Pending, Submitted, or Overdue",
      },
      default: "Pending",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);