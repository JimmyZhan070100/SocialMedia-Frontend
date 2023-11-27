import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/register";
import Main from "./main/Main";
import Profile from "./profile/profile";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />{" "}
        <Route path="/login" exact={true} element={<Login />} />{" "}
        <Route path="/register" exact={true} element={<Register />} />{" "}
        <Route path="/main" element={<Main />} />{" "}
        <Route path="/profile" element={<Profile />} />{" "}
      </Routes>
    </div>
  );
}

export default App;
