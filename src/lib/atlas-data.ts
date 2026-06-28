export const agents = [
  {
    id: "sentinel",
    name: "Sentinel",
    role: "Risk Agent",
    status: "active",
    description: "Monitors liquidation thresholds across every position. Auto-rebalances collateral before health factor drops below 1.15.",
    metric: "0 liquidations · 312 saves",
    accent: "from-cyan-400 to-sky-500",
  },
  {
    id: "harvester",
    name: "Harvester",
    role: "Yield Agent",
    status: "active",
    description: "Discovers and migrates capital across HashKey DeFi pools using risk-adjusted APY scoring.",
    metric: "+18.4% net APY",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    id: "router",
    name: "Router",
    role: "Bridge & Execution Agent",
    status: "active",
    description: "Uses Chainlink CCIP to bridge assets between Ethereum and HashKey Chain with MEV-protected routing.",
    metric: "1,284 routes · $48M volume",
    accent: "from-violet-400 to-fuchsia-500",
  },
  {
    id: "oracle",
    name: "Oracle",
    role: "Research Agent",
    status: "active",
    description: "RAG over governance forums, audits and on-chain telemetry. Produces daily protocol risk briefs.",
    metric: "27 protocols indexed",
    accent: "from-amber-400 to-orange-500",
  },
  {
    id: "consul",
    name: "Consul",
    role: "Governance Agent",
    status: "active",
    description: "Reads proposals, simulates economic impact, votes on behalf of delegated wallets with full audit trail.",
    metric: "94% participation",
    accent: "from-rose-400 to-pink-500",
  },
  {
    id: "ledger",
    name: "Ledger",
    role: "Treasury Agent",
    status: "active",
    description: "Manages DAO treasuries — diversification, hedging, payroll streams via HSP rails.",
    metric: "$12.4M AUM",
    accent: "from-indigo-400 to-blue-500",
  },
] as const;

export const portfolioStats = {
  tvl: "$2,847,219.42",
  tvlChange: "+12.4%",
  healthFactor: 2.31,
  netApy: 18.42,
  exposure24h: "+$34,219",
  agentsActive: 6,
};

export const positions = [
  { protocol: "HashSwap V3", asset: "HSK/USDT LP", value: 842000, apy: 24.3, risk: "Low", agent: "Harvester" },
  { protocol: "HashLend", asset: "wBTC Collateral", value: 612000, apy: 4.1, risk: "Low", agent: "Sentinel" },
  { protocol: "Atlas Vault α", asset: "Delta-neutral ETH", value: 487000, apy: 19.8, risk: "Medium", agent: "Harvester" },
  { protocol: "HSP Treasury", asset: "USDC stream", value: 312000, apy: 7.9, risk: "Low", agent: "Ledger" },
  { protocol: "CCIP Bridge", asset: "wETH in-flight", value: 218000, apy: 0, risk: "Low", agent: "Router" },
  { protocol: "HashKey Stake", asset: "stHSK", value: 376219, apy: 9.4, risk: "Low", agent: "Sentinel" },
];

export const riskFindings = [
  { severity: "info", title: "HashLend oracle latency normal", detail: "Median 2.1s, p99 4.4s — within thresholds.", time: "2m ago" },
  { severity: "warn", title: "HSK/USDT depth thinning on Bridge B", detail: "Router rerouted 14% of flow to Bridge A via CCIP.", time: "11m ago" },
  { severity: "info", title: "Sentinel topped up wBTC vault", detail: "Added 0.42 wBTC. Health factor 1.42 → 2.18.", time: "27m ago" },
  { severity: "crit", title: "Suspicious governance proposal", detail: "Proposal #84 grants admin to EOA. Consul voted AGAINST and flagged.", time: "1h ago" },
  { severity: "info", title: "Oracle finished risk brief: Atlas Vault α", detail: "Score 87/100. No correlated tail risk detected.", time: "3h ago" },
];

export const activity = [
  { ts: "14:02:11", agent: "Harvester", action: "Migrated $84,200 from HashLend USDC → HashSwap HSK/USDT LP", tx: "0x8a…f12c" },
  { ts: "13:47:02", agent: "Sentinel", action: "Auto top-up: +0.42 wBTC to maintain HF ≥ 2.0", tx: "0x4d…a991" },
  { ts: "13:21:48", agent: "Router", action: "CCIP bridge Ethereum → HashKey: 12.4 wETH", tx: "0x91…02bc" },
  { ts: "12:58:30", agent: "Consul", action: "Voted AGAINST proposal #84 (admin grant)", tx: "0xc1…7f44" },
  { ts: "12:30:00", agent: "Oracle", action: "Published daily risk brief — 27 protocols scored", tx: "ipfs://Qm…" },
  { ts: "12:01:55", agent: "Ledger", action: "Streamed payroll: 14 recipients via HSP", tx: "0x77…be03" },
];

export const proposals = [
  { id: 84, title: "Grant admin role to multisig", status: "Active", agentVote: "Against", confidence: 96, ends: "in 18h" },
  { id: 83, title: "Increase Atlas Vault α cap to $10M", status: "Active", agentVote: "For", confidence: 88, ends: "in 2d" },
  { id: 82, title: "Add stHSK as collateral on HashLend", status: "Passed", agentVote: "For", confidence: 91, ends: "ended" },
  { id: 81, title: "Reduce protocol fee from 0.3% to 0.2%", status: "Failed", agentVote: "Against", confidence: 72, ends: "ended" },
];
