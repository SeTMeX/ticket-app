import { useState, useRef } from "react";

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
      <span style={{ color: "#fff", fontSize: "17px", fontWeight: 600, letterSpacing: "-0.4px" }}>{time}</span>
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

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

export default function TicketGenerator() {
  const [routeNumber, setRouteNumber] = useState<string>("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
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

  const handleGenerateImage = () => {
    if (!ticket) return;

    const S = 3;
    const W = 375, H = 812;
    const canvas = document.createElement("canvas");
    canvas.width = W * S;
    canvas.height = H * S;
    const c = canvas.getContext("2d")!;
    c.scale(S, S);

    const rrect = (x: number, y: number, w: number, h: number, r: number) => {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    };

    const bubble = (x: number, y: number, w: number, h: number, tl: number, tr: number, br: number, bl: number) => {
      c.beginPath();
      c.moveTo(x + tl, y);
      c.lineTo(x + w - tr, y);
      c.arcTo(x + w, y, x + w, y + tr, tr);
      c.lineTo(x + w, y + h - br);
      c.arcTo(x + w, y + h, x + w - br, y + h, br);
      c.lineTo(x + bl, y + h);
      c.arcTo(x, y + h, x, y + h - bl, bl);
      c.lineTo(x, y + tl);
      c.arcTo(x, y, x + tl, y, tl);
      c.closePath();
    };

    // Phone clip
    rrect(0, 0, W, H, 54);
    c.fillStyle = "#1c1c1e"; c.fill();
    c.save();
    rrect(0, 0, W, H, 54); c.clip();

    // ── Status bar (0–42px) ──
    c.fillStyle = "#1c1c1e";
    c.fillRect(0, 0, W, 42);
    
    // Time with location arrow
    c.fillStyle = "#fff";
    c.font = "600 17px -apple-system, sans-serif";
    c.fillText(ticket.time, 22, 28);
    
    // Location arrow
    c.save();
    c.translate(22 + c.measureText(ticket.time).width + 4, 28);
    c.beginPath();
    c.moveTo(0, -5);
    c.lineTo(10, 0);
    c.lineTo(0, 5);
    c.closePath();
    c.fill();
    c.restore();

    const bx = 278, barBottom = 27;
    [[0,5],[4.5,7],[9,10],[13.5,12]].forEach(([x, h], i) => {
      c.fillStyle = i === 3 ? "rgba(255,255,255,0.3)" : "#fff";
      rrect(bx + x, barBottom - h, 3, h, 1); c.fill();
    });
    c.fillStyle = "#fff";
    c.font = "600 13px -apple-system, sans-serif";
    c.fillText("4G", bx + 20, 26);

    const batX = bx + 40, batY = 16;
    c.strokeStyle = "rgba(255,255,255,0.55)"; c.lineWidth = 1.2;
    rrect(batX, batY, 22, 11, 3); c.stroke();
    c.fillStyle = "rgba(255,255,255,0.45)";
    c.fillRect(batX + 22, batY + 3, 2, 5);
    c.fillStyle = "#fff";
    rrect(batX + 1.5, batY + 1.5, 13.2, 8, 1.5); c.fill();
    c.font = "600 12px -apple-system, sans-serif";
    c.fillText("67", batX + 25, batY + 10);

    // ── Contact header (42–138px) ──
    c.fillStyle = "#1c1c1e";
    c.fillRect(0, 42, W, 96);
    c.strokeStyle = "#38383a"; c.lineWidth = 0.5;
    c.beginPath(); c.moveTo(0, 138); c.lineTo(W, 138); c.stroke();

    // Back arrow and badge
    c.strokeStyle = "#007AFF"; c.lineWidth = 2.2; c.lineCap = "round";
    c.beginPath(); c.moveTo(20, 48); c.lineTo(12, 57); c.lineTo(20, 66); c.stroke();

    c.fillStyle = "#007AFF";
    c.beginPath(); c.arc(34, 57, 11, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#fff"; c.font = "700 11px -apple-system, sans-serif";
    c.textAlign = "center"; c.fillText("15", 34, 61); c.textAlign = "left";

    // Avatar with proper positioning
    c.fillStyle = "#636366";
    c.beginPath(); c.arc(187, 74, 30, 0, Math.PI * 2); c.fill();
    c.save();
    c.beginPath(); c.arc(187, 74, 30, 0, Math.PI * 2); c.clip();
    c.fillStyle = "#c7c7cc";
    c.beginPath(); c.arc(187, 66, 13, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.ellipse(187, 102, 23, 17, 0, 0, Math.PI * 2); c.fill();
    c.restore();

    // Contact name with arrow
    c.fillStyle = "#fff"; c.font = "600 14px -apple-system, sans-serif";
    c.textAlign = "center"; c.fillText("7000", 187, 121);
    // Draw arrow
    c.save();
    c.translate(187 + c.measureText("7000").width / 2 + 3, 121);
    c.strokeStyle = "#8e8e93"; c.lineWidth = 1.6; c.lineCap = "round";
    c.beginPath(); c.moveTo(0, -4); c.lineTo(4, 0); c.lineTo(0, 4); c.stroke();
    c.restore();
    c.textAlign = "left";

    // ── Chat area (138–722px) ──
    c.fillStyle = "#000";
    c.fillRect(0, 138, W, H - 138 - 60 - 30);

    c.fillStyle = "#8e8e93"; c.font = "400 12px -apple-system, sans-serif";
    c.textAlign = "center";
    c.fillText("Text Message", 187, 165);
    c.fillText("Today  " + ticket.time, 187, 183);
    c.textAlign = "left";

    const cy = 204;

    // Green bubble (sent message) - right aligned with pointed bottom-right
    c.font = "600 17px -apple-system, sans-serif";
    const sentW = c.measureText(routeNumber).width + 32;
    const sentX = W - sentW - 12; // Adjusted padding
    bubble(sentX, cy, sentW, 42, 20, 20, 5, 20);
    c.fillStyle = "#34c759"; c.fill();
    c.fillStyle = "#fff"; c.font = "600 17px -apple-system, sans-serif";
    c.fillText(routeNumber, sentX + 16, cy + 24);

    // First received bubble - left aligned with pointed bottom-left
    const b1y = cy + 42 + 4;
    const b1text = "Solicitarea este in curs de procesare.";
    c.font = "600 16px -apple-system, sans-serif";
    const b1w = Math.min(c.measureText(b1text).width + 28, 308);
    const b1lines = wrapText(c, b1text, b1w - 28);
    const b1h = b1lines.length * 22 + 20;
    bubble(12, b1y, b1w, b1h, 18, 18, 18, 5); // Adjusted x position
    c.fillStyle = "#1c1c1e"; c.fill();
    c.fillStyle = "#fff"; c.font = "600 16px -apple-system, sans-serif";
    b1lines.forEach((line, i) => c.fillText(line, 26, b1y + 23 + i * 22)); // Adjusted text position

    // Second received bubble - ticket details with underline
    const b2y = b1y + b1h + 3;
    const b2lines = [
      "Bilet electronic nr. " + ticket.ticketNumber,
      ticket.date,
      "Valabil 1 ora (de la " + ticket.time + " pina la " + ticket.endTime + ")",
      "Pret 6 MDL",
      "Numar de bord " + routeNumber,
    ];
    c.font = "600 16px -apple-system, sans-serif";
    const b2w = Math.min(Math.max(...b2lines.map(l => c.measureText(l).width)) + 28, 308);
    const b2h = b2lines.length * 25 + 22;
    bubble(12, b2y, b2w, b2h, 18, 18, 18, 5); // Adjusted x position
    c.fillStyle = "#1c1c1e"; c.fill();
    b2lines.forEach((line, i) => {
      const ly = b2y + 24 + i * 25;
      if (i === 0) {
        const prefix = "Bilet electronic nr. ";
        c.fillStyle = "#fff"; c.font = "600 16px -apple-system, sans-serif";
        c.fillText(prefix, 26, ly); // Adjusted text position
        const pw = c.measureText(prefix).width;
        c.fillStyle = "#0a84ff";
        c.fillText(ticket.ticketNumber, 26 + pw, ly);
        c.fillRect(26 + pw, ly + 2, c.measureText(ticket.ticketNumber).width, 1);
      } else {
        c.fillStyle = "#fff"; c.font = "600 16px -apple-system, sans-serif";
        c.fillText(line, 26, ly); // Adjusted text position
      }
    });

    // ── Input bar (722–782px) ──
    const inputY = H - 60 - 30;
    c.fillStyle = "#1c1c1e"; c.fillRect(0, inputY, W, 60);
    c.strokeStyle = "#38383a"; c.lineWidth = 0.5;
    c.beginPath(); c.moveTo(0, inputY); c.lineTo(W, inputY); c.stroke();
    
    // Plus button circle
    c.fillStyle = "#3a3a3c";
    c.beginPath(); c.arc(28, inputY + 28, 16, 0, Math.PI * 2); c.fill();
    
    // Plus icon
    c.strokeStyle = "#ebebf5"; c.lineWidth = 2; c.lineCap = "round";
    c.beginPath(); c.moveTo(28, inputY + 21); c.lineTo(28, inputY + 35); c.stroke();
    c.beginPath(); c.moveTo(21, inputY + 28); c.lineTo(35, inputY + 28); c.stroke();
    
    // Text input field
    c.strokeStyle = "#48484a"; c.lineWidth = 0.5;
    rrect(52, inputY + 10, 280, 36, 18); c.stroke();
    c.fillStyle = "#636366"; c.font = "400 16px -apple-system, sans-serif";
    c.fillText("Text Message", 70, inputY + 33);
    
    // Microphone icon
    c.save();
    c.translate(W - 28, inputY + 28);
    c.fillStyle = "#636366";
    // Mic head
    rrect(-4, -13, 8, 13, 4); c.fill();
    // Mic stand
    c.strokeStyle = "#636366"; c.lineWidth = 1.8; c.lineCap = "round";
    c.beginPath(); c.moveTo(-7.5, 0); c.arc(0, 0, 7.5, Math.PI, 0, true); c.stroke();
    c.beginPath(); c.moveTo(0, 13); c.lineTo(0, 17); c.stroke();
    c.beginPath(); c.moveTo(-3, 17); c.lineTo(3, 17); c.stroke();
    c.restore();

    // ── Home indicator (782–812px) ──
    const homeY = H - 30;
    c.fillStyle = "#1c1c1e"; c.fillRect(0, homeY, W, 30);
    c.fillStyle = "#fff";
    rrect(W / 2 - 67, homeY + 10, 134, 5, 3); c.fill();

    c.restore();
    setGeneratedImageUrl(canvas.toDataURL("image/png"));
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
              style={{
                padding: "11px 22px", borderRadius: "999px",
                background: "linear-gradient(135deg, #e6af2d 0%, #d4711a 100%)",
                border: "none", color: "#07070d", fontSize: "14px", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(230,175,45,0.25)",
              }}
            >
              🖼 Salvează Imaginea
            </button>
          </div>

          {generatedImageUrl && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "100%" }}>
              <p style={{ color: "#5a5a72", fontSize: "12px", textAlign: "center", margin: 0, letterSpacing: "0.03em" }}>
                Ține apăsat pe imagine pentru a salva în poze
              </p>
              <div
                style={{
                  position: "relative",
                  width: "375px",
                  borderRadius: "54px",
                  border: "1px solid #2a2a2a",
                  display: "block",
                  WebkitTouchCallout: "default",
                  WebkitUserSelect: "none",
                  userSelect: "none",
                  WebkitTapHighlightColor: "transparent",
                  cursor: "pointer",
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  const timer = setTimeout(() => {
                        // Create download link
                        const link = document.createElement('a');
                        link.href = generatedImageUrl;
                        link.download = `bilet-${ticket?.ticketNumber || 'electronic'}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        // Show feedback
                        const toast = document.createElement('div');
                        toast.textContent = 'Imagine salvată!';
                        toast.style.cssText = `
                          position: fixed;
                          top: 50%;
                          left: 50%;
                          transform: translate(-50%, -50%);
                          background: rgba(0,0,0,0.8);
                          color: white;
                          padding: 12px 24px;
                          borderRadius: 8px;
                          fontSize: 16px;
                          zIndex: 9999;
                        `;
                        document.body.appendChild(toast);
                        setTimeout(() => document.body.removeChild(toast), 2000);
                      }, 500);
                      
                      // Store timer ID to clear on touch end
                      (e.currentTarget as any).longPressTimer = timer;
                    }}
                onTouchEnd={(e) => {
                  // Clear timer if touch ends before 500ms
                  const timer = (e.currentTarget as any).longPressTimer;
                  if (timer) {
                    clearTimeout(timer);
                    (e.currentTarget as any).longPressTimer = null;
                  }
                }}
                onTouchCancel={(e) => {
                  // Clear timer if touch is cancelled
                  const timer = (e.currentTarget as any).longPressTimer;
                  if (timer) {
                    clearTimeout(timer);
                    (e.currentTarget as any).longPressTimer = null;
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  // For desktop - right click to save
                  const link = document.createElement('a');
                  link.href = generatedImageUrl;
                  link.download = `bilet-${ticket?.ticketNumber || 'electronic'}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <img
                  src={generatedImageUrl}
                  alt="Bilet electronic"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "54px",
                    display: "block",
                    pointerEvents: "none",
                  }}
                />
                {/* Vibration feedback overlay */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: "54px",
                  background: "rgba(255,255,255,0.1)",
                  opacity: 0,
                  transition: "opacity 0.2s",
                  pointerEvents: "none",
                }}
                onTouchStart={(e) => {
                  (e.currentTarget as HTMLDivElement).style.opacity = "1";
                      // Vibrate if available
                      if (navigator.vibrate) {
                        navigator.vibrate(50);
                      }
                    }}
                onTouchEnd={(e) => {
                  (e.currentTarget as HTMLDivElement).style.opacity = "0";
                }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
