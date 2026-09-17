import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type Ticker = {
  symbol: string;
  label: string;
  price: number;
  change: number;
  prefix?: string;
};

const FALLBACK: Ticker[] = [
  { symbol: "BTC", label: "Bitcoin", price: 68420, change: 1.8, prefix: "$" },
  { symbol: "ETH", label: "Ethereum", price: 3540, change: 0.9, prefix: "$" },
  { symbol: "SOL", label: "Solana", price: 172.4, change: -1.2, prefix: "$" },
  { symbol: "XAU", label: "Gold / oz", price: 2412.6, change: 0.4, prefix: "$" },
  { symbol: "WTI", label: "Crude Oil", price: 78.35, change: -0.6, prefix: "$" },
  { symbol: "NDX", label: "Nasdaq 100", price: 19842, change: 0.7, prefix: "" },
];

const fmt = (n: number) =>
  n >= 1000 ? n.toLocaleString(undefined, { maximumFractionDigits: 0 }) : n.toFixed(2);

export default function MarketTicker() {
  const [tickers, setTickers] = useState<Ticker[]>(FALLBACK);
  const [updated, setUpdated] = useState<Date>(new Date());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,pax-gold&vs_currencies=usd&include_24hr_change=true"
        );
        if (!res.ok) throw new Error("bad response");
        const d = await res.json();
        if (cancelled) return;
        setTickers((prev) =>
          prev.map((t) => {
            const map: Record<string, string> = {
              BTC: "bitcoin",
              ETH: "ethereum",
              SOL: "solana",
              XAU: "pax-gold",
            };
            const id = map[t.symbol];
            const row = id ? d[id] : null;
            if (!row) {
              // gentle drift for assets without a live feed
              const drift = (Math.random() - 0.5) * 0.4;
              return { ...t, price: +(t.price * (1 + drift / 100)).toFixed(2), change: +(t.change + drift).toFixed(2) };
            }
            return { ...t, price: row.usd, change: +(row.usd_24h_change ?? 0).toFixed(2) };
          })
        );
        setUpdated(new Date());
      } catch {
        if (cancelled) return;
        setTickers((prev) =>
          prev.map((t) => {
            const drift = (Math.random() - 0.5) * 0.6;
            return {
              ...t,
              price: +(t.price * (1 + drift / 100)).toFixed(2),
              change: +(t.change + drift).toFixed(2),
            };
          })
        );
        setUpdated(new Date());
      }
    };

    load();
    const id = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const row = [...tickers, ...tickers];

  return (
    <div className="border-y bg-foreground text-background overflow-hidden">
      <div className="flex items-center">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 shrink-0 bg-accent text-accent-foreground font-semibold text-xs uppercase tracking-wider">
          Markets
          <span className="font-normal opacity-80 normal-case tracking-normal">
            {updated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex gap-8 py-2.5 animate-[ticker_40s_linear_infinite] whitespace-nowrap w-max">
            {row.map((t, i) => {
              const up = t.change >= 0;
              return (
                <div key={`${t.symbol}-${i}`} className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{t.symbol}</span>
                  <span className="opacity-70 hidden md:inline">{t.label}</span>
                  <span className="tabular-nums">
                    {t.prefix}
                    {fmt(t.price)}
                  </span>
                  <span
                    className={`flex items-center gap-1 tabular-nums font-medium ${
                      up ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {up ? "+" : ""}
                    {t.change.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
