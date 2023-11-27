import React, { useState } from "react";
import "./auth.css";
import "../styles/style.css";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { updateFormData } from ".././actions";
import * as dataFetchers from "../getData";

const Register = ({ formData, updateForm }) => {
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Dispatch an action to update the form data in the store
    updateForm({ [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    // Validate each field
    if (!/^[a-zA-Z]+$/.test(formData.firstName)) {
      errors.firstName = "First Name can only contain letters";
    }
    if (!/^[a-zA-Z]+$/.test(formData.lastName)) {
      errors.lastName = "Last Name can only contain letters";
    }
    if (!/^[a-zA-Z0-9]+$/.test(formData.userName)) {
      errors.userName = "User Name can only contain letters and numbers";
    }
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      errors.email = "Invalid email address";
    }
    if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.phone)) {
      errors.phone = "Phone number must be in the format 123-123-1234";
    }
    if (formData.zip.length !== 5 || isNaN(formData.zip)) {
      errors.zip = "Zip code must be 5 digits";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    // Validate birthdate for age >= 18
    const birthdateDate = new Date(formData.birthDate);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthdateDate.getFullYear();
    if (age < 18) {
      errors.birthDate = "You must be at least 18 years old to register.";
    }
    setErrorMessages(errors);

    // If no errors, submit the form data
    if (Object.keys(errors).length === 0) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/register`, {
        // Use your backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.userName,
          email: formData.email,
          dob: formData.birthDate,
          phone: formData.phone,
          zipcode: formData.zip,
          password: formData.password,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Registration failed");
          }
          return response.json();
        })
        .then((data) => {
          if (data.result === "success") {
            localStorage.setItem("formData", JSON.stringify(formData));
            fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                username: formData.userName,
                password: formData.password,
              }),
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Invalid username or password");
                }
                return response.json();
              })
              .then((user) => {
                // Assuming the backend returns user details on successful login
                localStorage.setItem("user", JSON.stringify(user));
                // Fetch additional user data
                return Promise.all([
                  dataFetchers.fetchEmail(formData.userName),
                  dataFetchers.fetchPhone(formData.userName),
                  dataFetchers.fetchZipcode(formData.userName),
                  dataFetchers.fetchDob(formData.userName),
                ]);
              })
              .then(([emailData, phoneData, zipcodeData, dobData]) => {
                // Update the form data
                const formDataUpdate = {
                  userName: formData.userName,
                  email: emailData.email,
                  phone: phoneData.phone,
                  zip: zipcodeData.zipcode,
                  birthDate: dobData.dob,
                  password: formData.password,
                  confirmPassword: formData.password,
                };
                updateForm(formDataUpdate);
                navigate("/main");
              });
          } else {
            // Handle registration error
            setErrorMessages({ form: "Registration failed" });
          }
        })
        .catch((error) => {
          setErrorMessages({ form: error.message });
        });
    }
  };

  return (
    <div className="Login">
      <div className="Ricebook">
        <div className="Ricebooktext">RiceBook</div>
        <div className="title">
          Join RiceBook <br />
          makes life better
        </div>
      </div>
      <div className="LoginContainer">
        <div className="Logindetails">
          <form onSubmit={handleSubmit}>
            <input
              className="firstname"
              name="firstName"
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            {errorMessages.firstName && (
              <div className="error">{errorMessages.firstName}</div>
            )}
            <input
              className="lastname"
              name="lastName"
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            {errorMessages.lastName && (
              <div className="error">{errorMessages.lastName}</div>
            )}
            <input
              className="commoninput"
              name="userName"
              type="text"
              placeholder="User name"
              value={formData.userName}
              onChange={handleInputChange}
            />
            {errorMessages.userName && (
              <div className="error">{errorMessages.userName}</div>
            )}
            <input
              className="commoninput"
              name="email"
              type="text"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errorMessages.email && (
              <div className="error">{errorMessages.email}</div>
            )}
            <input
              className="commoninput"
              name="phone"
              type="text"
              placeholder="Phone number (123-123-1234)"
              value={formData.phone}
              onChange={handleInputChange}
            />
            {errorMessages.phone && (
              <div className="error">{errorMessages.phone}</div>
            )}
            <input
              className="commoninput"
              name="zip"
              type="text"
              placeholder="Zip code"
              value={formData.zip}
              onChange={handleInputChange}
            />
            {errorMessages.zip && (
              <div className="error">{errorMessages.zip}</div>
            )}
            <input
              className="commoninput"
              name="birthDate"
              type="date"
              placeholder="BirthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
            />
            {errorMessages.birthDate && (
              <div className="error">{errorMessages.birthDate}</div>
            )}
            <input
              className="commoninput"
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <input
              className="commoninput"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errorMessages.confirmPassword && (
              <div className="error">{errorMessages.confirmPassword}</div>
            )}
            <br />
            <button className="regisbtn" type="submit">
              Submit
            </button>
          </form>
          <button className="backbtn">
            <Link className="back" to="/login">
              Already have an account
            </Link>
          </button>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
