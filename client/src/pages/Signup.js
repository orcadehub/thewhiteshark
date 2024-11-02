import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false); // Track if user exists
  const { chatid } = useParams(); // Capture chatId from URL
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user exists with given chatId
    const checkUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3300/authenticate/${chatid}`
        );
        setIsExistingUser(response.data.exists);
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    if (chatid) checkUser();
  }, [chatid]);

  const handleSignupOrLogin = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: isExistingUser ? "Logging In..." : "Signing Up...",
      text: "Please wait while we process your request.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await axios.post(
        `http://localhost:3300/authenticate/${chatid}`,
        {
          username,
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      await Swal.fire({
        icon: "success",
        title: isExistingUser ? "Login Successful" : "Signup Successful",
        text: `Welcome, ${response.data.user.username}!`,
      });

      navigate("/home");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: isExistingUser ? "Login Failed" : "Signup Failed",
        text:
          error.response?.data?.message ||
          "An error occurred. Please try again.",
      });
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSignupOrLogin}>
        <h2 style={styles.heading}>{isExistingUser ? "Log In" : "Sign Up"}</h2>
        {!isExistingUser && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
        )}
        <button type="submit" style={styles.button}>
          {isExistingUser ? "Log In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#000",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
    backgroundColor: "#333",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
  },
  heading: { fontSize: "24px", marginBottom: "20px", textAlign: "center" },
  input: {
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "none",
    outline: "none",
    fontSize: "16px",
    width: "100%",
  },
  button: {
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#FF6347",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Signup;
