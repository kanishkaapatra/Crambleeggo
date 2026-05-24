import { useState, useRef, useEffect } from "react";

// ── Crème + Peacock Blue theme ──────────────────────────────────────────────
const ACCENT      = "#006D77";   // peacock blue
const ACCENT_LIGHT= "#E0F0F1";   // accent tint for hover/bg
const ACCENT_DARK = "#003F45";   // deep teal — dark sections
const BG          = "#F7F4EE";   // crème base
const PANEL       = "#FFFFFF";   // card / panel white
const BORDER      = "#E2DDD6";   // soft warm border
const BORDER_DARK = "#C8C2BA";   // stronger border
const TEXT        = "#0A0A0A";   // near-black
const MUTED       = "#555555";   // mid-muted
const MUTED_LIGHT = "#AAAAAA";   // light muted

// Dot-grid background: 22px spacing, 1px dots
const DOT_GRID = `radial-gradient(circle, #0A0A0A22 1px, transparent 1px)`;

const FONT_HEADING = "'DM Serif Display', serif";
const FONT_BODY    = "'DM Mono', monospace";

const SERVICES = [
  { id: "blog",    icon: "✦", label: "Blog Post / Article",  prompt: "Write me a 1000-word blog post about [your topic]" },
  { id: "brand",   icon: "◈", label: "Brand Identity Kit",   prompt: "Create a brand identity kit for my company called [name]" },
  { id: "seo",     icon: "◎", label: "SEO Audit Report",     prompt: "Write an SEO audit report for my website [url or niche]" },
  { id: "email",   icon: "⊡", label: "Email Sequence",       prompt: "Write a 3-part email sequence for my [product/service]" },
  { id: "landing", icon: "▣", label: "Landing Page Copy",    prompt: "Write landing page copy for my product called [name]" },
  { id: "custom",  icon: "✧", label: "Custom Request",       prompt: "" },
];

const AGENT_META = {
  sales:    { name: "Sales",    emoji: "🧠", color: "#006D77", bg: "#E0F0F1" },
  checkout: { name: "Checkout", emoji: "💳", color: "#1D6FA4", bg: "#E0EEF8" },
  delivery: { name: "Delivery", emoji: "⚙️", color: "#2E7D52", bg: "#E1F3EA" },
  finance:  { name: "Finance",  emoji: "💰", color: "#7B3FA0", bg: "#F0E6F8" },
};

async function callClaude(systemPrompt, userMessage) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const data = await res.json();
  return (data.content || []).map(b => b.text || "").join("");
}

function generateId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function AnimatedText({ text }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else clearInterval(iv);
    }, 9);
    return () => clearInterval(iv);
  }, [text]);
  return <span>{displayed}</span>;
}

function AgentPip({ color }) {
  return (
    <span style={{
      display: "inline-block", width: 7, height: 7, borderRadius: "50%",
      background: color, marginRight: 6, verticalAlign: "middle", flexShrink: 0,
    }} />
  );
}

// ── Checkout Card ────────────────────────────────────────────────────────────
function CheckoutCard({ amount, lineItem, onPay, paying }) {
  const [card,   setCard]   = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvv,    setCvv]    = useState("123");

  const inputStyle = {
    width: "100%", background: BG, border: `1px solid ${BORDER_DARK}`,
    borderRadius: 6, padding: "9px 12px", color: TEXT,
    fontSize: 13, fontFamily: FONT_BODY, outline: "none",
    boxSizing: "border-box", transition: "border-color 0.15s",
  };

  return (
    <div style={{
      background: PANEL, borderRadius: 12, padding: "22px 24px",
      maxWidth: 360, fontFamily: FONT_BODY,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
        <span style={{ fontSize: 18 }}>💳</span>
        <span style={{ fontSize: 10, color: MUTED, letterSpacing: 3, textTransform: "uppercase" }}>
          Secure Checkout
        </span>
      </div>

      {/* Line item + price */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${BORDER}`,
      }}>
        <span style={{ color: MUTED, fontSize: 13 }}>{lineItem}</span>
        <span style={{ color: ACCENT_DARK, fontSize: 24, fontFamily: FONT_HEADING }}>${amount}</span>
      </div>

      {/* Fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Card Number", value: card,   setter: setCard,   ph: "4242 4242 4242 4242" },
          { label: "Expiry",      value: expiry, setter: setExpiry, ph: "MM/YY" },
          { label: "CVV",         value: cvv,    setter: setCvv,    ph: "123" },
        ].map(({ label, value, setter, ph }) => (
          <div key={label}>
            <div style={{ fontSize: 10, color: MUTED_LIGHT, marginBottom: 5, letterSpacing: 1.5, textTransform: "uppercase" }}>
              {label}
            </div>
            <input
              value={value} onChange={e => setter(e.target.value)} placeholder={ph}
              style={inputStyle}
              onFocus={e  => e.target.style.borderColor = ACCENT}
              onBlur={e   => e.target.style.borderColor = BORDER_DARK}
            />
          </div>
        ))}
      </div>

      {/* Pay button */}
      <button
        onClick={onPay} disabled={paying}
        style={{
          width: "100%", background: paying ? MUTED_LIGHT : ACCENT_DARK,
          border: "none", borderRadius: 8, padding: "13px",
          color: "#FFFFFF", fontSize: 13, fontWeight: 700,
          cursor: paying ? "not-allowed" : "pointer",
          letterSpacing: 1.5, textTransform: "uppercase", transition: "all 0.2s",
          fontFamily: FONT_BODY,
        }}
      >
        {paying ? "Processing…" : `Pay $${amount}`}
      </button>
      <div style={{ fontSize: 10, color: MUTED_LIGHT, textAlign: "center", marginTop: 10 }}>
        🔒 256-bit SSL — Secured by Crambleeggo Pay
      </div>
    </div>
  );
}

// ── Delivery Card ────────────────────────────────────────────────────────────
function DeliveryCard({ content }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(content).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{
      background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 12,
      overflow: "hidden", maxWidth: 600,
    }}>
      <div style={{
        padding: "10px 16px", borderBottom: `1px solid ${BORDER}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#F0F8F6",
      }}>
        <span style={{ fontSize: 11, color: AGENT_META.delivery.color, letterSpacing: 2, textTransform: "uppercase", fontFamily: FONT_BODY }}>
          ✓ Delivered
        </span>
        <button
          onClick={copy}
          style={{
            background: copied ? ACCENT_LIGHT : PANEL, border: `1px solid ${BORDER_DARK}`,
            borderRadius: 5, color: copied ? ACCENT : MUTED,
            fontSize: 11, padding: "4px 12px", cursor: "pointer",
            letterSpacing: 1, fontFamily: FONT_BODY, transition: "all 0.15s",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div style={{
        padding: "18px 20px", color: TEXT, fontSize: 13,
        lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: FONT_BODY,
        maxHeight: 420, overflowY: "auto",
      }}>
        {content}
      </div>
    </div>
  );
}

// ── Single Chat Message ──────────────────────────────────────────────────────
function Message({ msg, isNew }) {
  const [visible, setVisible] = useState(!isNew);
  useEffect(() => {
    if (isNew) { const t = setTimeout(() => setVisible(true), 40); return () => clearTimeout(t); }
  }, []);

  const isUser = msg.role === "user";
  const agent  = msg.agent ? AGENT_META[msg.agent] : null;

  return (
    <div style={{
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      display: "flex", flexDirection: isUser ? "row-reverse" : "row",
      gap: 10, marginBottom: 20, alignItems: "flex-start",
    }}>
      {/* Avatar */}
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
          background: agent?.bg || ACCENT_LIGHT,
          border: `1.5px solid ${agent?.color || ACCENT}33`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
        }}>
          {agent?.emoji || "◈"}
        </div>
      )}

      <div style={{ maxWidth: "82%", display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Agent label */}
        {!isUser && agent && (
          <div style={{ fontSize: 10, color: agent.color, letterSpacing: 2, textTransform: "uppercase", fontFamily: FONT_BODY }}>
            {agent.name} Agent
          </div>
        )}

        {/* Bubble */}
        <div style={{
          background: isUser ? ACCENT_DARK : PANEL,
          border: `1px solid ${isUser ? "transparent" : BORDER}`,
          borderLeft: !isUser ? `3px solid ${agent?.color || ACCENT}` : undefined,
          borderRadius: isUser ? "12px 3px 12px 12px" : "3px 12px 12px 12px",
          padding: (msg.type === "checkout" || msg.type === "delivery") ? 0 : "12px 16px",
          color: isUser ? "#FFFFFF" : TEXT,
          fontSize: 13.5, lineHeight: 1.75, fontFamily: FONT_BODY,
          overflow: "hidden",
        }}>
          {msg.type === "checkout" && msg.checkoutData ? (
            <CheckoutCard
              amount={msg.checkoutData.amount}
              lineItem={msg.checkoutData.line_item}
              onPay={msg.onPay}
              paying={msg.paying}
            />
          ) : msg.type === "delivery" ? (
            <DeliveryCard content={msg.content} />
          ) : (
            isNew && !isUser ? <AnimatedText text={msg.content} /> : <span>{msg.content}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Thinking Indicator ───────────────────────────────────────────────────────
function ThinkingIndicator({ agent }) {
  const meta = AGENT_META[agent];
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const iv = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 420);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "center" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        background: meta?.bg || ACCENT_LIGHT,
        border: `1.5px solid ${meta?.color || ACCENT}33`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
      }}>{meta?.emoji}</div>
      <div style={{ fontSize: 12, color: MUTED, fontStyle: "italic", fontFamily: FONT_BODY }}>
        {meta?.name} agent thinking{dots}
      </div>
    </div>
  );
}

// ── Root App ─────────────────────────────────────────────────────────────────
export default function Crambleeggo() {
  const [messages,     setMessages]     = useState([]);
  const [input,        setInput]        = useState("");
  const [state,        setState]        = useState("IDLE");
  const [thinking,     setThinking]     = useState(null);
  const [revenue,      setRevenue]      = useState({ today: 0, jobs: 0, nextPayout: 0, transactions: [] });
  const [pendingAmount,  setPendingAmount]  = useState(0);
  const [pendingService, setPendingService] = useState("");
  const chatEndRef = useRef(null);
  const inputRef   = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);

  const addMsg    = (msg) => setMessages(prev => [...prev, { ...msg, id: generateId(), isNew: true }]);
  const updateLast = (up)  => setMessages(prev => { const c=[...prev]; c[c.length-1]={...c[c.length-1],...up}; return c; });

  // ── Agents ──────────────────────────────────────────────────────────────
  const runSalesAgent = async (request) => {
    setState("SCOPING"); setThinking("sales");
    try {
      const reply = await callClaude(
        `You are a confident, friendly sales agent for Crambleeggo — a premium AI freelance agency.
Read the customer's request, scope the work clearly, set a fair price ($19–$199), and reply conversationally.
Be specific about exactly what you'll deliver. End with the price and a CTA asking if they want to proceed.
Keep reply under 85 words. Be sharp and professional.`,
        request
      );
      setThinking(null);
      addMsg({ role: "assistant", agent: "sales", content: reply, isNew: true });
      setState("QUOTED");
      const m = reply.match(/\$(\d+)/); if (m) setPendingAmount(parseInt(m[1]));
      setPendingService(request.slice(0, 60));
    } catch {
      setThinking(null);
      addMsg({ role: "assistant", agent: "sales", content: "Connection issue — please try again.", isNew: true });
      setState("IDLE");
    }
  };

  const runCheckoutAgent = async () => {
    setState("CHECKOUT"); setThinking("checkout");
    try {
      const reply = await callClaude(
        `You are a checkout agent for Crambleeggo. Return ONLY valid JSON, no markdown, no explanation:
{"session_id":"SESS_XXXX","amount":NUMBER,"line_item":"SHORT_DESCRIPTION","checkout_url":"https://pay.crambleeggo.io/SESSION"}
Make session_id random-looking. line_item under 40 chars. Use the amount from context.`,
        `Customer confirmed. Amount: $${pendingAmount}. Service: ${pendingService}`
      );
      setThinking(null);
      let data;
      try { data = JSON.parse(reply.replace(/```json|```/g, "").trim()); }
      catch { data = { session_id: "SESS_"+generateId(), amount: pendingAmount, line_item: pendingService.slice(0,40), checkout_url: "#" }; }
      data.amount = data.amount || pendingAmount;

      addMsg({
        role: "assistant", agent: "checkout", type: "checkout",
        checkoutData: data, content: "",
        onPay: () => handlePayment(data), paying: false, isNew: true,
      });
    } catch {
      setThinking(null);
      addMsg({ role: "assistant", agent: "checkout", content: "Checkout error — please try again.", isNew: true });
      setState("QUOTED");
    }
  };

  const handlePayment = async (checkoutData) => {
    updateLast({ paying: true });
    await new Promise(r => setTimeout(r, 2000));
    updateLast({ paying: false });
    setState("DELIVERING");
    addMsg({ role: "user", content: `💳 Payment successful — $${checkoutData.amount}`, isNew: true });
    await runDeliveryAgent(checkoutData.amount);
  };

  const runDeliveryAgent = async (amount) => {
    setThinking("delivery");
    try {
      const customerRequest = messages.find(m => m.role === "user")?.content || pendingService;
      const reply = await callClaude(
        `You are the Delivery Agent for Crambleeggo — a premium AI freelance agency.
Produce the ACTUAL deliverable the customer paid for. Real, usable, professional output only.
Blog post → write the full post. Email sequence → write every email in full.
Landing page → write all sections. SEO audit → write a detailed real audit. Brand kit → full identity spec.
Minimum 300 words of actual content. Do NOT explain what you're doing — just deliver the work.`,
        `Customer request: ${customerRequest}\nService: ${pendingService}\nAmount paid: $${amount}`
      );
      setThinking(null);
      addMsg({ role: "assistant", agent: "delivery", type: "delivery", content: reply, isNew: true });
      setState("DELIVERED");
      await runFinanceAgent(amount);
    } catch {
      setThinking(null);
      addMsg({ role: "assistant", agent: "delivery", content: "Delivery error — please refresh and try again.", isNew: true });
      setState("IDLE");
    }
  };

  const runFinanceAgent = async (amount) => {
    setThinking("finance");
    try {
      const ownerCut = (amount * 0.9).toFixed(2);
      const reply = await callClaude(
        `You are the Finance Agent for Crambleeggo. A transaction just completed.
Write 2–3 sentences confirming: the transaction ID (invent a realistic one), the amount, the owner payout (90%), and Friday payout schedule.
Be brief and professional.`,
        `Amount: $${amount}. Service: ${pendingService}. Owner payout: $${ownerCut}`
      );
      setThinking(null);
      addMsg({ role: "assistant", agent: "finance", content: reply, isNew: true });

      const txId = "TXN-" + generateId();
      setRevenue(prev => ({
        today:    prev.today + amount,
        jobs:     prev.jobs  + 1,
        nextPayout: prev.nextPayout + parseFloat(ownerCut),
        transactions: [
          { id: txId, amount, service: pendingService.slice(0, 30), time: new Date().toLocaleTimeString() },
          ...prev.transactions,
        ].slice(0, 8),
      }));
      setState("IDLE");
    } catch {
      setThinking(null);
      addMsg({ role: "assistant", agent: "finance", content: `Transaction logged. $${amount} revenue recorded.`, isNew: true });
      setState("IDLE");
    }
  };

  // ── Input handling ───────────────────────────────────────────────────────
  const handleSend = async () => {
    const text = input.trim(); if (!text) return;
    setInput("");
    if (state === "IDLE") {
      addMsg({ role: "user", content: text, isNew: true });
      await runSalesAgent(text);
    } else if (state === "QUOTED") {
      addMsg({ role: "user", content: text, isNew: true });
      const lo = text.toLowerCase();
      if (lo.includes("yes") || lo.includes("sure") || lo.includes("ok") ||
          lo.includes("proceed") || lo.includes("go") || lo.includes("yeah") || lo.includes("yep")) {
        await runCheckoutAgent();
      } else {
        addMsg({
          role: "assistant", agent: "sales",
          content: "No problem! Let me know if you'd like to adjust anything, or just say 'yes' when you're ready to proceed.",
          isNew: true,
        });
      }
    }
  };

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const busy = thinking !== null || ["CHECKOUT","DELIVERING","PAYING"].includes(state);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: "flex", height: "100vh",
      background: BG,
      backgroundImage: DOT_GRID,
      backgroundSize: "22px 22px",
      fontFamily: FONT_BODY, color: TEXT,
    }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: 268, flexShrink: 0, background: ACCENT_DARK,
        display: "flex", flexDirection: "column", padding: "28px 20px",
        overflow: "hidden", color: "#FFFFFF",
      }}>

        {/* Branding */}
        <div style={{ marginBottom: 34 }}>
          <div style={{ fontSize: 26, fontFamily: FONT_HEADING, color: "#FFFFFF", lineHeight: 1.1, letterSpacing: -0.5 }}>
            crambleeggo
          </div>
          <div style={{ fontSize: 9, color: "#FFFFFF88", letterSpacing: 3.5, textTransform: "uppercase", marginTop: 5 }}>
            AI Freelance Agency
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#FFFFFF22", marginBottom: 24 }} />

        {/* Owner Dashboard */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 9, color: "#FFFFFF66", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>
            Owner Dashboard
          </div>
          {[
            { label: "Today's Revenue", value: `$${revenue.today.toFixed(2)}`, big: true },
            { label: "Jobs Completed",  value: String(revenue.jobs) },
            { label: "Next Payout",     value: `$${revenue.nextPayout.toFixed(2)}` },
          ].map(({ label, value, big }) => (
            <div key={label} style={{
              background: "#FFFFFF12", border: "1px solid #FFFFFF22", borderRadius: 8,
              padding: "10px 14px", marginBottom: 8,
            }}>
              <div style={{ fontSize: 10, color: "#FFFFFF66", marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: big ? 22 : 16, color: "#FFFFFF", fontFamily: big ? FONT_HEADING : FONT_BODY, fontWeight: big ? 400 : 600 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 9, color: "#FFFFFF66", letterSpacing: 3, textTransform: "uppercase", marginBottom: 10 }}>
            Transactions
          </div>
          {revenue.transactions.length === 0 ? (
            <div style={{ fontSize: 11, color: "#FFFFFF44", fontStyle: "italic" }}>No transactions yet</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, overflowY: "auto", flex: 1 }}>
              {revenue.transactions.map(tx => (
                <div key={tx.id} style={{
                  background: "#FFFFFF0E", borderRadius: 7, padding: "8px 10px",
                  border: "1px solid #FFFFFF1A",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 600 }}>${tx.amount}</span>
                    <span style={{ fontSize: 10, color: "#7ED8AA" }}>✓ paid</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#FFFFFF77", marginTop: 2 }}>
                    {tx.service.slice(0, 26)}{tx.service.length > 26 ? "…" : ""}
                  </div>
                  <div style={{ fontSize: 9, color: "#FFFFFF44", marginTop: 1 }}>{tx.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status pill */}
        <div style={{
          marginTop: 16, padding: "8px 12px", borderRadius: 6,
          background: "#FFFFFF12", border: "1px solid #FFFFFF22",
          fontSize: 10, color: "#FFFFFF88",
          display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_BODY,
        }}>
          <span style={{
            display: "inline-block", width: 7, height: 7, borderRadius: "50%",
            background: state === "IDLE" ? "#7ED8AA" : "#F5C842",
            marginRight: 4,
          }} />
          {state === "IDLE" ? "Ready" : state.charAt(0) + state.slice(1).toLowerCase()}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{
          padding: "14px 28px", borderBottom: `1px solid ${BORDER}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: PANEL,
        }}>
          <div>
            <div style={{ fontSize: 14, color: TEXT, fontWeight: 600, fontFamily: FONT_HEADING }}>Agency Chat</div>
            <div style={{ fontSize: 10, color: MUTED_LIGHT, marginTop: 1, fontFamily: FONT_BODY }}>
              {state === "IDLE" ? "Ready for your next project" : `${state.charAt(0) + state.slice(1).toLowerCase()}…`}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {Object.entries(AGENT_META).map(([k, m]) => (
              <div key={k} style={{
                fontSize: 10, color: m.color, padding: "3px 10px",
                border: `1px solid ${m.color}44`, borderRadius: 20,
                background: m.bg, display: "flex", alignItems: "center", gap: 4,
                fontFamily: FONT_BODY,
              }}>
                <AgentPip color={m.color} />{m.name}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>

          {/* Empty state */}
          {messages.length === 0 && state === "IDLE" && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 36, marginTop: 16 }}>
                <div style={{ fontSize: 38, fontFamily: FONT_HEADING, color: ACCENT_DARK, marginBottom: 8, lineHeight: 1.2 }}>
                  What can we create for you?
                </div>
                <div style={{ fontSize: 13, color: MUTED, fontFamily: FONT_BODY }}>
                  Choose a service below, or describe your project — our agents handle the rest.
                </div>
              </div>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
                maxWidth: 660, margin: "0 auto",
              }}>
                {SERVICES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { if (s.id !== "custom") setInput(s.prompt); inputRef.current?.focus(); }}
                    style={{
                      background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 10,
                      padding: "16px 16px", cursor: "pointer", textAlign: "left",
                      transition: "all 0.15s", color: TEXT, fontFamily: FONT_BODY,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.background = ACCENT_LIGHT; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER;  e.currentTarget.style.background = PANEL; }}
                  >
                    <div style={{ fontSize: 20, color: ACCENT, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 12, color: TEXT, lineHeight: 1.45 }}>{s.label}</div>
                    {s.id === "custom" && (
                      <div style={{ fontSize: 10, color: ACCENT, marginTop: 5 }}>Dynamic scoping ✦</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <Message key={msg.id} msg={msg} isNew={msg.isNew && i === messages.length - 1} />
          ))}

          {thinking && <ThinkingIndicator agent={thinking} />}
          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <div style={{
          padding: "14px 28px 18px", borderTop: `1px solid ${BORDER}`,
          background: PANEL,
        }}>
          <div style={{
            display: "flex", gap: 10, alignItems: "flex-end",
            background: BG, border: `1.5px solid ${busy ? BORDER : BORDER_DARK}`, borderRadius: 12,
            padding: "10px 14px", transition: "border-color 0.2s",
          }}
            onFocusCapture={e => e.currentTarget.style.borderColor = ACCENT}
            onBlurCapture={e  => e.currentTarget.style.borderColor = BORDER_DARK}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={
                state === "IDLE"   ? "Describe your project or request…" :
                state === "QUOTED" ? "Type 'yes' to confirm, or ask to adjust…" :
                                     "Processing your request…"
              }
              disabled={busy} rows={1}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: TEXT, fontSize: 13, fontFamily: FONT_BODY,
                resize: "none", lineHeight: 1.6, opacity: busy ? 0.45 : 1,
              }}
            />
            <button
              onClick={handleSend} disabled={busy || !input.trim()}
              style={{
                background: (busy || !input.trim()) ? BORDER : ACCENT_DARK,
                border: "none", borderRadius: 8, padding: "9px 18px",
                color: (busy || !input.trim()) ? MUTED_LIGHT : "#FFFFFF",
                fontSize: 12, fontWeight: 700, cursor: (busy || !input.trim()) ? "not-allowed" : "pointer",
                transition: "all 0.15s", letterSpacing: 0.5, whiteSpace: "nowrap",
                fontFamily: FONT_BODY,
              }}
            >
              Send ↑
            </button>
          </div>
          <div style={{ fontSize: 10, color: MUTED_LIGHT, marginTop: 8, textAlign: "center", fontFamily: FONT_BODY }}>
            All four agents are real AI calls — Sales → Checkout → Delivery → Finance
          </div>
        </div>
      </div>
    </div>
  );
}
