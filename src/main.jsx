import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import KraftLogin from "./KraftLogin.jsx";

function Root() {
  const [unlocked, setUnlocked] = useState(
    sessionStorage.getItem("kraft_unlocked") === "1"
  );
  return unlocked ? <App /> : (
    <KraftLogin onUnlock={() => {
      sessionStorage.setItem("kraft_unlocked", "1");
      setUnlocked(true);
    }} />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);