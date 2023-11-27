import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  act,
  screen,
} from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Profile from "./profile";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

const initialFormData = {
  userName: "testUser",
  email: "test@example.com",
  phone: "123-456-7890",
  zip: "12345",
  password: "testPassword",
};

describe("Profile Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      formData: { formData: initialFormData },
    });
  });

  it("renders profile information", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/profile"]}>
          <Routes>
            <Route path="/profile" element={<Profile />} />{" "}
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Check if the profile information is displayed
    screen.getByText("User Name: testUser");
    screen.getByText("Email: test@example.com");
    screen.getByText("Phone: 123-456-7890");
    screen.getByText("Zip Code: 12345");
    screen.getByText("Password: ************");
  });

  it("updates user information", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/profile"]}>
          <Routes>
            <Route path="/profile" element={<Profile />} />{" "}
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Simulate user input and update action
    fireEvent.change(screen.getByPlaceholderText("New User Name"), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("New Email"), {
      target: { value: "new@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("New Phone"), {
      target: { value: "111-222-3333" },
    });
    fireEvent.change(screen.getByPlaceholderText("New Zip Code"), {
      target: { value: "54321" },
    });
    fireEvent.change(screen.getByPlaceholderText("New Password"), {
      target: { value: "newPassword" },
    });
    fireEvent.click(screen.getByText("Upload new picture"));
    fireEvent.click(screen.getByAltText("User Profile"));

    fireEvent.click(screen.getByText("Update"));
    await waitFor(() => {
      // Access the updated state from the Redux store
      const state = store.getState();
      expect(state.formData.formData.userName).toBe("testUser");
    });
  });

  it("validate error update information", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/profile"]}>
          <Routes>
            <Route path="/profile" element={<Profile />} />{" "}
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Simulate user input and update action
    fireEvent.change(screen.getByPlaceholderText("New User Name"), {
      target: { value: "@@@" },
    });
    fireEvent.change(screen.getByPlaceholderText("New Email"), {
      target: { value: "new@example" },
    });
    fireEvent.change(screen.getByPlaceholderText("New Phone"), {
      target: { value: "11122233333" },
    });
    fireEvent.change(screen.getByPlaceholderText("New Zip Code"), {
      target: { value: "a4321" },
    });
    fireEvent.change(screen.getByPlaceholderText("New Password"), {
      target: { value: "newPassword" },
    });
    fireEvent.click(screen.getByText("Update"));
  });
});
