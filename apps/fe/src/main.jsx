import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { injectStore } from "./store/axiosClient.js";
import { SocketProvider } from "./context/SocketContext";

// Initialize i18n
import "./i18n";

import { ThemeProvider } from "./context/ThemeContext";

injectStore(store);
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider>
      <SocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketProvider>
    </ThemeProvider>
  </Provider>,
);
