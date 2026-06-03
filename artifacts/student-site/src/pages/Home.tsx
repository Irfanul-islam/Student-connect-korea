import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  MapPin, ExternalLink, Phone, Clock, Star, BookOpen, Globe, Navigation,
  Utensils, ShoppingBag, Search, Compass, ChevronRight, Wifi
} from "lucide-react";

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section id={id} ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger} className={className}>
      {children}
    </motion.section>
  );
}

// ─── Qibla Finder ─────────────────────────────────────────────────────────────
function calcQibla(lat: number, lng: number): number {
  const mLat = 21.3891 * (Math.PI / 180);
  const mLng = 39.8579 * (Math.PI / 180);
  const uLat = lat * (Math.PI / 180);
  const uLng = lng * (Math.PI / 180);
  const y = Math.sin(mLng - uLng) * Math.cos(mLat);
  const x = Math.cos(uLat) * Math.sin(mLat) - Math.sin(uLat) * Math.cos(mLat) * Math.cos(mLng - uLng);
  return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
}

function QiblaFinder() {
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">("idle");
  const [qibla, setQibla] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [compassSupported, setCompassSupported] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const findQibla = useCallback(() => {
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        setQibla(calcQibla(latitude, longitude));
        setStatus("found");
      },
      () => setStatus("error"),
      { timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    type DeviceOrientationEventType = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<string> };
    if (typeof DeviceOrientationEvent !== "undefined") {
      setCompassSupported(true);
      const handler = (e: DeviceOrientationEvent) => {
        const heading = (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ?? (e.alpha ? 360 - e.alpha : 0);
        setDeviceHeading(heading);
      };
      window.addEventListener("deviceorientationabsolute", handler as EventListener, true);
      window.addEventListener("deviceorientation", handler as EventListener, true);
      return () => {
        window.removeEventListener("deviceorientationabsolute", handler as EventListener, true);
        window.removeEventListener("deviceorientation", handler as EventListener, true);
      };
    }
  }, []);

  const needleAngle = qibla !== null ? qibla - deviceHeading : 0;

  return (
    <div className="flex flex-col items-center gap-6">
      {status === "idle" && (
        <div className="text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Find the exact Qibla direction from your current location in Korea.
          </p>
          <button
            data-testid="button-find-qibla"
            onClick={findQibla}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-md inline-flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Use My Location
          </button>
        </div>
      )}

      {status === "loading" && (
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-sm">Getting your location...</p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <p className="text-destructive text-sm mb-3">Could not get your location. Please allow location access.</p>
          <button onClick={findQibla} className="text-sm text-primary underline">Try again</button>
        </div>
      )}

      {status === "found" && qibla !== null && (
        <div className="flex flex-col items-center gap-5">
          {/* Compass */}
          <div className="relative w-56 h-56">
            {/* Compass ring */}
            <div className="absolute inset-0 rounded-full border-4 border-border bg-card shadow-lg">
              {["N", "E", "S", "W"].map((dir, i) => {
                const angle = i * 90;
                const rad = (angle - 90) * (Math.PI / 180);
                const r = 96;
                const cx = 112 + r * Math.cos(rad);
                const cy = 112 + r * Math.sin(rad);
                return (
                  <span key={dir} className="absolute text-xs font-bold text-muted-foreground" style={{ left: cx - 6, top: cy - 8 }}>
                    {dir}
                  </span>
                );
              })}
              {/* Tick marks */}
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = i * 10;
                const rad = (angle - 90) * (Math.PI / 180);
                const r1 = i % 9 === 0 ? 82 : 86;
                const r2 = 90;
                return (
                  <div key={i} className="absolute" style={{ left: 112, top: 112 }}>
                    <div className={`absolute origin-bottom ${i % 9 === 0 ? "bg-muted-foreground" : "bg-border"}`}
                      style={{
                        width: i % 9 === 0 ? 2 : 1,
                        height: r2 - r1,
                        transform: `rotate(${angle}deg) translateX(-50%) translateY(-${r2}px)`,
                      }}
                    />
                  </div>
                );
              })}
              {/* Qibla needle */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
                style={{ transform: `rotate(${needleAngle}deg)` }}
              >
                <div className="relative h-full w-full flex flex-col items-center justify-center">
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-1 h-16 bg-gradient-to-b from-primary to-primary/30 rounded-full" />
                    <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center mt-0.5">
                      <span className="text-primary-foreground text-[8px] font-bold">Q</span>
                    </div>
                  </div>
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                    <div className="w-1 h-10 bg-muted-foreground/30 rounded-full" />
                  </div>
                </div>
              </div>
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-1">
            <p className="text-2xl font-bold font-serif text-foreground">{Math.round(qibla)}°</p>
            <p className="text-sm text-muted-foreground">from North, toward Mecca (Al-Kaaba)</p>
            {coords && (
              <p className="text-xs text-muted-foreground/70">
                Your location: {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
              </p>
            )}
            {!compassSupported && (
              <p className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg mt-2">
                Face north, then rotate {Math.round(qibla)}° clockwise to face the Qibla.
              </p>
            )}
            {compassSupported && (
              <p className="text-xs text-green-600 flex items-center justify-center gap-1 mt-1">
                <Wifi className="w-3 h-3" /> Live compass active — point the needle arrow toward Qibla
              </p>
            )}
          </div>

          <button onClick={() => setStatus("idle")} className="text-xs text-primary underline">
            Recalculate
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const mosques = [
  {
    name: "Ansan Islamic Musalla",
    area: "Wongok-dong, Ansan-si",
    address: "Wongokbon-dong, Danwon-gu, Ansan-si, Gyeonggi-do",
    hours: "Open for Friday prayers and daily salah",
    note: "Prayer space serving the large Muslim community in Ansan's Multicultural Village. Located in the heart of Wongok-dong.",
    mapUrl: "https://maps.google.com/?q=Ansan+Mosque+Wongok+Korea",
    highlight: true,
    distance: "Local",
  },
  {
    name: "Gyeonggi Islamic Center",
    area: "Anyang, Gyeonggi-do",
    address: "Anyang-si, Gyeonggi-do",
    hours: "Friday prayers + daily salah",
    note: "Serves the wider Gyeonggi Province Muslim community. About 30 minutes from Ansan by subway.",
    mapUrl: "https://maps.google.com/?q=Gyeonggi+Islamic+Center+Anyang+Korea",
    highlight: false,
    distance: "~30 min",
  },
  {
    name: "Seoul Central Mosque",
    area: "Itaewon, Seoul",
    address: "39 Usadan-ro 10-gil, Yongsan-gu, Seoul",
    hours: "Open daily — all five prayers",
    note: "Korea's largest and most established mosque. Halal restaurants, Islamic library, and full facilities on-site. About 1 hour from Ansan.",
    mapUrl: "https://maps.google.com/?q=Seoul+Central+Mosque+Itaewon",
    highlight: false,
    distance: "~1 hr",
  },
  {
    name: "Suwon Islamic Center",
    area: "Suwon, Gyeonggi-do",
    address: "Suwon-si, Gyeonggi-do",
    hours: "Friday prayers + daily salah",
    note: "Convenient for students in Suwon and southern Gyeonggi. About 40 minutes from Ansan.",
    mapUrl: "https://maps.google.com/?q=Suwon+Islamic+Center+Korea",
    highlight: false,
    distance: "~40 min",
  },
  {
    name: "Incheon Prayer Room",
    area: "Incheon International Airport",
    address: "Terminal 1 & 2, Incheon International Airport",
    hours: "24 hours",
    note: "Dedicated prayer rooms in both terminals. Wudu facilities available. Essential for arriving and departing Muslim travelers.",
    mapUrl: "https://maps.google.com/?q=Incheon+Airport+Prayer+Room",
    highlight: false,
    distance: "~45 min",
  },
];

const restaurants = [
  {
    name: "Ansan Multicultural Street",
    area: "Wongok-dong, Ansan-si",
    cuisine: "Bangladeshi, Pakistani, Indian, Middle Eastern",
    note: "A whole street of halal eateries near Ansan Station. You will find familiar South Asian dishes, halal kebabs, and Bangladeshi staples right here.",
    mapUrl: "https://maps.google.com/?q=Ansan+Multicultural+Street+Wongokdong",
    certified: true,
    tag: "Walking distance",
  },
  {
    name: "Bangladeshi Restaurants – Wongok-dong",
    area: "Wongok-dong, Ansan-si",
    cuisine: "Bangladeshi / Deshi food",
    note: "Multiple Bangladeshi-run halal restaurants in the Wongok-dong area. Rice, curry, fish, dal — tastes of home within walking distance.",
    mapUrl: "https://maps.google.com/?q=Bangladeshi+restaurant+Ansan+Wongokdong+Korea",
    certified: true,
    tag: "Deshi food",
  },
  {
    name: "Huda Restaurant",
    area: "Itaewon, Seoul",
    cuisine: "Halal Korean",
    note: "One of Korea's oldest halal-certified Korean restaurants. Near Seoul Central Mosque in Itaewon.",
    mapUrl: "https://maps.google.com/?q=Huda+Restaurant+Itaewon+Seoul",
    certified: true,
    tag: "~1 hr away",
  },
  {
    name: "Al-Medina Restaurant",
    area: "Itaewon, Seoul",
    cuisine: "Middle Eastern / Arabic",
    note: "Authentic halal Middle Eastern food in Itaewon. Popular with Muslim expats and students visiting Seoul.",
    mapUrl: "https://maps.google.com/?q=Al+Medina+Restaurant+Itaewon+Seoul",
    certified: true,
    tag: "~1 hr away",
  },
  {
    name: "Makan Restaurant",
    area: "Itaewon, Seoul",
    cuisine: "Malaysian / Southeast Asian Halal",
    note: "KMF-certified Malaysian halal restaurant. Nasi lemak, rendang, and Southeast Asian curries.",
    mapUrl: "https://maps.google.com/?q=Makan+Restaurant+Itaewon+Seoul",
    certified: true,
    tag: "~1 hr away",
  },
];

const groceries = [
  {
    name: "Halal Grocery Shops – Wongok-dong",
    area: "Wongok-dong, Ansan-si",
    note: "Multiple halal grocery shops lining Ansan's Multicultural Street. Fresh halal meat, Bangladeshi spices, rice, lentils, hilsa fish (sometimes), and South Asian pantry staples.",
    mapUrl: "https://maps.google.com/?q=Halal+grocery+Ansan+Wongokdong+Korea",
  },
  {
    name: "Bangladesh Grocery Stores",
    area: "Wongok-dong, Ansan-si",
    note: "Bangladeshi-run stores selling familiar products — turmeric, mustard oil, dried fish, Bangladeshi rice varieties, betel leaf, and even some Bangladeshi snacks.",
    mapUrl: "https://maps.google.com/?q=Bangladesh+grocery+Ansan+Korea",
  },
  {
    name: "Itaewon Halal Butcher & Market",
    area: "Itaewon, Seoul",
    note: "The area around Seoul Central Mosque has halal butchers and grocery stores. Best source for halal-certified meat cuts in Seoul.",
    mapUrl: "https://maps.google.com/?q=Halal+butcher+Itaewon+Seoul",
  },
  {
    name: "H Mart (Korean Grocery)",
    area: "Nationwide",
    note: "Large Korean supermarket chain. Look for products labeled 할랄 (Halal). Not fully halal but useful for vegetables, seafood, and packaged goods.",
    mapUrl: "https://maps.google.com/?q=Hmart+Korea",
  },
];

const deliveryApps = [
  {
    name: "Baemin",
    korean: "배달의민족",
    description: "Korea's top delivery app. Search '할랄' to find halal options. Works well in Ansan.",
    url: "https://www.baemin.com",
    tip: "Ask the restaurant directly via in-app chat to confirm halal status.",
    colorClass: "border-teal-200 bg-teal-50",
  },
  {
    name: "Coupang Eats",
    korean: "쿠팡이츠",
    description: "Fast delivery. Search 할랄 and filter results. Very responsive support.",
    url: "https://www.coupangeats.com",
    tip: "Leave a note: '할랄만 주세요' (Halal only please) in every order.",
    colorClass: "border-red-200 bg-red-50",
  },
  {
    name: "Yogiyo",
    korean: "요기요",
    description: "Good coverage in smaller cities including Ansan. Halal search available.",
    url: "https://www.yogiyo.co.kr",
    tip: "Good fallback when Baemin has limited options in your neighborhood.",
    colorClass: "border-rose-200 bg-rose-50",
  },
  {
    name: "HalalTrip",
    korean: "할랄트립",
    description: "Dedicated Muslim travel app. Find KMF-certified halal restaurants, mosques, and prayer rooms in Korea.",
    url: "https://www.halaltrip.com",
    tip: "Best app for verified halal listings with reviews from the Muslim community.",
    colorClass: "border-green-200 bg-green-50",
  },
];

const phrases = [
  { ko: "할랄 음식 있어요?", en: "Do you have halal food?" },
  { ko: "돼지고기 없이 해주세요", en: "Without pork, please" },
  { ko: "알코올 없이 해주세요", en: "Without alcohol, please" },
  { ko: "닭고기 할랄이에요?", en: "Is the chicken halal?" },
  { ko: "기도실 어디 있어요?", en: "Where is the prayer room?" },
  { ko: "메카 방향이 어디예요?", en: "Which direction is Mecca?" },
];

const tips = [
  { icon: BookOpen, title: "KMF Halal List", body: "The Korea Muslim Federation (kmf.or.kr) publishes a certified list of halal restaurants and products. Always the safest source.", url: "https://www.kmf.or.kr" },
  { icon: Globe, title: "Foreigner Help Line — 1345", body: "24/7 government hotline available in English and Bengali. Immigration, legal aid, emergencies. Save it now.", url: "" },
  { icon: Navigation, title: "Naver Maps (네이버 지도)", body: "More accurate than Google Maps for Korea. Search '할랄 음식점' to find nearby halal eateries.", url: "https://map.naver.com" },
  { icon: Phone, title: "Emergency Numbers", body: "Police: 112 | Fire & Ambulance: 119 | Foreigner Help: 1345", url: "" },
  { icon: Star, title: "GKS Scholarship", body: "Full government scholarship for international students. Covers tuition, housing, living expenses.", url: "https://www.studyinkorea.go.kr" },
  { icon: ShoppingBag, title: "Alien Registration Card", body: "Apply within 90 days of arrival at the Ansan Immigration Office. Required for a bank account, SIM card, and much more.", url: "https://www.hikorea.go.kr" },
];

type Tab = "mosques" | "restaurants" | "groceries" | "delivery";

const navLinks: { href: string; label: string }[] = [
  { href: "#qibla", label: "Qibla Finder" },
  { href: "#mosques", label: "Mosques" },
  { href: "#halal", label: "Halal Food" },
  { href: "#tips", label: "Tips" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("mosques");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredRestaurants = restaurants.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.area.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Compass className="w-4 h-4 text-primary-foreground" />
            </span>
            <span className="font-serif text-lg font-bold text-foreground">Galib on the Go</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
          </nav>
          <button data-testid="button-menu" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-md hover:bg-muted transition-colors">
            <span className="block w-5 h-0.5 bg-foreground mb-1" /><span className="block w-5 h-0.5 bg-foreground mb-1" /><span className="block w-5 h-0.5 bg-foreground" />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-3">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground">{l.label}</a>
            ))}
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent blur-3xl -translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-widest uppercase mb-5">
              <MapPin className="w-3 h-3" /> Ansan-si, Gyeonggi-do, South Korea
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold leading-tight mb-4">
              Galib on the Go
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto leading-relaxed">
              Your Muslim-friendly guide to halal food, mosques, Qibla, and everyday life in South Korea — starting from Ansan.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="#qibla" data-testid="link-qibla" className="px-5 py-2.5 rounded-full bg-white text-primary font-semibold text-sm hover:bg-white/90 transition shadow-sm inline-flex items-center gap-2">
                <Compass className="w-4 h-4" /> Find Qibla
              </a>
              <a href="#mosques" data-testid="link-mosques" className="px-5 py-2.5 rounded-full border border-white/30 text-primary-foreground text-sm font-medium hover:bg-white/10 transition">
                Find Mosques
              </a>
            </div>
          </motion.div>
          {/* Category pills */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-wrap gap-2 justify-center mt-10">
            {[
              { icon: Compass, label: "Qibla Finder", href: "#qibla" },
              { icon: MapPin, label: "Mosques", href: "#mosques" },
              { icon: Utensils, label: "Halal Food", href: "#halal" },
              { icon: ShoppingBag, label: "Groceries", href: "#halal" },
              { icon: BookOpen, label: "Tips & Resources", href: "#tips" },
            ].map((cat) => (
              <a key={cat.label} href={cat.href} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-sm text-primary-foreground/90">
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Qibla Finder */}
      <Section id="qibla" className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div variants={fadeUp} className="mb-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">For Prayer</span>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-3">Qibla Finder</h2>
            <p className="text-muted-foreground">
              Instantly find the direction of the Kaaba from anywhere in South Korea. Uses your GPS location for accuracy.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <QiblaFinder />
          </motion.div>
          <motion.div variants={fadeUp} className="mt-6 grid grid-cols-3 gap-3 text-sm text-muted-foreground">
            {[
              { label: "Ansan-si", deg: "286°" },
              { label: "Seoul", deg: "285°" },
              { label: "Busan", deg: "280°" },
            ].map((city) => (
              <div key={city.label} className="bg-muted/50 rounded-xl p-3 border border-border">
                <p className="font-semibold text-foreground text-base">{city.deg}</p>
                <p className="text-xs">{city.label} approx.</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Mosques & Halal Food Tabs */}
      <Section id="mosques" className="py-20 px-4 bg-muted/40">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Directory</span>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-3">Halal Directory</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Mosques, halal restaurants, grocery stores, and food delivery — all in one place for Ansan and beyond.
            </p>
          </motion.div>

          {/* Tab bar */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 justify-center mb-8">
            {([
              { key: "mosques", label: "Mosques", icon: MapPin },
              { key: "restaurants", label: "Halal Restaurants", icon: Utensils },
              { key: "groceries", label: "Grocery Stores", icon: ShoppingBag },
              { key: "delivery", label: "Food Delivery", icon: Navigation },
            ] as { key: Tab; label: string; icon: typeof MapPin }[]).map((t) => (
              <button
                key={t.key}
                data-testid={`tab-${t.key}`}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeTab === t.key
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </motion.div>

          {/* Search (restaurants only) */}
          {activeTab === "restaurants" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative max-w-sm mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                data-testid="input-search-restaurants"
                type="text"
                placeholder="Search restaurants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </motion.div>
          )}

          {/* Mosques */}
          {activeTab === "mosques" && (
            <motion.div id="halal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mosques.map((m) => (
                <div key={m.name} data-testid={`card-mosque-${m.name.replace(/\s+/g, "-")}`}
                  className={`p-5 rounded-2xl border bg-card shadow-sm flex flex-col gap-3 ${m.highlight ? "border-primary/40 ring-1 ring-primary/20" : "border-border"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{m.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.area}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${m.highlight ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {m.distance}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <p className="flex items-start gap-2 text-muted-foreground"><MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />{m.address}</p>
                    <p className="flex items-start gap-2 text-muted-foreground"><Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />{m.hours}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/60 rounded-lg px-3 py-2">{m.note}</p>
                  <a href={m.mapUrl} target="_blank" rel="noopener noreferrer"
                    data-testid={`link-map-${m.name.replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-auto">
                    <Navigation className="w-3.5 h-3.5" />Open in Google Maps<ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </motion.div>
          )}

          {/* Restaurants */}
          {activeTab === "restaurants" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid sm:grid-cols-2 gap-4">
              {filteredRestaurants.map((r) => (
                <div key={r.name} data-testid={`card-restaurant-${r.name.replace(/\s+/g, "-")}`}
                  className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{r.name}</h3>
                      <p className="text-xs text-muted-foreground">{r.area}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {r.certified && <span className="shrink-0 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">Halal</span>}
                      <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{r.tag}</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-accent flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5" />{r.cuisine}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.note}</p>
                  <a href={r.mapUrl} target="_blank" rel="noopener noreferrer"
                    data-testid={`link-map-restaurant-${r.name.replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-auto">
                    <Navigation className="w-3.5 h-3.5" />Find on Google Maps<ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
              {filteredRestaurants.length === 0 && (
                <div className="sm:col-span-2 text-center text-muted-foreground py-10">No results for "{search}"</div>
              )}
              <div className="sm:col-span-2 p-5 rounded-2xl border border-primary/30 bg-primary/5">
                <p className="font-semibold text-foreground text-sm mb-1">Ansan's Multicultural Village (원곡동)</p>
                <p className="text-sm text-muted-foreground">Wongok-dong in Ansan has one of the largest South Asian communities in Korea. The main street is lined with Bangladeshi, Pakistani, Indian, and Middle Eastern halal eateries and grocery stores — all walkable from Ansan Station (Line 4).</p>
              </div>
            </motion.div>
          )}

          {/* Groceries */}
          {activeTab === "groceries" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid sm:grid-cols-2 gap-4">
              {groceries.map((g) => (
                <div key={g.name} data-testid={`card-grocery-${g.name.replace(/\s+/g, "-")}`}
                  className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground mb-0.5">{g.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{g.area}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{g.note}</p>
                  <a href={g.mapUrl} target="_blank" rel="noopener noreferrer"
                    data-testid={`link-map-grocery-${g.name.replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-auto">
                    <Navigation className="w-3.5 h-3.5" />Find on Google Maps<ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </motion.div>
          )}

          {/* Delivery */}
          {activeTab === "delivery" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {deliveryApps.map((app) => (
                  <div key={app.name} data-testid={`card-delivery-${app.name.replace(/\s+/g, "-")}`}
                    className={`p-5 rounded-2xl border flex flex-col gap-3 ${app.colorClass}`}>
                    <div>
                      <h3 className="font-semibold text-foreground">{app.name}</h3>
                      <p className="text-xs text-muted-foreground">{app.korean}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{app.description}</p>
                    <div className="bg-white/60 rounded-lg px-3 py-2">
                      <p className="text-xs font-medium text-foreground mb-0.5">Tip</p>
                      <p className="text-xs text-muted-foreground">{app.tip}</p>
                    </div>
                    <a href={app.url} target="_blank" rel="noopener noreferrer"
                      data-testid={`link-app-${app.name.replace(/\s+/g, "-")}`}
                      className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-auto">
                      Visit<ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
              {/* Korean phrases */}
              <div className="p-5 rounded-2xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-3">Useful Korean Phrases for Halal Dining</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {phrases.map((p) => (
                    <div key={p.ko} className="bg-muted/60 rounded-lg px-4 py-2.5 border border-border">
                      <p className="font-medium text-foreground text-sm">{p.ko}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.en}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Section>

      {/* Tips & Resources */}
      <Section id="tips" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="mb-10 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Practical Help</span>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-3">Tips for Muslim Students</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Essential links, numbers, and know-how for everyday life in Korea.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tips.map((t) => (
              <motion.div key={t.title} variants={fadeUp} data-testid={`card-tip-${t.title.replace(/\s+/g, "-")}`}
                className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <t.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{t.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
                </div>
                {t.url && (
                  <a href={t.url} target="_blank" rel="noopener noreferrer"
                    data-testid={`link-tip-${t.title.replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-auto">
                    Visit<ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
          {/* Quick contact */}
          <motion.div variants={fadeUp} className="mt-6 p-6 rounded-2xl bg-primary text-primary-foreground">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div>
                <p className="font-semibold text-lg">Korea Muslim Federation (KMF)</p>
                <p className="text-primary-foreground/80 text-sm mt-1">Official Islamic organization in Korea. Halal certification, event listings, and Muslim community support.</p>
              </div>
              <a href="https://www.kmf.or.kr" target="_blank" rel="noopener noreferrer"
                data-testid="link-kmf"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary font-semibold text-sm hover:bg-white/90 transition shadow-sm">
                Visit KMF<ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border bg-muted/30 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <Compass className="w-3.5 h-3.5 text-primary-foreground" />
          </span>
          <p className="font-serif text-lg font-bold text-foreground">Galib on the Go</p>
        </div>
        <p className="text-sm text-muted-foreground">Muslim-friendly guide to life in South Korea — from Ansan with heart.</p>
        <p className="text-xs text-muted-foreground/60 mt-4">Information is provided in good faith. Always verify halal status and opening hours directly with the establishment.</p>
      </footer>
    </div>
  );
}
