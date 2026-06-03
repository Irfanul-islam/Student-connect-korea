import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, Volume2, Search, Copy, Check } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

interface Phrase {
  ko: string;
  romanize: string;
  en: string;
  tip?: string;
  emoji: string;
}

interface Category {
  id: string;
  icon: string;
  title: string;
  color: string;
  bg: string;
  border: string;
  phrases: Phrase[];
}

const CATEGORIES: Category[] = [
  {
    id: "greetings",
    icon: "👋",
    title: "Greetings & Basics",
    color: "text-violet-700",
    bg: "bg-violet-50",
    border: "border-violet-200",
    phrases: [
      { ko: "안녕하세요", romanize: "an-nyeong-ha-se-yo", en: "Hello / Good day", emoji: "😊", tip: "Works any time of day — morning, afternoon, evening. Safe default." },
      { ko: "감사합니다", romanize: "gam-sa-ham-ni-da", en: "Thank you", emoji: "🙏", tip: "The polite form. Koreans really appreciate hearing this — use it often!" },
      { ko: "네 / 아니요", romanize: "ne / a-ni-yo", en: "Yes / No", emoji: "✅", tip: "'네' sounds like 'neh'. Short and sweet." },
      { ko: "죄송합니다", romanize: "joe-song-ham-ni-da", en: "I'm sorry / Excuse me", emoji: "🙇", tip: "Use when bumping into someone or making a mistake. Very important in Korean culture." },
      { ko: "잠깐만요", romanize: "jam-kkan-man-yo", en: "One moment please / Wait a second", emoji: "⏱️", tip: "Useful when you need time to think or process something." },
      { ko: "모르겠어요", romanize: "mo-reu-get-sseo-yo", en: "I don't know / I'm not sure", emoji: "🤷", tip: "Honest and polite — no shame in using this." },
      { ko: "영어 할 수 있어요?", romanize: "yeong-eo hal su it-sseo-yo?", en: "Can you speak English?", emoji: "🌐", tip: "Try this at convenience stores or with younger people — they're more likely to help." },
      { ko: "이름이 뭐예요?", romanize: "i-reum-i mwo-ye-yo?", en: "What is your name?", emoji: "🪪", tip: "Great icebreaker. Be ready to say your name back!" },
      { ko: "반가워요", romanize: "ban-ga-wo-yo", en: "Nice to meet you", emoji: "🤝", tip: "Say this after being introduced. Koreans smile when they hear a foreigner use this." },
      { ko: "안녕히 계세요", romanize: "an-nyeong-hi gye-se-yo", en: "Goodbye (said by the one leaving)", emoji: "👋", tip: "Say this when YOU are leaving. The other person says 안녕히 가세요 (go well)." },
    ],
  },
  {
    id: "food",
    icon: "🍽️",
    title: "Food & Restaurants",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-200",
    phrases: [
      { ko: "할랄 음식 있어요?", romanize: "hal-lal eum-shik it-sseo-yo?", en: "Do you have halal food?", emoji: "🥩", tip: "Most restaurant staff understand 할랄 — it's widely known in Korea." },
      { ko: "돼지고기 없이 해주세요", romanize: "dwae-ji-go-gi eob-si hae-ju-se-yo", en: "Without pork, please", emoji: "🚫🐷", tip: "Critical phrase. Point to the menu item and say this clearly." },
      { ko: "알코올 없이 해주세요", romanize: "al-ko-ol eob-si hae-ju-se-yo", en: "Without alcohol, please", emoji: "🚫🍺", tip: "Some sauces in Korean food contain soju or wine — this covers it." },
      { ko: "닭고기 할랄이에요?", romanize: "dak-go-gi hal-lal-i-e-yo?", en: "Is the chicken halal?", emoji: "🍗", tip: "Chicken is the safest meat to ask about in Korean restaurants." },
      { ko: "이거 주세요", romanize: "i-geo ju-se-yo", en: "This one, please (pointing)", emoji: "👆", tip: "Life-saving phrase when you can't read the menu — just point and say this!" },
      { ko: "얼마예요?", romanize: "eol-ma-ye-yo?", en: "How much is it?", emoji: "💰", tip: "Use at street stalls and markets where prices aren't displayed." },
      { ko: "맛있어요!", romanize: "mas-it-sseo-yo!", en: "It's delicious!", emoji: "😋", tip: "Say this to the cook or server — they will absolutely love you for it." },
      { ko: "물 주세요", romanize: "mul ju-se-yo", en: "Water, please", emoji: "💧", tip: "Free water (usually cold) is always available in Korean restaurants — just ask." },
      { ko: "계산서 주세요", romanize: "gye-san-seo ju-se-yo", en: "The bill, please", emoji: "🧾", tip: "Or just shout 계산해 주세요 (gye-san-hae ju-se-yo) at the counter." },
      { ko: "포장해 주세요", romanize: "po-jang-hae ju-se-yo", en: "To go / Takeaway, please", emoji: "🥡", tip: "Works at any restaurant — they'll pack it in a neat container." },
    ],
  },
  {
    id: "numbers",
    icon: "🔢",
    title: "Numbers & Money",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    phrases: [
      { ko: "일 이 삼 사 오", romanize: "il · i · sam · sa · o", en: "1 · 2 · 3 · 4 · 5 (Sino-Korean)", emoji: "1️⃣", tip: "Use Sino-Korean numbers for money, bus numbers, and floors." },
      { ko: "육 칠 팔 구 십", romanize: "yuk · chil · pal · gu · sip", en: "6 · 7 · 8 · 9 · 10", emoji: "🔟", tip: "십 (10) + 일 (1) = 십일 (11). Add them together like that." },
      { ko: "백 · 천 · 만", romanize: "baek · cheon · man", en: "100 · 1,000 · 10,000", emoji: "💵", tip: "만 (10,000) is the key unit in Korea. Everything is in multiples of 만. ₩50,000 = 오만 원." },
      { ko: "원", romanize: "won", en: "Korean Won (currency)", emoji: "💴", tip: "Always say 원 (won) after the number: 오천 원 = 5,000 won." },
      { ko: "얼마예요?", romanize: "eol-ma-ye-yo?", en: "How much?", emoji: "🤔", tip: "If you don't catch the number, hold out your phone calculator — they'll type it." },
      { ko: "깎아 주세요", romanize: "kka-kka ju-se-yo", en: "Please give me a discount", emoji: "📉", tip: "Works at traditional markets (시장). Don't try this at convenience stores." },
      { ko: "카드 돼요?", romanize: "ka-deu dwae-yo?", en: "Can I pay by card?", emoji: "💳", tip: "Korea is very card-friendly. Almost everywhere accepts cards." },
    ],
  },
  {
    id: "transport",
    icon: "🚇",
    title: "Getting Around",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    phrases: [
      { ko: "어디 있어요?", romanize: "eo-di it-sseo-yo?", en: "Where is [place]?", emoji: "📍", tip: "Just add the place name before it: 화장실 어디 있어요? = Where is the bathroom?" },
      { ko: "안산역 어디예요?", romanize: "an-san-yeok eo-di-ye-yo?", en: "Where is Ansan Station?", emoji: "🚉", tip: "Replace 안산 with any place name. 역 (yeok) = station." },
      { ko: "지하철 어디예요?", romanize: "ji-ha-cheol eo-di-ye-yo?", en: "Where is the subway?", emoji: "🚇", tip: "The subway (지하철) is how you get everywhere in the Seoul metro area." },
      { ko: "버스 어디서 타요?", romanize: "beo-seu eo-di-seo ta-yo?", en: "Where do I take the bus?", emoji: "🚌", tip: "Very handy when you can't find the bus stop." },
      { ko: "이 버스 안산 가요?", romanize: "i beo-seu an-san ga-yo?", en: "Does this bus go to Ansan?", emoji: "🧭", tip: "Replace 안산 with any destination name." },
      { ko: "다음 역이 어디예요?", romanize: "da-eum yeok-i eo-di-ye-yo?", en: "What is the next station?", emoji: "🗺️", tip: "Useful when you're not sure you're on the right train." },
      { ko: "환승해야 해요?", romanize: "hwan-seung-hae-ya hae-yo?", en: "Do I need to transfer?", emoji: "↔️", tip: "Ask this when checking if you're on the right line." },
      { ko: "화장실 어디예요?", romanize: "hwa-jang-sil eo-di-ye-yo?", en: "Where is the bathroom?", emoji: "🚻", tip: "Subway stations always have clean free bathrooms — just ask staff." },
    ],
  },
  {
    id: "university",
    icon: "🎓",
    title: "University & Study",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    phrases: [
      { ko: "도서관 어디예요?", romanize: "do-seo-gwan eo-di-ye-yo?", en: "Where is the library?", emoji: "📚", tip: "Korean university libraries are amazing — quiet, open late, free printing." },
      { ko: "교수님, 질문 있어요", romanize: "gyo-su-nim, jil-mun it-sseo-yo", en: "Professor, I have a question", emoji: "✋", tip: "님 is a respectful suffix. Always use 교수님 for your professor." },
      { ko: "학생증 만들어야 해요", romanize: "hak-saeng-jeung man-deul-eo-ya hae-yo", en: "I need to make a student ID", emoji: "🪪", tip: "Get this done the first week — you need it for the library, discounts, and everything." },
      { ko: "기숙사 어디예요?", romanize: "gi-suk-sa eo-di-ye-yo?", en: "Where is the dormitory?", emoji: "🏠", tip: "Ask this when you first arrive on campus and you're lost." },
      { ko: "와이파이 비밀번호가 뭐예요?", romanize: "wa-i-pa-i bi-mil-beon-ho-ga mwo-ye-yo?", en: "What is the WiFi password?", emoji: "📶", tip: "Essential. Most Korean cafes and campus buildings have free WiFi." },
      { ko: "시험 언제예요?", romanize: "si-heom eon-je-ye-yo?", en: "When is the exam?", emoji: "📝", tip: "Mid-term = 중간고사, Final = 기말고사. Know both." },
      { ko: "과제 제출 기한이 언제예요?", romanize: "gwa-je je-chul gi-han-i eon-je-ye-yo?", en: "What is the assignment deadline?", emoji: "📅", tip: "Korean professors take deadlines seriously. Always check." },
      { ko: "출석체크해요?", romanize: "chul-seok-che-keu-hae-yo?", en: "Do you take attendance?", emoji: "📋", tip: "In Korea, attendance often counts toward your grade. Don't skip!" },
    ],
  },
  {
    id: "health",
    icon: "🏥",
    title: "Health & Emergency",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
    phrases: [
      { ko: "도와주세요!", romanize: "do-wa-ju-se-yo!", en: "Please help me!", emoji: "🆘", tip: "Shout this loudly in an emergency — Koreans will respond." },
      { ko: "병원 어디예요?", romanize: "byeong-won eo-di-ye-yo?", en: "Where is the hospital?", emoji: "🏥", tip: "University health centers are cheap and English-friendly for international students." },
      { ko: "약국 어디예요?", romanize: "yak-guk eo-di-ye-yo?", en: "Where is the pharmacy?", emoji: "💊", tip: "Pharmacies (약국) are everywhere and open late. Basic meds are cheap here." },
      { ko: "아파요", romanize: "a-pa-yo", en: "I am in pain / I feel sick", emoji: "🤒", tip: "Point to where it hurts. Koreans will understand even without words." },
      { ko: "알레르기 있어요", romanize: "al-le-reu-gi it-sseo-yo", en: "I have an allergy", emoji: "⚠️", tip: "Follow with the allergen: 돼지고기 알레르기 있어요 = I'm allergic to pork." },
      { ko: "구급차 불러주세요", romanize: "gu-geup-cha bul-leo-ju-se-yo", en: "Please call an ambulance", emoji: "🚑", tip: "Or just dial 119 — it works for both fire and ambulance. Free call." },
      { ko: "경찰 불러주세요", romanize: "gyeong-chal bul-leo-ju-se-yo", en: "Please call the police", emoji: "👮", tip: "Police number: 112. Use 1345 for the foreigner helpline (Bengali available)." },
      { ko: "보험증 있어요", romanize: "bo-heom-jeung it-sseo-yo", en: "I have insurance / health card", emoji: "📄", tip: "International students on NHIS health insurance get big discounts at hospitals." },
    ],
  },
  {
    id: "social",
    icon: "😄",
    title: "Making Friends",
    color: "text-pink-700",
    bg: "bg-pink-50",
    border: "border-pink-200",
    phrases: [
      { ko: "방글라데시에서 왔어요", romanize: "bang-geul-ra-de-shi-e-seo wat-sseo-yo", en: "I'm from Bangladesh", emoji: "🇧🇩", tip: "Koreans are curious about other countries — this will start great conversations." },
      { ko: "한국어 조금 해요", romanize: "han-gug-eo jo-geum hae-yo", en: "I speak a little Korean", emoji: "🗣️", tip: "Say this with a smile and Koreans will be incredibly patient and kind with you." },
      { ko: "같이 밥 먹어요!", romanize: "ga-chi bap meog-eo-yo!", en: "Let's eat together!", emoji: "🍚", tip: "Food is how Koreans bond. Saying this to a classmate is a perfect friendship starter." },
      { ko: "연락해요!", romanize: "yeol-lak-hae-yo!", en: "Let's keep in touch!", emoji: "📱", tip: "Koreans use KakaoTalk — exchange KakaoTalk IDs, not phone numbers." },
      { ko: "한국 음식 맛있어요!", romanize: "han-guk eum-shik mas-it-sseo-yo!", en: "Korean food is delicious!", emoji: "🥘", tip: "Instant friendship unlock. Every Korean will be overjoyed to hear this." },
      { ko: "이거 뭐예요?", romanize: "i-geo mwo-ye-yo?", en: "What is this?", emoji: "🤔", tip: "Perfect for pointing at unfamiliar food, signs, or objects. Very natural curiosity." },
      { ko: "재미있어요!", romanize: "jae-mi-it-sseo-yo!", en: "This is fun / interesting!", emoji: "🎉", tip: "Use when trying new things — Korean games, street food, activities. Very natural." },
      { ko: "화이팅!", romanize: "hwa-i-ting!", en: "Fighting! / You've got this! / Good luck!", emoji: "💪", tip: "Korea's universal cheer. You'll hear this everywhere. Shout it back!" },
    ],
  },
  {
    id: "shopping",
    icon: "🛍️",
    title: "Shopping & Daily Life",
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    phrases: [
      { ko: "이거 있어요?", romanize: "i-geo it-sseo-yo?", en: "Do you have this?", emoji: "🔍", tip: "Show a picture on your phone while asking — works every time." },
      { ko: "다른 거 있어요?", romanize: "da-reun geo it-sseo-yo?", en: "Do you have a different one?", emoji: "🔄", tip: "For size, colour, or style variations." },
      { ko: "영수증 주세요", romanize: "yeong-su-jeung ju-se-yo", en: "Please give me a receipt", emoji: "🧾", tip: "Always get a receipt for any purchase over a few thousand won." },
      { ko: "봉투 주세요", romanize: "bong-tu ju-se-yo", en: "Please give me a bag", emoji: "🛍️", tip: "Plastic bags cost about ₩100-200 in Korea — you need to ask and pay separately." },
      { ko: "택배 보내고 싶어요", romanize: "taek-bae bo-nae-go si-peo-yo", en: "I want to send a parcel", emoji: "📦", tip: "Post offices (우체국) are everywhere and extremely affordable for shipping." },
      { ko: "교환할 수 있어요?", romanize: "gyo-hwan-hal su it-sseo-yo?", en: "Can I exchange this?", emoji: "↩️", tip: "Korean stores usually allow exchange within 7-30 days with receipt." },
      { ko: "세일 언제예요?", romanize: "se-il eon-je-ye-yo?", en: "When is the sale?", emoji: "🏷️", tip: "Big sales in January and July in Korea. Also check Coupang for daily deals online." },
    ],
  },
];

function PhraseCard({ phrase, catBg, catBorder, catColor }: {
  phrase: Phrase;
  catBg: string;
  catBorder: string;
  catColor: string;
}) {
  const [copied, setCopied] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phrase.ko).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(phrase.ko);
      utterance.lang = "ko-KR";
      utterance.rate = 0.85;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      variants={fadeUp}
      data-testid={`card-phrase-${phrase.ko.slice(0, 8).replace(/\s/g, "-")}`}
      onClick={() => setFlipped(!flipped)}
      className={`cursor-pointer rounded-2xl border p-4 flex flex-col gap-2 transition-all duration-200 hover:shadow-md active:scale-[0.98] ${
        flipped ? `${catBg} ${catBorder}` : "bg-card border-border"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className="text-xl mt-0.5 shrink-0">{phrase.emoji}</span>
          <div className="min-w-0">
            <p className="font-bold text-foreground text-base leading-snug">{phrase.ko}</p>
            <p className={`text-xs mt-0.5 font-medium ${catColor}`}>{phrase.romanize}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={handleSpeak} title="Hear pronunciation"
            className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
            <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button onClick={handleCopy} title="Copy Korean text"
            className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {/* English meaning */}
      <p className="text-sm text-muted-foreground">{phrase.en}</p>

      {/* Tip — shown on flip */}
      {flipped && phrase.tip && (
        <div className="mt-1 rounded-lg bg-white/60 border border-white/80 px-3 py-2">
          <p className="text-xs text-foreground/80 leading-relaxed">💡 {phrase.tip}</p>
        </div>
      )}
      {!flipped && (
        <p className="text-[10px] text-muted-foreground/50 mt-1">Tap for tip →</p>
      )}
    </motion.div>
  );
}

function CategorySection({ cat }: { cat: Category }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section ref={ref} id={cat.id} initial="hidden" animate={inView ? "visible" : "hidden"} variants={stagger}>
      <motion.div variants={fadeUp} className="mb-4 flex items-center gap-3">
        <span className="text-2xl">{cat.icon}</span>
        <h2 className={`font-serif text-xl font-bold ${cat.color}`}>{cat.title}</h2>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">{cat.phrases.length} phrases</span>
      </motion.div>
      <div className="grid sm:grid-cols-2 gap-3">
        {cat.phrases.map((p) => (
          <PhraseCard key={p.ko} phrase={p} catBg={cat.bg} catBorder={cat.border} catColor={cat.color} />
        ))}
      </div>
    </motion.section>
  );
}

export default function Korean() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCats = CATEGORIES
    .filter((c) => activeCategory === "all" || c.id === activeCategory)
    .map((c) => ({
      ...c,
      phrases: c.phrases.filter(
        (p) =>
          search === "" ||
          p.ko.includes(search) ||
          p.en.toLowerCase().includes(search.toLowerCase()) ||
          p.romanize.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((c) => c.phrases.length > 0);

  const totalPhrases = CATEGORIES.reduce((a, c) => a + c.phrases.length, 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link href="/" data-testid="link-back-home"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">🇰🇷</span>
            <span className="font-serif text-lg font-bold text-foreground">Korean Phrases</span>
          </div>
          <span className="ml-auto text-xs text-muted-foreground hidden sm:block">Tap any card for a tip</span>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-primary text-primary-foreground px-4 py-12 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-5xl mb-4">🇰🇷</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3">Korean Cheat Sheet</h1>
          <p className="text-primary-foreground/80 max-w-md mx-auto">
            {totalPhrases} essential phrases · 8 categories · Tap any card for tips · Tap 🔊 to hear pronunciation
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6 flex flex-wrap gap-2 justify-center">
          {CATEGORIES.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors">
              {c.icon} {c.title}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Sticky filters */}
      <div className="sticky top-[57px] z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 space-y-3">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            data-testid="input-phrase-search"
            type="text" placeholder="Search Korean, English, or pronunciation…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          <button onClick={() => setActiveCategory("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${activeCategory === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
            All
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)}
              data-testid={`filter-cat-${c.id}`}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${activeCategory === c.id ? `${c.bg} ${c.color} ${c.border}` : "border-border text-muted-foreground hover:text-foreground"}`}>
              {c.icon} {c.title.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-10 space-y-12">
        {filteredCats.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">No phrases found for "{search}"</p>
            <button onClick={() => setSearch("")} className="mt-3 text-sm text-primary underline">Clear search</button>
          </div>
        ) : (
          filteredCats.map((cat) => <CategorySection key={cat.id} cat={cat} />)
        )}

        {/* Alphabet reminder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-6 rounded-2xl bg-primary text-primary-foreground"
        >
          <h3 className="font-serif text-xl font-bold mb-2">Pro tip: Learn Hangul first 🎯</h3>
          <p className="text-primary-foreground/85 text-sm leading-relaxed mb-4">
            Hangul (Korean alphabet) has only 24 letters and takes about 2-3 hours to learn. Once you can read it,
            you can sound out menus, signs, and bus stops — even without knowing what they mean!
          </p>
          <a href="https://www.duolingo.com/course/ko/en/Learn-Korean" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary text-sm font-semibold hover:bg-white/90 transition">
            Learn Hangul on Duolingo →
          </a>
        </motion.div>

        {/* Emergency cheat card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-5 rounded-2xl bg-red-50 border border-red-200"
        >
          <h3 className="font-bold text-red-700 mb-3">🆘 Emergency Numbers — Save These Now</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { num: "112", label: "Police", icon: "👮" },
              { num: "119", label: "Fire & Ambulance", icon: "🚑" },
              { num: "1345", label: "Foreigner Help", icon: "🌐" },
            ].map((e) => (
              <div key={e.num} className="bg-white rounded-xl p-3 text-center border border-red-100">
                <p className="text-2xl mb-1">{e.icon}</p>
                <p className="text-xl font-bold text-red-700">{e.num}</p>
                <p className="text-xs text-red-600 font-medium mt-0.5">{e.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-600 mt-3 leading-relaxed">
            1345 (Foreigner Help Line) is available 24/7 in Bengali and English — immigration, legal, and emergency support.
          </p>
        </motion.div>
      </main>

      <footer className="py-8 px-4 border-t border-border text-center text-xs text-muted-foreground/60">
        Galib on the Go · Korean phrases for Muslim students in South Korea · Tap 🔊 to hear pronunciation via your device
      </footer>
    </div>
  );
}
