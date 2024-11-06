// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = mongoose.model("Task");

// Route to get all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// Route to add a new task (admin only)
router.post("/tasks", async (req, res) => {
  const { taskName, points, category, friends } = req.body;

  try {
    const newTask = new Task({
      taskName,
      points,
      category,
      friends: category === "Friends" ? friends : 0, // Set friends if category is "Friends"
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Error adding task" });
  }
});

module.exports = router;
