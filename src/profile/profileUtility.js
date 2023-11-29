export const handleInputChange = (
  e,
  updatedData,
  setUpdatedData,
  errors,
  setErrors
) => {
  const { name, value } = e.target;
  setUpdatedData({
    ...updatedData,
    [name]: value,
  });
  setErrors({
    ...errors,
    [name]: "",
  });
};

export const maskPassword = (password) => {
  return "*".repeat(password.length);
};

export const handleImageChange = (e, setProfilePicture, setUsername) => {
  const file = e.target.files[0];
  if (!file) {
    return; // Do nothing if no file is selected
  }

  const formData = new FormData();
  formData.append("avatar", file);

  const username = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")).username
    : null;
  setUsername(username); // Ensure we have the username from local storage

  fetch(`${process.env.REACT_APP_BACKEND_URL}/avatar`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to upload avatar");
      }
      return response.json();
    })
    .then((data) => {
      if (data.avatar) {
        setProfilePicture(data.avatar);
      }
    })
    .catch((error) => {
      console.error("Error uploading avatar:", error);
    });
};

export const validateInputs = (updatedData, formData) => {
  const newErrors = {};

  if (updatedData.userName && !/^[a-zA-Z0-9]+$/.test(updatedData.userName)) {
    newErrors.userName = "User Name can only contain letters and numbers";
  }
  if (
    updatedData.email &&
    (!updatedData.email.includes("@") || !updatedData.email.includes("."))
  ) {
    newErrors.email = "Invalid email address";
  }
  if (updatedData.phone && !/^\d{3}-\d{3}-\d{4}$/.test(updatedData.phone)) {
    newErrors.phone = "Phone number must be in the format 123-123-1234";
  }
  if (
    updatedData.zip &&
    (updatedData.zip.length !== 5 || isNaN(updatedData.zip))
  ) {
    newErrors.zip = "Zip code must be 5 digits";
  }
  if (updatedData.password && updatedData.password === formData.password) {
    newErrors.password = "Password cannot be the same as the previous";
  }

  return newErrors;
};

export const handleUpdate = (
  updatedData,
  updateForm,
  setUpdatedData,
  setErrors,
  formData
) => {
  const newErrors = validateInputs(updatedData, formData);

  if (Object.keys(newErrors).length === 0) {
    if (updatedData.email && updatedData.email !== formData.email) {
      updateEmail(updatedData.email, setErrors, updateForm, formData);
    }

    if (updatedData.password && updatedData.password !== formData.password) {
      updatePassword(updatedData.password, setErrors, updateForm, formData);
    }

    if (updatedData.phone && updatedData.phone !== formData.phone) {
      updatePhoneNumber(updatedData.phone, setErrors, updateForm, formData);
    }

    if (updatedData.zip && updatedData.zip !== formData.zip) {
      updateZipCode(updatedData.zip, setErrors, updateForm, formData);
    }

    setUpdatedData({
      userName: "",
      email: "",
      phone: "",
      zip: "",
      password: "",
      confirmPassword: "",
    });
  } else {
    setErrors(newErrors);
  }
};

export const updateEmail = (email, setErrors, updateForm, formData) => {
  fetch(`${process.env.REACT_APP_BACKEND_URL}/email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update email");
      }
      return response.json();
    })
    .then((data) => {
      if (data.email === email) {
        // Update local state and storage
        const updatedFormData = { ...formData, email };
        updateForm(updatedFormData);
        localStorage.setItem("formData", JSON.stringify(updatedFormData));
      } else {
        setErrors({ email: "Failed to update email" });
      }
    })
    .catch((error) => {
      setErrors({ email: error.message });
    });
};

export const updatePassword = (password, setErrors, updateForm, formData) => {
  fetch(`${process.env.REACT_APP_BACKEND_URL}/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ password }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update password");
      }
      return response.json();
    })
    .then((data) => {
      if (data.result === "success") {
        // Update local state and storage
        const updatedFormData = { ...formData, password };
        updateForm(updatedFormData);
        localStorage.setItem("formData", JSON.stringify(updatedFormData));
      } else {
        setErrors({ password: "Failed to update password" });
      }
    })
    .catch((error) => {
      setErrors({ password: error.message });
    });
};

export const updatePhoneNumber = (phone, setErrors, updateForm, formData) => {
  fetch(`${process.env.REACT_APP_BACKEND_URL}/phone`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ phone }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update phone number");
      }
      return response.json();
    })
    .then((data) => {
      if (data.phone === phone) {
        const updatedFormData = { ...formData, phone };
        updateForm(updatedFormData);
        localStorage.setItem("formData", JSON.stringify(updatedFormData));
      } else {
        setErrors({ phone: "Failed to update phone number" });
      }
    })
    .catch((error) => {
      setErrors({ phone: error.message });
    });
};

export const updateZipCode = (zipcode, setErrors, updateForm, formData) => {
  fetch(`${process.env.REACT_APP_BACKEND_URL}/zipcode`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ zipcode }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update ZIP code");
      }
      return response.json();
    })
    .then((data) => {
      if (data.zipcode === zipcode) {
        const updatedFormData = { ...formData, zip: zipcode };
        updateForm(updatedFormData);
        localStorage.setItem("formData", JSON.stringify(updatedFormData));
      } else {
        setErrors({ zip: "Failed to update ZIP code" });
      }
    })
    .catch((error) => {
      setErrors({ zip: error.message });
    });
};

export const fetchUserAvatar = (username, setProfilePicture) => {
  fetch(`${process.env.REACT_APP_BACKEND_URL}/avatar/${username}`, {
    credentials: "include", // Include credentials for cookie-based authentication
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch avatar");
      }
      return response.json();
    })
    .then((data) => {
      if (data.avatar) {
        setProfilePicture(data.avatar);
      }
    })
    .catch((error) => {
      console.error("Failed to fetch avatar:", error);
    });
};
