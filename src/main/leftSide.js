import React, { useEffect, useState } from "react";
import { useArticle } from "./postProvider";
import * as dataFetchers from "../getData";

const LeftSide = () => {
  const { userIds, setUserIds, articles, setArticles } = useArticle();
  const [user, setUser] = useState({
    username: "Default Username",
  });

  const [statusHeadline, setStatusHeadline] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [followedUsers, setFollowedUsers] = useState([]);
  const [newFollowerUsername, setNewFollowerUsername] = useState("");
  const [error, setError] = useState("");
  const imageArr = [
    "https://plus.unsplash.com/premium_photo-1696879454010-6aed21c32fc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=250&q=60",
    "https://images.unsplash.com/photo-1696543710864-fecad4bfbf62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=60",
    "https://images.unsplash.com/photo-1696197017974-e9bf6319eb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzOXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=60",
    "https://images.unsplash.com/photo-1683009427042-e094996f9780?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwyNnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&q=60",
  ];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageArr.length);
    return imageArr[randomIndex];
  };

  useEffect(() => {
    // Retrieve user data from localStorage
    let userData = localStorage.getItem("user");

    // if (!userData) {
    //   // 'user' key doesn't exist in localStorage, get 'formData' instead
    //   userData = localStorage.getItem("formData");
    //   if (userData) {
    //     userData = JSON.parse(userData);
    //     userData.username = userData.userName;
    //     userData.id = "-1";
    //     localStorage.setItem("formData", JSON.stringify(userData));
    //   }
    // } else {
    //   userData = JSON.parse(userData);
    // }

    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUser(parsedUserData);

      // Fetch the status headline using the user's username
      dataFetchers
        .fetchHeadline(parsedUserData.username)
        .then((data) => {
          // Set the status headline from the fetched data
          setStatusHeadline(data.headline);
        })
        .catch((error) => {
          console.error("Error fetching headline:", error);
          setStatusHeadline("Unable to fetch headline");
        });
    }
  }, []);

  const handleUpdateStatusHeadline = () => {
    if (!newStatus.trim()) {
      setError("Headline cannot be empty");
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/headline`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ headline: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update headline");
        }
        return response.json();
      })
      .then((data) => {
        // Update the status headline in the local state
        setStatusHeadline(data.headline);

        // Optionally, save the updated status headline to localStorage
        localStorage.setItem("statusHeadline", data.headline);

        setNewStatus(""); // Clear the input field after updating
      })
      .catch((error) => {
        console.error("Error updating headline:", error);
        setError(error.message);
      });
  };

  const handleFollowUser = () => {
    // Check if the newFollowerUsername exists in the list of followed users
    if (followedUsers.some((user) => user.username === newFollowerUsername)) {
      // Show an error message if the username already exists
      setError("This user is already followed.");
    } else {
      // Clear any previous error messages
      setError("");

      fetch(
        `${process.env.REACT_APP_BACKEND_URL}/following/${newFollowerUsername}`,
        {
          method: "PUT",
          credentials: "include", // Include credentials for cookie-based authentication
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.username) {
            setFollowedUsers(data.following);
          } else {
            setError("This user does not exist.");
          }
        })
        .catch((error) => {
          setError(error.message);
        });

      // Clear the input field
      setNewFollowerUsername("");
    }
  };

  const handleUnfollowUser = (userId) => {
    // Remove the user with the given ID from the list of followed users
    setFollowedUsers((prevFollowedUsers) =>
      prevFollowedUsers.filter((user) => user.id !== userId)
    );
    setUserIds((prevFollowedUsers) =>
      prevFollowedUsers.filter((user) => user.id !== userId)
    );
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0M01YNSrXlAxDO-nSwD-a8FZLr8z3Acg5U-81iOejxQ&s"
            alt="User Profile"
          />
        </div>
        <div>
          <div>{user.username}</div>
          <div>{statusHeadline}</div>
          {/* Input field for new status headline */}
          <input
            type="text"
            placeholder="New Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
          <button className="statusBtn" onClick={handleUpdateStatusHeadline}>
            Update Status
          </button>
        </div>
      </div>
      <div>
        <strong>Followed Users</strong>
        <div>
          {followedUsers.map((followedUser) => (
            <div key={followedUser.id}>
              <img
                src={getRandomImage()}
                alt={`${followedUser.name}'s Profile`}
              />
              <div>{followedUser.username}</div>
              <div>{followedUser.company?.catchPhrase}</div>
              <button
                className="unfollowBtn"
                onClick={() => handleUnfollowUser(followedUser.id)}
              >
                Unfollow
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Enter username"
          value={newFollowerUsername}
          onChange={(e) => setNewFollowerUsername(e.target.value)}
        />
        <button className="followBtn" onClick={handleFollowUser}>
          Follow
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default LeftSide;
