import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  // Get the token from local storage
  const token = localStorage.getItem("token");

  // Check if the token exists before setting up the config object
  if (!token) {
    console.error(
      "No token found in localStorage, redirecting to /authenticate."
    );
    navigate("/authenticate");
  }

  // Configuration object with the Authorization header
  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        console.log("Sending request to fetch profile data...");
        const response = await axios.get(
          "http://localhost:3300/profile",
          CONFIG_OBJ
        );

        // Logging response for debugging
        console.log("Response data:", response.data);

        setProfileData(response.data.user);
      } catch (error) {
        console.error("Error fetching profile data:", error);

        // If unauthorized, redirect to login
        if (error.response && error.response.status === 401) {
          navigate("/authenticate");
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    fetchProfileData();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.profileContainer}>
        <h4 style={styles.greeting}>Hello, Good Morning</h4>
        <button style={styles.button}>
          <h2 style={styles.name}>{profileData?.username || "User Name"}</h2>
          <p style={styles.id}>ID: {profileData?.referralId || "N/A"}</p>
        </button>
        <div style={styles.balanceContainer}>
          <h2 style={styles.balanceTitle}>Balance</h2>
          <h1 style={styles.balanceAmount}>
            ${profileData?.walletAmount || "0.00"}
          </h1>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#000",
    color: "#fff",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileContainer: {
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
    height: "100%",
    padding: "20px",
    borderRadius: "10px",
  },
  greeting: {
    marginBottom: "20px",
  },
  button: {
    width: "80%",
    padding: "15px",
    backgroundColor: "#3030ca",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "20px",
  },
  name: {
    margin: "0",
  },
  id: {
    margin: "0",
  },
  balanceContainer: {
    textAlign: "left",
    marginTop: "20px",
    width: "100%",
  },
  balanceTitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  balanceAmount: {
    fontSize: "32px",
    fontWeight: "bold",
  },
  footer: {
    backgroundColor: "#222",
    width: "100%",
    maxWidth: "400px",
    padding: "15px 10px",
    display: "flex",
    justifyContent: "space-around",
    color: "white",
    fontSize: "14px",
    borderRadius: "0 0 10px 10px",
  },

  // Responsive styles
  "@media (max-width: 430px)": {
    profileContainer: {
      padding: "15px",
    },
    balanceAmount: {
      fontSize: "28px",
    },
  },
};

export default Profile;
