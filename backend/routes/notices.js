// routes/notices.js

const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");

// GET /notices — get all notices
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /notices/latest — most recent notice
router.get("/latest", async (req, res) => {
  try {
    const notice = await Notice.findOne().sort({ date: -1 });
    if (!notice) {
      return res.status(404).json({ error: "No notices found" });
    }
    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /notices/:id — get notice by ID
router.get("/:id", async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.json(notice);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid notice ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

// POST /notices — create a new notice
router.post("/", async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    res.status(201).json(notice);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /notices/:id — update a notice
router.put("/:id", async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.json(notice);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid notice ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /notices/:id — delete a notice
router.delete("/:id", async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ error: "Notice not found" });
    }
    res.json({ message: "Notice deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid notice ID format" });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;