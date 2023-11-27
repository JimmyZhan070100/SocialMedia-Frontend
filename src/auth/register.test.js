import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
import Login from "./Login";
import Register from "./register";
import Main from "../main/Main";

describe("Register Component", () => {
  it("renders the Register component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/register"]}>
          <Routes>
            <Route path="/" element={<Login />} />{" "}
            <Route path="/login" exact={true} element={<Login />} />{" "}
            <Route path="/register" exact={true} element={<Register />} />{" "}
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Ensure that the Register component is rendered
    screen.getByPlaceholderText("First Name");
    screen.getByPlaceholderText("Last Name");
    screen.getByPlaceholderText("User name");
    screen.getByPlaceholderText("Email address");
    screen.getByPlaceholderText("Phone number (123-123-1234)");
    screen.getByPlaceholderText("Zip code");
    screen.getByPlaceholderText("BirthDate");
    screen.getByPlaceholderText("Password");
    screen.getByPlaceholderText("Confirm password");
    screen.getByText("Already have an account");
  });

  it("handles form submission with valid data", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/register"]}>
          <Routes>
            <Route path="/" element={<Login />} />{" "}
            <Route path="/login" exact={true} element={<Login />} />{" "}
            <Route path="/register" exact={true} element={<Register />} />{" "}
            <Route path="/main" element={<Main />} />{" "}
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const userNameInput = screen.getByPlaceholderText("User name");
    const emailInput = screen.getByPlaceholderText("Email address");
    const phoneInput = screen.getByPlaceholderText(
      "Phone number (123-123-1234)"
    );
    const zipInput = screen.getByPlaceholderText("Zip code");
    const birthDateInput = screen.getByPlaceholderText("BirthDate");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm password");
    const submitButton = screen.getByText("Submit");

    fireEvent.change(firstNameInput, { target: { value: "John" } });
    fireEvent.change(lastNameInput, { target: { value: "Doe" } });
    fireEvent.change(userNameInput, { target: { value: "johndoe123" } });
    fireEvent.change(emailInput, { target: { value: "johndoe@example.com" } });
    fireEvent.change(phoneInput, { target: { value: "123-123-1234" } });
    fireEvent.change(zipInput, { target: { value: "12345" } });
    fireEvent.change(birthDateInput, { target: { value: "2000-01-01" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    fireEvent.click(submitButton);
  });

  it("handles form submission with invalid data", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/register"]}>
          <Routes>
            <Route path="/" element={<Login />} />{" "}
            <Route path="/login" exact={true} element={<Login />} />{" "}
            <Route path="/register" exact={true} element={<Register />} />{" "}
            <Route path="/main" element={<Main />} />{" "}
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Fill in the form with invalid data

    const firstNameInput = screen.getByPlaceholderText("First Name");
    const lastNameInput = screen.getByPlaceholderText("Last Name");
    const userNameInput = screen.getByPlaceholderText("User name");
    const emailInput = screen.getByPlaceholderText("Email address");
    const phoneInput = screen.getByPlaceholderText(
      "Phone number (123-123-1234)"
    );
    const zipInput = screen.getByPlaceholderText("Zip code");
    const birthDateInput = screen.getByPlaceholderText("BirthDate");
    const passwordInput = screen.getByPlaceholderText("Password");
    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm password");
    const submitButton = screen.getByText("Submit");

    fireEvent.change(firstNameInput, { target: { value: "123" } });
    fireEvent.change(lastNameInput, { target: { value: "123" } });
    fireEvent.change(userNameInput, { target: { value: "@@@" } });
    fireEvent.change(emailInput, { target: { value: "johndoe@example" } });
    fireEvent.change(phoneInput, { target: { value: "123-1231234" } });
    fireEvent.change(zipInput, { target: { value: "1a345" } });
    fireEvent.change(birthDateInput, { target: { value: "20023-01-01" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password456" },
    });
    fireEvent.click(submitButton);
  });
});
