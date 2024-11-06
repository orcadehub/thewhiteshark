import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Tasks.css";

const Tasks = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedCategory, setSelectedCategory] = useState("New");
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [tasks, setTasks] = useState([]);

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
        const response = await axios.get("http://localhost:3300/tasks", CONFIG_OBJ);
        setTasks(response.data); // Assuming API returns an array of tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:3300/profile", CONFIG_OBJ);
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
              <button className="btn btn-custom">Open</button>
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
                <button className="btn btn-custom">Open</button>
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
                className={`header-link ${selectedCategory === category ? "active" : ""}`}
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
                  <button className="btn btn-custom">Start</button>
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
                  <button className="btn btn-custom">Start</button>
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

