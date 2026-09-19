import { useState } from "react";

export default function AskBar({ onAsk, loading }) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (!query.trim()) return;
    onAsk(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-2 bg-[#171717] border border-[#2A2A2A] rounded-full px-5 py-3.5 focus-within:border-[#3FC1B0] transition-colors">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about the weather anywhere — e.g. Will it rain in Bengaluru tomorrow?"
          className="flex-1 bg-transparent text-sm text-[#F2EDE4] placeholder-[#86A19C] focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#3FC1B0] text-[#0A0A0A] hover:bg-[#56d4c2] transition-colors disabled:opacity-50"
        >
          {loading ? "..." : "→"}
        </button>
      </div>
    </div>
  );
}
