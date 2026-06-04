import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, BellOff, RefreshCw, AlertCircle, BellRing } from "lucide-react";

const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
type PrayerName = (typeof PRAYERS)[number];
const SALAH_PRAYERS: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const METHOD = 3; // Muslim World League

interface PrayerTimesData {
  Fajr: string; Sunrise: string; Dhuhr: string;
  Asr: string; Maghrib: string; Isha: string;
}

export interface LocationProps {
  lat: number;
  lng: number;
  city: string;
}

interface Props {
  location: LocationProps;
}

const PRAYER_ICONS: Record<PrayerName, string> = {
  Fajr: "🌙", Sunrise: "🌅", Dhuhr: "☀️", Asr: "🌤️", Maghrib: "🌇", Isha: "🌃",
};

function timeUntilMs(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.getTime() - Date.now();
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "now";
  const sec = Math.floor(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function getNextPrayer(times: PrayerTimesData): PrayerName | null {
  for (const p of PRAYERS) {
    if (timeUntilMs(times[p]) > 30_000) return p; // at least 30s ahead
  }
  return null;
}

function loadAlarms(): Record<PrayerName, boolean> {
  try {
    const stored = localStorage.getItem("galib-alarms-v2");
    if (stored) return JSON.parse(stored);
  } catch {}
  return { Fajr: false, Sunrise: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false };
}

function saveAlarms(a: Record<PrayerName, boolean>) {
  localStorage.setItem("galib-alarms-v2", JSON.stringify(a));
}

export default function PrayerTimes({ location }: Props) {
  const [times, setTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");

  // Alarm state — always reflects localStorage; never gated by permission
  const [alarms, setAlarms] = useState<Record<PrayerName, boolean>>(loadAlarms);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "denied"
  );

  const [countdown, setCountdown] = useState("");
  const [nextPrayer, setNextPrayer] = useState<PrayerName | null>(null);
  const timerRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // ── Fetch prayer times ──────────────────────────────────────────────────
  const fetchTimes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const ts = Math.floor(Date.now() / 1000);
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${ts}?latitude=${location.lat}&longitude=${location.lng}&method=${METHOD}`
      );
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      setTimes(json.data.timings as PrayerTimesData);
      setDate(json.data.date.readable);
    } catch {
      setError("Could not load prayer times. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, [location.lat, location.lng]);

  useEffect(() => {
    fetchTimes();
    // Auto-refresh at midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 1, 0, 0);
    const id = setTimeout(fetchTimes, midnight.getTime() - now.getTime());
    return () => clearTimeout(id);
  }, [fetchTimes]);

  // ── Countdown tick ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!times) return;
    const tick = () => {
      const next = getNextPrayer(times);
      setNextPrayer(next);
      setCountdown(next ? formatCountdown(timeUntilMs(times[next])) : "");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [times]);

  // ── Schedule browser notifications ─────────────────────────────────────
  useEffect(() => {
    if (!times) return;
    Object.values(timerRefs.current).forEach(clearTimeout);
    timerRefs.current = {};

    SALAH_PRAYERS.forEach((prayer) => {
      if (!alarms[prayer]) return;
      const ms = timeUntilMs(times[prayer]);
      if (ms <= 0) return;
      timerRefs.current[prayer] = setTimeout(() => {
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(`🕌 ${prayer} — Time to pray`, {
            body: `${prayer} is at ${times[prayer]}. May your prayer be accepted.`,
            icon: "/icon.svg",
            tag: prayer,
            silent: false,
          });
        }
        // Title flash fallback (works even without notification permission)
        const orig = document.title;
        let i = 0;
        const flash = setInterval(() => {
          document.title = i++ % 2 === 0 ? `🕌 ${prayer} time!` : orig;
          if (i > 12) { clearInterval(flash); document.title = orig; }
        }, 500);
      }, ms);
    });

    return () => Object.values(timerRefs.current).forEach(clearTimeout);
  }, [times, alarms]);

  // ── Alarm toggle — ALWAYS saves state, requests permission as side effect ──
  const toggleAlarm = (prayer: PrayerName) => {
    const willBeOn = !alarms[prayer];
    setAlarms((prev) => {
      const next = { ...prev, [prayer]: willBeOn };
      saveAlarms(next);
      return next;
    });
    // Request permission as a side effect — doesn't block the toggle
    if (willBeOn && typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().then((p) => setNotifPerm(p));
    }
  };

  const allAlarmsOn = SALAH_PRAYERS.every((p) => alarms[p]);
  const toggleAll = () => {
    const willBeOn = !allAlarmsOn;
    setAlarms((prev) => {
      const next = { ...prev };
      SALAH_PRAYERS.forEach((p) => { next[p] = willBeOn; });
      saveAlarms(next);
      return next;
    });
    if (willBeOn && typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().then((p) => setNotifPerm(p));
    }
  };

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    const p = await Notification.requestPermission();
    setNotifPerm(p);
  };

  // ── Render ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
      <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      <p className="text-sm">Loading prayer times…</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-6 space-y-3">
      <AlertCircle className="w-9 h-9 text-destructive mx-auto" />
      <p className="text-sm text-destructive">{error}</p>
      <button onClick={fetchTimes} className="text-sm text-primary underline inline-flex items-center gap-1.5">
        <RefreshCw className="w-3.5 h-3.5" /> Retry
      </button>
    </div>
  );

  if (!times) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs text-primary font-medium">{location.city}</p>
          <p className="text-sm font-medium text-foreground">{date}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            data-testid="button-toggle-all-alarms"
            onClick={toggleAll}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              allAlarmsOn
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {allAlarmsOn ? "🔔 All on" : "🔕 All off"}
          </button>
          <button onClick={fetchTimes} className="p-1.5 rounded-full hover:bg-muted transition-colors" title="Refresh">
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Next prayer banner */}
      {nextPrayer && (
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{PRAYER_ICONS[nextPrayer]}</span>
            <div>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Next prayer</p>
              <p className="font-semibold text-foreground">{nextPrayer} — {times[nextPrayer]}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">In</p>
            <p className="font-mono font-bold text-primary text-xl tabular-nums leading-none">{countdown}</p>
          </div>
        </div>
      )}

      {/* Prayer list */}
      <div className="space-y-1.5">
        {PRAYERS.map((prayer) => {
          const ms = timeUntilMs(times[prayer]);
          const isPast = ms < 0;
          const isNext = prayer === nextPrayer;
          const isSalah = SALAH_PRAYERS.includes(prayer);
          const alarmOn = alarms[prayer];

          return (
            <div
              key={prayer}
              data-testid={`row-prayer-${prayer}`}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                isNext
                  ? "bg-primary/5 border-primary/40 shadow-sm"
                  : isPast
                  ? "bg-muted/30 border-transparent opacity-50"
                  : "bg-card border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg w-7 text-center">{PRAYER_ICONS[prayer]}</span>
                <span className={`font-medium ${isPast ? "text-muted-foreground" : isNext ? "text-foreground font-semibold" : "text-foreground"}`}>
                  {prayer}
                </span>
                {!isSalah && (
                  <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full font-medium">no alarm</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-mono text-sm tabular-nums ${isPast ? "text-muted-foreground" : "text-foreground font-semibold"}`}>
                  {times[prayer]}
                </span>
                {isSalah && (
                  <button
                    data-testid={`button-alarm-${prayer}`}
                    onClick={() => toggleAlarm(prayer)}
                    title={alarmOn ? "Alarm ON — tap to turn off" : "Alarm OFF — tap to turn on"}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      alarmOn
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    {alarmOn
                      ? <BellRing className="w-3.5 h-3.5" />
                      : <BellOff className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notification permission banner */}
      {SALAH_PRAYERS.some((p) => alarms[p]) && notifPerm !== "granted" && (
        <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm ${
          notifPerm === "denied"
            ? "bg-red-50 border-red-200 text-red-700"
            : "bg-amber-50 border-amber-200 text-amber-700"
        }`}>
          <Bell className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            {notifPerm === "denied" ? (
              <>
                <p className="font-medium text-xs">Notifications blocked by browser</p>
                <p className="text-xs mt-0.5 opacity-80">Go to browser Settings → Site Settings → Notifications → allow this site. Then reload.</p>
              </>
            ) : (
              <>
                <p className="font-medium text-xs">Allow notifications so alarms actually fire</p>
                <button onClick={requestPermission} className="text-xs underline font-semibold mt-0.5">
                  Tap here to allow notifications →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground/50 text-center pt-1">
        Muslim World League method · Updates daily · Alarms fire on-screen even without notification permission
      </p>
    </div>
  );
}
