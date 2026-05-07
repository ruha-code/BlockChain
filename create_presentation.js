const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Gym Credit Token System";
pres.author = "Ruslan";

// Color palette
const C = {
  dark:    "0D1F2D",  // dark navy
  emerald: "059669",  // emerald green
  light:   "ECFDF5",  // light green tint
  white:   "FFFFFF",
  gray:    "6B7280",
  lgray:   "F3F4F6",
  text:    "111827",
  muted:   "9CA3AF",
  accent:  "34D399",  // bright emerald
};

function titleSlide() {
  const s = pres.addSlide();
  s.background = { color: C.dark };

  // Decorative left bar
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 0.08, h: 5.625, fill: { color: C.emerald } });

  // Top label
  s.addText("FINAL PROJECT DEFENSE", {
    x: 0.5, y: 0.6, w: 9, h: 0.35,
    fontSize: 10, color: C.accent, bold: true, charSpacing: 4, fontFace: "Calibri",
  });

  // Main title
  s.addText("Gym Credit", {
    x: 0.5, y: 1.1, w: 9, h: 1.1,
    fontSize: 56, color: C.white, bold: true, fontFace: "Calibri",
  });
  s.addText("Token System", {
    x: 0.5, y: 2.05, w: 9, h: 1.0,
    fontSize: 56, color: C.accent, bold: true, fontFace: "Calibri",
  });

  // Subtitle
  s.addText("A decentralized ERC-20 loyalty token for gym members on Ethereum Sepolia", {
    x: 0.5, y: 3.2, w: 7.5, h: 0.6,
    fontSize: 14, color: C.muted, fontFace: "Calibri", italic: true,
  });

  // Bottom row
  s.addText("Blockchain Technologies  ·  Spring 2026  ·  Ruslan", {
    x: 0.5, y: 5.0, w: 9, h: 0.35,
    fontSize: 10, color: C.gray, fontFace: "Calibri",
  });

  // Decorative circles
  s.addShape(pres.ShapeType.ellipse, { x: 8.8, y: 0.2, w: 1.8, h: 1.8, fill: { color: C.emerald }, line: { color: C.emerald }, transparency: 85 });
  s.addShape(pres.ShapeType.ellipse, { x: 8.2, y: 3.8, w: 2.4, h: 2.4, fill: { color: C.emerald }, line: { color: C.emerald }, transparency: 92 });
}

function agendaSlide() {
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Agenda", {
    x: 0.5, y: 0.4, w: 9, h: 0.65,
    fontSize: 32, bold: true, color: C.text, fontFace: "Calibri",
  });

  const items = [
    { n: "01", title: "Problem & Purpose",    sub: "Why this system was built" },
    { n: "02", title: "System Architecture",  sub: "Smart contracts & frontend design" },
    { n: "03", title: "Core Features",        sub: "Buy, Sell, Transfer, Admin panel" },
    { n: "04", title: "Technology Stack",     sub: "Solidity, Hardhat, React, ethers.js" },
    { n: "05", title: "Live Demo",            sub: "Deployed on Sepolia testnet" },
    { n: "06", title: "Security & Standards", sub: "ERC-20, CEI, ReentrancyGuard, OpenZeppelin" },
  ];

  const cols = [[0, 1, 2], [3, 4, 5]];
  cols.forEach((group, ci) => {
    group.forEach((idx, ri) => {
      const it = items[idx];
      const x = 0.5 + ci * 4.8;
      const y = 1.3 + ri * 1.25;
      s.addShape(pres.ShapeType.rect, { x, y, w: 4.4, h: 1.05, fill: { color: C.lgray }, line: { color: "E5E7EB" }, rectRadius: 0.08 });
      s.addText(it.n, { x: x + 0.18, y: y + 0.15, w: 0.5, h: 0.38, fontSize: 13, bold: true, color: C.emerald, fontFace: "Calibri" });
      s.addText(it.title, { x: x + 0.68, y: y + 0.1, w: 3.5, h: 0.38, fontSize: 14, bold: true, color: C.text, fontFace: "Calibri" });
      s.addText(it.sub, { x: x + 0.68, y: y + 0.52, w: 3.5, h: 0.38, fontSize: 11, color: C.gray, fontFace: "Calibri" });
    });
  });
}

function purposeSlide() {
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Problem & Purpose", {
    x: 0.5, y: 0.35, w: 9, h: 0.6,
    fontSize: 30, bold: true, color: C.text, fontFace: "Calibri",
  });

  // Left: problem
  s.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.15, w: 4.3, h: 3.9, fill: { color: "FEF2F2" }, line: { color: "FECACA" }, rectRadius: 0.1 });
  s.addText("The Problem", { x: 0.7, y: 1.35, w: 3.9, h: 0.4, fontSize: 14, bold: true, color: "B91C1C", fontFace: "Calibri" });
  const problems = [
    "Traditional loyalty programs rely on centralized databases",
    "Points can be lost, expired, or arbitrarily changed",
    "No transparency — users can't verify balances independently",
    "Requires trust in a single company to honor rewards",
  ];
  problems.forEach((p, i) => {
    s.addShape(pres.ShapeType.ellipse, { x: 0.75, y: 1.95 + i * 0.72, w: 0.18, h: 0.18, fill: { color: "B91C1C" }, line: { color: "B91C1C" } });
    s.addText(p, { x: 1.05, y: 1.88 + i * 0.72, w: 3.5, h: 0.58, fontSize: 11.5, color: C.text, fontFace: "Calibri", valign: "middle" });
  });

  // Right: solution
  s.addShape(pres.ShapeType.rect, { x: 5.2, y: 1.15, w: 4.3, h: 3.9, fill: { color: C.light }, line: { color: "A7F3D0" }, rectRadius: 0.1 });
  s.addText("Our Solution", { x: 5.4, y: 1.35, w: 3.9, h: 0.4, fontSize: 14, bold: true, color: C.emerald, fontFace: "Calibri" });
  const solutions = [
    "ERC-20 token on Ethereum — immutable and transparent",
    "Smart contract enforces all rules automatically",
    "Anyone can verify balances on Etherscan",
    "Owner-controlled rates, no third-party dependency",
  ];
  solutions.forEach((p, i) => {
    s.addShape(pres.ShapeType.ellipse, { x: 5.45, y: 1.95 + i * 0.72, w: 0.18, h: 0.18, fill: { color: C.emerald }, line: { color: C.emerald } });
    s.addText(p, { x: 5.75, y: 1.88 + i * 0.72, w: 3.5, h: 0.58, fontSize: 11.5, color: C.text, fontFace: "Calibri", valign: "middle" });
  });
}

function architectureSlide() {
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("System Architecture", {
    x: 0.5, y: 0.35, w: 9, h: 0.6,
    fontSize: 30, bold: true, color: C.text, fontFace: "Calibri",
  });

  // Three layers
  const layers = [
    { label: "Frontend (React)", color: "EFF6FF", border: "BFDBFE", tc: "1D4ED8",
      items: ["React + Vite + Tailwind CSS", "useWallet hook — state management", "MetaMask wallet integration", "Real-time balance updates"] },
    { label: "Blockchain Layer", color: C.light, border: "A7F3D0", tc: C.emerald,
      items: ["GymCoin.sol — ERC-20 token", "UserProfile.sol — on-chain identity", "OpenZeppelin libraries", "Sepolia testnet"] },
    { label: "Infrastructure", color: "FFF7ED", border: "FED7AA", tc: "C2410C",
      items: ["Hardhat — compile & deploy", "ethers.js v6 — contract calls", "Alchemy RPC endpoint", "Etherscan block explorer"] },
  ];

  layers.forEach((l, i) => {
    const x = 0.4 + i * 3.15;
    s.addShape(pres.ShapeType.rect, { x, y: 1.1, w: 2.9, h: 4.1, fill: { color: l.color }, line: { color: l.border }, rectRadius: 0.1 });
    s.addText(l.label, { x: x + 0.1, y: 1.25, w: 2.7, h: 0.45, fontSize: 13, bold: true, color: l.tc, fontFace: "Calibri", align: "center" });
    l.items.forEach((item, j) => {
      s.addShape(pres.ShapeType.rect, { x: x + 0.15, y: 1.88 + j * 0.77, w: 2.6, h: 0.62, fill: { color: C.white }, line: { color: l.border }, rectRadius: 0.06 });
      s.addText(item, { x: x + 0.22, y: 1.88 + j * 0.77, w: 2.46, h: 0.62, fontSize: 10.5, color: C.text, fontFace: "Calibri", valign: "middle" });
    });

    // Arrow between layers
    if (i < 2) {
      s.addShape(pres.ShapeType.rect, { x: x + 2.92, y: 2.9, w: 0.22, h: 0.04, fill: { color: C.muted }, line: { color: C.muted } });
    }
  });

  s.addText("↔ ethers.js calls   ↔ JSON-RPC   ↔ Hardhat deploy", {
    x: 0.5, y: 5.25, w: 9, h: 0.25,
    fontSize: 10, color: C.muted, fontFace: "Calibri", align: "center",
  });
}

function featuresSlide() {
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Core Features", {
    x: 0.5, y: 0.35, w: 9, h: 0.6,
    fontSize: 30, bold: true, color: C.text, fontFace: "Calibri",
  });

  const features = [
    { title: "Buy GC Tokens",    color: "EFF6FF", bc: "BFDBFE", tc: "1D4ED8",
      points: ["Pay ETH, receive GC at fixed buy rate", "Max buy limit enforced on-chain", "Instant MetaMask transaction"] },
    { title: "Sell GC Tokens",   color: C.light,  bc: "A7F3D0", tc: C.emerald,
      points: ["Burn GC, receive ETH at sell rate", "Max sell limit enforced on-chain", "ReentrancyGuard protection"] },
    { title: "Transfer GC",      color: "FFF7ED", bc: "FED7AA", tc: "C2410C",
      points: ["Send GC to any address", "Standard ERC-20 transfer", "Full transaction history"] },
    { title: "User Profile",     color: "F5F3FF", bc: "DDD6FE", tc: "6D28D9",
      points: ["On-chain username & email", "UserProfile.sol contract", "Register once, update anytime"] },
    { title: "Admin Panel",      color: "FFF1F2", bc: "FECDD3", tc: "BE123C",
      points: ["Set buy/sell rates", "Set max buy/sell limits", "Fund & withdraw ETH"] },
    { title: "Dashboard & Stats",color: C.lgray,  bc: "E5E7EB", tc: C.text,
      points: ["Live GC & ETH balances", "Transaction history log", "Leaderboard & market rates"] },
  ];

  const cols = 3;
  features.forEach((f, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 0.4 + col * 3.15;
    const y = 1.1 + row * 2.15;
    s.addShape(pres.ShapeType.rect, { x, y, w: 2.9, h: 1.95, fill: { color: f.color }, line: { color: f.bc }, rectRadius: 0.1 });
    s.addText(f.title, { x: x + 0.15, y: y + 0.1, w: 2.6, h: 0.38, fontSize: 13, bold: true, color: f.tc, fontFace: "Calibri" });
    f.points.forEach((p, j) => {
      s.addText("• " + p, { x: x + 0.15, y: y + 0.54 + j * 0.42, w: 2.62, h: 0.38, fontSize: 10.5, color: C.text, fontFace: "Calibri" });
    });
  });
}

function contractsSlide() {
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addText("Smart Contract Design", {
    x: 0.5, y: 0.35, w: 9, h: 0.6,
    fontSize: 30, bold: true, color: C.white, fontFace: "Calibri",
  });

  // GymCoin box
  s.addShape(pres.ShapeType.rect, { x: 0.4, y: 1.1, w: 4.5, h: 4.15, fill: { color: "0F2D1E" }, line: { color: C.emerald }, rectRadius: 0.1 });
  s.addText("GymCoin.sol", { x: 0.6, y: 1.25, w: 4.1, h: 0.4, fontSize: 15, bold: true, color: C.accent, fontFace: "Calibri" });
  s.addText("ERC20  ·  ReentrancyGuard", { x: 0.6, y: 1.65, w: 4.1, h: 0.3, fontSize: 10, color: C.muted, fontFace: "Calibri", italic: true });

  const gcItems = [
    { label: "constructor()", detail: "initialSupply, sellRate, buyRate, maxBuy, maxSell" },
    { label: "buy(gcAmount)", detail: "payable — sends ETH, receives GC tokens" },
    { label: "sell(gcAmount)", detail: "burns GC, sends ETH back (CEI pattern)" },
    { label: "setRates()", detail: "owner only — update buy/sell ETH rates" },
    { label: "setLimits()", detail: "owner only — max buy/sell per transaction" },
    { label: "withdraw()", detail: "owner only — pull all ETH from contract" },
  ];
  gcItems.forEach((it, i) => {
    s.addText(it.label, { x: 0.6, y: 2.1 + i * 0.49, w: 1.65, h: 0.38, fontSize: 10.5, bold: true, color: C.accent, fontFace: "Consolas" });
    s.addText(it.detail, { x: 2.28, y: 2.1 + i * 0.49, w: 2.45, h: 0.38, fontSize: 10, color: C.muted, fontFace: "Calibri", valign: "middle" });
  });

  // UserProfile box
  s.addShape(pres.ShapeType.rect, { x: 5.3, y: 1.1, w: 4.3, h: 4.15, fill: { color: "111827" }, line: { color: "6366F1" }, rectRadius: 0.1 });
  s.addText("UserProfile.sol", { x: 5.5, y: 1.25, w: 3.9, h: 0.4, fontSize: 15, bold: true, color: "A5B4FC", fontFace: "Calibri" });
  s.addText("on-chain identity registry", { x: 5.5, y: 1.65, w: 3.9, h: 0.3, fontSize: 10, color: C.muted, fontFace: "Calibri", italic: true });

  const upItems = [
    { label: "registerUser()", detail: "store username & email first time" },
    { label: "updateUser()",   detail: "change username or email later" },
    { label: "getUserInfo()",  detail: "view — returns username, email, address" },
    { label: "isRegistered()", detail: "view — bool check for any address" },
  ];
  upItems.forEach((it, i) => {
    s.addText(it.label,  { x: 5.5,  y: 2.1 + i * 0.49, w: 1.65, h: 0.38, fontSize: 10.5, bold: true, color: "A5B4FC", fontFace: "Consolas" });
    s.addText(it.detail, { x: 7.18, y: 2.1 + i * 0.49, w: 2.25, h: 0.38, fontSize: 10, color: C.muted, fontFace: "Calibri", valign: "middle" });
  });

  s.addText("Events: TokensBought · TokensSold · RatesUpdated · UserRegistered · UserUpdated", {
    x: 0.4, y: 5.3, w: 9.2, h: 0.25,
    fontSize: 9.5, color: C.muted, fontFace: "Calibri", align: "center",
  });
}

function techStackSlide() {
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Technology Stack", {
    x: 0.5, y: 0.35, w: 9, h: 0.6,
    fontSize: 30, bold: true, color: C.text, fontFace: "Calibri",
  });

  const techs = [
    { name: "Solidity 0.8.x",  role: "Smart contract language",            color: "EFF6FF", tc: "1E40AF" },
    { name: "OpenZeppelin",     role: "ERC-20, ReentrancyGuard libraries",  color: C.light,  tc: C.emerald },
    { name: "Hardhat",          role: "Compile, test & deploy framework",   color: "FFF7ED", tc: "C2410C" },
    { name: "ethers.js v6",     role: "Frontend contract interaction",      color: "F5F3FF", tc: "6D28D9" },
    { name: "React + Vite",     role: "Frontend UI framework",              color: "FFF1F2", tc: "BE123C" },
    { name: "Tailwind CSS",     role: "Utility-first styling",              color: "F0FDFA", tc: "0D9488" },
    { name: "MetaMask",         role: "Browser wallet & signer",            color: "FFFBEB", tc: "B45309" },
    { name: "Sepolia Testnet",  role: "Ethereum test network",              color: C.lgray,  tc: C.text   },
  ];

  const cols = 4;
  techs.forEach((t, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 0.35 + col * 2.35;
    const y = 1.15 + row * 1.8;
    s.addShape(pres.ShapeType.rect, { x, y, w: 2.2, h: 1.6, fill: { color: t.color }, line: { color: "E5E7EB" }, rectRadius: 0.1 });
    s.addText(t.name, { x: x + 0.12, y: y + 0.18, w: 1.96, h: 0.5, fontSize: 13, bold: true, color: t.tc, fontFace: "Calibri", align: "center" });
    s.addText(t.role, { x: x + 0.1,  y: y + 0.75, w: 2.0,  h: 0.7, fontSize: 10, color: C.gray, fontFace: "Calibri", align: "center", valign: "top" });
  });
}

function securitySlide() {
  const s = pres.addSlide();
  s.background = { color: C.white };

  s.addText("Security & Standards", {
    x: 0.5, y: 0.35, w: 9, h: 0.6,
    fontSize: 30, bold: true, color: C.text, fontFace: "Calibri",
  });

  const items = [
    {
      title: "ERC-20 Standard",
      color: "EFF6FF", bc: "BFDBFE", tc: "1D4ED8",
      x: 0.4, y: 1.15,
      body: "Full OpenZeppelin ERC-20 implementation. Standard interface ensures compatibility with any wallet, exchange, or DApp that supports ERC-20 tokens.",
    },
    {
      title: "ReentrancyGuard",
      color: C.light, bc: "A7F3D0", tc: C.emerald,
      x: 5.15, y: 1.15,
      body: "Applied to the sell() function — the highest-risk function. Prevents a malicious contract from re-entering sell() before the first call completes.",
    },
    {
      title: "CEI Pattern",
      color: "FFF7ED", bc: "FED7AA", tc: "C2410C",
      x: 0.4, y: 3.05,
      body: "Checks–Effects–Interactions: state is updated before ETH is transferred. Neutralizes reentrancy attacks even without the guard, providing two-layer defense.",
    },
    {
      title: "onlyOwner Modifier",
      color: "F5F3FF", bc: "DDD6FE", tc: "6D28D9",
      x: 5.15, y: 3.05,
      body: "Simple owner address check (msg.sender == owner) guards setRates(), setLimits(), and withdraw(). No unnecessary role complexity.",
    },
  ];

  items.forEach((it) => {
    s.addShape(pres.ShapeType.rect, { x: it.x, y: it.y, w: 4.5, h: 1.75, fill: { color: it.color }, line: { color: it.bc }, rectRadius: 0.1 });
    s.addText(it.title, { x: it.x + 0.18, y: it.y + 0.15, w: 4.14, h: 0.4, fontSize: 14, bold: true, color: it.tc, fontFace: "Calibri" });
    s.addText(it.body,  { x: it.x + 0.18, y: it.y + 0.6,  w: 4.14, h: 1.0, fontSize: 11, color: C.text, fontFace: "Calibri" });
  });
}

function demoSlide() {
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 10, h: 5.625, fill: { color: C.dark }, line: { color: C.dark } });

  s.addText("Live Deployment", {
    x: 0.5, y: 0.4, w: 9, h: 0.65,
    fontSize: 30, bold: true, color: C.white, fontFace: "Calibri",
  });
  s.addText("Sepolia Testnet · Verified on Etherscan", {
    x: 0.5, y: 1.0, w: 9, h: 0.35,
    fontSize: 12, color: C.muted, fontFace: "Calibri", italic: true,
  });

  const contracts = [
    { label: "GymCoin.sol",     addr: "0x22b0a8fa5ECA22EC6D1E82676eB7d4E49A121E58", color: C.accent  },
    { label: "UserProfile.sol", addr: "0xea96e4Da2abd88b566484d75b8602E8Ece2cCF6f", color: "A5B4FC" },
  ];
  contracts.forEach((c, i) => {
    s.addShape(pres.ShapeType.rect, { x: 0.5, y: 1.55 + i * 0.9, w: 9, h: 0.72, fill: { color: "0F1A12" }, line: { color: "1F3A22" }, rectRadius: 0.08 });
    s.addText(c.label, { x: 0.75, y: 1.62 + i * 0.9, w: 2.0, h: 0.38, fontSize: 12, bold: true, color: c.color, fontFace: "Calibri" });
    s.addText(c.addr,  { x: 2.8,  y: 1.62 + i * 0.9, w: 6.5,  h: 0.38, fontSize: 11, color: C.white, fontFace: "Consolas" });
    s.addText("sepolia.etherscan.io", { x: 0.75, y: 1.98 + i * 0.9, w: 8.5, h: 0.22, fontSize: 9, color: C.muted, fontFace: "Calibri" });
  });

  // Stats row
  const stats = [
    { v: "1,000,000", l: "GC Total Supply" },
    { v: "0.0001 ETH", l: "Buy Rate / GC" },
    { v: "0.00005 ETH", l: "Sell Rate / GC" },
    { v: "10,000 GC", l: "Max Buy / tx" },
  ];
  stats.forEach((st, i) => {
    const x = 0.5 + i * 2.28;
    s.addShape(pres.ShapeType.rect, { x, y: 3.7, w: 2.12, h: 1.5, fill: { color: "0F2D1E" }, line: { color: C.emerald }, rectRadius: 0.1 });
    s.addText(st.v, { x, y: 3.82, w: 2.12, h: 0.65, fontSize: 15, bold: true, color: C.accent, fontFace: "Calibri", align: "center" });
    s.addText(st.l, { x, y: 4.47, w: 2.12, h: 0.55, fontSize: 10,  color: C.muted,  fontFace: "Calibri", align: "center" });
  });
}

function closingSlide() {
  const s = pres.addSlide();
  s.background = { color: C.dark };

  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 0.08, h: 5.625, fill: { color: C.emerald } });

  s.addText("Thank You", {
    x: 0.5, y: 1.2, w: 9, h: 1.0,
    fontSize: 52, bold: true, color: C.white, fontFace: "Calibri",
  });
  s.addText("Questions & Discussion", {
    x: 0.5, y: 2.2, w: 9, h: 0.6,
    fontSize: 22, color: C.accent, fontFace: "Calibri", italic: true,
  });

  const summary = [
    "ERC-20 token deployed on Ethereum Sepolia",
    "Full-stack DApp: React + Hardhat + ethers.js",
    "On-chain identity via UserProfile contract",
    "Security: CEI pattern + ReentrancyGuard",
  ];
  summary.forEach((line, i) => {
    s.addText("✓  " + line, {
      x: 0.6, y: 3.1 + i * 0.42,
      w: 8, h: 0.38,
      fontSize: 13, color: C.muted, fontFace: "Calibri",
    });
  });

  s.addShape(pres.ShapeType.ellipse, { x: 8.5, y: 3.8, w: 2.2, h: 2.2, fill: { color: C.emerald }, line: { color: C.emerald }, transparency: 90 });
  s.addShape(pres.ShapeType.ellipse, { x: 8.0, y: 0.1, w: 1.5, h: 1.5, fill: { color: C.emerald }, line: { color: C.emerald }, transparency: 85 });
}

// Build slides
titleSlide();
agendaSlide();
purposeSlide();
architectureSlide();
featuresSlide();
contractsSlide();
techStackSlide();
securitySlide();
demoSlide();
closingSlide();

pres.writeFile({ fileName: "GymCreditToken_Presentation.pptx" }).then(() => {
  console.log("Done: GymCreditToken_Presentation.pptx");
});
