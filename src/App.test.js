import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux"; // Import Provider
import store from "./store.js"; // Import your mock store
import App from "./App";

test("renders the landing page", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </Provider>
  );
});
