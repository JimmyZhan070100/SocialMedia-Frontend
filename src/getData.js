const backendUrl = process.env.REACT_APP_BACKEND_URL; // Ensure you have set this in your .env file

export const fetchEmail = async (username) => {
  try {
    const response = await fetch(`${backendUrl}/email/${username}`, {
      method: "GET",
      credentials: "include", // if your backend requires cookies or session
    });
    if (!response.username === username) {
      throw new Error("Failed to fetch email");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching email:", error);
    return null;
  }
};

export const fetchDob = async (username) => {
  try {
    const response = await fetch(`${backendUrl}/dob/${username}`, {
      method: "GET",
      credentials: "include", // if your backend requires cookies or session
    });
    if (!response.username === username) {
      throw new Error("Failed to fetch dob");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching dob:", error);
    return null;
  }
};

export const fetchZipcode = async (username) => {
  try {
    const response = await fetch(`${backendUrl}/zipcode/${username}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.username === username) {
      throw new Error("Failed to fetch zipcode");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching zipcode:", error);
    return null;
  }
};

export const fetchPhone = async (username) => {
  try {
    const response = await fetch(`${backendUrl}/phone/${username}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.username === username) {
      throw new Error("Failed to fetch phone number");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching phone:", error);
    return null;
  }
};

export const fetchHeadline = async (username) => {
  try {
    const response = await fetch(`${backendUrl}/headline/${username}`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.username === username) {
      throw new Error("Failed to fetch headline");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching headline:", error);
    return null;
  }
};

export const fetchFollowing = (username) => {
  return fetch(`${process.env.REACT_APP_BACKEND_URL}/following/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch following list");
      }
      return response.json();
    })
    .then((data) => {
      return data.following;
    })
    .catch((error) => {
      console.error("Error fetching following list:", error);
      throw error;
    });
};

export const fetchAvatar = async (username) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/avatar/${username}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch avatar");
    }
    const data = await response.json();
    if (data.username !== username) {
      throw new Error("Username mismatch");
    }
    console.log(data.avatar);
    return data.avatar;
  } catch (error) {
    console.error("Error fetching avatar:", error);
    return null;
  }
};
