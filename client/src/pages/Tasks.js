import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Tasks.css";
import Swal from "sweetalert2";
import config from "../config";

const Tasks = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedCategory, setSelectedCategory] = useState("Available");
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [userData, setUserData] = useState(user);

  const baseURL =
    process.env.NODE_ENV === "development"
      ? config.LOCAL_BASE_URL
      : config.BASE_URL;
  
  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  useEffect(() => {
    if (!user) {
      navigate("/authenticate");
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${baseURL}tasks`, CONFIG_OBJ);
        const tasksWithCompletion = response.data.map((task) => {
          const userCompletedTask = userData.completedTasks.find(
            (userTask) => userTask.taskId === task._id
          );
          return {
            ...task,
            taskCompletion: userCompletedTask
              ? userCompletedTask.status
              : task.taskCompletion,
          };
        });

        setTasks(tasksWithCompletion);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
 
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}profile`,
          CONFIG_OBJ
        );
        setTotalReferrals(response.data.user.totalReferrals);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchTasks();
    fetchProfileData();
  }, [navigate, user, userData, baseURL]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

const handleTaskStart = async (taskId, points, socialMediaLink, visitCount) => {
  if (socialMediaLink) {
    // Open the social media link in a new tab
    window.open(socialMediaLink, "_blank");
    visitCount += 1; // Increment visitCount locally before sending to backend

    try {
      // Send updated visitCount to backend
      const response = await axios.put(
        `${baseURL}task/${taskId}/open`,
        { visitCount }, // Pass visitCount in the request body
        CONFIG_OBJ
      );

      if (response.status === 200) {
        setUserData(response.data.user);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId
              ? {
                  ...task,
                  taskCompletion:
                    visitCount >= 2 ? "complete" : task.taskCompletion,
                  visitCount, // Update visit count here after receiving response
                }
              : task
          )
        );

        if (visitCount === 2) {
          // Task completed after second visit, points are awarded
          Swal.fire({
            icon: "success",
            title: "Task Completed",
            text: `You have successfully completed the task and earned ${points} BP.`,
            confirmButtonColor: "#FFA500",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response
          ? error.response.data.message
          : "Something went wrong! Please try again later.",
      });
    }
  } else {
    // For non-social media link tasks, mark as completed after first visit
    try {
      // Check if the task has already been completed
      const task = tasks.find((task) => task._id === taskId);
      if (task && task.taskCompletion === "complete") {
        Swal.fire({
          icon: "info",
          title: "Task Already Completed",
          text: `You've already completed this task and earned ${points} BP.`,
        });
        return; // Don't continue if the task is already completed
      }

      const response = await axios.put(
        `${baseURL}task/${taskId}/open`,
        {}, // No visitCount needed here
        CONFIG_OBJ
      );

      if (response.status === 200) {
        setUserData(response.data.user);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, taskCompletion: "complete" } : task
          )
        );

        Swal.fire({
          icon: "success",
          title: "Task Completed",
          text: `You have successfully completed the task and earned ${points} BP.`,
          confirmButtonColor: "#FFA500",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response
          ? error.response.data.message
          : "Something went wrong! Please try again later.",
      });
    }
  }
};


  const handleDeleteTask = async (taskId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This task will be deleted permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF6347",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${baseURL}${taskId}`, CONFIG_OBJ);

        Swal.fire({
          icon: "success",
          title: "Task Deleted",
          text: response.data.message,
          confirmButtonColor: "#FFA500",
        });

        setTasks(tasks.filter((task) => task._id !== taskId));
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response
          ? error.response.data.message
          : "Something went wrong! Please try again later.",
      });
    }
  };

  return (
    <div className="mobile-container">
      <h4 style={{ marginTop: "-40px" }}>Tasks</h4>
      <div className="task-section">
        <div className="header-container">
          {["Available", "Advanced"].map((category) => (
            <div className="header" key={category}>
              <a
                href="#"
                className={`header-link ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </a>
            </div>
          ))}
        </div>

        {selectedCategory === "Available" && (
          <div className="task-list">
            {tasks
              .filter((task) => task.category === "Available")
              .map((task) => (
                <div className="task" key={task._id}>
                  <div className="task-info">
                    <span>{task.taskName}</span>
                    <div>
                      <small>+{task.points} BP</small>
                    </div>
                  </div>
                  {user && user.role === "admin" ? (
                    <button
                      className="btn del-btn"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Delete
                    </button>
                  ) : task.taskCompletion === "complete" ? (
                    <button className="btn btn-custom" disabled>
                      Completed
                    </button>
                  ) : (
                    <button
                      className="btn btn-custom"
                      onClick={() =>
                        handleTaskStart(
                          task._id,
                          task.points,
                          task.socialMediaLink,
                          task.visitCount
                        )
                      }
                      disabled={
                        task.visitCount >= 2 ||
                        task.taskCompletion === "complete"
                      }
                    >
                      {task.visitCount >= 2 ||
                      task.taskCompletion === "complete"
                        ? "Completed"
                        : "Start"}
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}

        {selectedCategory === "Advanced" && (
          <div className="task-list">
            {tasks
              .filter((task) => task.category === "Advanced")
              .map((task) => (
                <div className="task" key={task._id}>
                  <div className="task-info">
                    <span>{task.taskName}</span>
                    <div>
                      <small>+{task.points} BP</small>
                    </div>
                  </div>
                  {user && user.role === "admin" ? (
                    <button
                      className="btn del-btn"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Delete
                    </button>
                  ) : task.taskCompletion === "complete" ? (
                    <button className="btn btn-custom" disabled>
                      Completed
                    </button>
                  ) : task.taskCompletion === "claimed" ? (
                    <button className="btn btn-custom" disabled>
                      Claimed
                    </button>
                  ) : (
                    <button
                      className="btn btn-custom"
                      onClick={() =>
                        handleTaskStart(
                          task._id,
                          task.points,
                          task.socialMediaLink,
                          task.visitCount
                        )
                      }
                    >
                      Claim Points
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
