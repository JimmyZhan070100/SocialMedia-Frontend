import React, { useEffect, useState } from "react";
import { useArticle } from "./postProvider";
import * as dataFetchers from "../getData";

const LeftSide = ({ onFollowChange }) => {
  const { userIds, setUserIds, articles, setArticles } = useArticle();
  const DEFAULT_IMAGE =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0M01YNSrXlAxDO-nSwD-a8FZLr8z3Acg5U-81iOejxQ&s";
  const [user, setUser] = useState({
    username: "Default Username",
  });
  const [statusHeadline, setStatusHeadline] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [followedUsers, setFollowedUsers] = useState([]);
  const [newFollowerUsername, setNewFollowerUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let userData = localStorage.getItem("user");

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

      dataFetchers
        .fetchAvatar(parsedUserData.username)
        .then((avatarUrl) => setProfilePicture(avatarUrl))
        .catch((error) => {
          console.error("Error fetching avatar:", error);
          setProfilePicture(DEFAULT_IMAGE);
        });

      dataFetchers
        .fetchFollowing(parsedUserData.username)
        .then(async (following) => {
          const fetchAvatarPromises = following.map(async (username) => {
            try {
              const avatarUrl = await dataFetchers.fetchAvatar(username);
              return { username, avatar: avatarUrl || DEFAULT_IMAGE }; // defaultAvatarUrl is a fallback image URL
            } catch (error) {
              console.error(`Error fetching avatar for ${username}:`, error);
              return { username, avatar: DEFAULT_IMAGE }; // Use fallback image in case of an error
            }
          });

          const followedUsersWithAvatars = await Promise.all(
            fetchAvatarPromises
          );
          setFollowedUsers(followedUsersWithAvatars);
        })
        .catch((error) =>
          console.error("Error fetching following list:", error)
        );
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
        setStatusHeadline(data.headline);
        localStorage.setItem("statusHeadline", data.headline);

        setNewStatus("");
      })
      .catch((error) => {
        console.error("Error updating headline:", error);
        setError(error.message);
      });
  };

  const handleFollowUser = async () => {
    if (followedUsers.some((user) => user.username === newFollowerUsername)) {
      setError("This user is already followed.");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/following/${newFollowerUsername}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add follower");
      }

      const data = await response.json();

      if (data.username) {
        // Fetch the avatar of the new follower
        const avatarUrl = await dataFetchers.fetchAvatar(newFollowerUsername);
        const newFollower = {
          username: newFollowerUsername,
          avatar: avatarUrl || DEFAULT_IMAGE,
        };

        // Update the followedUsers state
        setFollowedUsers((prevFollowedUsers) => [
          ...prevFollowedUsers,
          newFollower,
        ]);
        onFollowChange();
      } else {
        setError("This user does not exist.");
      }
    } catch (error) {
      setError(error.message);
    }

    setNewFollowerUsername(""); // Clear the input field
  };

  const handleUnfollowUser = (followedUser) => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/following/${followedUser.username}`,
      {
        method: "DELETE",
        credentials: "include", // Include credentials for cookie-based authentication
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to unfollow user");
        }
        return response.json();
      })
      .then((data) => {
        setFollowedUsers(data.following);
        onFollowChange();
      })
      .catch((error) => {
        console.error("Error unfollowing user:", error);
        setError(error.message);
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div>
          <img src={profilePicture} alt="User Profile" className="image-size" />
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
          {followedUsers.map((followedUser, index) => (
            <div key={index}>
              <img
                src={followedUser.avatar}
                alt={`${followedUser.username}'s Profile`}
                className="image-size"
              />
              <div>{followedUser.username}</div>
              <button
                className="unfollowBtn"
                onClick={() => handleUnfollowUser(followedUser)}
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
