import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AddTask.css";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const [taskName, setTaskName] = useState("");
  const [points, setPoints] = useState("");
  const [category, setCategory] = useState("");
  const [friends, setFriends] = useState(0);
  const [socialMediaPlatform, setSocialMediaPlatform] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Function to check if the user is an admin based on the JWT token
  const checkAdminStatus = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found. Redirecting to login.");
      navigate("/authenticate"); // Redirect to login if no token is found
      return;
    }

    // Ensure the userData has the role set properly
    if (userData && userData.role === "admin") {
      setIsAdmin(true); // User is admin
      console.log("User is admin.");
    } else {
      setIsAdmin(false);
      console.log("User is not admin. Redirecting to homepage.");
      navigate("/"); // Redirect to homepage if the user is not an admin
    }
  };

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();

    // Validate social media platform for "Earn" category
    if (category === "Earn" && !socialMediaPlatform) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please select a social media platform for Earn tasks.",
        confirmButtonColor: "#FFA500",
      });
      return;
    }
    // Ensure social media link is filled for "Earn" tasks
    if (category === "Earn" && !socialMediaLink) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please provide a link to the social media platform for Earn tasks.",
        confirmButtonColor: "#FFA500",
      });
      return;
    }

    try {
      await axios.post(
        "http://localhost:3300/tasks",
        {
          taskName,
          points,
          category,
          friends: category === "Friends" ? friends : 0,
          socialMediaPlatform: category === "Earn" ? socialMediaPlatform : null,
          socialMediaLink: category === "Earn" ? socialMediaLink : null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Send token in request header
          },
        }
      );

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
      setSocialMediaPlatform("");
      setSocialMediaLink("");
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
        {category === "Earn" && (
          <>
            <select
              value={socialMediaPlatform}
              onChange={(e) => setSocialMediaPlatform(e.target.value)}
              className="task-select"
              required
            >
              <option value="">Select Social Media Platform</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="YouTube">YouTube</option>
              <option value="Twitter">Twitter</option>
            </select>

            <input
              type="url"
              placeholder="Social Media Link"
              value={socialMediaLink}
              onChange={(e) => setSocialMediaLink(e.target.value)}
              className="task-input"
              required
            />
          </>
        )}
        <button type="submit" className="task-submit-btn">
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
