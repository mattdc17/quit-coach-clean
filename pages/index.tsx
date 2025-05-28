import { useState, useEffect, useRef } from "react";
import LoginGate from "../components/LoginGate";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const systemPrompt = "You are Quit Coach, a supportive recovery assistant...";
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [starters, setStarters] = useState([]);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
      <div className="outer-wrapper">
        <div className="chat-container">
          <div className="logo-container">
            <img src="/logo.png" alt="Quit Coach Logo" className="logo-access" />
          </div>
          {/*<h1>Quit Coach</h1>
          <p>
            For people quitting substances or healing afterward — quick, clear support to take back control of your life.
          </p> */}

          {!started && (
            <div>
              <h2>What's On Your Mind?</h2>
              <div className="prompt-buttons">
                {starters.map((starter, i) => (
                  <button
                    key={i}
                    className="prompt-button"
                    onClick={() => sendMessage(starter)}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(messages.some((m) => m.role !== "system") || loading) && (
            <div className="fixed-chat-wrapper">
              <div className="message-box">
                {messages.map((m, i) =>
                  m.role !== "system" ? (
                  <div
                    key={i}
                    className={`message ${m.role === "user" ? "user" : "assistant"}`}
                  >
                    {m.content.split("\n\n").map((para, j) => (
                      <p key={j}>{para}</p>
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

          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type anything..."
            />
            <button onClick={() => sendMessage()} disabled={loading}>
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </LoginGate>
  );
}
