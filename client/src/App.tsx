import React, { useEffect, useState } from "react";
/* For API part
import Message from "./Message";
 */

// This defines the overall page layout.
function App() {


  return(
    <div>
      <h2 className="text-red-500">Hi, Wenfei!</h2>
    </div>
  );

  /*
  // Uncomment this section to connect to and retrieve data from API.
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
  */
}

export default App;
