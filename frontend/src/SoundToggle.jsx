export default function SoundToggle({ enabled, setEnabled }) {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className="glass-pill rounded-full w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors flex-shrink-0"
      title={enabled ? "Mute weather sounds" : "Enable weather sounds"}
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}
