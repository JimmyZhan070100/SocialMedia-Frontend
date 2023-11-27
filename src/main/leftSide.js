import React, { useEffect, useState } from "react";
import { useArticle } from "./postProvider";

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

    if (!userData) {
      // 'user' key doesn't exist in localStorage, get 'formData' instead
      userData = localStorage.getItem("formData");
      if (userData) {
        userData = JSON.parse(userData);
        userData.username = userData.userName;
        userData.id = "-1";
        localStorage.setItem("formData", JSON.stringify(userData));
      }
    } else {
      userData = JSON.parse(userData);
    }

    if (userData) {
      setUser(userData);
      setStatusHeadline(userData.company?.catchPhrase || "Happy every day");
    }

    // Retrieve the status headline from localStorage on component mount
    const savedStatusHeadline = localStorage.getItem("statusHeadline");
    if (savedStatusHeadline) {
      setStatusHeadline(savedStatusHeadline);
    }

    // Fetch followed users from JSONPlaceholder API
    if (userData && userData.id) {
      fetch("https://jsonplaceholder.typicode.com/users")
        .then((response) => response.json())
        .then((data) => {
          const id = userData.id;
          const followingIds = [];
          for (let i = id; i <= id + 3; i++) {
            const wrappedId = i <= 10 ? i : i - 10;
            followingIds.push(wrappedId);
          }

          // Filter followed users whose id is in the followingIds array
          const followingUsers = data.filter((user) =>
            followingIds.includes(user.id)
          );

          setFollowedUsers(followingUsers);
          setUserIds(followingUsers);
        })
        .catch((error) => {
          console.error("Error fetching followed users:", error);
        });
    }
  }, []);

  const handleUpdateStatusHeadline = () => {
    // Update the status headline with the newStatus value
    setStatusHeadline(newStatus);

    // Save the updated status headline to localStorage
    localStorage.setItem("statusHeadline", newStatus);

    setNewStatus(""); // Clear the input field after updating
  };

  const handleFollowUser = () => {
    // Check if the newFollowerUsername exists in the list of followed users
    if (followedUsers.some((user) => user.username === newFollowerUsername)) {
      // Show an error message if the username already exists
      setError("This user is already followed.");
    } else {
      // Clear any previous error messages
      setError("");

      // Check if the newFollowerUsername exists in JSONPlaceholder data
      fetch(
        `https://jsonplaceholder.typicode.com/users?username=${newFollowerUsername}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            // User with the provided username exists in JSONPlaceholder, add them as a follower
            const newUser = data[0];
            setFollowedUsers((prevFollowedUsers) => [
              ...prevFollowedUsers,
              newUser,
            ]);
            setUserIds((prevFollowedUsers) => [...prevFollowedUsers, newUser]);
          } else {
            setError("This user does not exist.");
            // User with the provided username does not exist, create a default follower
            // const newUser = {
            //   id: Math.random(), // Use a unique identifier
            //   name: "New Follower",
            //   username: newFollowerUsername,
            //   company: {
            //     catchPhrase: "Happy every day",
            //   },
            //   // Add other user properties as needed
            // };
            // setFollowedUsers((prevFollowedUsers) => [
            //   ...prevFollowedUsers,
            //   newUser,
            // ]);
            // setUserIds((prevFollowedUsers) => [...prevFollowedUsers, newUser]);
          }

          // Clear the input field
          setNewFollowerUsername("");
        })
        .catch((error) => {
          console.error("Error checking new follower:", error);
        });
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
