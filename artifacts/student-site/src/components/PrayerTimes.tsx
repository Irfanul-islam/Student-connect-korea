import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, BellOff, RefreshCw, AlertCircle } from "lucide-react";

const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
type PrayerName = (typeof PRAYERS)[number];

// Ansan-si, Gyeonggi-do, South Korea
const LAT = 37.3219;
const LNG = 126.8309;
const METHOD = 3; // Muslim World League

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

function parseTime(timeStr: string): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function timeUntil(timeStr: string): number {
  return parseTime(timeStr).getTime() - Date.now();
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "now";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function getNextPrayer(times: PrayerTimes): PrayerName | null {
  const ordered: PrayerName[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
  for (const p of ordered) {
    if (timeUntil(times[p]) > 0) return p;
  }
  return null;
}

const PRAYER_ICONS: Record<PrayerName, string> = {
  Fajr: "🌙",
  Sunrise: "🌅",
  Dhuhr: "☀️",
  Asr: "🌤️",
  Maghrib: "🌇",
  Isha: "🌃",
};

const SALAH_PRAYERS: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export default function PrayerTimes() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const [alarms, setAlarms] = useState<Record<PrayerName, boolean>>(() => {
    try {
      const stored = localStorage.getItem("galib-alarms");
      if (stored) return JSON.parse(stored);
    } catch {}
    return { Fajr: false, Sunrise: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false };
  });
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");
  const [countdown, setCountdown] = useState("");
  const [nextPrayer, setNextPrayer] = useState<PrayerName | null>(null);
  const alarmTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const fetchTimes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const ts = Math.floor(Date.now() / 1000);
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${ts}?latitude=${LAT}&longitude=${LNG}&method=${METHOD}`
      );
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      const t = json.data.timings as PrayerTimes;
      setTimes(t);
      setDate(json.data.date.readable);
    } catch {
      setError("Could not load prayer times. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimes();
    setNotifPermission(Notification.permission);

    // Auto-refresh at midnight
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 1, 0, 0);
    const msToMidnight = midnight.getTime() - now.getTime();
    const timer = setTimeout(fetchTimes, msToMidnight);
    return () => clearTimeout(timer);
  }, [fetchTimes]);

  // Countdown tick
  useEffect(() => {
    if (!times) return;
    const tick = () => {
      const next = getNextPrayer(times);
      setNextPrayer(next);
      if (next) {
        const ms = timeUntil(times[next]);
        setCountdown(formatCountdown(ms));
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [times]);

  // Schedule alarms
  useEffect(() => {
    if (!times) return;
    // Clear existing
    Object.values(alarmTimers.current).forEach(clearTimeout);
    alarmTimers.current = {};

    SALAH_PRAYERS.forEach((prayer) => {
      if (!alarms[prayer]) return;
      const ms = timeUntil(times[prayer]);
      if (ms <= 0) return;
      alarmTimers.current[prayer] = setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(`Prayer Time: ${prayer}`, {
            body: `It's time for ${prayer} — ${times[prayer]}`,
            icon: "/icon.svg",
            tag: prayer,
            silent: false,
          });
        } else {
          // Fallback: page title flash
          const orig = document.title;
          let count = 0;
          const flash = setInterval(() => {
            document.title = count % 2 === 0 ? `🕌 ${prayer} time!` : orig;
            if (++count > 10) { clearInterval(flash); document.title = orig; }
          }, 600);
        }
      }, ms);
    });

    return () => Object.values(alarmTimers.current).forEach(clearTimeout);
  }, [times, alarms]);

  const toggleAlarm = async (prayer: PrayerName) => {
    if (!alarms[prayer] && Notification.permission !== "granted") {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
      if (perm !== "granted") {
        alert("Please allow notifications in your browser to use prayer alarms.");
        return;
      }
    }
    setAlarms((prev) => {
      const next = { ...prev, [prayer]: !prev[prayer] };
      localStorage.setItem("galib-alarms", JSON.stringify(next));
      return next;
    });
  };

  const allAlarmsOn = SALAH_PRAYERS.every((p) => alarms[p]);

  const toggleAll = async () => {
    if (!allAlarmsOn && Notification.permission !== "granted") {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
      if (perm !== "granted") return;
    }
    setAlarms((prev) => {
      const next = { ...prev };
      SALAH_PRAYERS.forEach((p) => { next[p] = !allAlarmsOn; });
      localStorage.setItem("galib-alarms", JSON.stringify(next));
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
        <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <p className="text-sm">Loading prayer times…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 space-y-3">
        <AlertCircle className="w-9 h-9 text-destructive mx-auto" />
        <p className="text-sm text-destructive">{error}</p>
        <button onClick={fetchTimes} className="text-sm text-primary underline inline-flex items-center gap-1">
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    );
  }

  if (!times) return null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Ansan-si, Gyeonggi-do</p>
          <p className="text-sm font-medium text-foreground">{date}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            data-testid="button-toggle-all-alarms"
            onClick={toggleAll}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              allAlarmsOn
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {allAlarmsOn ? "All alarms on" : "All alarms off"}
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
              <p className="text-xs text-primary font-semibold uppercase tracking-wide">Next prayer</p>
              <p className="font-semibold text-foreground">{nextPrayer} — {times[nextPrayer]}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">in</p>
            <p className="font-mono font-bold text-primary text-lg tabular-nums">{countdown}</p>
          </div>
        </div>
      )}

      {/* Prayer list */}
      <div className="space-y-1.5">
        {PRAYERS.map((prayer) => {
          const isPast = timeUntil(times[prayer]) < 0;
          const isNext = prayer === nextPrayer;
          const isSalah = SALAH_PRAYERS.includes(prayer);

          return (
            <div
              key={prayer}
              data-testid={`row-prayer-${prayer}`}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                isNext
                  ? "bg-primary/5 border-primary/30"
                  : isPast
                  ? "bg-muted/30 border-transparent opacity-60"
                  : "bg-card border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg w-7 text-center">{PRAYER_ICONS[prayer]}</span>
                <span className={`font-medium ${isPast ? "text-muted-foreground" : "text-foreground"}`}>
                  {prayer}
                </span>
                {!isSalah && (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">not salah</span>
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
                    title={alarms[prayer] ? "Alarm on — click to turn off" : "Alarm off — click to turn on"}
                    className={`p-1.5 rounded-full transition-colors ${
                      alarms[prayer]
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {alarms[prayer] ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Notification permission hint */}
      {notifPermission !== "granted" && SALAH_PRAYERS.some((p) => alarms[p]) && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Notifications are blocked. Allow them in your browser settings to receive prayer alarms.
        </p>
      )}

      <p className="text-xs text-muted-foreground/60 text-center">
        Times calculated via Aladhan API · Muslim World League method · Updates daily
      </p>
    </div>
  );
}
