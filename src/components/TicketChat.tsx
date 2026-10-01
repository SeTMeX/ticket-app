// src/components/TicketChat.tsx
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type View = "list" | string;

interface Ticket {
  ticketNumber: string;
  routeNumber: string;
  time: string;
  endTime: string;
  date: string;
}

type Message =
  | { id: number; kind: "user"; text: string; time: string }
  | { id: number; kind: "bot"; text: string; time: string }
  | { id: number; kind: "ticket"; ticket: Ticket; time: string }
  | { id: number; kind: "typing" }
  | { id: number; kind: "separator"; label: string };

interface Contact {
  id: string;
  name: string;
  unread: boolean;
  preview: string;
  previewTime: string;
  isTicketBot?: boolean;
}

const SF = "-apple-system, 'SF Pro Text', BlinkMacSystemFont, sans-serif";
const BUBBLE_RECV = "#2c2c2e";
const BUBBLE_SENT = "#34c759";
const AVATAR_BG = "#3a3a3c";

const STYLE_TAG_ID = "ticket-chat-anim";

function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_TAG_ID)) return;
  const css = `
    @keyframes tc-pop-in {
      0%   { opacity: 0; transform: translateY(8px) scale(0.96); }
      100% { opacity: 1; transform: translateY(0)   scale(1);    }
    }
    @keyframes tc-fade-in {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0);   }
    }
    @keyframes tc-dot {
      0%, 60%, 100% { transform: translateY(0);    opacity: 0.5; }
      30%           { transform: translateY(-4px); opacity: 1;   }
    }
    @keyframes tc-row-in {
      from { opacity: 0; transform: translateX(-6px); }
      to   { opacity: 1; transform: translateX(0);    }
    }
    .tc-bubble    { animation: tc-pop-in  220ms cubic-bezier(0.22, 1, 0.36, 1) both; }
    .tc-separator { animation: tc-fade-in 260ms ease-out both; }
    .tc-row       { animation: tc-row-in  280ms ease-out both; }
    .tc-dot {
      width: 7px; height: 7px; border-radius: 50%; background: #8e8e93;
      animation: tc-dot 1s infinite ease-in-out;
    }
    .tc-dot:nth-child(2) { animation-delay: 0.15s; }
    .tc-dot:nth-child(3) { animation-delay: 0.3s;  }
    .tc-press { transition: transform 120ms ease, background-color 150ms ease; }
    .tc-press:active { transform: scale(0.97); }
    .tc-row-btn { transition: background-color 150ms ease; }
    .tc-row-btn:active { background-color: #1c1c1e; }
  `;
  const tag = document.createElement("style");
  tag.id = STYLE_TAG_ID;
  tag.textContent = css;
  document.head.appendChild(tag);
}

function genTicketNumber(route: string): string {
  return `${route}${Math.floor(1000 + Math.random() * 9000)}`;
}
function fmtTime(d: Date): string {
  return d.toLocaleTimeString("ro-MD", { hour: "2-digit", minute: "2-digit", hour12: false });
}
function fmtDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtSeparator(d: Date): string {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()} at ${fmtTime(d)}`;
}
function plusHour(d: Date): Date {
  const x = new Date(d);
  x.setHours(x.getHours() + 1);
  return x;
}
function buildTicket(route: string): Ticket {
  const now = new Date();
  return {
    ticketNumber: genTicketNumber(route),
    routeNumber: route,
    time: fmtTime(now),
    endTime: fmtTime(plusHour(now)),
    date: fmtDate(now),
  };
}

function getMessagePreview(msg: Message): string {
  if (msg.kind === "user") return msg.text;
  if (msg.kind === "bot") return msg.text;
  if (msg.kind === "ticket") return "Bilet electronic";
  if (msg.kind === "separator") return "";
  return "";
}

const INITIAL_CONTACTS: Contact[] = [
  { id: "7000",        name: "7000",        unread: false, isTicketBot: true,
    preview: "",
    previewTime: "Yesterday" },
  { id: "7001",        name: "7001",        unread: false, isTicketBot: true,
    preview: "",
    previewTime: "Yesterday" },
  { id: "vbcolectare", name: "VBColectare", unread: false,
    preview: "Stimate client, inregistrati un overdraft nesanctionat la card. Va rugam efectuati p...",
    previewTime: "Monday" },
  { id: "google",      name: "Google",      unread: true,
    preview: "G-097432 – код подтверждения Google. Никому не сообщайте его.",
    previewTime: "Monday" },
  { id: "n2525",       name: "2525",        unread: true,
    preview: "In adresa DVS a parvenit transfer de bani numarul DP8013963823RC. Achitarea est...",
    previewTime: "Monday" },
  { id: "orange",      name: "Orange",      unread: true,
    preview: "Ati primit 20 Puncte de Fidelitate. In total aveti 162 puncte, egale cu 162 minute nati...",
    previewTime: "Monday" },
  { id: "nica",        name: "Nica",        unread: true,
    preview: "Ai avut 2 apeluri de la aceasta persoana. Ultimul - pe 26/04 la 19:58. Orange",
    previewTime: "Sunday" },
  { id: "novapost",    name: "Nova Post",   unread: true,
    preview: "Instaleaza noua aplicatie Nova Post https://url.novapost.com/UtWD4h! Ai -15% cu co...",
    previewTime: "21.04.2026" },
  { id: "maib",        name: "MAIB",        unread: false,
    preview: "Achitare reusita 245.50 MDL la LINELLA. Sold disponibil: 3,420.18 MDL. Detalii in ap...",
    previewTime: "20.04.2026" },
  { id: "moldcell",    name: "Moldcell",    unread: true,
    preview: "Abonamentul tau Unlimited a fost reinnoit. 500 minute, 100 SMS si trafic nelimitat...",
    previewTime: "19.04.2026" },
  { id: "glovo",       name: "Glovo",       unread: false,
    preview: "Comanda ta #G8842 a fost livrata. Multumim ca ai ales Glovo! Lasa o evaluare in ap...",
    previewTime: "18.04.2026" },
  { id: "wolt",        name: "Wolt",        unread: true,
    preview: "Curierul tau Andrei e in drum spre tine. Timp estimat de sosire: 12 minute.",
    previewTime: "17.04.2026" },
  { id: "bolt",        name: "Bolt",        unread: false,
    preview: "Codul tau de verificare Bolt este 4421. Nu il transmite nimanui.",
    previewTime: "16.04.2026" },
  { id: "yango",       name: "Yango",       unread: true,
    preview: "Soferul Sergiu (Skoda Octavia, ABC 123) va sosi peste 3 minute. Pretul cursei: 65 MDL.",
    previewTime: "15.04.2026" },
  { id: "moldovagaz",  name: "MoldovaGaz",  unread: false,
    preview: "Factura pentru luna martie 2026 in valoare de 1,287.40 MDL. Termen limita: 25.04.2026.",
    previewTime: "14.04.2026" },
  { id: "maibpay",     name: "MAIB Pay",    unread: true,
    preview: "Ai primit 500.00 MDL de la Ion P. Mesaj: \"Restul de la cina\". Vezi detalii in aplicatie.",
    previewTime: "13.04.2026" },
  { id: "posta",       name: "Posta MD",    unread: false,
    preview: "Coletul RR123456789MD a sosit la oficiul postal Chisinau-12. Termen de pastrare: 30 zile.",
    previewTime: "12.04.2026" },
  { id: "energocom",   name: "Energocom",   unread: false,
    preview: "Consum energie electrica martie: 184 kWh. Suma de plata: 654.20 MDL. Plateste pina la 28.04.",
    previewTime: "10.04.2026" },
  { id: "smartid",     name: "Smart-ID",    unread: true,
    preview: "Cerere de autentificare la MAIB Online. Codul de control: 7423. Confirma sau respinge.",
    previewTime: "08.04.2026" },
];

const STORAGE_KEY_PREFIX = "ticket_chat_messages_";

function loadMessagesFromStorage(chatId: string): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${chatId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveMessagesToStorage(chatId: string, messages: Message[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${chatId}`, JSON.stringify(messages));
  } catch {
    // Ignore storage errors
  }
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
  "7000":      loadMessagesFromStorage("7000"),
  "7001":      loadMessagesFromStorage("7001"),
  vbcolectare: [{ id: 1, kind: "bot", text: "Stimate client, inregistrati un overdraft nesanctionat la card. Va rugam efectuati plata pina la sfirsitul lunii.", time: "Monday" }],
  google:      [{ id: 1, kind: "bot", text: "G-097432 – код подтверждения Google. Никому не сообщайте его.", time: "Monday" }],
  n2525:       [{ id: 1, kind: "bot", text: "In adresa DVS a parvenit transfer de bani numarul DP8013963823RC. Achitarea estimativa - astazi.", time: "Monday" }],
  orange:      [{ id: 1, kind: "bot", text: "Ati primit 20 Puncte de Fidelitate. In total aveti 162 puncte, egale cu 162 minute nationale.", time: "Monday" }],
  nica:        [{ id: 1, kind: "bot", text: "Ai avut 2 apeluri de la aceasta persoana. Ultimul - pe 26/04 la 19:58. Orange", time: "Sunday" }],
  novapost:    [{ id: 1, kind: "bot", text: "Instaleaza noua aplicatie Nova Post https://url.novapost.com/UtWD4h! Ai -15% cu codul UTWD4H.", time: "21.04.2026" }],
  maib:        [{ id: 1, kind: "bot", text: "Achitare reusita 245.50 MDL la LINELLA. Sold disponibil: 3,420.18 MDL. Detalii in aplicatia MAIB.", time: "20.04.2026" }],
  moldcell:    [{ id: 1, kind: "bot", text: "Abonamentul tau Unlimited a fost reinnoit. 500 minute, 100 SMS si trafic nelimitat pentru 30 de zile.", time: "19.04.2026" }],
  glovo:       [{ id: 1, kind: "bot", text: "Comanda ta #G8842 a fost livrata. Multumim ca ai ales Glovo! Lasa o evaluare in aplicatie.", time: "18.04.2026" }],
  wolt:        [{ id: 1, kind: "bot", text: "Curierul tau Andrei e in drum spre tine. Timp estimat de sosire: 12 minute.", time: "17.04.2026" }],
  bolt:        [{ id: 1, kind: "bot", text: "Codul tau de verificare Bolt este 4421. Nu il transmite nimanui.", time: "16.04.2026" }],
  yango:       [{ id: 1, kind: "bot", text: "Soferul Sergiu (Skoda Octavia, ABC 123) va sosi peste 3 minute. Pretul cursei: 65 MDL.", time: "15.04.2026" }],
  moldovagaz:  [{ id: 1, kind: "bot", text: "Factura pentru luna martie 2026 in valoare de 1,287.40 MDL. Termen limita: 25.04.2026.", time: "14.04.2026" }],
  maibpay:     [{ id: 1, kind: "bot", text: "Ai primit 500.00 MDL de la Ion P. Mesaj: \"Restul de la cina\". Vezi detalii in aplicatie.", time: "13.04.2026" }],
  posta:       [{ id: 1, kind: "bot", text: "Coletul RR123456789MD a sosit la oficiul postal Chisinau-12. Termen de pastrare: 30 zile.", time: "12.04.2026" }],
  energocom:   [{ id: 1, kind: "bot", text: "Consum energie electrica martie: 184 kWh. Suma de plata: 654.20 MDL. Plateste pina la 28.04.", time: "10.04.2026" }],
  smartid:     [{ id: 1, kind: "bot", text: "Cerere de autentificare la MAIB Online. Codul de control: 7423. Confirma sau respinge.", time: "08.04.2026" }],
};

const Avatar = ({ size }: { size: number }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%", background: AVATAR_BG,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, overflow: "hidden",
  }}>
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="40" r="20" fill="#8e8e93" />
      <ellipse cx="50" cy="100" rx="32" ry="24" fill="#8e8e93" />
    </svg>
  </div>
);

const ContactHeader = ({
  contact, unreadCount, onBack,
}: { contact: Contact; unreadCount: number; onBack: () => void }) => (
  <div style={{
    backgroundColor: "#000", display: "flex", flexDirection: "column", alignItems: "center",
    paddingTop: 10, paddingBottom: 12, position: "relative", flexShrink: 0,
  }}>
    <button
      onClick={onBack}
      aria-label="Înapoi"
      className="tc-press"
      style={{
        position: "absolute", left: 12, top: 18,
        background: "#1c1c1e", border: "none", borderRadius: 16,
        padding: "6px 12px 6px 8px", display: "flex", alignItems: "center", gap: 3,
        cursor: "pointer",
      }}
    >
      <svg width="9" height="15" viewBox="0 0 9 15" fill="none">
        <path d="M7 1.5L1.5 7.5L7 13.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ color: "#fff", fontSize: 16, fontWeight: 500, fontFamily: SF }}>{unreadCount}</span>
    </button>
    <div style={{ marginBottom: 4 }}>
      <Avatar size={52} />
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: "#fff", fontSize: 15, fontWeight: 600, fontFamily: SF }}>{contact.name}</span>
      <svg width="6" height="11" viewBox="0 0 6 11" fill="none">
        <path d="M1 1L5 5.5L1 10" stroke="#8e8e93" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </div>
);

const SentBubble = ({ text }: { text: string }) => (
  <div className="tc-bubble" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4, paddingRight: 6 }}>
    <div style={{
      backgroundColor: BUBBLE_SENT, color: "#fff",
      padding: "10px 16px", borderRadius: 20, borderBottomRightRadius: 6,
      fontSize: 16, fontWeight: 500, fontFamily: SF, maxWidth: "75%", lineHeight: 1.4, wordBreak: "break-word",
    }}>{text}</div>
  </div>
);

const ReceivedTextBubble = ({ text }: { text: string }) => (
  <div className="tc-bubble" style={{ display: "flex", justifyContent: "flex-start", marginBottom: 3, paddingLeft: 6 }}>
    <div style={{
      backgroundColor: BUBBLE_RECV, color: "#fff",
      padding: "10px 14px", borderRadius: 20, borderBottomLeftRadius: 6,
      fontSize: 15, fontWeight: 400, fontFamily: SF, maxWidth: "85%", lineHeight: 1.4, wordBreak: "break-word",
    }}>{text}</div>
  </div>
);

const TicketBubble = ({ ticket }: { ticket: Ticket }) => (
  <div className="tc-bubble" style={{ display: "flex", justifyContent: "flex-start", marginBottom: 6, paddingLeft: 6 }}>
    <div style={{
      backgroundColor: BUBBLE_RECV, color: "#fff",
      padding: "11px 14px", borderRadius: 20, borderBottomLeftRadius: 6,
      fontSize: 15, fontWeight: 400, fontFamily: SF, maxWidth: "85%", lineHeight: 1.5,
    }}>
      {"Bilet electronic nr."}<br />
      <span style={{ color: "#4db8ff", textDecoration: "underline" }}>{ticket.ticketNumber}</span><br />
      {ticket.date}<br />
      {"Valabil 1 ora (de la "}
      <span style={{ textDecoration: "underline" }}>{ticket.time}</span>
      {" pina la "}
      <span style={{ textDecoration: "underline" }}>{ticket.endTime}</span>
      {")"}<br />
      {"Pret 7 MDL"}
    </div>
  </div>
);

const TypingBubble = () => (
  <div className="tc-bubble" style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4, paddingLeft: 6 }}>
    <div style={{
      backgroundColor: BUBBLE_RECV,
      padding: "12px 14px", borderRadius: 20, borderBottomLeftRadius: 6,
      display: "flex", alignItems: "center", gap: 5,
    }}>
      <span className="tc-dot" />
      <span className="tc-dot" />
      <span className="tc-dot" />
    </div>
  </div>
);

const Separator = ({ label }: { label: string }) => (
  <div className="tc-separator" style={{
    textAlign: "center", color: "#8e8e93", fontSize: 12, fontWeight: 500,
    margin: "10px 0 6px", fontFamily: SF,
  }}>{label}</div>
);

const InputBar = ({
  value, onChange, onSubmit, placeholder, numeric,
}: {
  value: string; onChange: (v: string) => void; onSubmit: () => void;
  placeholder: string; numeric?: boolean;
}) => {
  const canSend = value.trim().length > 0;
  return (
    <div style={{
      backgroundColor: "#000",
      display: "flex", alignItems: "center",
      padding: "6px 10px",
      paddingBottom: "max(6px, env(safe-area-inset-bottom))",
      gap: 8, flexShrink: 0,
    }}>
      <div className="tc-press" style={{
        width: 32, height: 32, borderRadius: "50%", backgroundColor: "#1c1c1e",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1V13M1 7H13" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); if (canSend) onSubmit(); }}
        style={{ flex: 1, display: "flex", alignItems: "center", position: "relative" }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode={numeric ? "numeric" : "text"}
          placeholder={placeholder}
          style={{
            flex: 1, border: "0.5px solid #2c2c2e", borderRadius: 18,
            padding: "7px 36px 7px 14px", color: "#fff", fontSize: 16, fontFamily: SF,
            backgroundColor: "transparent", outline: "none", minWidth: 0,
            transition: "border-color 200ms ease",
          }}
        />
        {canSend ? (
          <button
            type="submit"
            aria-label="Trimite"
            className="tc-press tc-bubble"
            style={{
              position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)",
              width: 28, height: 28, borderRadius: "50%", border: "none",
              backgroundColor: BUBBLE_SENT, display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", padding: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5 12L12 5L19 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ) : (
          <svg width="16" height="22" viewBox="0 0 17 22" fill="none"
               style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)" }}>
            <rect x="4.5" y="0.5" width="8" height="13" rx="4" fill="#8e8e93" />
            <path d="M1 9.5a7.5 7.5 0 0015 0" stroke="#8e8e93" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <line x1="8.5" y1="17" x2="8.5" y2="21" stroke="#8e8e93" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="5"   y1="21" x2="12"  y2="21" stroke="#8e8e93" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </form>
    </div>
  );
};

const ChatListTopBar = () => (
  <div style={{
    padding: "10px 14px 4px",
    display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
  }}>
    <button className="tc-press" style={{
      background: "#1c1c1e", border: "none", borderRadius: 18,
      padding: "7px 16px", color: "#fff", fontSize: 16, fontWeight: 400,
      fontFamily: SF, cursor: "pointer",
    }}>Edit</button>
    <button className="tc-press" style={{
      background: "#1c1c1e", border: "none", borderRadius: "50%",
      width: 36, height: 36, display: "flex", alignItems: "center",
      justifyContent: "center", cursor: "pointer",
    }}>
      <svg width="16" height="14" viewBox="0 0 18 14" fill="none">
        <line x1="1" y1="2"  x2="17" y2="2"  stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <line x1="4" y1="7"  x2="14" y2="7"  stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <line x1="7" y1="12" x2="11" y2="12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  </div>
);

const ChatListTitle = () => (
  <div style={{ padding: "4px 18px 8px", flexShrink: 0 }}>
    <h1 style={{
      color: "#fff", fontSize: 34, fontWeight: 700, fontFamily: SF,
      margin: 0, letterSpacing: "-0.4px",
    }}>Messages</h1>
  </div>
);

const ChatRow = ({ contact, onOpen, index }: { contact: Contact; onOpen: () => void; index: number }) => (
  <button
    onClick={onOpen}
    className="tc-row tc-row-btn"
    style={{
      display: "flex", alignItems: "flex-start", gap: 8,
      padding: "10px 16px 0 4px", background: "none", border: "none",
      width: "100%", textAlign: "left", cursor: "pointer",
      animationDelay: `${Math.min(index, 12) * 35}ms`,
    }}
  >
    <div style={{
      width: 16, display: "flex", justifyContent: "center", paddingTop: 28, flexShrink: 0,
    }}>
      {contact.unread && (
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#0a84ff" }} />
      )}
    </div>
    <div style={{ marginTop: 4 }}>
      <Avatar size={52} />
    </div>
    <div style={{
      flex: 1, minWidth: 0, paddingLeft: 4, paddingTop: 8, paddingBottom: 12,
      borderBottom: "0.5px solid #1c1c1e",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6 }}>
        <span style={{ color: "#fff", fontSize: 18, fontWeight: 600, fontFamily: SF }}>{contact.name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <span style={{ color: "#8e8e93", fontSize: 15, fontFamily: SF }}>{contact.previewTime}</span>
          <svg width="7" height="12" viewBox="0 0 8 14" fill="none">
            <path d="M1 1L7 7L1 13" stroke="#48484a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div style={{
        color: "#8e8e93", fontSize: 15, fontFamily: SF, marginTop: 3, lineHeight: 1.3,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        overflow: "hidden", textOverflow: "ellipsis",
      }}>{contact.preview}</div>
    </div>
  </button>
);

const BottomSearchBar = () => (
  <div style={{
    display: "flex", gap: 10, alignItems: "center",
    padding: "8px 14px",
    paddingBottom: "max(8px, env(safe-area-inset-bottom))",
    flexShrink: 0,
  }}>
    <div style={{
      flex: 1, background: "#1c1c1e", borderRadius: 18,
      padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, minWidth: 0,
    }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="#8e8e93" strokeWidth="2" />
        <path d="M20 20L17 17" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span style={{ color: "#8e8e93", fontSize: 16, fontFamily: SF, flex: 1 }}>Search</span>
      <svg width="14" height="20" viewBox="0 0 17 22" fill="none">
        <rect x="4.5" y="0.5" width="8" height="13" rx="4" fill="#8e8e93" />
        <path d="M1 9.5a7.5 7.5 0 0015 0" stroke="#8e8e93" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <line x1="8.5" y1="17" x2="8.5" y2="21" stroke="#8e8e93" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="5"   y1="21" x2="12"  y2="21" stroke="#8e8e93" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
    <button className="tc-press" style={{
      width: 38, height: 38, background: "#1c1c1e", border: "none",
      borderRadius: "50%", display: "flex", alignItems: "center",
      justifyContent: "center", cursor: "pointer", flexShrink: 0,
    }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path d="M14 4H5C3.89 4 3 4.89 3 6V19C3 20.11 3.89 21 5 21H18C19.11 21 20 20.11 20 19V10"
              stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.5 2.5C19.33 1.67 20.67 1.67 21.5 2.5C22.33 3.33 22.33 4.67 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
              stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  </div>
);

export default function TicketChat() {
  const [view, setView] = useState<View>("list");
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [input, setInput] = useState("");
  const idRef = useRef(100);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { injectStyles(); }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [allMessages, view]);

  useEffect(() => { setInput(""); }, [view]);

  // Update contact previews when messages change for 7000 and 7001
  useEffect(() => {
    setContacts((prevContacts) => {
      const updated = prevContacts.map((contact) => {
        if (contact.id === "7000" || contact.id === "7001") {
          const messages = allMessages[contact.id] ?? [];
          const lastMessage = messages[messages.length - 1];
          if (lastMessage) {
            return {
              ...contact,
              preview: getMessagePreview(lastMessage),
              previewTime: lastMessage.time,
            };
          }
        }
        return contact;
      });
      return updated;
    });
  }, [allMessages]);

  const activeContact = view !== "list" ? contacts.find((c) => c.id === view) ?? null : null;
  const activeMessages = activeContact ? (allMessages[activeContact.id] ?? []) : [];
  const unreadCount = contacts.filter((c) => c.unread).length;

  const pushMessage = (chatId: string, msg: Message) => {
    setAllMessages((prev) => {
      const updated = { ...prev, [chatId]: [...(prev[chatId] ?? []), msg] };
      // Save to localStorage for ticket bots (7000, 7001)
      if (chatId === "7000" || chatId === "7001") {
        saveMessagesToStorage(chatId, updated[chatId]);
      }
      return updated;
    });
  };

  const removeMessage = (chatId: string, msgId: number) => {
    setAllMessages((prev) => {
      const updated = {
        ...prev,
        [chatId]: (prev[chatId] ?? []).filter((m) => m.id !== msgId),
      };
      // Save to localStorage for ticket bots (7000, 7001)
      if (chatId === "7000" || chatId === "7001") {
        saveMessagesToStorage(chatId, updated[chatId]);
      }
      return updated;
    });
  };

  const handleSend = () => {
    if (!activeContact) return;
    const text = input.trim();
    if (!text) return;
    setInput("");

    const now = new Date();
    const chatId = activeContact.id;
    pushMessage(chatId, { id: idRef.current++, kind: "separator", label: fmtSeparator(now) });
    pushMessage(chatId, { id: idRef.current++, kind: "user", text, time: fmtTime(now) });

    if (activeContact.isTicketBot) {
      const typingId = idRef.current++;
      setTimeout(() => {
        pushMessage(chatId, { id: typingId, kind: "typing" });
      }, 350);
      setTimeout(() => {
        removeMessage(chatId, typingId);
        pushMessage(chatId, {
          id: idRef.current++, kind: "bot",
          text: "Solicitarea este in curs de procesare.",
          time: fmtTime(new Date()),
        });
      }, 1200);
      setTimeout(() => {
        pushMessage(chatId, {
          id: idRef.current++, kind: "ticket",
          ticket: buildTicket(text), time: fmtTime(new Date()),
        });
      }, 2400);
    }
  };

  const root: CSSProperties = {
    position: "fixed", inset: 0,
    width: "100vw", height: "100dvh",
    backgroundColor: "#000",
    display: "flex", flexDirection: "column",
    overflow: "hidden",
    fontFamily: SF,
    paddingTop: "env(safe-area-inset-top)",
    paddingLeft: "env(safe-area-inset-left)",
    paddingRight: "env(safe-area-inset-right)",
    boxSizing: "border-box",
  };

  if (view === "list") {
    return (
      <div style={root}>
        <ChatListTopBar />
        <ChatListTitle />
        <div style={{ flex: 1, overflowY: "auto" }}>
          {contacts.map((c, i) => (
            <ChatRow key={c.id} contact={c} index={i} onOpen={() => setView(c.id)} />
          ))}
        </div>
        <BottomSearchBar />
      </div>
    );
  }

  if (!activeContact) {
    setView("list");
    return null;
  }

  return (
    <div style={root}>
      <ContactHeader
        contact={activeContact}
        unreadCount={unreadCount}
        onBack={() => setView("list")}
      />

      <div
        ref={scrollRef}
        style={{
          backgroundColor: "#000", flex: 1, padding: "0 4px 8px",
          display: "flex", flexDirection: "column", overflowY: "auto",
          scrollBehavior: "smooth",
        }}
      >
        {activeContact.isTicketBot && activeMessages.length === 0 && (
          <div className="tc-separator" style={{
            color: "#48484a", fontSize: 13, textAlign: "center",
            margin: "auto 24px", fontFamily: SF, lineHeight: 1.5,
          }}>
          </div>
        )}

        {activeMessages.map((m) => {
          if (m.kind === "user")      return <SentBubble        key={m.id} text={m.text} />;
          if (m.kind === "bot")       return <ReceivedTextBubble key={m.id} text={m.text} />;
          if (m.kind === "separator") return <Separator         key={m.id} label={m.label} />;
          if (m.kind === "typing")    return <TypingBubble      key={m.id} />;
          return <TicketBubble key={m.id} ticket={m.ticket} />;
        })}
      </div>

      <InputBar
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        placeholder="Text Message · SMS"
        numeric={activeContact.isTicketBot}
      />
    </div>
  );
}