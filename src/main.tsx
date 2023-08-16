import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "remixicon/fonts/remixicon.css";
import "./index.css";
import { ConfigProvider, theme } from "antd";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#7b68ed",
          controlHeight: 48,
          controlHeightLG: 40,
          borderRadius: 8,
        },
        algorithm: theme.darkAlgorithm,
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
