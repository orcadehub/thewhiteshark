import React from "react";
import "./Leader.css";
const Leader = () => {
  return (
    <div className="whole">
      <div className="lead">
        <h1>Leader Board</h1>
      </div>

      {/* User Section */}
      <div className="circle">
        <div className="items">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="70"
            height="70"
            fill="currentColor"
            className="bi bi-circle-fill"
            viewBox="0 0 16 16"
          >
            <circle cx="8" cy="8" r="8" />
          </svg>
          <div className="pin" id="user">
            <h2>UserLead</h2>
            <p>800 DOGS</p>
          </div>
        </div>
        <div className="end">
          <h4>#755513</h4>
        </div>
      </div>

      <div className="hold">
        <h2>47.1M holders</h2>
      </div>

      {/* Leaderboard Items */}
      {Array.from({ length: 8 }).map((_, index) => (
        <div className="board" key={index}>
          <div className="items">
            <div className="align">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                className="bi bi-circle-fill"
                viewBox="0 0 16 16"
              >
                <circle cx="8" cy="8" r="8" />
              </svg>
            </div>
            <div className="user">
              <h3>Username</h3>
              <p>700 DOGS</p>
            </div>
          </div>
          <div className="end">
            {index === 7 ? (
              <h4>#8</h4>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-square-fill"
                viewBox="0 0 16 16"
              >
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z" />
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Leader;
