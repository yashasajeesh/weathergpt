export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.08); }
        }
        @keyframes floatSlow2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 40px) scale(1.05); }
        }
      `}</style>
      <div className="absolute inset-0 bg-[#05070A]" />
      <div
        className="absolute rounded-full blur-[120px] opacity-40"
        style={{
          width: "700px", height: "700px",
          top: "-15%", left: "-10%",
          background: "radial-gradient(circle, #1F5F5A 0%, transparent 70%)",
          animation: "floatSlow 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full blur-[130px] opacity-30"
        style={{
          width: "800px", height: "800px",
          bottom: "-20%", right: "-15%",
          background: "radial-gradient(circle, #3A2E5C 0%, transparent 70%)",
          animation: "floatSlow2 30s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full blur-[100px] opacity-25"
        style={{
          width: "500px", height: "500px",
          top: "30%", left: "40%",
          background: "radial-gradient(circle, #E8A33D 0%, transparent 70%)",
          animation: "floatSlow 35s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}
