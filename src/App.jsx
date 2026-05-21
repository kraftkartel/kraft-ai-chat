import { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: "You are KRAFT AI, a helpful and intelligent assistant." },
            ...newMessages
          ]
        })
      });
      const data = await response.json();
      const aiMsg = data.choices[0].message;
      setMessages([...newMessages, aiMsg]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Error. Try again." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ color: "#fff", letterSpacing: 2 }}>KRAFT AI</h1>
      <div style={{ width: "100%", maxWidth: 700, flex: 1, overflowY: "auto", marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", margin: "8px 0" }}>
            <span style={{ background: m.role === "user" ? "#7c3aed" : "#1f1f1f", color: "#fff", padding: "10px 16px", borderRadius: 18, maxWidth: "75%", lineHeight: 1.5 }}>
              {m.content}
            </span>
          </div>
        ))}
        {loading && <p style={{ color: "#888" }}>KRAFT AI is thinking...</p>}
      </div>
      <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 700 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Message KRAFT AI..."
          style={{ flex: 1, padding: 14, borderRadius: 24, border: "none", background: "#1f1f1f", color: "#fff", fontSize: 16 }}
        />
        <button onClick={sendMessage} style={{ padding: "14px 24px", borderRadius: 24, background: "#7c3aed", color: "#fff", border: "none", cursor: "pointer", fontSize: 16 }}>
          Send
        </button>
      </div>
    </div>
  );
}
