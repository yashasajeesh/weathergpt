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
    <div className="px-4 sm:px-6 py-3 max-w-3xl mx-auto w-full">
      <div className="glass rounded-full px-5 py-3.5 flex items-center gap-2 focus-within:bg-white/10 transition-colors">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about the weather anywhere..."
          className="flex-1 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-40"
        >
          {loading ? "..." : "↑"}
        </button>
      </div>
    </div>
  );
}
