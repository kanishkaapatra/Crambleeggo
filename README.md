# crambleeggo

> An autonomous AI freelance agency that sells, delivers, and pays itself.

crambleeggo is a fully autonomous AI-powered freelance agency built around a multi-agent workflow. A customer describes what they want in plain English, and four AI agents handle the entire lifecycle:

* Scope the project
* Quote the work
* Collect payment
* Generate the deliverable
* Log revenue and queue payout

Everything happens inside a single premium chat interface.

No dashboards. No admin ops. No manual fulfillment.

---

# Demo Flow

```txt
Customer request
    ↓
🧠 Sales Agent scopes + quotes
    ↓
💳 Checkout Agent creates payment session
    ↓
Customer pays inline
    ↓
⚙️ Delivery Agent generates the deliverable
    ↓
💰 Finance Agent logs revenue + payout
```

---

# Features

## Autonomous Multi-Agent Workflow

Each stage is handled by a dedicated AI agent with a focused responsibility.

| Agent             | Responsibility                                   |
| ----------------- | ------------------------------------------------ |
| 🧠 Sales Agent    | Scopes work, negotiates scope, generates pricing |
| 💳 Checkout Agent | Creates checkout session + embedded payment UI   |
| ⚙️ Delivery Agent | Produces the actual deliverable                  |
| 💰 Finance Agent  | Logs transactions and schedules payouts          |

---

## Real Deliverables

The Delivery Agent generates actual usable assets, including:

* Blog posts
* Landing page copy
* Email sequences
* SEO audits
* Brand identity concepts
* Custom freelance requests

---

## Live Revenue Dashboard

The owner panel updates in real time after every completed transaction.

Tracks:

* Revenue earned today
* Jobs completed
* Recent transactions
* Upcoming payouts

---

## Editorial Luxury UI

Designed to feel like a high-end creative agency rather than a SaaS dashboard.

### Visual Direction

* Deep charcoal / near-black backgrounds
* Serif display typography
* Acid green or electric amber accents
* Grain texture overlays
* Smooth message transitions
* Agent-specific message styling

---

# System Architecture

```txt
Frontend (React)
    ↓
Conversation State Machine
    ↓
AI Agent Layer
    ├── Sales Agent
    ├── Checkout Agent
    ├── Delivery Agent
    └── Finance Agent
    ↓
Payments + Persistence
```

---

# State Machine

```txt
IDLE
→ SCOPING
→ QUOTED
→ CHECKOUT
→ PAYING
→ PAID
→ DELIVERING
→ DELIVERED
→ LOGGED
→ IDLE
```

---

# Example Interaction

## Customer

```txt
Write me a landing page for my productivity app called Stackr
```

## 🧠 Sales Agent

```txt
Great brief. I’ll write a full landing page for Stackr —
hero, 3 feature sections, social proof block, and a CTA.
Copy only, no code.

Price: $39. Ready to go?
```

## 💳 Checkout Agent

Embedded checkout card appears inline in chat.

## ⚙️ Delivery Agent

Returns a complete landing page copy document directly inside the interface.

## 💰 Finance Agent

```json
{
  "transaction_id": "txn_1042",
  "amount": 39,
  "service": "Landing Page Copy",
  "payout_scheduled": true
}
```

---

# Tech Stack

## Frontend

* React
* TailwindCSS
* Framer Motion

## AI Layer

* Multi-agent orchestration
* Dedicated system prompts per agent
* Structured JSON responses where required

## Payments

* Locus Checkout integration
* Embedded checkout experience

## Persistence

* Revenue logging
* Transaction history
* Payout scheduling

---

# UI Requirements

## Left Panel

* Agency branding
* Revenue dashboard
* Transaction feed
* Payout status

## Right Panel

* Conversational chat UI
* Inline checkout card
* Inline deliverable rendering
* Thinking/loading states
* Quick-pick service tiles

---

# Quick-Pick Services

* Blog post / article
* Brand identity kit
* SEO audit report
* Email sequence
* Landing page copy
* Custom request ✦

---

# Design Notes

crambleeggo should not feel corporate or utilitarian.

The target aesthetic is:

> “Autonomous creative agency meets luxury editorial product.”

Typography, spacing, motion, and contrast should carry as much identity as the functionality itself.

---

# Constraints

* All agent responses must come from real AI API calls
* No mocked delivery outputs
* Checkout must render inline
* Revenue dashboard updates live
* No HTML form tags
* Entire implementation lives in a single React artifact

---

# Local Development

```bash
git clone https://github.com/kanishkaapatra/crambleeggo.git

cd crambleeggo

npm install

npm run dev
```

---

# Environment Variables

```env
VITE_AI_API_KEY=
VITE_LOCUS_API_KEY=
```

---

# Future Ideas

* Multi-model agent routing
* Voice-to-job intake
* Team collaboration mode
* White-label agencies
* Automated revisions
* Usage-based dynamic pricing
* AI quality scoring
* Auto upsells and retainers

---

# Philosophy

crambleeggo is built around a simple idea:

> Freelance work is mostly workflow orchestration.

If AI can scope work, price it, fulfill it, and reconcile payment, then an agency becomes a software system instead of a service business.

---
