import { render, fireEvent } from "@testing-library/react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import React from "react";
import { Provider } from "react-redux";
import { rest } from "msw";
import { setupServer } from "msw/node";
import App from "./App";
import store from "./store";

require("mutationobserver-shim");

const server = setupServer(
  rest.post("/api/login", (req, res, ctx) => {
    return res(ctx.json({ token: "fake_user_token" }));
  })
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

test("logs in", () => {
  const { getByTestId, getByText } = render(
    <MuiThemeProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </MuiThemeProvider>
  );

  fireEvent.change(getByTestId("your-email-input"), {
    target: { value: "tester@nafnaval.is" },
  });

  fireEvent.change(getByTestId("partner-email-input"), {
    target: { value: "tester2@nafnaval.is" },
  });
  fireEvent.click(getByTestId("male-radio"));
  fireEvent.click(getByText("Submit"));
});
