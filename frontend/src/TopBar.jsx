const ROLES = ["General", "Agriculture", "Marine", "Aviation", "Smart City"];
const LANGUAGES = ["English", "ಕನ್ನಡ", "हिंदी"];

function CloudIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.5 17C4.01 17 2 14.99 2 12.5C2 10.19 3.72 8.3 5.96 8.03C6.72 5.68 8.94 4 11.5 4C14.61 4 17.17 6.34 17.47 9.36C19.5 9.69 21 11.42 21 13.5C21 15.84 19.09 17.75 16.75 17.75H6.5V17Z"
        stroke="#7DD8CC"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TopBar({ role, setRole, language, setLanguage }) {
  return (
    <div className="sticky top-0 z-20 px-4 sm:px-6 py-4">
      <div className="glass rounded-2xl px-5 py-3.5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <CloudIcon />
          <span className="font-logo text-lg font-semibold text-white">WeatherGPT</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="glass-pill rounded-full p-1 flex flex-wrap">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  role === r
                    ? "bg-white text-black font-medium"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="glass-pill rounded-full p-1 flex">
            {LANGUAGES.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                  language === l
                    ? "bg-[#E8A33D] text-black font-medium"
                    : "text-white/60 hover:text-white"
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
