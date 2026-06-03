import { useState, useEffect, useCallback } from "react";
import { RefreshCw, ArrowLeftRight, TrendingUp } from "lucide-react";

const PRESETS_KRW = [1000, 5000, 10000, 50000, 100000];

export default function CurrencyConverter() {
  const [rate, setRate] = useState<number | null>(null);
  const [rateDate, setRateDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [krw, setKrw] = useState("10000");
  const [bdt, setBdt] = useState("");
  const [lastEdited, setLastEdited] = useState<"krw" | "bdt">("krw");

  const fetchRate = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json"
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      const r = data.krw?.bdt as number | undefined;
      if (!r) throw new Error();
      setRate(r);
      setRateDate(data.date ?? "");
    } catch {
      // Fallback rate (approximate, updated manually)
      setRate(0.082);
      setRateDate("offline estimate");
      setError("Live rate unavailable — using approximate rate.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  // Compute output when rate or input changes
  useEffect(() => {
    if (!rate) return;
    if (lastEdited === "krw") {
      const n = parseFloat(krw.replace(/,/g, ""));
      setBdt(isNaN(n) ? "" : (n * rate).toFixed(2));
    } else {
      const n = parseFloat(bdt.replace(/,/g, ""));
      setKrw(isNaN(n) ? "" : Math.round(n / rate).toString());
    }
  }, [rate, krw, bdt, lastEdited]);

  const handleKrwChange = (v: string) => {
    setLastEdited("krw");
    setKrw(v.replace(/[^0-9.]/g, ""));
  };
  const handleBdtChange = (v: string) => {
    setLastEdited("bdt");
    setBdt(v.replace(/[^0-9.]/g, ""));
  };

  const swap = () => {
    setLastEdited((p) => (p === "krw" ? "bdt" : "krw"));
    setKrw(bdt);
    setBdt(krw);
  };

  const formatNum = (v: string) => {
    const n = parseFloat(v.replace(/,/g, ""));
    if (isNaN(n)) return "";
    return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-5">
      {/* Rate header */}
      <div className="flex items-center justify-between">
        <div>
          {loading ? (
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          ) : (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                1 KRW = <span className="text-primary">{rate?.toFixed(5)}</span> BDT
              </p>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">Updated: {rateDate || "—"}</p>
        </div>
        <button
          data-testid="button-refresh-rate"
          onClick={fetchRate}
          disabled={loading}
          className="p-2 rounded-full hover:bg-muted transition-colors disabled:opacity-50"
          title="Refresh rate"
        >
          <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Inputs */}
      <div className="space-y-3">
        <div className="relative">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
            Korean Won (KRW ₩)
          </label>
          <div className="flex items-center border border-border rounded-xl bg-card overflow-hidden focus-within:ring-2 focus-within:ring-primary/30">
            <span className="pl-4 text-muted-foreground font-medium">₩</span>
            <input
              data-testid="input-krw"
              type="number"
              inputMode="decimal"
              value={krw}
              onChange={(e) => handleKrwChange(e.target.value)}
              className="flex-1 px-3 py-3 bg-transparent text-foreground font-semibold text-lg focus:outline-none"
              placeholder="0"
            />
          </div>
          {krw && !isNaN(parseFloat(krw)) && (
            <p className="text-xs text-muted-foreground mt-1 pl-1">{formatNum(krw)} KRW</p>
          )}
        </div>

        <button
          data-testid="button-swap-currency"
          onClick={swap}
          className="flex items-center gap-2 text-xs text-primary font-medium mx-auto hover:opacity-80 transition-opacity"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Swap
        </button>

        <div className="relative">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
            Bangladeshi Taka (BDT ৳)
          </label>
          <div className="flex items-center border border-border rounded-xl bg-card overflow-hidden focus-within:ring-2 focus-within:ring-primary/30">
            <span className="pl-4 text-muted-foreground font-medium">৳</span>
            <input
              data-testid="input-bdt"
              type="number"
              inputMode="decimal"
              value={bdt}
              onChange={(e) => handleBdtChange(e.target.value)}
              className="flex-1 px-3 py-3 bg-transparent text-foreground font-semibold text-lg focus:outline-none"
              placeholder="0"
            />
          </div>
          {bdt && !isNaN(parseFloat(bdt)) && (
            <p className="text-xs text-muted-foreground mt-1 pl-1">{formatNum(bdt)} BDT</p>
          )}
        </div>
      </div>

      {/* Quick presets */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Quick convert</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS_KRW.map((v) => (
            <button
              key={v}
              data-testid={`button-preset-${v}`}
              onClick={() => { setLastEdited("krw"); setKrw(v.toString()); }}
              className="px-3 py-1.5 rounded-full border border-border bg-muted/50 text-xs font-medium hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors"
            >
              ₩{v.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Result box */}
      {rate && krw && bdt && !isNaN(parseFloat(krw)) && !isNaN(parseFloat(bdt)) && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl px-5 py-4 text-center">
          <p className="text-2xl font-bold text-primary">
            ₩{formatNum(krw)} = ৳{formatNum(bdt)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Rate: 1 KRW ≈ {rate.toFixed(4)} BDT · {rateDate}
          </p>
        </div>
      )}
    </div>
  );
}
