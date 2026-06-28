// Mock HashKey Chain client. No real RPC — this is a hackathon demo.
// Wallet state is stored under a wallet-only key so it never collides
// with auth/sign-up storage (Supabase uses sb-* keys; we use atlas.wallet.v1).

import { useEffect, useState, useSyncExternalStore } from "react";

export const HASHKEY_CHAIN = {
  name: "HashKey Chain",
  chainId: 177,
  rpc: "https://mainnet.hsk.xyz",
  explorer: "https://explorer.hsk.xyz",
  currency: "HSK",
};

export const CONTRACTS = {
  AtlasVault: "0xA71a5Vau1700000000000000000000000000a71a",
  PolicyManager: "0xP01icy00000000000000000000000000000P01c",
  RiskEngine: "0xR15kEn91ne000000000000000000000000R15ke",
  TradingAgent: "0x7Rad1n9A9ent0000000000000000000000Trad9",
  GovernanceHub: "0x90vernanceHub00000000000000000000090vrn",
  HSPGateway: "0xH5pGatevvay00000000000000000000000H5pgw",
};

const WALLET_KEY = "atlas.wallet.v1";

type Wallet = { address: string; chainId: number; connectedAt: number } | null;

const listeners = new Set<() => void>();
let wallet: Wallet = null;

function read(): Wallet {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    return raw ? (JSON.parse(raw) as Wallet) : null;
  } catch {
    return null;
  }
}
function emit() { listeners.forEach((l) => l()); }
function persist(w: Wallet) {
  wallet = w;
  if (typeof window !== "undefined") {
    if (w) localStorage.setItem(WALLET_KEY, JSON.stringify(w));
    else localStorage.removeItem(WALLET_KEY);
  }
  emit();
}

function randHex(n: number) {
  let s = "0x";
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 16).toString(16);
  return s;
}

export function shortAddr(a?: string | null) {
  if (!a) return "";
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export async function connectWallet(): Promise<Wallet> {
  // Simulated HashKey wallet handshake
  await new Promise((r) => setTimeout(r, 650));
  const w = { address: randHex(40), chainId: HASHKEY_CHAIN.chainId, connectedAt: Date.now() };
  persist(w);
  return w;
}
export function disconnectWallet() { persist(null); }

export function useWallet(): Wallet {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => wallet,
    () => null,
  );
}

// Hydrate from storage on the client
export function useHydrateWallet() {
  useEffect(() => { if (!wallet) { const w = read(); if (w) { wallet = w; emit(); } } }, []);
}

// ---- Tx simulator -----------------------------------------------------------

export type TxStatus = "idle" | "signing" | "pending" | "success" | "error";
export type TxStep = { label: string; ms: number };

export type TxRequest = {
  contract: keyof typeof CONTRACTS;
  method: string;
  args?: Record<string, unknown>;
  steps?: TxStep[];
  value?: string;
};

export type TxResult = {
  hash: string;
  block: number;
  gas: string;
  status: TxStatus;
  contract: string;
  method: string;
  explorer: string;
};

const DEFAULT_STEPS: TxStep[] = [
  { label: "Building calldata", ms: 350 },
  { label: "Requesting signature", ms: 700 },
  { label: "Broadcasting to HashKey Mainnet", ms: 600 },
  { label: "Awaiting confirmation", ms: 1100 },
];

export async function sendTx(
  req: TxRequest,
  onStep?: (i: number, step: TxStep) => void,
): Promise<TxResult> {
  const steps = req.steps ?? DEFAULT_STEPS;
  for (let i = 0; i < steps.length; i++) {
    onStep?.(i, steps[i]);
    await new Promise((r) => setTimeout(r, steps[i].ms));
  }
  const hash = randHex(64);
  const block = 18_422_900 + Math.floor(Math.random() * 1500);
  return {
    hash,
    block,
    gas: (12_000 + Math.floor(Math.random() * 80_000)).toLocaleString(),
    status: "success",
    contract: CONTRACTS[req.contract],
    method: req.method,
    explorer: `${HASHKEY_CHAIN.explorer}/tx/${hash}`,
  };
}

// Lightweight hook for buttons → tx
export function useTx() {
  const [status, setStatus] = useState<TxStatus>("idle");
  const [step, setStep] = useState<{ i: number; label: string } | null>(null);
  const [result, setResult] = useState<TxResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(req: TxRequest) {
    setError(null); setResult(null); setStep(null);
    setStatus("signing");
    try {
      const r = await sendTx(req, (i, s) => {
        setStatus(i === 0 ? "signing" : "pending");
        setStep({ i, label: s.label });
      });
      setResult(r); setStatus("success");
      return r;
    } catch (e) {
      setError((e as Error).message); setStatus("error");
      throw e;
    }
  }
  function reset() { setStatus("idle"); setStep(null); setResult(null); setError(null); }
  return { status, step, result, error, run, reset };
}
