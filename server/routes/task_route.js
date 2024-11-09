// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = mongoose.model("Task");
const User = mongoose.model("User");
const authenticateToken = require("../middlewares/authMiddleware");
const checkAdminRole = require("../middlewares/roleMiddleware");

// Route to get all tasks
router.get("/tasks", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// Route to add a new task (admin only)
router.post("/tasks",authenticateToken, checkAdminRole, async (req, res) => {
  const {
    taskName,
    points,
    category,
    friends,
    socialMediaPlatform,
    socialMediaLink,
  } = req.body;

  try {
    if (category === "Earn") {
      if (
        !socialMediaPlatform ||
        !["Instagram", "Facebook", "LinkedIn", "YouTube", "Twitter"].includes(
          socialMediaPlatform
        )
      ) {
        return res.status(400).json({
          message:
            "Social media platform is required and must be one of Instagram, Facebook, LinkedIn, YouTube or Twitter.",
        });
      }

      if (!socialMediaLink) {
        return res
          .status(400)
          .json({ message: "Social media link is required for Earn tasks." });
      }
    }
    const newTask = new Task({
      taskName,
      points,
      category,
      friends: category === "Friends" ? friends : 0, // Set friends if category is "Friends"
      socialMediaPlatform: category === "Earn" ? socialMediaPlatform : null,
      socialMediaLink: category === "Earn" ? socialMediaLink : null,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Error adding task" });
  }
});

router.put("/task/:id/start", authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Find the task and user
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the task has already been completed
    const taskCompletionStatus = user.completedTasks.find(
      (taskStatus) => taskStatus.taskId.toString() === taskId
    );

    if (taskCompletionStatus && taskCompletionStatus.status === "complete") {
      return res.status(400).json({ message: "Task already completed." });
    }

    // Add task to completedTasks if not already present
    if (!taskCompletionStatus) {
      user.completedTasks.push({ taskId, status: "complete" });
    } else {
      // Update the task completion status if it was in "start"
      taskCompletionStatus.status = "complete";
    }

    // Update the user's wallet
    user.walletAmount += task.points;
    await user.save();

    // Mark task as completed
    task.taskCompletion = "complete";
    await task.save();

    res.status(200).json({
      message: "Task completed and points added to wallet.",
      task: task,
      user: { id: user._id, walletAmount: user.walletAmount },
    });
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Route to update task open count
router.put("/task/:id/open", authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    // Find the user and the task
    // const user = await User.findById(userId);
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.opensCount += 1;
    await task.save();

    if (task.opensCount === 2 && task.taskCompletion !== "complete") {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      user.walletAmount += task.points;
      await user.save();

      task.taskCompletion = "complete";
      await task.save();

      return res.status(200).json({
        message: `Task completed! Points added to your wallet. You earned ${task.points} BP.`,
        task,
        user: { id: user._id, walletAmount: user.walletAmount },
      });
    }
      res
        .status(200)
        .json({ message: `Task opened ${task.opensCount} time(s).`, task });
  } catch (error) {
    console.error("Error opening task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Route to delete a task (admin only)
router.delete("/task/:id", authenticateToken, checkAdminRole, async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Find the task by its ID and delete it
    const result = await Task.deleteOne({ _id: taskId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task." });
  }
});


module.exports = router;
