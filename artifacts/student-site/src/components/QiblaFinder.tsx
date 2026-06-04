import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, AlertCircle, RefreshCw, Navigation2 } from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────────────────
const MECCA_LAT = 21.3891;
const MECCA_LNG = 39.8579;

// How aggressively we smooth (per RAF frame at ~60fps)
// 0.12 = ~8 frames to reach target = visually smooth but responsive
const EMA_ALPHA = 0.22;

// Ignore sensor deltas smaller than this (kills stationary jitter)
const DEADZONE_DEG = 0.4;

// ── Helpers ───────────────────────────────────────────────────────────────────
function calcQibla(lat: number, lng: number): number {
  const mLat = (MECCA_LAT * Math.PI) / 180;
  const mLng = (MECCA_LNG * Math.PI) / 180;
  const uLat = (lat * Math.PI) / 180;
  const uLng = (lng * Math.PI) / 180;
  const y = Math.sin(mLng - uLng) * Math.cos(mLat);
  const x =
    Math.cos(uLat) * Math.sin(mLat) -
    Math.sin(uLat) * Math.cos(mLat) * Math.cos(mLng - uLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Normalize a degree delta to [-180, 180] so we always take the shortest path */
function shortPath(delta: number): number {
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  return delta;
}

type Status = "idle" | "loading" | "found" | "error";

// ── Component ─────────────────────────────────────────────────────────────────
export default function QiblaFinder() {
  const [status, setStatus] = useState<Status>("idle");
  const [qibla, setQibla] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [compassActive, setCompassActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ── Animated heading state (set from RAF loop) ────────────────────────────
  const [displayHeading, setDisplayHeading] = useState(0);

  // ── Refs for sensor → smooth animation pipeline ───────────────────────────
  // prevRaw: last raw sensor reading (mod 360), to compute shortest-path delta
  const prevRawRef = useRef<number | null>(null);
  // continuous: unbounded accumulator — avoids 0/360 CSS wrap-around glitch
  const continuousRef = useRef(0);
  // target: latest value the EMA should move towards
  const targetRef = useRef(0);
  // smoothed: current EMA output (unbounded, matches continuousRef's space)
  const smoothedRef = useRef(0);
  // RAF handle
  const rafRef = useRef<number | null>(null);
  // Cleanup for event listeners
  const cleanupRef = useRef<(() => void) | null>(null);
  // Which event source won (absolute vs relative) — prevents double-firing
  const sourceRef = useRef<"absolute" | "relative" | null>(null);

  // ── 60fps EMA smoothing loop ───────────────────────────────────────────────
  useEffect(() => {
    const loop = () => {
      const diff = targetRef.current - smoothedRef.current;
      // Only update state if there's meaningful change to avoid React thrash
      if (Math.abs(diff) > 0.01) {
        smoothedRef.current += diff * EMA_ALPHA;
        setDisplayHeading(smoothedRef.current);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Sensor event handler ───────────────────────────────────────────────────
  const handleOrientation = useCallback(
    (e: DeviceOrientationEvent, sourceType: "absolute" | "relative") => {
      // Once we have an absolute source, ignore all relative events
      if (sourceRef.current === "absolute" && sourceType === "relative") return;
      if (sourceType === "absolute") sourceRef.current = "absolute";

      const ext = e as DeviceOrientationEvent & {
        webkitCompassHeading?: number;
        webkitCompassAccuracy?: number;
      };

      let raw: number | null = null;

      if (ext.webkitCompassHeading != null && ext.webkitCompassHeading >= 0) {
        // iOS: absolute, calibrated — best source
        raw = ext.webkitCompassHeading;
      } else if (e.alpha != null) {
        // Android absolute or relative alpha
        raw = (360 - e.alpha + 360) % 360;
      }

      if (raw == null) return;

      if (prevRawRef.current == null) {
        // First reading — seed everything
        prevRawRef.current = raw;
        continuousRef.current = raw;
        smoothedRef.current = raw;
        targetRef.current = raw;
      } else {
        const delta = shortPath(raw - prevRawRef.current);
        if (Math.abs(delta) >= DEADZONE_DEG) {
          continuousRef.current += delta;
          prevRawRef.current = raw;
          targetRef.current = continuousRef.current;
        }
      }

      setCompassActive(true);
    },
    []
  );

  // ── Start compass sensor ───────────────────────────────────────────────────
  const startCompass = useCallback(async () => {
    // Clean up any previous listeners
    cleanupRef.current?.();
    sourceRef.current = null;

    try {
      // iOS 13+: request DeviceOrientation permission
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<PermissionState>;
      };
      if (typeof DOE.requestPermission === "function") {
        const state = await DOE.requestPermission();
        if (state !== "granted") {
          setErrorMsg(
            "Compass permission denied. Go to Settings → Safari → Motion & Orientation Access and enable it."
          );
          return;
        }
      }

      const absHandler = (e: Event) =>
        handleOrientation(e as DeviceOrientationEvent, "absolute");
      const relHandler = (e: Event) =>
        handleOrientation(e as DeviceOrientationEvent, "relative");

      window.addEventListener("deviceorientationabsolute", absHandler, { passive: true });
      window.addEventListener("deviceorientation", relHandler, { passive: true });

      cleanupRef.current = () => {
        window.removeEventListener("deviceorientationabsolute", absHandler);
        window.removeEventListener("deviceorientation", relHandler);
      };
    } catch {
      setErrorMsg("Could not access the compass sensor.");
    }
  }, [handleOrientation]);

  // Cleanup on unmount
  useEffect(() => () => { cleanupRef.current?.(); }, []);

  // ── Get location ──────────────────────────────────────────────────────────
  const findQibla = useCallback(() => {
    setStatus("loading");
    setErrorMsg("");
    setCompassActive(false);
    prevRawRef.current = null;
    sourceRef.current = null;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setQibla(calcQibla(latitude, longitude));
        setStatus("found");
        await startCompass();
      },
      (err) => {
        setStatus("error");
        setErrorMsg(
          err.code === 1
            ? "Location access denied. Please allow location in your browser settings and try again."
            : "Could not get your location. Check your connection and try again."
        );
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  }, [startCompass]);

  // ── Derived angles for rendering ──────────────────────────────────────────
  // needleAngle: how much to rotate the needle so it points at Mecca
  // We keep both in the continuous space — no modular math = no wrap-around glitch
  const needleAngle = qibla !== null ? qibla - displayHeading : 0;

  // For "facing Qibla" detection, normalise to 0-360
  const normalised = ((needleAngle % 360) + 360) % 360;
  const isNearQibla = normalised < 10 || normalised > 350;

  // Current heading mod 360 for the readable label
  const headingDisplay = ((Math.round(displayHeading) % 360) + 360) % 360;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-6 select-none">

      {/* ── Idle ── */}
      {status === "idle" && (
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-6 max-w-xs leading-relaxed">
            Find the exact Qibla direction from anywhere on Earth using GPS and your device's compass.
          </p>
          <button
            data-testid="button-find-qibla"
            onClick={findQibla}
            className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition shadow-md inline-flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Use My Location
          </button>
        </div>
      )}

      {/* ── Loading ── */}
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4 text-muted-foreground py-8">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm">Getting your location…</p>
        </div>
      )}

      {/* ── Error ── */}
      {status === "error" && (
        <div className="text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
          <p className="text-destructive text-sm max-w-xs leading-relaxed">{errorMsg}</p>
          <button onClick={findQibla} className="text-sm text-primary underline inline-flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Try again
          </button>
        </div>
      )}

      {/* ── Found ── */}
      {status === "found" && qibla !== null && (
        <div className="flex flex-col items-center gap-6 w-full">

          {/* Compass face */}
          <div className="relative" style={{ width: 272, height: 272 }}>

            {/* ── Outer shadow ring ── */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "hsl(var(--card))",
                boxShadow: isNearQibla
                  ? "0 0 0 4px #22c55e40, 0 8px 32px #22c55e30, 0 2px 8px rgba(0,0,0,0.12)"
                  : "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
                transition: "box-shadow 0.6s ease",
                border: "3px solid hsl(var(--border))",
              }}
            />

            {/* ── Degree tick marks (static — they don't rotate) ── */}
            {Array.from({ length: 72 }).map((_, i) => {
              const angle = i * 5;
              const isMajor = angle % 90 === 0;
              const isMed = angle % 30 === 0;
              return (
                <div
                  key={i}
                  className="absolute inset-0 flex justify-center"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div
                    style={{
                      width: isMajor ? 2 : 1,
                      height: isMajor ? 18 : isMed ? 12 : 7,
                      marginTop: 6,
                      borderRadius: 1,
                      background: isMajor
                        ? "hsl(var(--foreground)/0.5)"
                        : isMed
                        ? "hsl(var(--foreground)/0.25)"
                        : "hsl(var(--border))",
                    }}
                  />
                </div>
              );
            })}

            {/* ── Rotating compass ring (N/E/S/W) — rotates opposite to heading ── */}
            {/* No CSS transition here — RAF loop already makes this smooth */}
            <div
              className="absolute inset-0"
              style={{ transform: `rotate(${-displayHeading}deg)` }}
            >
              {(["N", "E", "S", "W"] as const).map((dir, i) => {
                const angleDeg = i * 90;
                const rad = ((angleDeg - 90) * Math.PI) / 180;
                const r = 100;
                const cx = 136, cy = 136;
                return (
                  <span
                    key={dir}
                    className="absolute font-bold leading-none"
                    style={{
                      fontSize: 13,
                      color:
                        dir === "N"
                          ? "#ef4444"
                          : "hsl(var(--muted-foreground))",
                      left: cx + r * Math.cos(rad) - 7,
                      top: cy + r * Math.sin(rad) - 8,
                      // Counter-rotate the label so it stays upright
                      transform: `rotate(${displayHeading}deg)`,
                    }}
                  >
                    {dir}
                  </span>
                );
              })}
            </div>

            {/* ── Qibla needle — no CSS transition, RAF controls this ── */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${needleAngle}deg)` }}
            >
              {/* Full needle group centered at compass center */}
              <div style={{ position: "relative", width: "100%", height: "100%" }}>

                {/* Needle body — top half (points to Qibla) */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translateX(-50%)",
                    width: 8,
                    height: 95,
                    marginTop: -95,
                    borderRadius: "4px 4px 0 0",
                    background: isNearQibla
                      ? "linear-gradient(to top, #16a34a, #22c55e)"
                      : "linear-gradient(to top, hsl(var(--primary)/0.7), hsl(var(--primary)))",
                    transition: "background 0.4s ease",
                  }}
                />

                {/* Arrow tip */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translateX(-50%)",
                    marginTop: -95 - 14,
                    width: 0,
                    height: 0,
                    borderLeft: "9px solid transparent",
                    borderRight: "9px solid transparent",
                    borderBottom: `18px solid ${isNearQibla ? "#22c55e" : "hsl(var(--primary))"}`,
                    transition: "border-bottom-color 0.4s ease",
                  }}
                />

                {/* Kaaba emoji at the very tip */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -100%)",
                    marginTop: -95 - 14 - 22,
                    fontSize: 16,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  🕋
                </div>

                {/* Needle tail — bottom half */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translateX(-50%)",
                    width: 6,
                    height: 60,
                    marginTop: 4,
                    borderRadius: "0 0 3px 3px",
                    background: "hsl(var(--muted-foreground)/0.3)",
                  }}
                />
              </div>
            </div>

            {/* ── Center hub ── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "hsl(var(--card))",
                  border: "3px solid hsl(var(--border))",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "hsl(var(--primary))" }} />
              </div>
            </div>
          </div>

          {/* ── Info panel ── */}
          <div className="w-full grid grid-cols-3 gap-3">
            <div className="bg-muted/60 border border-border rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-0.5">Qibla</p>
              <p className="font-bold text-foreground text-lg leading-none">{Math.round(qibla)}°</p>
              <p className="text-xs text-muted-foreground mt-0.5">from N</p>
            </div>
            <div className="bg-muted/60 border border-border rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-0.5">Heading</p>
              <p className="font-bold text-foreground text-lg leading-none">
                {compassActive ? `${headingDisplay}°` : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">facing</p>
            </div>
            <div className={`border rounded-xl p-3 text-center transition-colors duration-500 ${isNearQibla ? "bg-green-50 border-green-200" : "bg-muted/60 border-border"}`}>
              <p className="text-xs text-muted-foreground mb-0.5">Status</p>
              <p className={`font-bold text-lg leading-none ${isNearQibla ? "text-green-600" : "text-foreground"}`}>
                {isNearQibla ? "✓" : "~"}
              </p>
              <p className={`text-xs mt-0.5 ${isNearQibla ? "text-green-600 font-semibold" : "text-muted-foreground"}`}>
                {isNearQibla ? "On Qibla!" : "Rotate"}
              </p>
            </div>
          </div>

          {/* ── Compass status pill ── */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-colors duration-500 ${
            compassActive
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}>
            <Navigation2 className={`w-3.5 h-3.5 ${compassActive ? "" : "animate-pulse"}`} />
            {compassActive
              ? "Live compass — rotate slowly until 🕋 points up"
              : "Waiting for compass sensor…"}
          </div>

          {/* ── Instruction ── */}
          <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed">
            Hold your phone flat and level. Turn your body until the Kaaba 🕋 arrow points straight up — that is Qibla.
          </p>

          {coords && (
            <p className="text-[10px] text-muted-foreground/50 font-mono">
              {coords.lat.toFixed(4)}°N · {coords.lng.toFixed(4)}°E
            </p>
          )}

          <button
            onClick={() => {
              setStatus("idle");
              setQibla(null);
              setCompassActive(false);
              prevRawRef.current = null;
              cleanupRef.current?.();
            }}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Recalculate
          </button>
        </div>
      )}
    </div>
  );
}
