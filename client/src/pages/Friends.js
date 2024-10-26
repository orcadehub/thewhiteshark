import React from "react";
import './Friends.css'
const Friends = () => {
  return (
    <div>
      {/* Invitation Content */}
      <div className="content">
        <h3>Invite friends &#128107; and get rewards</h3>
        <p>Earn up to 50,000 points from your friends!</p>
      </div>

      {/* Friends and Coins Information */}
      <div className="col">
        <div className="friends">
          <p>Friends invited</p>
          <h3>&#128107; X 6</h3>
        </div>
        <div className="friends1">
          <p>Coins earned</p>
          <h3>&#128176; X 12,151</h3>
        </div>
      </div>

      {/* Earnings Information */}
      <div className="col2">
        <ul>
          <li>
            You could earn <span className="span">10%</span> of all points
            earned by players you have invited, capped at{" "}
            <span className="span">50,000</span> points.
          </li>
          <li>
            Invited friends will receive a gift of{" "}
            <span className="span">1000</span> points.
          </li>
        </ul>
      </div>

     {/* Friend's Name Table */}
<table className="friend-table">
  <thead>
    <tr>
      <th>No.</th>
      <th>Friend's Name</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>Giridhar</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Manya Meghana</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Naveen $X Kumar</td>
    </tr>
    <tr>
      <td>4</td>
      <td>Chaithu Sai</td>
    </tr>
    <tr>
      <td>5</td>
      <td>Sravesh Lucky</td>
    </tr>
    <tr>
      <td>6</td>
      <td>Pavan Sai</td>
    </tr>
  </tbody>
</table>


      {/* Display Notice */}
      <div className="display">
        <p>Displaying the most recent 300 records only</p>
      </div>

      {/* Buttons */}
      <div className="button">
        <div className="btn">
          <button>Invite Friends!</button>
        </div>
        <div className="btn2">
          <h1>
            <i className="bx bxs-copy"></i>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Friends;
