const ROLES = ["General", "Agriculture", "Marine", "Aviation", "Smart City"];
const LANGUAGES = ["English", "ಕನ್ನಡ", "हिंदी"];

function CloudIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.5 17C4.01 17 2 14.99 2 12.5C2 10.19 3.72 8.3 5.96 8.03C6.72 5.68 8.94 4 11.5 4C14.61 4 17.17 6.34 17.47 9.36C19.5 9.69 21 11.42 21 13.5C21 15.84 19.09 17.75 16.75 17.75H6.5V17Z"
        stroke="#3FC1B0"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TopBar({ role, setRole, language, setLanguage }) {
  return (
    <div className="border-b border-[#2A2A2A] bg-[#0A0A0A] px-6 py-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <CloudIcon />
          <span className="font-logo text-xl font-semibold text-[#F2EDE4]">WeatherGPT</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Role selector */}
          <div className="flex bg-[#171717] border border-[#2A2A2A] rounded-full p-1">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  role === r
                    ? "bg-[#3FC1B0] text-[#0A0A0A] font-medium"
                    : "text-[#86A19C] hover:text-[#F2EDE4]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Language selector */}
          <div className="flex bg-[#171717] border border-[#2A2A2A] rounded-full p-1">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                  language === l
                    ? "bg-[#E8A33D] text-[#0A0A0A] font-medium"
                    : "text-[#86A19C] hover:text-[#F2EDE4]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
