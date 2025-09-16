import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("loading...");

  useEffect(() => {
    // Fetch message from API and only run on the first render of the component.
    fetch("/api/messages")
      .then((response) => response.text())
      .then((text) => setMessage(text));
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
