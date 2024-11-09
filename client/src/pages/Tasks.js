import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Tasks.css";
import Swal from "sweetalert2";


const Tasks = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [userData, setUserData] = useState(user);

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
        const response = await axios.get(
          "http://localhost:3300/tasks",
          CONFIG_OBJ
        );
        const tasksWithCompletion = response.data.map((task) => {
          const userCompletedTask = userData.completedTasks.find(
            (userTask) => userTask.taskId === task._id
          );
          return {
            ...task,
            taskCompletion: userCompletedTask
              ? userCompletedTask.status
              : "start",
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
          "http://localhost:3300/profile",
          CONFIG_OBJ
        );
        setTotalReferrals(response.data.user.totalReferrals);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchTasks();
    fetchProfileData();
  }, [navigate, user]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

const handleTaskStart = async (taskId, points) => {
  try {
    console.log("Sending task start request:", {
      taskId,
      points,
      token: localStorage.getItem("token"),
    });

    // Sending PUT request to start the task
    const response = await axios.put(
      `http://localhost:3300/task/${taskId}/start`,
      {},
      CONFIG_OBJ
    );

    if (response.status === 200) {
      const updatedTask = response.data.task; // Get the updated task from the response
      const updatedUserData = { ...userData };
      updatedUserData.walletAmount += points;

      // Update completedTasks in localStorage
      const updatedCompletedTasks = [...updatedUserData.completedTasks];
      const taskIndex = updatedCompletedTasks.findIndex(
        (task) => task.taskId === taskId
      );
      if (taskIndex !== -1) {
        updatedCompletedTasks[taskIndex].status = "complete";
      } else {
        updatedCompletedTasks.push({ taskId, status: "complete" });
      }

      updatedUserData.completedTasks = updatedCompletedTasks;

      // Save the updated user data in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      // Update the tasks in state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId
            ? { ...task, taskCompletion: "complete" } // Update the task with completion status
            : task
        )
      );

      setUserData(updatedUserData); // Update the userData state

      console.log("Task completed response:", response.data);

      Swal.fire({
        icon: "success",
        title: "Task Completed",
        text: `You have successfully completed the task and received ${points} points.`,
        confirmButtonColor: "#FFA500",
      });
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error completing the task:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response
        ? error.response.data.message
        : "Something went wrong! Please try again later.",
    });
  }
};

  const handleOpenTaskLink = async (taskId, socialMediaLink, opensCount, points) => {
    try {
      if (opensCount < 1) {
        // First time user opens the link, just update the count
        await axios.put(
          `http://localhost:3300/task/${taskId}/open`,
          {},
          CONFIG_OBJ
        );
      }

      // Increment the open count locally
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, opensCount: opensCount + 1 } : task
        )
      );

      if (opensCount === 1) {
        // After 2nd time opening, delay completion change
        setTimeout(async () => {
          await handleTaskStart(taskId, points);
        }, 3000);
      }

      // Open the social media link
      window.open(socialMediaLink, "_blank");
    } catch (error) {
      console.error("Error opening task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Display a confirmation alert before deletion
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This task will be deleted permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF6347", // You can change the color here
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        // Proceed with deletion if user confirms
        const response = await axios.delete(
          `http://localhost:3300/task/${taskId}`,
          CONFIG_OBJ
        );

        // Success message
        Swal.fire({
          icon: "success",
          title: "Task Deleted",
          text: response.data.message,
          confirmButtonColor: "#FFA500",
        });

        // Remove the task from state
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
      {/* Earn section */}
      <h5 className="section-title">Earn</h5>
      <div className="scrolling-wrapper">
        {tasks
          .filter((task) => task.category === "Earn")
          .map((task) => (
            <div className="earn-section" key={task._id}>
              <div>{task.taskName}</div>
              <div>
                <small>+{task.points} BP</small>
              </div>
              {/* Check if the user is an admin */}
              {user && user.role === "admin" ? (
                <button
                  className="btn del-btn"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </button>
              ) : (
                <button
                  className="btn btn-custom"
                  onClick={() =>
                    handleOpenTaskLink(
                      task._id,
                      task.socialMediaLink,
                      task.opensCount,
                      task.points
                    )
                  }
                  disabled={task.taskCompletion === "complete"}
                >
                  {task.taskCompletion === "complete" ? "Completed" : "Open"}
                </button>
              )}
            </div>
          ))}
      </div>

      {/* Weekly section */}
      <div className="weekly-section">
        <h5 className="section-title">Weekly</h5>
        {tasks
          .filter((task) => task.category === "Weekly")
          .map((task) => (
            <div className="task" key={task._id}>
              <div className="task-info">
                <span>{task.taskName}</span>
                <div>
                  <small>+{task.points} BP</small>
                </div>
                {user && user.role === "admin" ? (
                  <button
                    className="btn del-btn"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                ) : (
                  <button className="btn btn-custom">Open</button>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Task Categories */}
      <div className="task-section">
        <div className="header-container">
          {["New", "OnChain", "Friends"].map((category) => (
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

        {/* New tasks */}
        {selectedCategory === "New" && (
          <div className="task-list">
            {tasks
              .filter((task) => task.category === "New")
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
                  ) : (
                    <button
                      className="btn btn-custom"
                      onClick={() => handleTaskStart(task._id, task.points)}
                      disabled={task.taskCompletion === "complete"} // Disable if task is complete
                    >
                      {task.taskCompletion === "complete"
                        ? "Completed"
                        : "Start"}
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* OnChain tasks */}
        {selectedCategory === "OnChain" && (
          <div className="task-list">
            {tasks
              .filter((task) => task.category === "OnChain")
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
                  ) : (
                    <button
                      className="btn btn-custom"
                      onClick={() => handleTaskStart(task._id, task.points)}
                      disabled={task.taskCompletion === "complete"}
                    >
                      {task.taskCompletion === "complete"
                        ? "Completed"
                        : "Start"}
                    </button>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* Friends tasks */}
        {selectedCategory === "Friends" && (
          <div className="task-list">
            {tasks
              .filter((task) => task.category === "Friends")
              .map((task) => (
                <div className="task" key={task._id}>
                  <div className="task-info">
                    <span>{task.taskName}</span>
                    <div>
                      <small>+{task.points} BP</small>
                    </div>
                  </div>
                  <button
                    className="btn btn-custom"
                    disabled={totalReferrals < task.friends}
                  >
                    {totalReferrals >= task.friends
                      ? "Claim Reward"
                      : `${totalReferrals}/${task.friends}`}
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;

