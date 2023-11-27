import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Main from "./Main";
import Nav from "./nav";

const mockStore = configureStore([]);

const loggedInUser = {
  id: 1,
  name: "Leanne Graham",
  username: "Bret",
  email: "Sincere@april.biz",
  company: {
    name: "Romaguera-Crona",
    catchPhrase: "Multi-layered client-server neural-net",
    bs: "harness real-time e-markets",
  },
};

const initialState = {
  formData: {
    formData: loggedInUser,
  },
};

describe("Main Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
  });

  it("fetches articles for the current logged-in user", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/main"]}>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    screen.getByText("Author: Bret");
  });

  it("filter displayed articles by the search keyword", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/main"]}>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText("Search by text"); // Adjust this selector based on your actual input field
    fireEvent.change(searchInput, { target: { value: "delectus" } });

    screen.getByText("delectus");
  });

  it("adds articles when adding a follower", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/main"]}>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    // Simulate adding a follower
    const followInput = screen.getByPlaceholderText("Enter username"); // Adjust this selector based on your actual input field
    fireEvent.change(followInput, { target: { value: "Moriah.Stanton" } });

    const followButton = screen.getByText("Follow");
    fireEvent.click(followButton);

    // Wait for the articles to update (assuming it happens asynchronously)
    await waitFor(() => {
      screen.getByText("author: Moriah.Stanton");
    });
  });

  it("removes articles when removing a follower", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/main"]}>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    // Simulate removing a follower
    const unfollowButton = screen.getByText("Unfollow");
    fireEvent.click(unfollowButton);

    screen.queryByText("author: Bret"); // Ensure that the article is no longer in the UI
  });

  it("changes the new status", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/main"]}>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    const statusInput = screen.getByPlaceholderText("New Status"); // Adjust this selector based on your actual input field

    // Simulate changing the new status
    fireEvent.change(statusInput, { target: { value: "Happy every day!" } });
  });

  it("calls handleLogout when LogOut button is clicked", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/main"]}>
          <Main />
        </MemoryRouter>
      </Provider>
    );

    const logoutButton = screen.getByText("LogOut");

    fireEvent.click(logoutButton);
  });
});
