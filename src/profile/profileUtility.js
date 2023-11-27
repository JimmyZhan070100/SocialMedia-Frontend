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

export const handleImageChange = (e, setProfilePicture) => {
  const file = e.target.files[0];
  setProfilePicture(file);
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
    const updatedFormData = {
      userName: updatedData.userName || formData.userName,
      email: updatedData.email || formData.email,
      phone: updatedData.phone || formData.phone,
      zip: updatedData.zip || formData.zip,
      password: updatedData.password || formData.password,
      confirmPassword: updatedData.confirmPassword || formData.confirmPassword,
    };

    updateForm(updatedFormData);

    setUpdatedData({
      userName: "",
      email: "",
      phone: "",
      zip: "",
      password: "",
    });
    localStorage.setItem("formData", JSON.stringify(updatedFormData));
  } else {
    setErrors(newErrors);
  }
};
