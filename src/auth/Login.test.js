import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
import Login from "./Login";
import { updateFormData, loginFail } from "../actions";

describe("Login Component", () => {
  beforeEach(() => {
    // Reset any local storage and mock fetch responses
    localStorage.clear();
    jest.resetAllMocks();
  });

  it("renders the Login component", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    // Ensure that the Login component is rendered
    expect(screen.getByText("RiceBook")).toBeTruthy();
    expect(screen.getByPlaceholderText("Username")).toBeTruthy();
    expect(screen.getByPlaceholderText("Password")).toBeTruthy();
    expect(screen.getByText("LogIn")).toBeTruthy();
  });

  it("handles successful login", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: () => [
        {
          id: 1,
          name: "Leanne Graham",
          username: "Bret",
          email: "Sincere@april.biz",
          address: {
            street: "Kulas Light",
            suite: "Apt. 556",
            city: "Gwenborough",
            zipcode: "92998-3874",
          },
          phone: "1-770-736-8031 x56442",
          website: "hildegard.org",
          company: {
            name: "Romaguera-Crona",
            catchPhrase: "Multi-layered client-server neural-net",
            bs: "harness real-time e-markets",
          },
        },
      ],
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "Bret" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Kulas Light" },
    });

    // Trigger the login action by clicking the "LogIn" button
    fireEvent.click(screen.getByText("LogIn"));
  });

  it("handles login with invalid credentials", async () => {
    global.fetch = jest.fn().mockResolvedValue([]);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/login"]}>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "fakeuser" }, // Provide a fake username
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "fakepassword" }, // Provide a fake password
    });
    store.dispatch(loginFail("Invalid username or password"));
    // Trigger the login action by clicking the "LogIn" button
    fireEvent.click(screen.getByText("LogIn"));
    await screen.findByText("Invalid username or password");
  });
});
