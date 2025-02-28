import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
//import 'xterm/css/xterm.css'; // Import xterm styles

const TerminalComponent = () => {
  const terminalRef = useRef(null); // To hold the reference to the DOM element

  useEffect(() => {
    // Initialize terminal instance
    const term = new Terminal({
      cursorBlink: true, // You can customize various options
      theme: {
        background: "#000",
        foreground: "#fff",
      },
    });

    // Initialize FitAddon (for resizing)

    // Attach the terminal to the DOM element

    // Simulate some bash command output for demonstration
    term.writeln("Welcome to the terminal!");
    term.writeln("Type your commands below...");

    // You can use term.write() to simulate a prompt and accept user input
    term.write("$ ");

    // Optional: Add event listeners to handle user input and execute commands
    term.onData((data) => {
      if (data === "\r") {
        term.writeln("You pressed enter!");
        term.write("$ ");
      } else {
        term.write(data);
      }
    });

    return () => {
      term.dispose(); // Clean up on unmount
    };
  }, []);

  return (
    <div>
      <div
        ref={terminalRef}
        style={{
          height: "400px",
          width: "100%",
          backgroundColor: "#000",
          color: "#fff",
          border: "1px solid #ccc",
        }}
      ></div>
    </div>
  );
};

export default TerminalComponent;
