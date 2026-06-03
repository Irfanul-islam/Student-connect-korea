import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import {
  MapPin, ExternalLink, Clock, Star, BookOpen, Globe, Navigation,
  Utensils, ShoppingBag, Search, Compass, ChevronRight, Phone,
  ArrowDownToLine, ChefHat,
} from "lucide-react";
import QiblaFinder from "@/components/QiblaFinder";
import PrayerTimes from "@/components/PrayerTimes";
import CurrencyConverter from "@/components/CurrencyConverter";

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

// ── Data ─────────────────────────────────────────────────────────────────────
const mosques = [
  {
    name: "Ansan Islamic Musalla",
    area: "Wongok-dong, Ansan-si",
    address: "Wongokbon-dong, Danwon-gu, Ansan-si, Gyeonggi-do",
    hours: "Open daily — Friday prayer & five daily prayers",
    note: "Prayer space at the heart of Ansan's Multicultural Village. Serves the large Bangladeshi, Pakistani, and Muslim immigrant community in Wongok-dong.",
    mapUrl: "https://maps.google.com/?q=Ansan+Mosque+Wongok+Korea",
    highlight: true,
    distance: "Local",
  },
  {
    name: "Gyeonggi Islamic Center",
    area: "Anyang, Gyeonggi-do",
    address: "Anyang-si, Gyeonggi-do",
    hours: "Friday prayers + daily salah",
    note: "Main Islamic center for Gyeonggi Province. About 30 min from Ansan by subway (Line 4 → Line 1).",
    mapUrl: "https://maps.google.com/?q=Gyeonggi+Islamic+Center+Anyang+Korea",
    highlight: false,
    distance: "~30 min",
  },
  {
    name: "Seoul Central Mosque",
    area: "Itaewon, Seoul",
    address: "39 Usadan-ro 10-gil, Yongsan-gu, Seoul",
    hours: "Open daily — all five prayers",
    note: "Korea's largest mosque. Full facilities: Wudu rooms, Islamic library, halal market nearby. About 1 hour from Ansan via Line 4.",
    mapUrl: "https://maps.google.com/?q=Seoul+Central+Mosque+Itaewon",
    highlight: false,
    distance: "~1 hr",
  },
  {
    name: "Suwon Islamic Center",
    area: "Suwon, Gyeonggi-do",
    address: "Suwon-si, Gyeonggi-do",
    hours: "Friday prayers + daily salah",
    note: "Convenient for students in Suwon and southern Gyeonggi area. About 40 min from Ansan.",
    mapUrl: "https://maps.google.com/?q=Suwon+Islamic+Center+Korea",
    highlight: false,
    distance: "~40 min",
  },
  {
    name: "Incheon Airport Prayer Rooms",
    area: "Incheon International Airport",
    address: "Terminal 1 & 2, Incheon International Airport",
    hours: "24 hours",
    note: "Dedicated prayer rooms in both terminals with Wudu facilities. Essential for arriving and departing travelers.",
    mapUrl: "https://maps.google.com/?q=Incheon+Airport+Prayer+Room",
    highlight: false,
    distance: "~45 min",
  },
];

const restaurants = [
  {
    name: "Ansan Multicultural Street",
    area: "Wongok-dong, Ansan-si",
    cuisine: "Bangladeshi · Pakistani · Indian · Middle Eastern",
    note: "A full street of halal eateries right near Ansan Station. South Asian dishes, halal kebabs, and Bangladeshi staples — all within walking distance.",
    mapUrl: "https://maps.google.com/?q=Ansan+Multicultural+Street+Wongokdong",
    certified: true,
    tag: "Walking distance",
    krw: "5,000–15,000",
    bdt: "410–1,230",
  },
  {
    name: "Bangladeshi Restaurants – Wongok-dong",
    area: "Wongok-dong, Ansan-si",
    cuisine: "Bangladeshi / Deshi food",
    note: "Multiple Bangladeshi-run halal restaurants. Rice, curry, hilsa fish, dal — familiar tastes from home, right in your neighborhood.",
    mapUrl: "https://maps.google.com/?q=Bangladeshi+restaurant+Ansan+Wongokdong+Korea",
    certified: true,
    tag: "Deshi food",
    krw: "7,000–12,000",
    bdt: "574–984",
  },
  {
    name: "Huda Restaurant",
    area: "Itaewon, Seoul",
    cuisine: "Halal Korean",
    note: "One of Korea's oldest halal-certified Korean restaurants, steps from Seoul Central Mosque.",
    mapUrl: "https://maps.google.com/?q=Huda+Restaurant+Itaewon+Seoul",
    certified: true,
    tag: "~1 hr away",
    krw: "10,000–18,000",
    bdt: "820–1,476",
  },
  {
    name: "Al-Medina Restaurant",
    area: "Itaewon, Seoul",
    cuisine: "Middle Eastern / Arabic",
    note: "Authentic halal Middle Eastern food in Itaewon. Popular with the Muslim expat community.",
    mapUrl: "https://maps.google.com/?q=Al+Medina+Restaurant+Itaewon+Seoul",
    certified: true,
    tag: "~1 hr away",
    krw: "12,000–20,000",
    bdt: "984–1,640",
  },
  {
    name: "Makan Restaurant",
    area: "Itaewon, Seoul",
    cuisine: "Malaysian / Southeast Asian Halal",
    note: "KMF-certified Malaysian halal restaurant. Nasi lemak, rendang, and Southeast Asian curries.",
    mapUrl: "https://maps.google.com/?q=Makan+Restaurant+Itaewon+Seoul",
    certified: true,
    tag: "~1 hr away",
    krw: "13,000–22,000",
    bdt: "1,066–1,804",
  },
];

const groceries = [
  {
    name: "Halal Grocery Shops – Wongok-dong",
    area: "Wongok-dong, Ansan-si",
    note: "Multiple halal grocery stores lining Ansan's Multicultural Street. Fresh halal meat, Bangladeshi spices, rice, lentils, mustard oil, and South Asian pantry staples.",
    mapUrl: "https://maps.google.com/?q=Halal+grocery+Ansan+Wongokdong+Korea",
  },
  {
    name: "Bangladeshi Grocery Stores",
    area: "Wongok-dong, Ansan-si",
    note: "Bangladeshi-run shops with products from home — turmeric, mustard oil, dried fish (shutki), Bangladeshi rice varieties, betel leaf, and familiar snacks.",
    mapUrl: "https://maps.google.com/?q=Bangladesh+grocery+Ansan+Korea",
  },
  {
    name: "Itaewon Halal Butcher & Market",
    area: "Itaewon, Seoul",
    note: "Halal butchers and certified grocery stores near Seoul Central Mosque. Best source for certified halal meat cuts in Seoul.",
    mapUrl: "https://maps.google.com/?q=Halal+butcher+Itaewon+Seoul",
  },
  {
    name: "E-Mart / Homeplus (Korean Supermarkets)",
    area: "Nationwide",
    note: "Major Korean supermarkets. Look for products labeled 할랄. Good for vegetables, seafood, eggs, and packaged goods. Not fully halal but widely available.",
    mapUrl: "https://maps.google.com/?q=Emart+Ansan+Korea",
  },
];

const deliveryApps = [
  { name: "Baemin", korean: "배달의민족", desc: "Korea's top delivery app. Search '할랄' for halal options. Works great in Ansan.", url: "https://www.baemin.com", tip: "Chat with the restaurant in-app to confirm halal status before ordering.", color: "border-teal-200 bg-teal-50" },
  { name: "Coupang Eats", korean: "쿠팡이츠", desc: "Fast delivery, wide coverage. Search 할랄 and confirm with the restaurant.", url: "https://www.coupangeats.com", tip: "Add order note: '할랄만 주세요' (Halal only, please)", color: "border-red-200 bg-red-50" },
  { name: "Yogiyo", korean: "요기요", desc: "Good fallback for areas with fewer Baemin options. Halal search available.", url: "https://www.yogiyo.co.kr", tip: "Useful when Baemin coverage is limited in your specific neighborhood.", color: "border-rose-200 bg-rose-50" },
  { name: "HalalTrip", korean: "할랄트립", desc: "Dedicated Muslim travel app. Find KMF-certified restaurants, mosques, and prayer rooms across Korea.", url: "https://www.halaltrip.com", tip: "Most reliable for verified halal listings with Muslim community reviews.", color: "border-green-200 bg-green-50" },
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
  { icon: BookOpen, title: "KMF Halal Certification", body: "Korea Muslim Federation (kmf.or.kr) publishes the official certified list of halal restaurants and products. Always the safest reference.", url: "https://www.kmf.or.kr" },
  { icon: Globe, title: "Foreigner Help Line — 1345", body: "24/7 government hotline in English and Bengali. Immigration, legal aid, emergencies. Save this number now.", url: "" },
  { icon: Navigation, title: "Naver Maps (네이버 지도)", body: "More accurate than Google Maps in Korea. Search '할랄 음식점 안산' to find nearby halal eateries.", url: "https://map.naver.com" },
  { icon: Phone, title: "Emergency Numbers", body: "Police: 112 · Fire & Ambulance: 119 · Foreigner Help: 1345 (Bengali available)", url: "" },
  { icon: Star, title: "GKS / KGSP Scholarship", body: "Full government scholarship covering tuition, housing, and living expenses. Open to international students.", url: "https://www.studyinkorea.go.kr" },
  { icon: ShoppingBag, title: "Alien Registration Card", body: "Apply within 90 days of arrival at Ansan Immigration Office. Required for bank account, SIM card, and most services.", url: "https://www.hikorea.go.kr" },
];

type Tab = "mosques" | "restaurants" | "groceries" | "delivery";

const navLinks = [
  { href: "#prayer", label: "Prayer Times" },
  { href: "#qibla", label: "Qibla" },
  { href: "#directory", label: "Directory" },
  { href: "#currency", label: "Currency" },
  { href: "#tips", label: "Tips" },
];


export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("mosques");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.area.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  const handleInstall = () => {
    alert("To install: tap the Share button (iOS) or menu (Android) and choose 'Add to Home Screen'.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 text-primary-foreground" />
            </span>
            <span className="font-serif text-lg font-bold text-foreground">Galib on the Go</span>
          </a>
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
            <Link href="/recipes" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ChefHat className="w-4 h-4" /> Recipes
            </Link>
            <button
              data-testid="button-install-app"
              onClick={handleInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              Install App
            </button>
          </nav>
          <button data-testid="button-menu" onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-md hover:bg-muted">
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground" />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-3">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground">{l.label}</a>
            ))}
            <Link href="/recipes" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5">
              <ChefHat className="w-4 h-4" /> Recipes
            </Link>
            <button onClick={handleInstall} className="text-sm text-primary font-medium text-left flex items-center gap-1.5">
              <ArrowDownToLine className="w-4 h-4" /> Install App
            </button>
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
              <MapPin className="w-3 h-3" /> Ansan-si, Gyeonggi-do · South Korea
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold leading-tight mb-4">
              Galib on the Go
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto leading-relaxed">
              Your Muslim-friendly companion for halal food, mosques, prayer times, Qibla direction, and everyday life in South Korea.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="#prayer" data-testid="link-prayer" className="px-5 py-2.5 rounded-full bg-white text-primary font-semibold text-sm hover:bg-white/90 transition shadow-sm inline-flex items-center gap-2">
                Prayer Times
              </a>
              <a href="#qibla" data-testid="link-qibla" className="px-5 py-2.5 rounded-full border border-white/30 text-sm font-medium hover:bg-white/10 transition inline-flex items-center gap-2">
                <Compass className="w-4 h-4" /> Qibla Finder
              </a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex flex-wrap gap-2 justify-center mt-10">
            {[
              { icon: Compass, label: "Qibla Finder", href: "#qibla" },
              { icon: MapPin, label: "Mosques", href: "#directory" },
              { icon: Utensils, label: "Halal Food", href: "#directory" },
              { icon: ShoppingBag, label: "Groceries", href: "#directory" },
              { icon: Globe, label: "Currency", href: "#currency" },
              { icon: BookOpen, label: "Tips", href: "#tips" },
            ].map((cat) => (
              <a key={cat.label} href={cat.href} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-sm text-primary-foreground/90">
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </a>
            ))}
            <Link href="/recipes" className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition text-sm text-primary-foreground/90">
              <ChefHat className="w-3.5 h-3.5" />
              Recipes
            </Link>
          </motion.div>
          {/* Install hint */}
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-8 text-xs text-primary-foreground/50">
            Add to your home screen for quick access anywhere in Korea
          </motion.p>
        </div>
      </section>

      {/* Prayer Times */}
      <Section id="prayer" className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Daily Salah</span>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-3">Prayer Times</h2>
            <p className="text-muted-foreground text-sm">Live times for Ansan-si · Updates daily · Toggle alarms for each prayer</p>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <PrayerTimes />
          </motion.div>
        </div>
      </Section>

      {/* Qibla Finder */}
      <Section id="qibla" className="py-20 px-4 bg-muted/40">
        <div className="max-w-xl mx-auto">
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">For Prayer</span>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-3">Qibla Finder</h2>
            <p className="text-muted-foreground text-sm">GPS-accurate direction to the Kaaba from anywhere on Earth · Live compass on supported devices</p>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-card border border-border rounded-3xl p-8 shadow-sm">
            <QiblaFinder />
          </motion.div>
          <motion.div variants={fadeUp} className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
            {[{ label: "Ansan-si", deg: "~286°" }, { label: "Seoul", deg: "~285°" }, { label: "Busan", deg: "~280°" }].map((c) => (
              <div key={c.label} className="bg-card rounded-xl p-3 border border-border shadow-sm">
                <p className="font-bold text-foreground text-base">{c.deg}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Directory */}
      <Section id="directory" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Halal Directory</span>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-3">Find What You Need</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Mosques, halal restaurants, grocery stores, and delivery apps — centred on Ansan-si.</p>
          </motion.div>

          {/* Tab bar */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 justify-center mb-8">
            {([
              { key: "mosques" as Tab, label: "Mosques", icon: MapPin },
              { key: "restaurants" as Tab, label: "Halal Restaurants", icon: Utensils },
              { key: "groceries" as Tab, label: "Grocery Stores", icon: ShoppingBag },
              { key: "delivery" as Tab, label: "Food Delivery", icon: Navigation },
            ]).map((t) => (
              <button key={t.key} data-testid={`tab-${t.key}`} onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeTab === t.key
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}>
                <t.icon className="w-3.5 h-3.5" />{t.label}
              </button>
            ))}
          </motion.div>

          {/* Search bar (restaurants) */}
          {activeTab === "restaurants" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative max-w-sm mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input data-testid="input-search" type="text" placeholder="Search restaurants…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </motion.div>
          )}

          {/* Mosques */}
          {activeTab === "mosques" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mosques.map((m) => (
                <div key={m.name} data-testid={`card-mosque-${m.name.replace(/\s+/g, "-")}`}
                  className={`p-5 rounded-2xl border bg-card shadow-sm flex flex-col gap-3 ${m.highlight ? "border-primary/40 ring-1 ring-primary/20" : "border-border"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {m.highlight && <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1 mb-1"><Star className="w-3 h-3" />Nearest</span>}
                      <h3 className="font-semibold text-foreground">{m.name}</h3>
                      <p className="text-xs text-muted-foreground">{m.area}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${m.highlight ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{m.distance}</span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <p className="flex items-start gap-2 text-muted-foreground"><MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />{m.address}</p>
                    <p className="flex items-start gap-2 text-muted-foreground"><Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />{m.hours}</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/60 rounded-lg px-3 py-2">{m.note}</p>
                  <a href={m.mapUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-mosque-${m.name.replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-auto">
                    <Navigation className="w-3.5 h-3.5" />Open in Google Maps<ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </motion.div>
          )}

          {/* Restaurants */}
          {activeTab === "restaurants" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="grid sm:grid-cols-2 gap-4">
              {filteredRestaurants.map((r) => (
                <div key={r.name} data-testid={`card-restaurant-${r.name.replace(/\s+/g, "-")}`}
                  className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{r.name}</h3>
                      <p className="text-xs text-muted-foreground">{r.area}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {r.certified && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">Halal</span>}
                      <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{r.tag}</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-accent flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5" />{r.cuisine}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.note}</p>
                  {/* Price in both currencies */}
                  <div className="flex items-center gap-3 text-xs bg-muted/50 rounded-lg px-3 py-2 border border-border">
                    <span className="font-medium text-foreground">₩{r.krw}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">≈ ৳{r.bdt}</span>
                  </div>
                  <a href={r.mapUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-restaurant-${r.name.replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-auto">
                    <Navigation className="w-3.5 h-3.5" />Find on Google Maps<ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
              {filteredRestaurants.length === 0 && (
                <div className="sm:col-span-2 py-10 text-center text-muted-foreground">No results for "{search}"</div>
              )}
              <div className="sm:col-span-2 p-5 rounded-2xl border border-primary/30 bg-primary/5 text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground block mb-1">Ansan Multicultural Village (원곡동)</strong>
                Exit 4 from Ansan Station (Line 4). The whole street is lined with South Asian halal restaurants and grocery stores — the closest thing to home you will find in Korea.
              </div>
            </motion.div>
          )}

          {/* Groceries */}
          {activeTab === "groceries" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="grid sm:grid-cols-2 gap-4">
              {groceries.map((g) => (
                <div key={g.name} data-testid={`card-grocery-${g.name.replace(/\s+/g, "-")}`}
                  className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground mb-0.5">{g.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{g.area}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{g.note}</p>
                  <a href={g.mapUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-grocery-${g.name.replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-auto">
                    <Navigation className="w-3.5 h-3.5" />Find on Google Maps<ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </motion.div>
          )}

          {/* Delivery */}
          {activeTab === "delivery" && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {deliveryApps.map((app) => (
                  <div key={app.name} data-testid={`card-delivery-${app.name.replace(/\s+/g, "-")}`}
                    className={`p-5 rounded-2xl border flex flex-col gap-3 ${app.color}`}>
                    <div>
                      <h3 className="font-semibold text-foreground">{app.name}</h3>
                      <p className="text-xs text-muted-foreground">{app.korean}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{app.desc}</p>
                    <div className="bg-white/60 rounded-lg px-3 py-2">
                      <p className="text-xs font-medium text-foreground mb-0.5">Tip</p>
                      <p className="text-xs text-muted-foreground">{app.tip}</p>
                    </div>
                    <a href={app.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-auto">
                      Visit<ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
              <div className="p-5 rounded-2xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-3">Korean Phrases for Halal Ordering</h3>
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

      {/* Currency Converter */}
      <Section id="currency" className="py-20 px-4 bg-muted/40">
        <div className="max-w-xl mx-auto">
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Money</span>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-3">KRW / BDT Converter</h2>
            <p className="text-muted-foreground text-sm">Live exchange rate · Convert Korean Won to Bangladeshi Taka instantly</p>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <CurrencyConverter />
          </motion.div>
        </div>
      </Section>

      {/* Tips */}
      <Section id="tips" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="mb-8 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Practical Help</span>
            <h2 className="font-serif text-4xl font-bold text-foreground mb-3">Essential Tips</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Everything a Muslim student in Korea needs to know.</p>
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
                  <a href={t.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-auto">
                    Visit<ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} className="mt-6 p-6 rounded-2xl bg-primary text-primary-foreground flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <p className="font-semibold text-lg">Korea Muslim Federation (KMF)</p>
              <p className="text-primary-foreground/80 text-sm mt-1">Halal certification, event listings, and Muslim community support across Korea.</p>
            </div>
            <a href="https://www.kmf.or.kr" target="_blank" rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-primary font-semibold text-sm hover:bg-white/90 transition shadow-sm">
              Visit KMF<ChevronRight className="w-4 h-4" />
            </a>
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
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-muted-foreground/60">
          <span>Prayer times via Aladhan API</span>
          <span>·</span>
          <span>Exchange rates via jsdelivr currency API</span>
          <span>·</span>
          <span>Always verify halal status directly with establishments</span>
        </div>
      </footer>
    </div>
  );
}
