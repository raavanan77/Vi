import React, { useState, useEffect } from "react";

const LogDisplay = () => {
  const [logs, setLogs] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch logs from the backend
    const fetchLogs = () => {
      fetch("http://192.168.0.104:8000/api/logs/")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch logs");
          }
          return response.json();
        })
        .then((data) => {
          if (data.logs) {
            setLogs(data.logs); // Update the logs state
          } else {
            setError(data.error || "Unknown error");
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    };

    // Start polling every 5 seconds
    const intervalId = setInterval(fetchLogs, 5000);

    // Cleanup polling when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h1>Running Logs</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <pre>{logs}</pre> // Display logs in a <pre> tag to preserve formatting
      )}
    </div>
  );
};

export default LogDisplay;
