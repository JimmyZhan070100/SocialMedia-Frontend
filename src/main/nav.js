import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { updateFormData } from "../actions";

const Nav = ({ updateForm }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/logout`, {
      method: "PUT",
      credentials: "include", // Include credentials for cookie-based authentication
    })
      .then((response) => {
        if (response.ok) {
          // Clear localStorage and reset form data
          localStorage.clear();
          updateForm({
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            phone: "",
            zip: "",
            birthDate: "",
            password: "",
            confirmPassword: "",
          });
          // Navigate to the "Login" page
          navigate("/login");
        } else {
          // Handle logout failure (optional)
          console.error("Logout failed");
        }
      })
      .catch((error) => {
        // Handle network errors
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <nav className="navbar navbar-inverse navbar-helper">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link
              className="navbar-brand navbar-brand-helper"
              style={{ color: "#f0f2f5" }}
              to="/profile"
            >
              Profile
            </Link>
          </div>
          <div className="nav navbar-nav navbar-center">
            <ul className="nav navbar-nav">
              <h1 className="mainTitle">Rice Book</h1>
            </ul>
          </div>
          <div className="nav navbar-nav navbar-right">
            <ul className="nav navbar-nav">
              <li>
                <button className="logOut" onClick={handleLogout}>
                  LogOut
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="center">
        <hr />
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateForm: (formData) => dispatch(updateFormData(formData)),
});

export default connect(null, { updateForm: updateFormData })(Nav);
