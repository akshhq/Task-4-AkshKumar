// routes/assignments.js

const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");

// GET /assignments — get all assignments
router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /assignments/upcoming — pending assignments with a future due date
router.get("/upcoming", async (req, res) => {
  try {
    const upcoming = await Assignment.find({
      status: "Pending",
      dueDate: { $gte: new Date() },
    }).select("title dueDate");
    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /assignments/:id — get assignment by ID
router.get("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid assignment ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

// POST /assignments — create a new assignment
router.post("/", async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.status(201).json(assignment);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /assignments/:id — update an assignment
router.put("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid assignment ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /assignments/:id — delete an assignment
router.delete("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid assignment ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;