import React from "react";
import "./Header.css";

const Profile = () => {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <h1>Hello, Good morning</h1>
      </header>

      {/* Profile Section */}
      <div className="container">
        <button className="btn1">
          <h1>Madhu Sudhan</h1>
          <p>id: 222111999</p>
        </button>
      </div>

      {/* Balance Section */}
      <div className="container1">
        <h1 style={{ color: "white" }}>Balance</h1>
      </div>
      <div className="container2">
        <h1 style={{ color: "white" }}>$200.00</h1>
      </div>

      {/* Footer */}
    </div>
  );
};

export default Profile;
