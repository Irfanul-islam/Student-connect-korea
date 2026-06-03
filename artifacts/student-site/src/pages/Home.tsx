import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, ExternalLink, Phone, Clock, Star, BookOpen, Globe, Heart, GraduationCap, Utensils, Navigation } from "lucide-react";
import koreaLife from "@/assets/korea-life.png";
import bdNostalgia from "@/assets/bd-nostalgia.png";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const mosques = [
  {
    name: "Seoul Central Mosque",
    korean: "서울중앙성원",
    address: "39 Usadan-ro 10-gil, Yongsan-gu, Seoul",
    area: "Itaewon, Seoul",
    hours: "Open daily — Prayer times vary",
    note: "Largest mosque in Korea. Halal restaurants, Islamic library, and Wudu facilities on-site.",
    mapUrl: "https://maps.google.com/?q=Seoul+Central+Mosque+Itaewon",
    highlight: true,
  },
  {
    name: "Busan Mosque",
    korean: "부산이슬람사원",
    address: "35 Choryang-ro 78beon-gil, Dong-gu, Busan",
    area: "Choryang, Busan",
    hours: "Open daily for prayers",
    note: "Main mosque serving the Busan Muslim community.",
    mapUrl: "https://maps.google.com/?q=Busan+Mosque+Korea",
  },
  {
    name: "Daegu Islamic Center",
    korean: "대구이슬람센터",
    address: "Buk-gu, Daegu",
    area: "Daegu",
    hours: "Open for Friday prayers and daily salah",
    note: "Serves the Muslim community in the Daegu-Gyeongbuk region.",
    mapUrl: "https://maps.google.com/?q=Daegu+Islamic+Center+Korea",
  },
  {
    name: "Gyeonggi Islamic Center",
    korean: "경기이슬람센터",
    address: "Anyang, Gyeonggi-do",
    area: "Gyeonggi Province",
    hours: "Open for Friday prayers",
    note: "Convenient for students in Suwon, Anyang, and surrounding areas.",
    mapUrl: "https://maps.google.com/?q=Gyeonggi+Islamic+Center+Korea",
  },
  {
    name: "Gwangju Islamic Center",
    korean: "광주이슬람센터",
    address: "Gwangju Metropolitan City",
    area: "Gwangju",
    hours: "Open for Friday prayers and daily salah",
    note: "Serves the Muslim community in Gwangju and the Honam region.",
    mapUrl: "https://maps.google.com/?q=Gwangju+Islamic+Center+Korea",
  },
  {
    name: "Jeonju Islamic Center",
    korean: "전주이슬람센터",
    address: "Jeonju-si, Jeollabuk-do",
    area: "Jeonju",
    hours: "Open for Friday prayers",
    note: "Community center for Muslims in Jeonju and nearby cities.",
    mapUrl: "https://maps.google.com/?q=Jeonju+Islamic+Center+Korea",
  },
];

const halalRestaurants = [
  {
    name: "Huda Restaurant",
    area: "Itaewon, Seoul",
    cuisine: "Korean-Islamic / Halal Korean",
    note: "One of the oldest halal restaurants near Seoul Central Mosque. Hearty Korean food prepared fully halal.",
    mapUrl: "https://maps.google.com/?q=Huda+Restaurant+Itaewon+Seoul",
    certified: true,
  },
  {
    name: "Al-Medina Restaurant",
    area: "Itaewon, Seoul",
    cuisine: "Middle Eastern / Arabic",
    note: "Authentic Middle Eastern halal food. Popular with the Muslim expat community in Itaewon.",
    mapUrl: "https://maps.google.com/?q=Al+Medina+Restaurant+Itaewon+Seoul",
    certified: true,
  },
  {
    name: "Makan Restaurant",
    area: "Itaewon, Seoul",
    cuisine: "Malaysian / Southeast Asian Halal",
    note: "Certified halal Malaysian and Southeast Asian dishes. Nasi Lemak, curries, and more.",
    mapUrl: "https://maps.google.com/?q=Makan+Restaurant+Itaewon+Seoul",
    certified: true,
  },
  {
    name: "Itaewon Halal District",
    area: "Itaewon, Seoul",
    cuisine: "Various — Turkish, Arabic, Pakistani, Indian",
    note: "The street around Seoul Central Mosque is lined with halal kebab shops, grocery stores, and restaurants from many cuisines.",
    mapUrl: "https://maps.google.com/?q=Itaewon+Halal+Street+Seoul",
    certified: true,
  },
  {
    name: "Chicken Masala",
    area: "Dongdaemun / Ansan",
    cuisine: "South Asian / Bangladeshi-style",
    note: "South Asian halal food. Ansan's Multicultural Street (다문화거리) has several Bangladeshi and Pakistani halal eateries.",
    mapUrl: "https://maps.google.com/?q=Ansan+Multicultural+Street+Korea",
    certified: false,
  },
  {
    name: "Busan Halal Restaurants",
    area: "Choryang & Seomyeon, Busan",
    cuisine: "Middle Eastern / South Asian / Malaysian",
    note: "The area around Busan Station and Seomyeon has a growing number of certified halal restaurants serving diverse Muslim cuisines.",
    mapUrl: "https://maps.google.com/?q=Halal+Restaurant+Busan+Korea",
    certified: true,
  },
];

const deliveryApps = [
  {
    name: "Baemin",
    korean: "배달의민족",
    description: "Korea's most popular food delivery app. Search '할랄' or '무슬림' to find halal options near you. Works nationwide.",
    url: "https://www.baemin.com",
    tip: "Look for the halal certification badge or ask the restaurant directly via in-app chat.",
    color: "bg-teal-50 border-teal-200",
    iconColor: "text-teal-600",
  },
  {
    name: "Coupang Eats",
    korean: "쿠팡이츠",
    description: "Fast delivery with many restaurant options. Search 할랄 in the search bar. Often has faster delivery than competitors.",
    url: "https://www.coupangeats.com",
    tip: "Use the filter feature and always confirm halal status with the restaurant before ordering.",
    color: "bg-red-50 border-red-200",
    iconColor: "text-red-500",
  },
  {
    name: "Yogiyo",
    korean: "요기요",
    description: "Major delivery platform with halal-friendly restaurants listed. Good coverage in smaller cities too.",
    url: "https://www.yogiyo.co.kr",
    tip: "Leave a note in your order (할랄만 주세요 / Halal only please) to notify the kitchen.",
    color: "bg-rose-50 border-rose-200",
    iconColor: "text-rose-500",
  },
  {
    name: "HalalTrip",
    korean: "할랄트립",
    description: "Dedicated app for Muslim travelers in Korea. Find halal restaurants, mosques, and prayer rooms across South Korea.",
    url: "https://www.halaltrip.com",
    tip: "Best app specifically for finding KMF-certified halal restaurants with verified reviews from Muslims.",
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
  },
  {
    name: "Korea Muslim Federation",
    korean: "한국이슬람교중앙회",
    description: "Official KMF halal certification list. The most reliable source for certified halal restaurants and food products in Korea.",
    url: "https://www.kmf.or.kr",
    tip: "KMF-certified businesses are verified — always the safest choice for confirmed halal dining.",
    color: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
  },
];

const resources = [
  { icon: GraduationCap, title: "GKS Scholarship", desc: "Government-funded full scholarship for international students in Korea. Covers tuition, housing, and living expenses.", url: "https://www.studyinkorea.go.kr" },
  { icon: Globe, title: "Study in Korea Portal", desc: "Official Korean government portal for international student admissions, visa info, and university listings.", url: "https://www.studyinkorea.go.kr" },
  { icon: BookOpen, title: "TOPIK (Korean Language)", desc: "Test of Proficiency in Korean. Required for most graduate programs. Study resources available free online.", url: "https://www.topik.go.kr" },
  { icon: Heart, title: "Hi Korea (Visa & Residence)", desc: "Official portal for alien registration, visa renewal, and immigration services for international students.", url: "https://www.hikorea.go.kr" },
  { icon: Navigation, title: "Naver Maps (네이버 지도)", desc: "The most reliable maps app in Korea. Better than Google Maps for local navigation, bus routes, and subway info.", url: "https://map.naver.com" },
  { icon: Phone, title: "Emergency Numbers", desc: "Police: 112 | Fire & Ambulance: 119 | Foreigner Help Line: 1345 (24/7, available in English and Bengali).", url: "" },
];

const navLinks = [
  { href: "#story", label: "My Story" },
  { href: "#life", label: "Life in Korea" },
  { href: "#halal", label: "Halal & Mosques" },
  { href: "#resources", label: "Resources" },
  { href: "#contact", label: "Connect" },
];

type HalalTab = "mosques" | "restaurants" | "delivery";

export default function Home() {
  const [activeTab, setActiveTab] = useState<HalalTab>("mosques");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="#hero" className="font-serif text-lg font-semibold text-primary">
            Rafiul in Seoul
          </a>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <button
            data-testid="button-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          >
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground mb-1" />
            <span className="block w-5 h-0.5 bg-foreground" />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="hero" className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-primary/8 blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-secondary/40 blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-2xl"
        >
          <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-4 border-primary/20 flex items-center justify-center overflow-hidden shadow-lg">
            <span className="text-5xl select-none">🧑‍🎓</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-widest uppercase mb-4">
              Bangladesh to South Korea
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="font-serif text-5xl sm:text-6xl font-bold leading-tight text-foreground mb-4"
          >
            From Dhaka to Seoul
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8"
          >
            Chasing dreams, one lecture at a time. A newbie student's guide to life,
            faith, and finding your footing in South Korea.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <a
              href="#halal"
              data-testid="link-halal"
              className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              Halal Food and Mosques
            </a>
            <a
              href="#story"
              data-testid="link-story"
              className="px-5 py-2.5 rounded-full border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Read My Story
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex items-center justify-center gap-6 mt-10 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              🇧🇩 Bangladeshi
            </span>
            <span className="w-px h-4 bg-border" />
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              🇰🇷 Studying in Seoul
            </span>
            <span className="w-px h-4 bg-border" />
            <span>Muslim student</span>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-10 bg-gradient-to-b from-border to-transparent mx-auto mb-1" />
          <span className="text-xs text-muted-foreground">scroll</span>
        </motion.div>
      </section>

      {/* My Story */}
      <Section id="story" className="py-24 px-4 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">My Journey</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">How It All Began</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeUp} className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Growing up in Dhaka, South Korea felt like another world — something you see in K-dramas,
                not something you actually go to. Then one afternoon, I found out I had been selected for
                a scholarship. My hands were shaking.
              </p>
              <p>
                The first flight out of Shahjalal International. The immigration line at Incheon. Trying
                to figure out the subway with a 30 kg bag and zero Korean. Every step felt enormous.
              </p>
              <p>
                I had heard it would be hard. The language barrier is real. The food situation as a Muslim
                student requires planning. Winter hits differently when you are from a country that barely
                has winter. But slowly, day by day, Seoul started to feel like home.
              </p>
              <p>
                This website is for every Bangladeshi student who is about to take that same leap — or is
                already here and trying to figure things out. You are not alone.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="space-y-4">
              {[
                { label: "Left Bangladesh", detail: "Dhaka to Seoul, Incheon Airport", icon: "✈️" },
                { label: "First Semester", detail: "Classes in Korean, survival mode activated", icon: "📖" },
                { label: "Found the Mosque", detail: "Seoul Central Mosque, Itaewon — a home away from home", icon: "🕌" },
                { label: "Made friends", detail: "Other international students from 30+ countries", icon: "🤝" },
                { label: "Still going", detail: "One exam at a time, one biryani at a time", icon: "💪" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border shadow-sm"
                >
                  <span className="text-2xl mt-0.5">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{item.label}</p>
                    <p className="text-muted-foreground text-sm">{item.detail}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Life in Korea */}
      <Section id="life" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Student Life</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">Life in South Korea</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Korea is safe, modern, and genuinely fascinating — once you get past the initial overwhelm.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <motion.img
              variants={fadeUp}
              src={koreaLife}
              alt="Life in South Korea"
              className="w-full rounded-2xl shadow-lg object-cover aspect-[4/3]"
            />
            <motion.div variants={stagger} className="space-y-5">
              {[
                { title: "Getting Around", body: "The subway (지하철) is your best friend. Buy a T-money card on day one. Google Maps works fine but Naver Maps is more accurate for Korea." },
                { title: "Weather", body: "Prepare for four very real seasons. Winters are cold and dry (−5°C to −10°C). Stock up on warm clothes before January. Summers are humid and hot." },
                { title: "Language", body: "Learning basic Korean makes life dramatically easier. Even just reading Hangul (the alphabet) takes 1–2 hours to learn and opens up everything." },
                { title: "Cost of Living", body: "Monthly expenses typically run 600,000–900,000 KRW (roughly $450–$680 USD) including dorm, food, and transport on a student budget." },
                { title: "University Life", body: "Korean universities have active international student offices. Use them. They help with registration, housing, and getting oriented." },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeUp}>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Bangladesh in My Heart */}
      <Section className="py-24 px-4 bg-muted/40">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div variants={fadeUp} className="order-2 md:order-1">
              <span className="text-xs font-semibold tracking-widest uppercase text-accent mb-3 block">Always With Me</span>
              <h2 className="font-serif text-4xl font-bold text-foreground mb-6">Bangladesh in My Heart</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  No matter how many cherry blossoms you see, or how well you learn to say
                  "annyeonghaseyo," there is still nothing quite like the smell of Ilish curry
                  or the sound of the azan rising over Dhaka at dawn.
                </p>
                <p>
                  Being far from home teaches you how deeply Bangladeshi you actually are. The
                  culture, the food, the togetherness — you miss it in ways you never expected.
                </p>
                <p>
                  There is a growing Bangladeshi community in South Korea — particularly in Seoul,
                  Ansan, and near major universities. Find them. They will feed you, help you, and
                  speak Bangla with you when you need it most.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {["Ilish Bhuna", "Panta Bhat", "Shorshe Ilish", "Biryani", "Cha", "Pitha", "Bhorta"].map((food) => (
                  <span
                    key={food}
                    className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20"
                  >
                    {food}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.img
              variants={fadeUp}
              src={bdNostalgia}
              alt="Bangladesh — home"
              className="order-1 md:order-2 w-full rounded-2xl shadow-lg object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </Section>

      {/* Halal Food and Mosques */}
      <Section id="halal" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">For Muslim Students</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">Halal Food and Mosques</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Living as a Muslim student in Korea requires a little planning — but the community
              is there, and it is warm and welcoming.
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={fadeUp} className="flex gap-2 p-1 rounded-xl bg-muted border border-border mb-8 w-fit mx-auto">
            {(["mosques", "restaurants", "delivery"] as HalalTab[]).map((tab) => (
              <button
                key={tab}
                data-testid={`tab-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "mosques" && "Mosques"}
                {tab === "restaurants" && "Halal Restaurants"}
                {tab === "delivery" && "Food Delivery"}
              </button>
            ))}
          </motion.div>

          {/* Mosques Tab */}
          {activeTab === "mosques" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {mosques.map((mosque) => (
                <div
                  key={mosque.name}
                  data-testid={`card-mosque-${mosque.name.replace(/\s+/g, "-")}`}
                  className={`p-5 rounded-2xl border bg-card shadow-sm flex flex-col gap-3 ${
                    mosque.highlight ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
                  }`}
                >
                  {mosque.highlight && (
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Most Prominent
                    </span>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{mosque.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{mosque.korean}</p>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <p className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                      {mosque.address}
                    </p>
                    <p className="flex items-start gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                      {mosque.hours}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/60 rounded-lg px-3 py-2">
                    {mosque.note}
                  </p>
                  <a
                    href={mosque.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-map-${mosque.name.replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-auto"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Open in Google Maps
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </motion.div>
          )}

          {/* Restaurants Tab */}
          {activeTab === "restaurants" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {halalRestaurants.map((r) => (
                <div
                  key={r.name}
                  data-testid={`card-restaurant-${r.name.replace(/\s+/g, "-")}`}
                  className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{r.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{r.area}</p>
                    </div>
                    {r.certified && (
                      <span className="shrink-0 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        KMF Halal
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-accent flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5" />
                    {r.cuisine}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.note}</p>
                  <a
                    href={r.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-map-restaurant-${r.name.replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-auto"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Find on Google Maps
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
              <div className="sm:col-span-2 p-5 rounded-2xl border border-primary/30 bg-primary/5 text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground block mb-1">Pro tip for Bangladeshi students</strong>
                Ansan city (안산), about 40 minutes from Seoul, has a large South Asian community including
                many Bangladeshis. The area around Ansan Station has Bangladeshi grocery stores,
                halal meat shops, and restaurants where you can find familiar ingredients and food.
              </div>
            </motion.div>
          )}

          {/* Delivery Tab */}
          {activeTab === "delivery" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {deliveryApps.map((app) => (
                <div
                  key={app.name}
                  data-testid={`card-delivery-${app.name.replace(/\s+/g, "-")}`}
                  className={`p-5 rounded-2xl border ${app.color} flex flex-col gap-3`}
                >
                  <div>
                    <h3 className="font-semibold text-foreground">{app.name}</h3>
                    <p className="text-xs text-muted-foreground">{app.korean}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{app.description}</p>
                  <div className="bg-white/60 rounded-lg px-3 py-2">
                    <p className="text-xs font-medium text-foreground mb-0.5">Tip</p>
                    <p className="text-xs text-muted-foreground">{app.tip}</p>
                  </div>
                  {app.url && (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid={`link-app-${app.name.replace(/\s+/g, "-")}`}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium hover:underline mt-auto ${app.iconColor}`}
                    >
                      Visit Website
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
              <div className="sm:col-span-2 p-5 rounded-2xl border border-border bg-muted/40 text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground block mb-1">Useful Korean phrases for ordering food</strong>
                <div className="grid sm:grid-cols-2 gap-2 mt-2">
                  {[
                    { phrase: "할랄 음식 있어요?", meaning: "Do you have halal food?" },
                    { phrase: "돼지고기 없이 해주세요", meaning: "Without pork please" },
                    { phrase: "알코올 없이 해주세요", meaning: "Without alcohol please" },
                    { phrase: "닭고기 할랄이에요?", meaning: "Is the chicken halal?" },
                  ].map((p) => (
                    <div key={p.phrase} className="bg-background rounded-lg px-3 py-2 border border-border">
                      <p className="font-medium text-foreground text-sm">{p.phrase}</p>
                      <p className="text-xs text-muted-foreground">{p.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Section>

      {/* Resources */}
      <Section id="resources" className="py-24 px-4 bg-muted/40">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="mb-12 text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Practical Help</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground">Resources for Students</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Everything you need — scholarships, visas, apps, and the emergency numbers to keep on your phone.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((r) => (
              <motion.div
                key={r.title}
                variants={fadeUp}
                data-testid={`card-resource-${r.title.replace(/\s+/g, "-")}`}
                className="p-5 rounded-2xl border border-border bg-card shadow-sm flex flex-col gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <r.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{r.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                </div>
                {r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-resource-${r.title.replace(/\s+/g, "-")}`}
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline mt-auto"
                  >
                    Visit Site
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact / Connect */}
      <Section id="contact" className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div variants={fadeUp} className="mb-8">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary mb-3 block">Connect</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Are You a Bangladeshi Student in Korea?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This community grows one connection at a time. Whether you just landed in Incheon or
              you have been here for years — reach out. Let us help each other.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="space-y-4">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm text-left">
              <h3 className="font-semibold text-foreground mb-2">Bangladeshi Students in Korea</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Search Facebook groups for "Bangladeshi Students in South Korea" or "Bangladesh Korea
                Student Community" to find active groups where students share tips, jobs, and support.
              </p>
              <a
                href="https://www.facebook.com/groups/search/posts/?q=bangladeshi+students+south+korea"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-facebook-community"
                className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
              >
                Search on Facebook
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="p-6 rounded-2xl border border-border bg-card shadow-sm text-left">
              <h3 className="font-semibold text-foreground mb-2">Korea Muslim Federation (KMF)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                The official Islamic organization in South Korea. They assist Muslim students with
                prayer room locations, halal certification lists, and Islamic events.
              </p>
              <a
                href="https://www.kmf.or.kr"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-kmf"
                className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
              >
                Visit KMF Website
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5 text-left">
              <h3 className="font-semibold text-foreground mb-2">Foreigner Help Line — 1345</h3>
              <p className="text-sm text-muted-foreground">
                Korea's official foreigner support hotline. Available 24/7 in English and Bengali.
                Call for immigration questions, emergencies, or if you simply do not know who else
                to call.
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border bg-muted/30 text-center">
        <p className="font-serif text-lg font-semibold text-primary mb-1">Rafiul in Seoul</p>
        <p className="text-sm text-muted-foreground">
          From Bangladesh with love. Built for every newbie student figuring it out.
        </p>
        <p className="text-xs text-muted-foreground/60 mt-4">
          Information is provided in good faith. Always verify halal status and opening hours directly with the establishment.
        </p>
      </footer>
    </div>
  );
}
