import { useState, useEffect } from "react";

export default function LoginGate({ children }) {
  const [code, setCode] = useState("");
  const [granted, setGranted] = useState(false);

  const allowedCode = "coachpass"; // Replace this

  useEffect(() => {
    const stored = localStorage.getItem("access-granted");
    if (stored === "true") setGranted(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === allowedCode) {
      setGranted(true);
      localStorage.setItem("access-granted", "true");
    } else {
      alert("Incorrect access code.");
    }
  };

  if (granted) return <>{children}</>;

  return (
    <div className="outer-wrapper">
      <div className="chat-container">
        <div className="logo-container">
          <img src="/logo.png" alt="Logo" className="logo" />
        </div>
        <h1>Enter Access Code</h1>
        <form onSubmit={handleSubmit} className="access-form">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code"
            className="access-input"
          />
          <button type="submit" className="access-button">Enter</button>
        </form>
      </div>
    </div>
  );
}
