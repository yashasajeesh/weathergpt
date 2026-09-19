import { useState } from "react";
import axios from "axios";

export default function ChatBox({ onWeatherUpdate }) {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message;
    setChatLog((prev) => [...prev, { sender: "user", text: userMsg }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/chat", {
        message: userMsg,
      });

      const { reply, location, raw_weather } = response.data;
      setChatLog((prev) => [...prev, { sender: "bot", text: reply }]);
      if (onWeatherUpdate) onWeatherUpdate({ location, raw_weather });
    } catch (error) {
      setChatLog((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="bg-[#171717] border border-[#2A2A2A] rounded-lg flex flex-col h-full min-h-[420px]">
      <div className="px-6 py-4 border-b border-[#2A2A2A]">
        <p className="text-[#86A19C] text-xs uppercase tracking-wide">Ask WeatherGPT</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {chatLog.length === 0 && (
          <p className="text-[#86A19C] text-sm">
            Try: "Will it rain in Bengaluru tomorrow?"
          </p>
        )}
        {chatLog.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <span
              className={`px-4 py-2 rounded-lg text-sm max-w-[80%] leading-relaxed ${
                msg.sender === "user"
                  ? "bg-[#E8A33D] text-[#0A0A0A]"
                  : "bg-[#0A0A0A] text-[#EDF3F2] border border-[#2A2A2A]"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <p className="text-[#3FC1B0] text-sm">Thinking...</p>}
      </div>

      <div className="p-4 border-t border-[#2A2A2A] flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about the weather..."
          className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded-md px-3 py-2 text-sm text-[#EDF3F2] placeholder-[#86A19C] focus:outline-none focus:border-[#E8A33D]"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 rounded-md bg-[#E8A33D] text-[#0A0A0A] text-sm font-medium hover:bg-[#f0b25a] transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
