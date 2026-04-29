// src/components/TicketChat.tsx
import { useEffect, useRef, useState } from "react";

// ─────────────────────────── Types ───────────────────────────

type ChatId = "7000" | "mama" | "tata" | "andrei";

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
  | { id: number; kind: "processing"; time: string }
  | { id: number; kind: "ticket"; ticket: Ticket; time: string };

interface Contact {
  id: ChatId;
  name: string;
  avatarBg: string;
  initials: string;
  preview: string;
  previewTime: string;
}

const SF = "-apple-system, 'SF Pro Text', BlinkMacSystemFont, sans-serif";

// ─────────────────────────── Helpers ───────────────────────────

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

const CONTACTS: Contact[] = [
  { id: "7000",   name: "7000",   avatarBg: "#636366", initials: "70", preview: "Bilet electronic...",   previewTime: "Acum"  },
  { id: "mama",   name: "Mama",   avatarBg: "#ff375f", initials: "M",  preview: "Vii diseară la masă?", previewTime: "16:42" },
  { id: "tata",   name: "Tata",   avatarBg: "#0a84ff", initials: "T",  preview: "Sună-mă când poți",    previewTime: "14:08" },
  { id: "andrei", name: "Andrei", avatarBg: "#30d158", initials: "A",  preview: "👍",                   previewTime: "Ieri"  },
];

const INITIAL_MESSAGES: Record<ChatId, Message[]> = {
  "7000": [],
  mama:   [{ id: 1, kind: "bot", text: "Vii diseară la masă?", time: "16:42" }],
  tata:   [{ id: 1, kind: "bot", text: "Sună-mă când poți",    time: "14:08" }],
  andrei: [{ id: 1, kind: "bot", text: "👍",                   time: "Ieri"  }],
};

// ─────────────────────────── Conversation header ───────────────────────────

const ContactHeader = ({
  contact, unreadCount, onBack,
}: { contact: Contact; unreadCount: number; onBack: () => void }) => (
  <div style={{
    backgroundColor: "#1c1c1e", display: "flex", flexDirection: "column", alignItems: "center",
    paddingBottom: 12, position: "relative", borderBottom: "0.5px solid #38383a", flexShrink: 0,
  }}>
    <button
      onClick={onBack}
      aria-label="Înapoi"
      style={{
        position: "absolute", left: 10, top: 4, display: "flex", alignItems: "center", gap: 1,
        background: "none", border: "none", padding: 4, cursor: "pointer",
      }}
    >
      <svg width="13" height="24" viewBox="0 0 12 22" fill="none">
        <path d="M10 2L2 11L10 20" stroke="#007AFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {unreadCount > 0 && (
        <div style={{
          backgroundColor: "#007AFF", borderRadius: "50%", minWidth: 22, height: 22,
          padding: "0 6px", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{unreadCount}</span>
        </div>
      )}
    </button>
    <div style={{
      width: 60, height: 60, borderRadius: "50%", backgroundColor: contact.avatarBg,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", marginTop: 6, marginBottom: 5,
    }}>
      {contact.id === "7000" ? (
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="37" r="22" fill="#c7c7cc" />
          <ellipse cx="50" cy="96" rx="38" ry="28" fill="#c7c7cc" />
        </svg>
      ) : (
        <span style={{ color: "#fff", fontSize: 24, fontWeight: 600, fontFamily: SF }}>{contact.initials}</span>
      )}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: SF }}>{contact.name}</span>
      <svg width="6" height="11" viewBox="0 0 6 11" fill="none">
        <path d="M1 1L5 5.5L1 10" stroke="#8e8e93" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </div>
);

// ─────────────────────────── Bubbles ───────────────────────────

const SentBubble = ({ text }: { text: string }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4, paddingRight: 4 }}>
    <div style={{
      backgroundColor: "#34c759", color: "#fff",
      padding: "10px 16px", borderRadius: 20, borderBottomRightRadius: 5,
      fontSize: 17, fontWeight: 600, fontFamily: SF, maxWidth: "70%", lineHeight: 1.3, wordBreak: "break-word",
    }}>{text}</div>
  </div>
);

const ReceivedTextBubble = ({ text }: { text: string }) => (
  <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 3, paddingLeft: 4 }}>
    <div style={{
      backgroundColor: "#1c1c1e", color: "#fff",
      padding: "10px 14px", borderRadius: 20, borderBottomLeftRadius: 5,
      fontSize: 16, fontWeight: 600, fontFamily: SF, maxWidth: "82%", lineHeight: 1.4, wordBreak: "break-word",
    }}>{text}</div>
  </div>
);

const TicketBubble = ({ ticket }: { ticket: Ticket }) => (
  <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 6, paddingLeft: 4 }}>
    <div style={{
      backgroundColor: "#1c1c1e", color: "#fff",
      padding: "11px 14px", borderRadius: 20, borderBottomLeftRadius: 5,
      fontSize: 16, fontWeight: 600, fontFamily: SF, maxWidth: "82%", lineHeight: 1.55,
    }}>
      {"Bilet electronic nr. "}
      <span style={{ color: "#0a84ff", textDecoration: "underline", textDecorationColor: "#0a84ff" }}>
        {ticket.ticketNumber}
      </span>
      <br />{ticket.date}
      <br />{`Valabil 1 ora (de la ${ticket.time} pina la ${ticket.endTime})`}
      <br />{"Pret 6 MDL"}
      <br />{`Numar de bord ${ticket.routeNumber}`}
    </div>
  </div>
);

// ─────────────────────────── Input bar ───────────────────────────

const InputBar = ({
  value, onChange, onSubmit, placeholder, numeric,
}: {
  value: string; onChange: (v: string) => void; onSubmit: () => void;
  placeholder: string; numeric?: boolean;
}) => {
  const canSend = value.trim().length > 0;
  return (
    <div style={{
      backgroundColor: "#1c1c1e", borderTop: "0.5px solid #38383a",
      display: "flex", alignItems: "center",
      padding: "8px 12px calc(10px + env(safe-area-inset-bottom))", gap: 10, flexShrink: 0,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", backgroundColor: "#3a3a3c",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1V13M1 7H13" stroke="#ebebf5" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <form
        onSubmit={(e) => { e.preventDefault(); if (canSend) onSubmit(); }}
        style={{ flex: 1, display: "flex", alignItems: "center" }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode={numeric ? "numeric" : "text"}
          placeholder={placeholder}
          style={{
            flex: 1, border: "0.5px solid #48484a", borderRadius: 20,
            padding: "8px 14px", color: "#fff", fontSize: 16, fontFamily: SF,
            backgroundColor: "transparent", outline: "none", minWidth: 0,
          }}
        />
      </form>
      {canSend ? (
        <button
          onClick={onSubmit}
          aria-label="Trimite"
          style={{
            flexShrink: 0, width: 32, height: 32, borderRadius: "50%", border: "none",
            backgroundColor: "#34c759", display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M5 12L12 5L19 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : (
        <svg width="16" height="22" viewBox="0 0 17 22" fill="none" style={{ flexShrink: 0 }}>
          <rect x="4.5" y="0.5" width="8" height="13" rx="4" fill="#636366" />
          <path d="M1 9.5a7.5 7.5 0 0015 0" stroke="#636366" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <line x1="8.5" y1="17" x2="8.5" y2="21" stroke="#636366" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="5"   y1="21" x2="12"  y2="21" stroke="#636366" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};

// ─────────────────────────── Messages list screen ───────────────────────────

const ChatListTopBar = () => (
  <div style={{
    backgroundColor: "#000",
    padding: "6px 16px 4px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    flexShrink: 0,
  }}>
    <span style={{ color: "#0a84ff", fontSize: 17, fontFamily: SF }}>Edit</span>
    <span style={{ color: "#0a84ff", fontSize: 22, fontFamily: SF, fontWeight: 400 }}>✎</span>
  </div>
);

const ChatListTitle = () => (
  <div style={{ backgroundColor: "#000", padding: "2px 16px 10px", flexShrink: 0 }}>
    <h1 style={{
      color: "#fff", fontSize: 34, fontWeight: 700, fontFamily: SF,
      margin: 0, letterSpacing: "-0.4px",
    }}>Messages</h1>
  </div>
);

const SearchBar = () => (
  <div style={{ backgroundColor: "#000", padding: "0 16px 8px", flexShrink: 0 }}>
    <div style={{
      backgroundColor: "#1c1c1e", borderRadius: 10, padding: "7px 10px",
      display: "flex", alignItems: "center", gap: 6,
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="#8e8e93" strokeWidth="2" />
        <path d="M20 20L17 17" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span style={{ color: "#8e8e93", fontSize: 16, fontFamily: SF }}>Search</span>
    </div>
  </div>
);

const ChatRow = ({ contact, onOpen }: { contact: Contact; onOpen: () => void }) => (
  <button
    onClick={onOpen}
    style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 16px", background: "none", border: "none",
      width: "100%", textAlign: "left", cursor: "pointer",
      borderBottom: "0.5px solid #1c1c1e",
    }}
  >
    <div style={{
      width: 56, height: 56, borderRadius: "50%", backgroundColor: contact.avatarBg,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      overflow: "hidden",
    }}>
      {contact.id === "7000" ? (
        <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="37" r="22" fill="#c7c7cc" />
          <ellipse cx="50" cy="96" rx="38" ry="28" fill="#c7c7cc" />
        </svg>
      ) : (
        <span style={{ color: "#fff", fontSize: 22, fontWeight: 600, fontFamily: SF }}>{contact.initials}</span>
      )}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6 }}>
        <span style={{ color: "#fff", fontSize: 17, fontWeight: 600, fontFamily: SF }}>{contact.name}</span>
        <span style={{ color: "#8e8e93", fontSize: 13, fontFamily: SF, flexShrink: 0 }}>{contact.previewTime}</span>
      </div>
      <div style={{
        color: "#8e8e93", fontSize: 15, fontFamily: SF,
        marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{contact.preview}</div>
    </div>
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 1L7 7L1 13" stroke="#48484a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

// ─────────────────────────── Main app ───────────────────────────

export default function TicketChat() {
  const [view, setView] = useState<"list" | ChatId>("list");
  const [allMessages, setAllMessages] = useState<Record<ChatId, Message[]>>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const idRef = useRef(100);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [allMessages, view]);

  useEffect(() => { setInput(""); }, [view]);

  const activeContact = view !== "list" ? CONTACTS.find((c) => c.id === view)! : null;
  const activeMessages = activeContact ? allMessages[activeContact.id] : [];

  const pushMessage = (chatId: ChatId, msg: Message) =>
    setAllMessages((prev) => ({ ...prev, [chatId]: [...prev[chatId], msg] }));

  const handleSend = () => {
    if (!activeContact) return;
    const text = input.trim();
    if (!text) return;
    setInput("");

    const now = new Date();
    pushMessage(activeContact.id, { id: idRef.current++, kind: "user", text, time: fmtTime(now) });

    if (activeContact.id === "7000") {
      setTimeout(() => {
        pushMessage("7000", { id: idRef.current++, kind: "processing", time: fmtTime(new Date()) });
        setTimeout(() => {
          pushMessage("7000", {
            id: idRef.current++, kind: "ticket",
            ticket: buildTicket(text), time: fmtTime(new Date()),
          });
        }, 700);
      }, 450);
    } else {
      const replies: Record<string, string[]> = {
        mama:   ["Bine dragă ❤️", "Te aștept", "Ok, sărutări"],
        tata:   ["Ok", "Sună-mă mai târziu", "Mulțumesc"],
        andrei: ["👍", "Cool", "Ne vedem"],
      };
      const pool = replies[activeContact.id] ?? ["Ok"];
      setTimeout(() => {
        pushMessage(activeContact.id, {
          id: idRef.current++, kind: "bot",
          text: pool[Math.floor(Math.random() * pool.length)],
          time: fmtTime(new Date()),
        });
      }, 700);
    }
  };

  // ── Root: full real-screen, with safe areas, NO fake status bar / NO fake home indicator ──
  const root: React.CSSProperties = {
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
        <SearchBar />
        <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#000", paddingBottom: "env(safe-area-inset-bottom)" }}>
          {CONTACTS.map((c) => (
            <ChatRow key={c.id} contact={c} onOpen={() => setView(c.id)} />
          ))}
        </div>
      </div>
    );
  }

  const firstTime = activeMessages[0]?.time ?? fmtTime(new Date());

  return (
    <div style={root}>
      <ContactHeader
        contact={activeContact!}
        unreadCount={CONTACTS.length - 1}
        onBack={() => setView("list")}
      />

      <div
        ref={scrollRef}
        style={{
          backgroundColor: "#000", flex: 1, padding: "0 8px 12px",
          display: "flex", flexDirection: "column", overflowY: "auto",
        }}
      >
        <div style={{
          textAlign: "center", color: "#8e8e93", fontSize: 12, fontWeight: 400,
          lineHeight: 1.5, margin: "14px 0 16px", fontFamily: SF,
        }}>
          <div>Text Message</div>
          <div>Today &nbsp;{firstTime}</div>
        </div>

        {activeContact!.id === "7000" && activeMessages.length === 0 && (
          <div style={{
            color: "#48484a", fontSize: 13, textAlign: "center",
            margin: "auto 24px", fontFamily: SF, lineHeight: 1.5,
          }}>
          </div>
        )}

        {activeMessages.map((m) => {
          if (m.kind === "user")       return <SentBubble        key={m.id} text={m.text} />;
          if (m.kind === "bot")        return <ReceivedTextBubble key={m.id} text={m.text} />;
          if (m.kind === "processing") return <ReceivedTextBubble key={m.id} text="Solicitarea este in curs de procesare." />;
          return <TicketBubble key={m.id} ticket={m.ticket} />;
        })}
      </div>

      <InputBar
        value={input}
        onChange={setInput}
        onSubmit={handleSend}
        placeholder="Text Message"
        numeric={activeContact!.id === "7000"}
      />
    </div>
  );
}