import React, { useState } from "react";
import "../styles/style.css";
import { Link, useNavigate } from "react-router-dom";
import { connect, useDispatch, useSelector } from "react-redux";
import { updateFormData, loginFail } from "../actions";
import * as dataFetchers from "../getData";
import { FcGoogle } from "react-icons/fc";

const Login = ({ updateForm }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.formData.error);

  const GoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
  };

  const handleLogin = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
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
          dataFetchers.fetchEmail(username),
          dataFetchers.fetchPhone(username),
          dataFetchers.fetchZipcode(username),
          dataFetchers.fetchDob(username),
        ]);
      })
      .then(([emailData, phoneData, zipcodeData, dobData]) => {
        // Update the form data
        const formDataUpdate = {
          userName: username,
          email: emailData.email,
          phone: phoneData.phone,
          zip: zipcodeData.zipcode,
          birthDate: dobData.dob,
          password: password,
          confirmPassword: password,
        };
        updateForm(formDataUpdate);
        navigate("/main");
      })
      .catch((error) => {
        dispatch(loginFail(error.message));
      });
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
          <input
            type="text"
            className="LoginText"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <br />
          <input
            type="Password"
            className="LoginText"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <br />
          <button className="btn" onClick={handleLogin}>
            LogIn
          </button>
          <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
        </div>
        <div className="SocialLogin">
          <button onClick={GoogleLogin} className="btn btn-light">
            <FcGoogle className="google-icon" /> Login with Google
          </button>
        </div>
        <div className="CreateAccount">
          <button className="btns">
            <Link className="Linker" to="/register">
              New User?
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateForm: (formData) => dispatch(updateFormData(formData)),
});

export default connect(null, mapDispatchToProps)(Login);
