import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { connect } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { updateFormData } from ".././actions";
import {
  handleInputChange,
  handleImageChange,
  handleUpdate,
  maskPassword,
  fetchUserAvatar,
} from "./profileUtility";
import "./profile.css";

const DEFAULT_AVATAR_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0M01YNSrXlAxDO-nSwD-a8FZLr8z3Acg5U-81iOejxQ&s";
const Profile = ({ formData, updateForm }) => {
  const [updatedData, setUpdatedData] = useState({
    userName: "",
    email: "",
    phone: "",
    zip: "",
    password: "",
    confirmPassword: "",
  });

  const [username, setUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [errors, setErrors] = useState({});
  const [hasGoogleId, setHasGoogleId] = useState(false);
  const [googleConnectError, setGoogleConnectError] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const googleIdLinkedError = queryParams.get("error") === "googleIdLinked";

  const handleGoogleConnect = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { username } = JSON.parse(storedUser);

      // Check if the user has a Google ID
      if (hasGoogleId) {
        // If the user has a Google ID, initiate the disconnect
        disconnectFromGoogle(username);
      } else {
        // If the user does not have a Google ID, initiate the connect
        connectToGoogle(username);
      }
    }
  };

  // Function to connect to Google
  const connectToGoogle = (username) => {
    // Reset any previous error messages
    setGoogleConnectError("");

    // Check if the user already has a Google ID
    if (hasGoogleId) {
      // If the user already has a Google ID, do not proceed
      console.log("User already has a Google ID");
    } else {
      // Fetch the user's Google ID status
      fetch(`${process.env.REACT_APP_BACKEND_URL}/google/${username}`, {
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.googleId) {
            // User has a Google ID, show error message
            setGoogleConnectError(
              "The Google account is already linked with another user"
            );
          } else {
            // User does not have a Google ID, initiate the connect
            setHasGoogleId(true);
            // Save formData to local storage
            localStorage.setItem("formData", JSON.stringify(formData));
            window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google/connect?username=${username}`;
          }
        })
        .catch((error) => {
          // Handle the error here and display the error message to the user
          console.error("Error checking Google ID:", error);
          // Set the error message in state
          setGoogleConnectError(
            "An error occurred while checking the Google account"
          );
        });
    }
  };

  // Function to disconnect from Google
  const disconnectFromGoogle = (username) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/google/${username}`, {
      method: "PUT",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === "Google ID cleared successfully") {
          // Clear the Google ID on the frontend
          setHasGoogleId(false);
          console.log(data.message);
        } else {
          console.log("Failed to clear Google ID");
        }
      })
      .catch((error) => {
        console.error("Error disconnecting from Google:", error);
      });
  };

  useEffect(() => {
    // Load formData from localStorage on component mount
    const storedFormData = localStorage.getItem("formData");
    if (storedFormData) {
      updateForm(JSON.parse(storedFormData));
    }

    // Retrieve the logged-in user's username
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { username } = JSON.parse(storedUser);
      fetchUserAvatar(username, setProfilePicture);

      // Fetch the user's Google ID status
      fetch(`${process.env.REACT_APP_BACKEND_URL}/google/${username}`, {
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Check if the data includes a googleId
          if (data.googleId) {
            setHasGoogleId(true);
          } else {
            setHasGoogleId(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching Google ID:", error);
        });
    }
  }, [updateForm]);

  return (
    <div className>
      <div>
        <Link className="Link-main" to="/main">
          Back to Main
        </Link>
      </div>
      <div className="text-center">
        <h1 className="title display-4 fw-normal">Profile</h1>
      </div>
      <div className="container">
        <div className="row">
          <div className="col d-flex flex-column align-items-center">
            <img
              src={profilePicture || DEFAULT_AVATAR_URL}
              alt="User Profile"
              className="profile-picture border border-secondary rounded"
            />
            <input
              type="file"
              accept="image/*"
              id="profilePictureInput"
              onChange={(e) =>
                handleImageChange(e, setProfilePicture, setUsername)
              } //update profile image
              style={{ display: "none" }}
            />
            <button
              className="btn btn-outline-secondary"
              onClick={() =>
                document.getElementById("profilePictureInput").click()
              }
            >
              Upload new picture
            </button>
            <br />
            <button className="btn btn-light" onClick={handleGoogleConnect}>
              <FcGoogle className="google-icon" />{" "}
              {hasGoogleId ? "Disconnect with Google" : "Connect with Google"}
            </button>
            {googleConnectError && (
              <div className="error-message text-center text-danger">
                {googleConnectError}
              </div>
            )}
            {googleIdLinkedError && (
              <div className="error-message text-center text-danger">
                The Google account is already linked with another user.
              </div>
            )}
          </div>
        </div>
      </div>
      <br />
      <div className="container">
        <div className="row row-cols-1 row-cols-md-2 mb-1 text-center">
          <div className="col col-color">
            <div className="card border-primary mb-1 rounded-3 shadow-sm">
              <h2 className="fs-5 text-muted">Current Information:</h2>
              <p>User Name: {formData?.userName}</p>
              <p>Email: {formData?.email}</p>
              <p>Phone: {formData?.phone}</p>
              <p>Zip Code: {formData?.zip}</p>
              <p>Password: {maskPassword(formData?.password)}</p>
              <br />
              <br />
            </div>
          </div>
          <div className="col">
            <div className="card border-warning mb-1 rounded-3 shadow-sm">
              <h2 className="fs-5 text-muted">Update Information:</h2>
              <input
                name="userName"
                type="text"
                className="profileInput mb-3"
                placeholder=""
                value={updatedData.userName}
                disabled
                onChange={(e) =>
                  handleInputChange(
                    e,
                    updatedData,
                    setUpdatedData,
                    errors,
                    setErrors
                  )
                }
              />
              <input
                name="email"
                type="text"
                className="profileInput mb-3"
                placeholder="New Email"
                value={updatedData.email}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    updatedData,
                    setUpdatedData,
                    errors,
                    setErrors
                  )
                }
              />
              <input
                name="phone"
                type="text"
                className="profileInput mb-3"
                placeholder="New Phone"
                value={updatedData.phone}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    updatedData,
                    setUpdatedData,
                    errors,
                    setErrors
                  )
                }
              />
              <input
                name="zip"
                type="text"
                className="profileInput mb-3"
                placeholder="New Zip Code"
                value={updatedData.zip}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    updatedData,
                    setUpdatedData,
                    errors,
                    setErrors
                  )
                }
              />
              <input
                name="password"
                type="password"
                className="profileInput mb-3"
                placeholder="New Password"
                value={updatedData.password}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    updatedData,
                    setUpdatedData,
                    errors,
                    setErrors
                  )
                }
              />
              <button
                className="btn btn-outline-warning"
                onClick={() =>
                  handleUpdate(
                    updatedData,
                    updateForm,
                    setUpdatedData,
                    setErrors,
                    formData
                  )
                }
              >
                Update
              </button>
            </div>
          </div>
        </div>
        {Object.keys(errors).length > 0 && (
          <div className="error-message text-center text-danger">
            {Object.values(errors).map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  formData: state.formData.formData,
});

const mapDispatchToProps = (dispatch) => ({
  updateForm: (formData) => dispatch(updateFormData(formData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
