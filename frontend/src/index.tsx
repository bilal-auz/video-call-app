import "./setup.ts";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { VideoCallContext } from "./context/VideoCallContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <VideoCallContext>
      <App />
    </VideoCallContext>
  </React.StrictMode>
);
