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
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            width: "100%",
            maxWidth: "300px",
            margin: "0 auto"
          }}
        >
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your code"
            className="access-input"
            style={{ width: "100%" }}
          />
          <button
            type="submit"
            className="access-button"
            style={{ width: "100%", fontWeight: "bold", fontSize: "1.1rem" }}
          >
            Enter
          </button>
        </form>

      </div>
    </div>
  );
}
