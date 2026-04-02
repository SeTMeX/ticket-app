import { useState, useRef } from "react";
import html2canvas from "html2canvas";

interface Ticket {
  ticketNumber: string;
  time: string;
  endTime: string;
  date: string;
}

function generateTicketNumber(routeNumber: string): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${routeNumber}${random}`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("ro-MD", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function addHour(date: Date): Date {
  const d = new Date(date);
  d.setHours(d.getHours() + 1);
  return d;
}

const StatusBar = ({ time }: { time: string }) => (
  <div style={{
    backgroundColor: "#1c1c1e",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 20px 8px",
    fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <span style={{ color: "#fff", fontSize: "17px", fontWeight: 600, letterSpacing: "-0.4px" }}>
        {time}
      </span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
        <path d="M2 12L22 2L12 22L10 13L2 12Z" />
      </svg>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
        <rect x="0" y="7" width="3" height="5" rx="1" fill="white" />
        <rect x="4.5" y="5" width="3" height="7" rx="1" fill="white" />
        <rect x="9" y="2" width="3" height="10" rx="1" fill="white" />
        <rect x="13.5" y="0" width="3" height="12" rx="1" fill="rgba(255,255,255,0.3)" />
      </svg>
      <span style={{ color: "#fff", fontSize: "13px", fontWeight: 600 }}>4G</span>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <div style={{
          position: "relative", width: "22px", height: "11px",
          border: "1.2px solid rgba(255,255,255,0.55)", borderRadius: "3px",
          padding: "1.5px", boxSizing: "border-box", display: "flex", alignItems: "center",
        }}>
          <div style={{
            position: "absolute", right: "-3px", top: "50%", transform: "translateY(-50%)",
            width: "2px", height: "5px", backgroundColor: "rgba(255,255,255,0.45)", borderRadius: "0 1.5px 1.5px 0",
          }} />
          <div style={{ width: "67%", height: "100%", backgroundColor: "#fff", borderRadius: "1.5px" }} />
        </div>
        <span style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>67</span>
      </div>
    </div>
  </div>
);

const ContactHeader = () => (
  <div style={{
    backgroundColor: "#1c1c1e", display: "flex", flexDirection: "column", alignItems: "center",
    paddingBottom: "12px", position: "relative", borderBottom: "0.5px solid #38383a",
  }}>
    <div style={{ position: "absolute", left: "10px", top: "4px", display: "flex", alignItems: "center", gap: "1px" }}>
      <svg width="12" height="22" viewBox="0 0 12 22" fill="none">
        <path d="M10 2L2 11L10 20" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{
        backgroundColor: "#007AFF", borderRadius: "50%", width: "22px", height: "22px",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: "#fff", fontSize: "11px", fontWeight: 700 }}>15</span>
      </div>
    </div>
    <div style={{
      width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#636366",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", marginTop: "2px", marginBottom: "5px",
    }}>
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="37" r="22" fill="#c7c7cc" />
        <ellipse cx="50" cy="96" rx="38" ry="28" fill="#c7c7cc" />
      </svg>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
      <span style={{ color: "#fff", fontSize: "14px", fontWeight: 600, fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>7000</span>
      <svg width="6" height="11" viewBox="0 0 6 11" fill="none">
        <path d="M1 1L5 5.5L1 10" stroke="#8e8e93" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </div>
);

const ChatArea = ({ ticket, routeNumber }: { ticket: Ticket; routeNumber: string }) => (
  <div style={{ backgroundColor: "#000", flex: 1, padding: "0 8px 12px", display: "flex", flexDirection: "column" }}>
    <div style={{ textAlign: "center", color: "#8e8e93", fontSize: "12px", fontWeight: 400, lineHeight: "1.5", margin: "14px 0 16px", fontFamily: "-apple-system, 'SF Pro Text', sans-serif" }}>
      <div>Text Message</div>
      <div>Today &nbsp;{ticket.time}</div>
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "4px", paddingRight: "4px" }}>
      <div style={{ backgroundColor: "#34c759", color: "#fff", padding: "10px 16px", borderRadius: "20px", borderBottomRightRadius: "5px", fontSize: "17px", fontWeight: 600, fontFamily: "-apple-system, 'SF Pro Text', sans-serif", maxWidth: "70%", lineHeight: "1.3" }}>
        {routeNumber}
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "3px", paddingLeft: "4px" }}>
      <div style={{ backgroundColor: "#1c1c1e", color: "#fff", padding: "10px 14px", borderRadius: "20px", borderBottomLeftRadius: "5px", fontSize: "16px", fontWeight: 600, fontFamily: "-apple-system, 'SF Pro Text', sans-serif", maxWidth: "82%", lineHeight: "1.4" }}>
        Solicitarea este in curs de procesare.
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "flex-start", paddingLeft: "4px" }}>
      <div style={{ backgroundColor: "#1c1c1e", color: "#fff", padding: "11px 14px", borderRadius: "20px", borderBottomLeftRadius: "5px", fontSize: "16px", fontWeight: 600, fontFamily: "-apple-system, 'SF Pro Text', sans-serif", maxWidth: "82%", lineHeight: "1.55" }}>
        {"Bilet electronic nr. "}
        <span style={{ color: "#0a84ff", textDecoration: "underline", textDecorationColor: "#0a84ff" }}>
          {ticket.ticketNumber}
        </span>
        <br />{ticket.date}
        <br />{"Valabil 1 ora (de la " + ticket.time + " pina la " + ticket.endTime + ")"}
        <br />{"Pret 6 MDL"}
        <br />{"Numar de bord " + routeNumber}
      </div>
    </div>
    <div style={{ flex: 1 }} />
  </div>
);

const InputBar = () => (
  <div style={{ backgroundColor: "#1c1c1e", borderTop: "0.5px solid #38383a", display: "flex", alignItems: "center", padding: "8px 12px 12px", gap: "10px" }}>
    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#3a3a3c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1V13M1 7H13" stroke="#ebebf5" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
    <div style={{ flex: 1, border: "0.5px solid #48484a", borderRadius: "20px", padding: "8px 14px", color: "#636366", fontSize: "16px", fontFamily: "-apple-system, 'SF Pro Text', sans-serif", backgroundColor: "transparent" }}>
      Text Message
    </div>
    <svg width="16" height="22" viewBox="0 0 17 22" fill="none" style={{ flexShrink: 0 }}>
      <rect x="4.5" y="0.5" width="8" height="13" rx="4" fill="#636366" />
      <path d="M1 9.5a7.5 7.5 0 0015 0" stroke="#636366" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <line x1="8.5" y1="17" x2="8.5" y2="21" stroke="#636366" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="5" y1="21" x2="12" y2="21" stroke="#636366" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </div>
);

const HomeIndicator = () => (
  <div style={{ backgroundColor: "#1c1c1e", display: "flex", justifyContent: "center", padding: "10px 0 20px" }}>
    <div style={{ width: "134px", height: "5px", backgroundColor: "#fff", borderRadius: "3px" }} />
  </div>
);

export default function TicketGenerator() {
  const [routeNumber, setRouteNumber] = useState<string>("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const phoneRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!routeNumber.trim()) return;
    const now = new Date();
    setTicket({
      ticketNumber: generateTicketNumber(routeNumber),
      time: formatTime(now),
      endTime: formatTime(addHour(now)),
      date: formatDate(now),
    });
    setGeneratedImageUrl(null);
  };

  const handleGenerateImage = async () => {
    if (!ticket || !phoneRef.current) return;
    setCapturing(true);
    try {
      const canvas = await html2canvas(phoneRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      setGeneratedImageUrl(canvas.toDataURL("image/png"));
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div style={{
      minHeight: "100svh",
      background: "linear-gradient(160deg, #07070d 0%, #0d0c16 50%, #080b10 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "32px 16px 48px",
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      position: "relative", overflowX: "hidden",
    }}>

      <div style={{
        position: "fixed", top: "-80px", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "350px",
        background: "radial-gradient(ellipse, rgba(230,175,45,0.06) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{
        width: "100%", maxWidth: "375px",
        background: "linear-gradient(155deg, #14131f 0%, #0e0d18 100%)",
        borderRadius: "26px", border: "1px solid rgba(230,175,45,0.12)",
        padding: "28px 24px 22px", marginBottom: "28px", boxSizing: "border-box",
        boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(230,175,45,0.08)", border: "1px solid rgba(230,175,45,0.18)",
            borderRadius: "999px", padding: "4px 12px",
          }}>
            <span style={{ fontSize: "10px", color: "#c9952a", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              🚌 Chișinău Transit
            </span>
          </div>
        </div>

        <h1 style={{
          background: "linear-gradient(135deg, #f2c94c 0%, #e07b20 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          fontSize: "27px", fontWeight: 800, textAlign: "center", margin: "0 0 6px", letterSpacing: "-0.6px",
        }}>
          Generate Your Ride
        </h1>
        <p style={{ color: "#38384a", fontSize: "12px", textAlign: "center", margin: "0 0 24px", letterSpacing: "0.03em" }}>
          Bilet electronic · 6 MDL · 1 oră valabil
        </p>

        <div style={{ marginBottom: "14px" }}>
          <label style={{
            color: "#5a5a72", fontSize: "10.5px", fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "8px",
          }}>
            Număr Rută / Vehicul
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={routeNumber}
            onChange={(e) => setRouteNumber(e.target.value)}
            placeholder="ex: 1335"
            style={{
              width: "100%", background: "rgba(255,255,255,0.03)", color: "#e8e8f4",
              border: "1px solid rgba(255,255,255,0.07)", borderRadius: "13px",
              padding: "13px 16px", fontSize: "16px", outline: "none",
              boxSizing: "border-box", fontFamily: "inherit",
            }}
          />
        </div>

        <button
          onClick={handleGenerate}
          style={{
            width: "100%", background: "linear-gradient(135deg, #e6af2d 0%, #d4711a 100%)",
            color: "#07070d", border: "none", borderRadius: "14px", padding: "14px",
            fontSize: "15px", fontWeight: 800, cursor: "pointer", letterSpacing: "0.01em",
            boxShadow: "0 6px 24px rgba(230,175,45,0.28), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          ✦ Generează Bilet
        </button>

        <div style={{ textAlign: "center", marginTop: "18px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <span style={{ color: "#282835", fontSize: "11px", fontWeight: 500, letterSpacing: "0.04em" }}>created by </span>
          <span style={{
            background: "linear-gradient(135deg, #e6af2d, #d4711a)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em",
          }}>SeTMeX</span>
        </div>
      </div>

      {ticket && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: "20px", width: "100%", maxWidth: "375px", position: "relative", zIndex: 1,
        }}>
          <div ref={phoneRef} style={{
            width: "375px", height: "812px", backgroundColor: "#1c1c1e",
            borderRadius: "54px", overflow: "hidden", border: "1px solid #2a2a2a",
            display: "flex", flexDirection: "column",
          }}>
            <StatusBar time={ticket.time} />
            <ContactHeader />
            <ChatArea ticket={ticket} routeNumber={routeNumber} />
            <InputBar />
            <HomeIndicator />
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleGenerate}
              style={{
                padding: "11px 22px", borderRadius: "999px",
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#aaaacc", fontSize: "14px", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              🔄 Regenerate
            </button>
            <button
              onClick={handleGenerateImage}
              disabled={capturing}
              style={{
                padding: "11px 22px", borderRadius: "999px",
                background: capturing ? "rgba(230,175,45,0.4)" : "linear-gradient(135deg, #e6af2d 0%, #d4711a 100%)",
                border: "none", color: "#07070d", fontSize: "14px", fontWeight: 700,
                cursor: capturing ? "wait" : "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(230,175,45,0.25)",
              }}
            >
              {capturing ? "Se generează..." : "🖼 Salvează Imaginea"}
            </button>
          </div>

          {generatedImageUrl && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "100%" }}>
              <p style={{ color: "#5a5a72", fontSize: "12px", textAlign: "center", margin: 0, letterSpacing: "0.03em" }}>
                Ține apăsat pe imagine și alege{" "}
                <strong style={{ color: "#aaaacc" }}>"Adaugă la fotografii"</strong>
              </p>
              <img
                src={generatedImageUrl}
                alt="Bilet electronic"
                style={{
                  width: "375px",
                  borderRadius: "54px",
                  border: "1px solid #2a2a2a",
                  display: "block",
                  WebkitTouchCallout: "default",
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}