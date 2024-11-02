import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Tasks.css";

const Tasks = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Redirect to login if the user is not logged in
    if (!user) {
      navigate("/authenticate");
    }
  }, [user, navigate]);

  return (
    <div className="mobile-container">
      {/* Earn section (Horizontally scrollable) */}
      <h5 className="section-title">Earn</h5>
      <div className="scrolling-wrapper">
        <div className="earn-section">
          <div>Whale Quest</div>
          <div>
            <small>+999 BP</small>
          </div>
          <button className="btn btn-custom">Open</button>
        </div>
        <div className="earn-section">
          <div>Weekly Check</div>
          <div>
            <small>+999 BP</small>
          </div>
          <button className="btn btn-custom">Open</button>
        </div>
        <div className="earn-section">
          <div>Task Completion</div>
          <div>
            <small>+500 BP</small>
          </div>
          <button className="btn btn-custom">Open</button>
        </div>
      </div>

      {/* Weekly section */}
      <div className="weekly-section">
        <h5 className="section-title">Weekly</h5>
        <div className="task">
          <div className="task-info">
            <span>Earn for checking socials</span>
            <div>
              <small>+999 BP</small>
            </div>
            <button className="btn btn-custom">Open</button>
          </div>
        </div>
      </div>

      {/* New tasks section */}
      <div className="task-section">
        <div className="header-container">
          <div className="header">
            <a href="/" className="header-link">
              New
            </a>
          </div>
          <div className="header">
            <a href="/" className="header-link">
              OnChain
            </a>
          </div>
        </div>
        {[...Array(4)].map((_, index) => (
          <div className="task" key={index}>
            <div className="task-info">
              <span>Defi Explained</span>
              <div>
                <small>+250 BP</small>
              </div>
            </div>
            <button className="btn btn-custom">Start</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
