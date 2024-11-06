import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AddTask.css";

const AddTask = () => {
  const [taskName, setTaskName] = useState("");
  const [points, setPoints] = useState("");
  const [category, setCategory] = useState("");
  const [friends, setFriends] = useState(0);

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3300/tasks", {
        taskName,
        points,
        category,
        friends: category === "Friends" ? friends : 0,
      });

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Task Added",
        text: `Task "${taskName}" has been successfully added!`,
        confirmButtonColor: "#FFA500",
      });

      // Clear form fields
      setTaskName("");
      setPoints("");
      setCategory("");
      setFriends(0);
    } catch (error) {
      console.error("Error adding task:", error);

      // Show error message
      Swal.fire({
        icon: "error",
        title: "Failed to Add Task",
        text: "An error occurred while adding the task. Please try again.",
        confirmButtonColor: "#FFA500",
      });
    }
  };

  return (
    <div className="task-form-container">
      <h3 className="task-form-title">Add New Task</h3>
      <form onSubmit={handleAddTask} className="task-form">
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="task-input"
          required
        />
        <input
          type="number"
          placeholder="Points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="task-input"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="task-select"
          required
        >
          <option value="">Select Category</option>
          <option value="Earn">Earn</option>
          <option value="Weekly">Weekly</option>
          <option value="New">New</option>
          <option value="OnChain">OnChain</option>
          <option value="Friends">Friends</option>
        </select>
        {category === "Friends" && (
          <input
            type="number"
            placeholder="Number of Friends"
            value={friends}
            onChange={(e) => setFriends(e.target.value)}
            className="task-input"
          />
        )}
        <button type="submit" className="task-submit-btn">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
