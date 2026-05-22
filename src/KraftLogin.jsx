import { useState, useEffect, useRef } from "react";

const CORRECT_PIN = atob("MDc4ODM4MTEyMA==");
const HINT = "Contact Kraft Kartel on WhatsApp: +250 788 381 120";

function GlitchCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let t = 0;
    let id;

    const cols = Math.floor(W / 20);
    const rows = Math.floor(H / 20);
    const grid = Array.from({ length: cols }, () =>
      Array.from({ length: rows }, () => ({
        alpha: Math.random(),
        speed: Math.random() * 0.06 + 0.02,
        offset: Math.random() * Math.PI * 2,
        char: Math.random() > 0.7 ? String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)) : Math.floor(Math.random() * 10).toString(),
        changeRate: Math.random() * 0.09,
      }))
    );

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    function draw() {
      t += 0.016;
      ctx.fillStyle = "rgba(7,7,13,0.12)";
      ctx.fillRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = "rgba(108,71,255,0.06)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Scanline
      const scanY = (t * 120) % H;
      const sg = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      sg.addColorStop(0, "rgba(108,71,255,0)");
      sg.addColorStop(0.5, "rgba(108,71,255,0.08)");
      sg.addColorStop(1, "rgba(108,71,255,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanY - 40, W, 80);

      // Matrix chars
      grid.forEach((col, ci) => {
        col.forEach((cell, ri) => {
          cell.offset += cell.speed;
          if (Math.random() < cell.changeRate) {
            cell.char = Math.random() > 0.7
              ? String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))
              : Math.floor(Math.random() * 10).toString();
          }
          const a = (Math.sin(cell.offset) * 0.5 + 0.5) * 0.7;
          ctx.fillStyle = `rgba(108,71,255,${a})`;
          ctx.font = "11px monospace";
          ctx.fillText(cell.char, ci * 20 + 4, ri * 20 + 14);
        });
      });

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${p.alpha})`;
        ctx.fill();
      });

      // Neural connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.strokeStyle = `rgba(108,71,255,${(1 - dist / 120) * 0.4})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      id = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0, width: "100%", height: "100%"
    }} />
  );
}

function TypingText({ lines, speed = 40 }) {
  const [displayed, setDisplayed] = useState([]);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const blink = setInterval(() => setCursor(c => !c), 500);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    if (lineIdx >= lines.length) return;
    if (charIdx < lines[lineIdx].length) {
      const t = setTimeout(() => {
        setDisplayed(prev => {
          const next = [...prev];
          next[lineIdx] = (next[lineIdx] || "") + lines[lineIdx][charIdx];
          return next;
        });
        setCharIdx(c => c + 1);
      }, speed + Math.random() * 30);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLineIdx(l => l + 1);
        setCharIdx(0);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx, lines, speed]);

  return (
    <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, lineHeight: 2, color: "rgba(167,139,250,0.8)" }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "rgba(108,71,255,0.6)" }}>{">"}</span>
          <span style={{ color: i < lineIdx ? "rgba(167,139,250,0.6)" : "#c4b5fd" }}>
            {displayed[i] || ""}
            {i === lineIdx && <span style={{ opacity: cursor ? 1 : 0, color: "#6c47ff" }}>|</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function KraftLogin({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const maxLen = CORRECT_PIN.length;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const terminalLines = [
    "KRAFT AI v2.0 INITIALIZED",
    "NEURAL ENGINE LOADED",
    "GROQ BACKEND CONNECTED",
    "ENCRYPTION ACTIVE",
    "AWAITING AUTHENTICATION...",
  ];

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
          setTimeout(() => onUnlock && onUnlock(), 1200);
        } else {
          setShake(true);
          setAttempts(a => a + 1);
          setTimeout(() => { setShake(false); setPin(""); }, 700);
        }
      }, 200);
    }
  };

  const keys = [["1","2","3"],["4","5","6"],["7","8","9"],["hint","0","del"]];

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#07070d",
      display: "flex",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      letterSpacing: 0.3,
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        @keyframes kshake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-12px)}
          40%{transform:translateX(12px)}
          60%{transform:translateX(-8px)}
          80%{transform:translateX(8px)}
        }
        @keyframes kglow {
          0%,100%{box-shadow:0 0 30px rgba(108,71,255,0.4),0 0 60px rgba(108,71,255,0.1)}
          50%{box-shadow:0 0 50px rgba(108,71,255,0.7),0 0 100px rgba(108,71,255,0.2)}
        }
        @keyframes kfadeup {
          from{opacity:0;transform:translateY(24px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes ksuccess {
          0%{transform:scale(1)}50%{transform:scale(1.06)}100%{transform:scale(1)}
        }
        @keyframes kborder {
          0%,100%{border-color:rgba(108,71,255,0.3)}
          50%{border-color:rgba(108,71,255,0.8)}
        }
        .kkey {
          cursor: pointer;
          transition: all 0.15s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
          overflow: hidden;
        }
        .kkey:hover {
          background: rgba(108,71,255,0.15) !important;
          border-color: rgba(108,71,255,0.5) !important;
          transform: translateY(-2px);
        }
        .kkey:active {
          transform: scale(0.88) translateY(0px) !important;
        }
        .kkey::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(108,71,255,0.3), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .kkey:active::after { opacity: 1; }
      `}</style>

      {/* LEFT PANEL */}
      {!isMobile && (
        <div style={{
          width: "55%", position: "relative",
          borderRight: "1px solid rgba(108,71,255,0.15)",
          display: "flex", flexDirection: "column",
          alignItems: "flex-start", justifyContent: "center",
          padding: "60px 56px",
          overflow: "hidden",
        }}>
          <GlitchCanvas />

          {/* Content over canvas */}
          <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #1a1a2e, #6c47ff)",
                border: "1px solid rgba(108,71,255,0.7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 800, color: "#ede9fe",
                animation: "kglow 3s ease infinite",
                flexShrink: 0,
              }}>K</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 6, color: "#e8e6f0" }}>KRAFT AI</div>
                <div style={{ fontSize: 11, color: "rgba(108,71,255,0.7)", letterSpacing: 3, fontWeight: 500 }}>INTELLIGENCE SYSTEM · v2.0</div>
              </div>
            </div>

            {/* Terminal */}
            <div style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(108,71,255,0.2)",
              borderRadius: 12, padding: "20px 24px",
              marginBottom: 40,
              animation: "kborder 4s ease infinite",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                {["#e11d48","#f59e0b","#10b981"].map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />
                ))}
                <span style={{ fontSize: 10, color: "rgba(108,71,255,0.5)", marginLeft: 8, letterSpacing: 2, fontFamily: "monospace" }}>SYSTEM TERMINAL</span>
              </div>
              <TypingText lines={terminalLines} speed={45} />
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 24 }}>
              {[
                { label: "UPTIME", value: "99.9%" },
                { label: "LATENCY", value: "~80ms" },
                { label: "ENGINE", value: "LLaMA 3.3" },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  padding: "12px 18px",
                  background: "rgba(108,71,255,0.06)",
                  border: "1px solid rgba(108,71,255,0.15)",
                  borderRadius: 10,
                }}>
                  <div style={{ fontSize: 9, color: "rgba(108,71,255,0.6)", letterSpacing: 2, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#c4b5fd", fontFamily: "monospace" }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Bottom tag */}
            <div style={{ marginTop: 48, fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: 2 }}>
              BUILT BY KRAFT KARTEL · KIGALI, RWANDA
            </div>
          </div>
        </div>
      )}

      {/* RIGHT PANEL */}
      <div style={{
        flex: 1,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 32px",
        background: "rgba(10,10,16,0.95)",
        position: "relative",
        userSelect: "none",
      }}>
        {/* Mobile logo */}
        {isMobile && (
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%", margin: "0 auto 12px",
              background: "linear-gradient(135deg,#1a1a2e,#6c47ff)",
              border: "1px solid rgba(108,71,255,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 800, color: "#ede9fe",
              animation: "kglow 3s ease infinite",
            }}>K</div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 5, color: "#e8e6f0" }}>KRAFT AI</div>
          </div>
        )}

        <div style={{ width: "100%", maxWidth: 340, animation: "kfadeup 0.7s ease" }}>
          {/* Header */}
          <div style={{ marginBottom: 36, textAlign: isMobile ? "center" : "left" }}>
            <div style={{ fontSize: 11, color: "rgba(108,71,255,0.7)", letterSpacing: 3, fontFamily: "monospace", marginBottom: 8 }}>
              {success ? "// ACCESS GRANTED" : "// AUTHENTICATION REQUIRED"}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#e8e6f0", lineHeight: 1.2 }}>
              {success ? "Welcome back." : "Enter your PIN"}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>
              {success ? "Initializing KRAFT AI..." : "Access restricted to authorized users only."}
            </div>
          </div>

          {/* PIN display */}
          <div style={{
            marginBottom: 32,
            animation: shake ? "kshake 0.6s ease" : success ? "ksuccess 0.5s ease" : "none",
          }}>
            <div style={{
              background: "rgba(108,71,255,0.04)",
              border: "1px solid rgba(108,71,255,0.15)",
              borderRadius: 14, padding: "18px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 10, color: "rgba(108,71,255,0.5)", letterSpacing: 2, fontFamily: "monospace" }}>PIN</span>
              <div style={{ display: "flex", gap: 8 }}>
                {Array.from({ length: maxLen }).map((_, i) => {
                  const filled = i < pin.length;
                  return (
                    <div key={i} style={{
                      width: filled ? 10 : 7,
                      height: filled ? 10 : 7,
                      borderRadius: "50%",
                      background: success
                        ? "linear-gradient(135deg,#10b981,#34d399)"
                        : filled
                        ? "linear-gradient(135deg,#6c47ff,#a78bfa)"
                        : "transparent",
                      border: filled ? "none" : "1px solid rgba(167,139,250,0.25)",
                      transition: "all 0.15s cubic-bezier(0.34,1.56,0.64,1)",
                      boxShadow: filled ? (success ? "0 0 8px rgba(16,185,129,0.6)" : "0 0 8px rgba(108,71,255,0.6)") : "none",
                    }} />
                  );
                })}
              </div>
            </div>
            {attempts > 0 && !success && (
              <div style={{ textAlign: "center", marginTop: 10, fontSize: 12, color: "#e11d48", fontFamily: "monospace", letterSpacing: 1 }}>
                INCORRECT — {attempts} failed attempt{attempts > 1 ? "s" : ""}
              </div>
            )}
          </div>

          {/* Hint */}
          {hintVisible && (
            <div style={{
              background: "rgba(108,71,255,0.08)",
              border: "1px solid rgba(108,71,255,0.25)",
              borderRadius: 10, padding: "12px 16px",
              marginBottom: 20, fontSize: 13,
              color: "#a78bfa", fontFamily: "monospace",
            }}>
              <span style={{ color: "rgba(108,71,255,0.5)" }}>{">"} FORGOT PIN? </span>
              <span style={{ color: "#c4b5fd", fontWeight: 600 }}>{HINT}</span>
            </div>
          )}

          {/* Keypad */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {keys.map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: 10 }}>
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
                        flex: 1, height: 64, borderRadius: 14,
                        background: isHint
                          ? "rgba(108,71,255,0.06)"
                          : isDel
                          ? "rgba(225,29,72,0.06)"
                          : "rgba(255,255,255,0.03)",
                        border: isHint
                          ? "1px solid rgba(108,71,255,0.25)"
                          : isDel
                          ? "1px solid rgba(225,29,72,0.2)"
                          : "1px solid rgba(255,255,255,0.06)",
                        color: isHint ? "#a78bfa" : isDel ? "#e11d48" : "#e8e6f0",
                        fontSize: isHint || isDel ? 11 : 20,
                        fontWeight: isHint || isDel ? 600 : 300,
                        fontFamily: isHint || isDel ? "'DM Sans', sans-serif" : "'DM Mono', monospace",
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        gap: 2, letterSpacing: isHint || isDel ? 1 : 3,
                      }}
                    >
                      {isDel ? (
                        <>
                          <span style={{ fontSize: 16 }}>&#9003;</span>
                          <span style={{ fontSize: 8, letterSpacing: 1, opacity: 0.6 }}>DEL</span>
                        </>
                      ) : isHint ? (
                        <>
                          <span style={{ fontSize: 16 }}>✉</span>
                          <span style={{ fontSize: 8, letterSpacing: 1, opacity: 0.6 }}>CONTACT</span>
                        </>
                      ) : (
                        <span>{k}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.12)", letterSpacing: 2, fontFamily: "monospace" }}>
            KRAFT AI · SECURED · KIGALI
          </div>
        </div>
      </div>
    </div>
  );
}