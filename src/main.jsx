import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import KraftLogin from "./KraftLogin.jsx";

function Root() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return (
      <KraftLogin onUnlock={() => setUnlocked(true)} />
    );
  }
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);