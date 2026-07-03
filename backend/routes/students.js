// routes/students.js

const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// GET /students — get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /students/count — total student count
router.get("/count", async (req, res) => {
  try {
    const total = await Student.countDocuments();
    res.json({ totalStudents: total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /students/:id — get student by ID
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    // Invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid student ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

// POST /students — create a new student
router.post("/", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    // Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    // Duplicate rollNo
    if (error.code === 11000) {
      return res.status(400).json({ error: "Roll number already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /students/:id — update a student
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid student ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /students/:id — delete a student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid student ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;