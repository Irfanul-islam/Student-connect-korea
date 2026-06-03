import { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Wifi, WifiOff, AlertCircle, RefreshCw } from "lucide-react";

// ── Mecca coordinates ────────────────────────────────────────────────
const MECCA_LAT = 21.3891;
const MECCA_LNG = 39.8579;

function calcQibla(lat: number, lng: number): number {
  const mLat = MECCA_LAT * (Math.PI / 180);
  const mLng = MECCA_LNG * (Math.PI / 180);
  const uLat = lat * (Math.PI / 180);
  const uLng = lng * (Math.PI / 180);
  const y = Math.sin(mLng - uLng) * Math.cos(mLat);
  const x =
    Math.cos(uLat) * Math.sin(mLat) -
    Math.sin(uLat) * Math.cos(mLat) * Math.cos(mLng - uLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// Low-pass filter that correctly handles 0/360 wrap-around
function smoothAngle(prev: number, next: number, alpha = 0.85): number {
  const prevRad = (prev * Math.PI) / 180;
  const nextRad = (next * Math.PI) / 180;
  const sinA = Math.sin(prevRad) * alpha + Math.sin(nextRad) * (1 - alpha);
  const cosA = Math.cos(prevRad) * alpha + Math.cos(nextRad) * (1 - alpha);
  return ((Math.atan2(sinA, cosA) * 180) / Math.PI + 360) % 360;
}

type Status = "idle" | "loading" | "found" | "error";

export default function QiblaFinder() {
  const [status, setStatus] = useState<Status>("idle");
  const [qibla, setQibla] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [compassActive, setCompassActive] = useState(false);
  const [permissionNeeded, setPermissionNeeded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const headingRef = useRef(0);

  // Detect if iOS permission is needed
  useEffect(() => {
    const needsPerm =
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === "function";
    setPermissionNeeded(needsPerm);
  }, []);

  const startCompass = useCallback(async () => {
    try {
      // iOS 13+ requires explicit permission
      if (permissionNeeded) {
        const perm = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (perm !== "granted") {
          setErrorMsg("Compass permission denied. Grant it in Settings → Safari → Motion & Orientation Access.");
          return;
        }
      }

      const handler = (e: DeviceOrientationEvent) => {
        let heading: number | null = null;
        const ext = e as DeviceOrientationEvent & { webkitCompassHeading?: number; webkitCompassAccuracy?: number };

        // Best source: iOS webkitCompassHeading (absolute, calibrated)
        if (ext.webkitCompassHeading != null && ext.webkitCompassHeading >= 0) {
          heading = ext.webkitCompassHeading;
        }
        // Second: absolute event alpha (Android Chrome)
        else if ((e as DeviceOrientationEvent & { absolute?: boolean }).absolute && e.alpha != null) {
          heading = (360 - e.alpha) % 360;
        }
        // Fallback: non-absolute alpha (less accurate)
        else if (e.alpha != null) {
          heading = (360 - e.alpha) % 360;
        }

        if (heading != null) {
          headingRef.current = smoothAngle(headingRef.current, heading);
          setDeviceHeading(headingRef.current);
          setCompassActive(true);
        }
      };

      // Prefer absolute events
      window.addEventListener("deviceorientationabsolute", handler as EventListener, true);
      window.addEventListener("deviceorientation", handler as EventListener, true);

      return () => {
        window.removeEventListener("deviceorientationabsolute", handler as EventListener, true);
        window.removeEventListener("deviceorientation", handler as EventListener, true);
      };
    } catch {
      setErrorMsg("Could not start compass.");
    }
  }, [permissionNeeded]);

  const findQibla = useCallback(() => {
    setStatus("loading");
    setErrorMsg("");
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
            ? "Location access denied. Please allow it in your browser settings."
            : "Could not get your location. Check your connection."
        );
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  }, [startCompass]);

  const needleAngle = qibla !== null ? qibla - deviceHeading : 0;
  const normalised = ((needleAngle % 360) + 360) % 360;
  const isNearQibla = normalised < 8 || normalised > 352;

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {status === "idle" && (
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-5 max-w-xs">
            Find the exact Qibla direction from anywhere on Earth. Uses your GPS + device compass for real-time accuracy.
          </p>
          <button
            data-testid="button-find-qibla"
            onClick={findQibla}
            className="px-7 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition shadow-md inline-flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Use My Location
          </button>
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-col items-center gap-3 text-muted-foreground py-4">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm">Getting your location…</p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
          <p className="text-destructive text-sm max-w-xs">{errorMsg}</p>
          <button onClick={findQibla} className="text-sm text-primary underline inline-flex items-center gap-1">
            <RefreshCw className="w-3.5 h-3.5" /> Try again
          </button>
        </div>
      )}

      {status === "found" && qibla !== null && (
        <div className="flex flex-col items-center gap-5 w-full">
          {/* Compass */}
          <div className="relative w-64 h-64">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full bg-card border-4 border-border shadow-lg overflow-hidden" />

            {/* Degree marks */}
            {Array.from({ length: 72 }).map((_, i) => {
              const angle = i * 5;
              const isMajor = angle % 90 === 0;
              const isMed = angle % 45 === 0;
              return (
                <div
                  key={i}
                  className="absolute inset-0 flex justify-center"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <div
                    className={`mt-1 ${isMajor ? "w-0.5 h-5 bg-foreground/60" : isMed ? "w-px h-3.5 bg-foreground/40" : "w-px h-2 bg-border"}`}
                  />
                </div>
              );
            })}

            {/* Cardinal labels — rotate opposite to deviceHeading so they always show true direction */}
            <div
              className="absolute inset-0 transition-transform duration-300"
              style={{ transform: `rotate(${-deviceHeading}deg)` }}
            >
              {["N", "E", "S", "W"].map((dir, i) => {
                const a = i * 90;
                const rad = ((a - 90) * Math.PI) / 180;
                const r = 95;
                return (
                  <span
                    key={dir}
                    className={`absolute text-xs font-bold ${dir === "N" ? "text-primary" : "text-muted-foreground"}`}
                    style={{
                      left: 128 + r * Math.cos(rad) - 6,
                      top: 128 + r * Math.sin(rad) - 8,
                      transform: `rotate(${deviceHeading}deg)`,
                    }}
                  >
                    {dir}
                  </span>
                );
              })}
            </div>

            {/* Qibla needle — rotates to point toward Mecca */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-200"
              style={{ transform: `rotate(${needleAngle}deg)` }}
            >
              <div className="relative h-full w-full flex flex-col items-center">
                {/* Arrow head */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div
                    className={`w-0 h-0 ${isNearQibla ? "animate-pulse" : ""}`}
                    style={{
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderBottom: `22px solid ${isNearQibla ? "#22c55e" : "hsl(var(--primary))"}`,
                    }}
                  />
                  <div
                    className="w-5 rounded-sm"
                    style={{
                      height: 88,
                      background: `linear-gradient(to bottom, ${isNearQibla ? "#22c55e" : "hsl(var(--primary))"}, hsl(var(--primary)/0.3))`,
                    }}
                  />
                </div>
                {/* Tail */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <div className="w-2 bg-muted-foreground/20 rounded-sm" style={{ height: 55 }} />
                </div>
              </div>
            </div>

            {/* Kaaba icon at tip */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-200"
              style={{ transform: `rotate(${needleAngle}deg)` }}
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2">
                <div className="w-5 h-5 bg-primary rounded-sm flex items-center justify-center" style={{ marginTop: 2 }}>
                  <span className="text-[8px] text-primary-foreground font-bold">🕋</span>
                </div>
              </div>
            </div>

            {/* Center hub */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-5 h-5 rounded-full bg-foreground/10 border-2 border-border flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
            </div>
          </div>

          {/* Reading */}
          <div className="text-center space-y-1">
            <p className={`text-3xl font-bold font-serif ${isNearQibla ? "text-green-600" : "text-foreground"}`}>
              {Math.round(qibla)}°
            </p>
            <p className="text-sm text-muted-foreground">from True North → direction of the Kaaba</p>
            {isNearQibla && (
              <p className="text-sm font-semibold text-green-600 animate-pulse">Facing Qibla!</p>
            )}
          </div>

          {/* Compass status */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${
            compassActive ? "bg-green-50 text-green-700 border border-green-200" : "bg-muted text-muted-foreground border border-border"
          }`}>
            {compassActive ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {compassActive ? "Live compass active — rotate until arrow points up" : "No compass sensor detected — manually rotate to the angle shown"}
          </div>

          {coords && (
            <p className="text-xs text-muted-foreground/60">
              {coords.lat.toFixed(5)}°N, {coords.lng.toFixed(5)}°E
            </p>
          )}

          {permissionNeeded && !compassActive && status === "found" && (
            <button
              data-testid="button-compass-permission"
              onClick={startCompass}
              className="text-xs text-primary underline"
            >
              Enable live compass (iOS)
            </button>
          )}

          <button onClick={() => { setStatus("idle"); setQibla(null); setCompassActive(false); }} className="text-xs text-muted-foreground underline">
            Recalculate
          </button>
        </div>
      )}
    </div>
  );
}
