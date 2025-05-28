import { useState, useEffect, useRef } from "react";
import LoginGate from "../components/LoginGate";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const systemPrompt = "You are Quit Coach, a supportive recovery assistant...";
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [starters, setStarters] = useState([]);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef(null);

  const conversationStarters = [
    "I’m ready to quit kratom — where do I start?",
    "I keep relapsing at night. Can we talk about that?",
    "Why do I feel scared of quitting even though I hate using?",
    "I want to taper down, but I don’t know how fast to go.",
    "I'm afraid that if I quit, I won't be able to enjoy my life.",
    "Can you give me motivation to get through my day?",
    "I want to quit, but I just don't know where to start."
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const shuffled = [...conversationStarters].sort(() => 0.5 - Math.random());
    setStarters(shuffled.slice(0, 4));
  }, []);

  const sendMessage = async (prompt = null) => {
    const userInput = prompt || input;
    if (!userInput.trim()) return;
    if (!started) setStarted(true);
    setLoading(true);

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            ...newMessages
          ]
        }),
      });

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "There was an error processing your request." }
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <LoginGate>
      <div className="outer-wrapper" style={{ padding: "1rem", height: "100vh" }}>
        <div className="chat-container" style={{ width: "100%", maxWidth: "100%", boxShadow: "none", padding: "1.5rem 1rem" }}>
          <div className="logo-container">
            <img src="/logo.png" alt="Quit Coach Logo" className="logo-access" style={{ width: "64px", height: "64px" }} />
          </div>

          {!started && (
            <>
              <h2 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem" }}>What's On Your Mind?</h2>
              <div className="prompt-buttons">
                {starters.map((starter, i) => (
                  <button
                    key={i}
                    className="prompt-button"
                    onClick={() => sendMessage(starter)}
                    style={{ fontSize: "0.9rem" }}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </>
          )}

          {(messages.some((m) => m.role !== "system") || loading) && (
            <div className="fixed-chat-wrapper">
              <div className="message-box" style={{ backgroundColor: "transparent", border: "none", padding: "0" }}>
                {messages.map((m, i) =>
                  m.role !== "system" ? (
                    <div
                      key={i}
                      className={`message ${m.role === "user" ? "user" : "assistant"}`}
                      style={{ borderRadius: "16px", padding: "0.75rem 1rem", margin: "0.25rem 0", fontSize: "0.9rem" }}
                    >
                      {m.content.split("\n\n").map((para, j) => (
                        <p key={j} style={{ margin: 0 }}>{para}</p>
                      ))}
                    </div>
                  ) : null
                )}
                {loading && (
                  <div className="message assistant typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          <div className="input-area" style={{ position: "fixed", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", padding: "0.75rem 1rem", display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type anything..."
              style={{ flex: 1, padding: "0.75rem", fontSize: "1rem", borderRadius: "12px", border: "1px solid #ccc" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading}
              style={{ backgroundColor: "#0670DB", color: "white", border: "none", padding: "0.75rem 1.25rem", borderRadius: "12px", fontSize: "1rem", cursor: "pointer" }}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </LoginGate>
  );
}
