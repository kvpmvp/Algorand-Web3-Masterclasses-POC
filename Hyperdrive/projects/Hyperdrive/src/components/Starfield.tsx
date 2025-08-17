import React from "react";

// Animated falling stars using layered radial-gradients with different speeds
const Starfield: React.FC = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <style>{`
      @keyframes fallSlow { from { background-position: 0 0; } to { background-position: 0 1200px; } }
      @keyframes fallMed  { from { background-position: 0 0; } to { background-position: 0 1600px; } }
      @keyframes fallFast { from { background-position: 0 0; } to { background-position: 0 2000px; } }
    `}</style>
    <div className="absolute inset-0 bg-black" />

    {/* Layer 1 (slow) */}
    <div
      className="absolute inset-0 opacity-70"
      style={{
        backgroundImage:
          "radial-gradient(2px 2px at 20px 30px, white 55%, transparent 56%)," +
          "radial-gradient(1px 1px at 200px 80px, white 55%, transparent 56%)," +
          "radial-gradient(1.5px 1.5px at 300px 120px, white 55%, transparent 56%)," +
          "radial-gradient(1px 1px at 400px 200px, white 55%, transparent 56%)," +
          "radial-gradient(2px 2px at 600px 50px, white 55%, transparent 56%)," +
          "radial-gradient(1px 1px at 800px 220px, white 55%, transparent 56%)",
        backgroundSize: "800px 800px",
        animation: "fallSlow 60s linear infinite",
      }}
    />

    {/* Layer 2 (medium) */}
    <div
      className="absolute inset-0 opacity-80"
      style={{
        backgroundImage:
          "radial-gradient(1px 1px at 150px 10px, white 55%, transparent 56%)," +
          "radial-gradient(2px 2px at 350px 260px, white 55%, transparent 56%)," +
          "radial-gradient(1px 1px at 550px 400px, white 55%, transparent 56%)," +
          "radial-gradient(1.5px 1.5px at 700px 90px, white 55%, transparent 56%)," +
          "radial-gradient(1px 1px at 950px 300px, white 55%, transparent 56%)",
        backgroundSize: "800px 800px",
        animation: "fallMed 40s linear infinite",
      }}
    />

    {/* Layer 3 (fast) */}
    <div
      className="absolute inset-0 opacity-90"
      style={{
        backgroundImage:
          "radial-gradient(1px 1px at 100px 200px, white 55%, transparent 56%)," +
          "radial-gradient(2px 2px at 260px 500px, white 55%, transparent 56%)," +
          "radial-gradient(1.5px 1.5px at 600px 150px, white 55%, transparent 56%)," +
          "radial-gradient(2px 2px at 900px 420px, white 55%, transparent 56%)",
        backgroundSize: "800px 800px",
        animation: "fallFast 25s linear infinite",
      }}
    />

    {/* Nebula tint */}
    <div
      className="absolute -inset-20 blur-3xl opacity-40"
      style={{
        background:
          "radial-gradient(circle at 20% 30%, rgba(56,189,248,0.25), transparent 40%)," +
          "radial-gradient(circle at 80% 70%, rgba(52,211,153,0.25), transparent 40%)",
      }}
    />
  </div>
);

export default Starfield;
