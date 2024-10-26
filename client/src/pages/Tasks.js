import React from "react";
import "./Tasks.css";
const Tasks = () => {
  return (
    <div className="mobile-container">
      {/* Earn section (Horizontally scrollable) */}
      <h5>Earn</h5>
      <div className="scrolling-wrapper">
        <div className="earn-section">
          <div>Whale Quest</div>
          <div>
            <small>+999 BP</small>
          </div>
          <button className="btn btn-custom m-2">Open</button>
        </div>
        <div className="earn-section">
          <div>Weekly Check</div>
          <div>
            <small>+999 BP</small>
          </div>
          <button className="btn btn-custom m-2">Open</button>
        </div>
        <div className="earn-section">
          <div>Task Completion</div>
          <div>
            <small>+500 BP</small>
          </div>
          <button className="btn btn-custom m-2">Open</button>
        </div>
      </div>

      {/* Weekly section */}
      <div className="weekly-section">
        <div className="p-2">WEEKLY</div>
        <div className="task">
          <div className="task-info">
            <span>Earn for checking socials</span>
            <div>
              <small>+999 BP</small>
            </div>
            <br />
            <button className="btn btn-custom m-0">Open</button>
          </div>
        </div>
      </div>

      {/* New tasks section */}
      <div className="task-section">
        <div className="header-container">
          <div className="header">
            <a href="/" style={{ color: "white", textDecoration: "none" }}>
              New
            </a>
          </div>
          <div className="header">
            <a href="/" style={{ color: "white", textDecoration: "none" }}>
              OnChain
            </a>
          </div>
        </div>
        <div className="task">
          <div className="task-info">
            <span>Defi Explained</span>
            <div>
              <small>+250 BP</small>
            </div>
          </div>
          <button className="btn btn-custom">Start</button>
        </div>
        <div className="task">
          <div className="task-info">
            <span>Defi Explained</span>
            <div>
              <small>+250 BP</small>
            </div>
          </div>
          <button className="btn btn-custom">Start</button>
        </div>
        <div className="task">
          <div className="task-info">
            <span>Defi Explained</span>
            <div>
              <small>+250 BP</small>
            </div>
          </div>
          <button className="btn btn-custom">Start</button>
        </div>
        <div className="task">
          <div className="task-info">
            <span>Defi Explained</span>
            <div>
              <small>+250 BP</small>
            </div>
          </div>
          <button className="btn btn-custom">Start</button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
