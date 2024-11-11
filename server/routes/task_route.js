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
    socialMediaPlatform,
    socialMediaLink,
  } = req.body;

  try {
    const newTask = new Task({
      taskName,
      points,
      category,
      socialMediaPlatform,
      socialMediaLink,
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


// Handle claiming points for a task
router.put('/task/:taskId/claim',authenticateToken, async (req, res) => {
  const taskId = req.params.taskId;
  const userId = req.user.id;  // Assume user is authenticated and `req.user.id` contains the user ID

  try {
    // Find the task that the user wants to claim
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Find the user who is claiming the task
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has already completed the task
    const taskCompletion = user.completedTasks.find(
      (completedTask) => completedTask.taskId.toString() === taskId
    );

    if (!taskCompletion) {
      return res.status(400).json({ message: 'You have not completed this task' });
    }

    if (taskCompletion.status === 'claimed') {
      return res.status(400).json({ message: 'Points for this task have already been claimed' });
    }

    // Add points to the user's wallet
    user.walletAmount += task.points;

    // Mark the task as "claimed"
    const updatedCompletedTasks = user.completedTasks.map((completedTask) =>
      completedTask.taskId.toString() === taskId
        ? { ...completedTask, status: 'claimed' }
        : completedTask
    );

    // Save the updated user and task completion status
    user.completedTasks = updatedCompletedTasks;
    await user.save();

    // Return success message
    res.status(200).json({
      message: 'Points claimed successfully!',
      task: {
        id: taskId,
        points: task.points,
      },
      walletAmount: user.walletAmount,
    });
  } catch (error) {
    console.error('Error claiming points:', error);
    res.status(500).json({ message: 'Something went wrong! Please try again later.' });
  }
});
router.put("/task/:taskId/open", authenticateToken, async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.id; // authenticated user
  const { visitCount } = req.body; // Get visitCount from request body

  try {
    const task = await Task.findById(taskId);
    const user = await User.findById(userId);

    if (!task || !user) {
      return res.status(404).json({ message: "Task or user not found" });
    }

    // If task has been completed, prevent further changes
    if (task.taskCompletion === "complete") {
      return res.status(400).json({
        message:
          "This task has already been completed. Points have been awarded.",
      });
    }

    // If the task has a social media link, increment visitCount
    if (task.socialMediaLink) {
      task.visitCount = visitCount; // Update visitCount based on the request

      // If visitCount is 2 or more, mark task as completed
      if (task.visitCount >= 2) {
        task.taskCompletion = "complete";
        user.walletAmount += task.points; // Add points to wallet

        const userTask = user.completedTasks.find(
          (t) => t.taskId.toString() === taskId
        );

        if (!userTask) {
          user.completedTasks.push({
            taskId: task._id,
            status: "complete",
          });
        } else {
          userTask.status = "complete"; // Update task completion status
        }

        await user.save(); // Save updated user
        await task.save(); // Save task completion

        return res.status(200).json({
          message: `Task completed! You earned ${task.points} BP.`,
          task,
          user: { id: user._id, walletAmount: user.walletAmount },
        });
      }

      await task.save(); // Save updated task with increased visit count
      return res.status(200).json({
        message: `Task opened ${task.visitCount} time(s). Keep going!`,
        task,
      });
    } else {
      // Non-social media tasks: complete after first visit
      if (task.taskCompletion === "start") {
        task.taskCompletion = "complete";
        user.walletAmount += task.points; // Add points to wallet

        const userTask = user.completedTasks.find(
          (t) => t.taskId.toString() === taskId
        );

        if (!userTask) {
          user.completedTasks.push({
            taskId: task._id,
            status: "complete",
          });
        } else {
          userTask.status = "complete"; // Update task completion status
        }

        await user.save(); // Save updated user
        await task.save(); // Mark task as completed

        return res.status(200).json({
          message: `Task completed! You earned ${task.points} BP.`,
          task,
          user: { id: user._id, walletAmount: user.walletAmount },
        });
      }

      return res.status(200).json({
        message: "Task already completed.",
        task,
      });
    }
  } catch (error) {
    console.error("Error handling task open:", error);
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
