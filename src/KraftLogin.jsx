import { useState, useEffect, useRef } from "react";

const CORRECT_PIN = "0788381120";
const HINT = "My phone number";

export default function KraftLogin({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxLen = CORRECT_PIN.length;

  const handleKey = (k) => {
    if (success) return;
    if (k === "del") { setPin(p => p.slice(0, -1)); return; }
    if (pin.length >= maxLen) return;
    const next = pin + k;
    setPin(next);
    if (next.length === maxLen) {
      setTimeout(() => {
        if (next === CORRECT_PIN) {
          setSuccess(true);
          setTimeout(() => onUnlock && onUnlock(), 1000);
        } else {
          setShake(true);
          setAttempts(a => a + 1);
          setTimeout(() => { setShake(false); setPin(""); }, 700);
        }
      }, 200);
    }
  };

  const keys = [
    ["1","2","3"],
    ["4","5","6"],
    ["7","8","9"],
    ["hint","0","del"],
  ];

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "linear-gradient(135deg, #07070d 0%, #0e0b1a 50%, #080d14 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      overflow: "hidden", userSelect: "none",
      color: "#e8e6f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes kshake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-10px)}
          30%{transform:translateX(10px)}
          45%{transform:translateX(-8px)}
          60%{transform:translateX(8px)}
          75%{transform:translateX(-5px)}
          90%{transform:translateX(5px)}
        }
        @keyframes kglow {
          0%,100%{box-shadow:0 0 20px rgba(108,71,255,0.3)}
          50%{box-shadow:0 0 40px rgba(108,71,255,0.6)}
        }
        @keyframes kfadeup {
          from{opacity:0;transform:translateY(20px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes kdot {
          from{transform:scale(0)}
          to{transform:scale(1)}
        }
        @keyframes kpulse {
          0%,100%{opacity:0.3;transform:scale(0.95)}
          50%{opacity:1;transform:scale(1.05)}
        }
        .kkey {
          transition: all 0.12s cubic-bezier(0.34,1.56,0.64,1);
          cursor: pointer;
        }
        .kkey:active {
          transform: scale(0.85) !important;
        }
      `}</style>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 40, animation: "kfadeup 0.6s ease" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px",
          background: "linear-gradient(135deg, #1a1a2e, #6c47ff)",
          border: "1px solid rgba(108,71,255,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, fontWeight: 800, color: "#ede9fe",
          animation: "kglow 3s ease infinite",
        }}>K</div>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 6, marginBottom: 6 }}>KRAFT AI</div>
        <div style={{ fontSize: 12, color: "rgba(167,139,250,0.6)", letterSpacing: 3 }}>
          {success ? "ACCESS GRANTED" : "ENTER YOUR PIN"}
        </div>
      </div>

      {/* PIN dots */}
      <div style={{
        marginBottom: 32,
        animation: shake ? "kshake 0.6s ease" : "none",
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center" }}>
          {Array.from({ length: maxLen }).map((_, i) => {
            const filled = i < pin.length;
            return (
              <div key={i} style={{
                width: filled ? 12 : 9,
                height: filled ? 12 : 9,
                borderRadius: "50%",
                background: success
                  ? "linear-gradient(135deg, #10b981, #34d399)"
                  : filled
                  ? "linear-gradient(135deg, #6c47ff, #a78bfa)"
                  : "transparent",
                border: filled ? "none" : "1.5px solid rgba(167,139,250,0.3)",
                transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow: filled ? (success ? "0 0 10px rgba(16,185,129,0.6)" : "0 0 10px rgba(108,71,255,0.5)") : "none",
              }} />
            );
          })}
        </div>
        {attempts > 0 && !success && (
          <div style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "#e11d48", letterSpacing: 1 }}>
            Wrong PIN {attempts > 1 ? `(${attempts} attempts)` : ""}
          </div>
        )}
      </div>

      {/* Hint */}
      {hintVisible && (
        <div style={{
          background: "rgba(108,71,255,0.12)",
          border: "1px solid rgba(108,71,255,0.3)",
          borderRadius: 12, padding: "10px 20px",
          marginBottom: 20, fontSize: 13,
          color: "#a78bfa", textAlign: "center",
        }}>
          Hint: <span style={{ color: "#c4b5fd", fontWeight: 600 }}>{HINT}</span>
        </div>
      )}

      {/* Keypad */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "kfadeup 0.8s ease" }}>
        {keys.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap: 12 }}>
            {row.map((k) => {
              const isHint = k === "hint";
              const isDel = k === "del";
              return (
                <button
                  key={k}
                  className="kkey"
                  onClick={() => {
                    if (isHint) { setHintVisible(v => !v); return; }
                    handleKey(k);
                  }}
                  style={{
                    width: 80, height: 80, borderRadius: 20,
                    background: isHint
                      ? "rgba(108,71,255,0.1)"
                      : isDel
                      ? "rgba(225,29,72,0.08)"
                      : "rgba(255,255,255,0.04)",
                    border: isHint
                      ? "1px solid rgba(108,71,255,0.3)"
                      : isDel
                      ? "1px solid rgba(225,29,72,0.2)"
                      : "1px solid rgba(255,255,255,0.07)",
                    color: isHint ? "#a78bfa" : isDel ? "#e11d48" : "#e8e6f0",
                    fontSize: isHint || isDel ? 11 : 22,
                    fontWeight: isHint || isDel ? 600 : 400,
                    fontFamily: isHint || isDel ? "'DM Sans', sans-serif" : "'DM Mono', monospace",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    letterSpacing: isHint || isDel ? 0.5 : 2,
                    gap: 2,
                  }}
                >
                  {isDel ? (
                    <span style={{ fontSize: 20 }}>&#9003;</span>
                  ) : isHint ? (
                    <>
                      <span style={{ fontSize: 18 }}>?</span>
                      <span style={{ fontSize: 9, letterSpacing: 1, opacity: 0.7 }}>HINT</span>
                    </>
                  ) : k}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 36, fontSize: 10,
        color: "rgba(255,255,255,0.15)",
        letterSpacing: 2, fontWeight: 500,
      }}>
        KRAFT AI · KIGALI, RWANDA
      </div>
    </div>
  );
}
