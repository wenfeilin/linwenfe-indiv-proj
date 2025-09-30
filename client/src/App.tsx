import React, { useEffect, useState } from "react";
import Message from "./Message";

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
      <Message />
      <h2 className="text-red-500">Hi</h2>
    </div>
  );
}

export default App;
