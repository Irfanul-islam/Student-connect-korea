import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { Search, Clock, Flame, ChevronLeft, ExternalLink, Youtube, Zap, Beef, Leaf } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

type Tag = "easy" | "fast" | "heavy";
type Cuisine =
  | "Bangladeshi"
  | "Korean"
  | "Italian"
  | "Indian"
  | "Japanese"
  | "Middle Eastern"
  | "Western"
  | "Chinese"
  | "Thai"
  | "Mexican";

interface Recipe {
  name: string;
  cuisine: Cuisine;
  tags: Tag[];
  time: string;
  calories: string;
  description: string;
  ingredients: string[];
  youtubeUrl: string;
  recipeUrl: string;
  emoji: string;
}

const RECIPES: Recipe[] = [
  // ── Bangladeshi ──────────────────────────────────────────────
  {
    name: "Khichuri",
    cuisine: "Bangladeshi",
    tags: ["easy", "heavy"],
    time: "30 min",
    calories: "~450 kcal",
    description: "Comforting one-pot rice and lentil dish. Perfect for rainy days and when you miss home.",
    ingredients: ["Rice", "Masoor or moong dal", "Onion", "Ginger-garlic paste", "Turmeric", "Cumin", "Oil", "Salt"],
    youtubeUrl: "https://www.youtube.com/results?search_query=bangladeshi+khichuri+recipe",
    recipeUrl: "https://www.recipesaresimple.com/khichuri-bangladeshi-style/",
    emoji: "🍚",
  },
  {
    name: "Egg Bhaji",
    cuisine: "Bangladeshi",
    tags: ["easy", "fast"],
    time: "15 min",
    calories: "~280 kcal",
    description: "Spiced fried eggs with onion and green chili. A staple student meal — quick, cheap, filling.",
    ingredients: ["Eggs", "Onion", "Green chili", "Turmeric", "Oil", "Salt"],
    youtubeUrl: "https://www.youtube.com/results?search_query=bangladeshi+egg+bhaji+recipe",
    recipeUrl: "https://www.recipesaresimple.com/dimer-bhaji/",
    emoji: "🥚",
  },
  {
    name: "Dal Bhat",
    cuisine: "Bangladeshi",
    tags: ["easy", "heavy"],
    time: "25 min",
    calories: "~400 kcal",
    description: "The everyday rice and lentil meal of Bangladesh. Simple ingredients, deeply satisfying.",
    ingredients: ["Red lentils", "Rice", "Onion", "Garlic", "Turmeric", "Mustard oil", "Salt", "Green chili"],
    youtubeUrl: "https://www.youtube.com/results?search_query=bangladeshi+dal+bhat+recipe",
    recipeUrl: "https://www.allrecipes.com/recipe/red-lentil-dal/",
    emoji: "🍛",
  },
  {
    name: "Chicken Curry",
    cuisine: "Bangladeshi",
    tags: ["easy", "heavy"],
    time: "40 min",
    calories: "~520 kcal",
    description: "Bold, aromatic Bangladeshi-style chicken curry. Serve with rice or roti.",
    ingredients: ["Chicken", "Onion", "Tomato", "Ginger-garlic paste", "Coriander", "Cumin", "Chili powder", "Oil", "Garam masala"],
    youtubeUrl: "https://www.youtube.com/results?search_query=bangladeshi+chicken+curry+recipe",
    recipeUrl: "https://www.recipesaresimple.com/bangladeshi-chicken-curry/",
    emoji: "🍗",
  },
  {
    name: "Aloo Bhorta",
    cuisine: "Bangladeshi",
    tags: ["easy", "fast"],
    time: "20 min",
    calories: "~220 kcal",
    description: "Mashed potato with mustard oil, onion, and chili. The simplest comfort food.",
    ingredients: ["Potatoes", "Mustard oil", "Onion", "Green chili", "Salt"],
    youtubeUrl: "https://www.youtube.com/results?search_query=aloo+bhorta+bangladeshi+recipe",
    recipeUrl: "https://www.recipesaresimple.com/aloo-bhorta/",
    emoji: "🥔",
  },

  // ── Korean ───────────────────────────────────────────────────
  {
    name: "Kimchi Fried Rice",
    cuisine: "Korean",
    tags: ["easy", "fast"],
    time: "12 min",
    calories: "~380 kcal",
    description: "Classic Korean pantry meal. Uses leftover rice and kimchi — both easy to find in Korea.",
    ingredients: ["Cooked rice", "Kimchi", "Sesame oil", "Soy sauce", "Egg", "Green onion", "Butter"],
    youtubeUrl: "https://www.youtube.com/results?search_query=kimchi+fried+rice+recipe+easy",
    recipeUrl: "https://www.koreanbapsang.com/kimchi-fried-rice/",
    emoji: "🍳",
  },
  {
    name: "Ramyeon (Korean Instant Noodles)",
    cuisine: "Korean",
    tags: ["easy", "fast"],
    time: "5 min",
    calories: "~500 kcal",
    description: "Korea's national student food. Add egg, cheese, or vegetables to upgrade it.",
    ingredients: ["Ramyeon packet", "Water", "Egg (optional)", "Cheese slice (optional)", "Green onion"],
    youtubeUrl: "https://www.youtube.com/results?search_query=korean+ramyeon+upgrade+recipe",
    recipeUrl: "https://www.maangchi.com/recipe/ramyeon",
    emoji: "🍜",
  },
  {
    name: "Gyeran Mari (Egg Roll)",
    cuisine: "Korean",
    tags: ["easy", "fast"],
    time: "10 min",
    calories: "~200 kcal",
    description: "Korean rolled omelette. Fluffy, light, and goes with anything. Great for lunch boxes.",
    ingredients: ["Eggs", "Green onion", "Carrot", "Salt", "Oil"],
    youtubeUrl: "https://www.youtube.com/results?search_query=gyeran+mari+korean+egg+roll+recipe",
    recipeUrl: "https://www.koreanbapsang.com/gyeran-mari-korean-egg-roll/",
    emoji: "🥚",
  },
  {
    name: "Doenjang Jjigae (Soybean Paste Stew)",
    cuisine: "Korean",
    tags: ["easy", "heavy"],
    time: "25 min",
    calories: "~300 kcal",
    description: "Hearty Korean stew with tofu and vegetables. Rich, umami flavour — great with rice.",
    ingredients: ["Doenjang paste", "Tofu", "Zucchini", "Mushrooms", "Onion", "Anchovy stock or water", "Green chili"],
    youtubeUrl: "https://www.youtube.com/results?search_query=doenjang+jjigae+recipe+easy",
    recipeUrl: "https://www.maangchi.com/recipe/doenjang-jjigae",
    emoji: "🍲",
  },
  {
    name: "Bibimbap",
    cuisine: "Korean",
    tags: ["easy", "heavy"],
    time: "30 min",
    calories: "~550 kcal",
    description: "Iconic Korean bowl of rice, seasoned vegetables, egg, and gochujang sauce. Colourful and nutritious.",
    ingredients: ["Cooked rice", "Spinach", "Carrot", "Bean sprouts", "Mushrooms", "Egg", "Gochujang", "Sesame oil", "Soy sauce"],
    youtubeUrl: "https://www.youtube.com/results?search_query=bibimbap+recipe+easy+home",
    recipeUrl: "https://www.koreanbapsang.com/bibimbap-korean-mixed-rice-with-vegetables/",
    emoji: "🥗",
  },

  // ── Italian ──────────────────────────────────────────────────
  {
    name: "Pasta Aglio e Olio",
    cuisine: "Italian",
    tags: ["easy", "fast"],
    time: "15 min",
    calories: "~430 kcal",
    description: "The classic Italian student dish — just garlic, olive oil, and pasta. Cheap and stunning.",
    ingredients: ["Spaghetti", "Garlic", "Olive oil", "Chili flakes", "Parsley", "Salt"],
    youtubeUrl: "https://www.youtube.com/results?search_query=pasta+aglio+e+olio+recipe",
    recipeUrl: "https://www.seriouseats.com/pasta-aglio-e-olio-recipe",
    emoji: "🍝",
  },
  {
    name: "Tomato Basil Pasta",
    cuisine: "Italian",
    tags: ["easy", "fast"],
    time: "20 min",
    calories: "~400 kcal",
    description: "Fresh tomato sauce with garlic and basil. No fancy skills needed — just a pot and a pan.",
    ingredients: ["Pasta", "Canned tomatoes", "Garlic", "Olive oil", "Basil", "Salt", "Black pepper"],
    youtubeUrl: "https://www.youtube.com/results?search_query=simple+tomato+pasta+recipe",
    recipeUrl: "https://www.simplyrecipes.com/recipes/pasta_al_pomodoro/",
    emoji: "🍅",
  },
  {
    name: "Carbonara (no cream version)",
    cuisine: "Italian",
    tags: ["easy", "heavy"],
    time: "20 min",
    calories: "~620 kcal",
    description: "Authentic Roman pasta. Creamy from eggs and cheese — no cream needed. Filling and rich.",
    ingredients: ["Spaghetti", "Eggs", "Parmesan or Pecorino", "Bacon or pancetta", "Black pepper", "Salt"],
    youtubeUrl: "https://www.youtube.com/results?search_query=authentic+carbonara+recipe+no+cream",
    recipeUrl: "https://www.seriouseats.com/the-best-carbonara-pasta-recipe",
    emoji: "🧀",
  },

  // ── Indian ───────────────────────────────────────────────────
  {
    name: "Dal Tadka",
    cuisine: "Indian",
    tags: ["easy", "heavy"],
    time: "30 min",
    calories: "~350 kcal",
    description: "Tempered lentils with spices. A complete protein-rich meal with rice or bread.",
    ingredients: ["Yellow lentils (toor dal)", "Tomato", "Onion", "Garlic", "Cumin", "Turmeric", "Ghee or oil", "Chili"],
    youtubeUrl: "https://www.youtube.com/results?search_query=dal+tadka+recipe+easy",
    recipeUrl: "https://www.vegrecipesofindia.com/dal-tadka-recipe/",
    emoji: "🫘",
  },
  {
    name: "Chana Masala",
    cuisine: "Indian",
    tags: ["easy", "heavy"],
    time: "25 min",
    calories: "~380 kcal",
    description: "Spiced chickpea curry. Use canned chickpeas to make it fast. High protein, very filling.",
    ingredients: ["Canned chickpeas", "Tomato", "Onion", "Garlic", "Ginger", "Cumin", "Coriander", "Garam masala", "Chili"],
    youtubeUrl: "https://www.youtube.com/results?search_query=chana+masala+recipe+easy+canned+chickpeas",
    recipeUrl: "https://www.cookingclassy.com/chana-masala/",
    emoji: "🫘",
  },
  {
    name: "Egg Curry",
    cuisine: "Indian",
    tags: ["easy", "fast"],
    time: "20 min",
    calories: "~340 kcal",
    description: "Boiled eggs in a spiced tomato-onion gravy. Budget-friendly, quick, and satisfying.",
    ingredients: ["Eggs", "Tomato", "Onion", "Garlic", "Ginger", "Turmeric", "Chili powder", "Garam masala", "Oil"],
    youtubeUrl: "https://www.youtube.com/results?search_query=easy+egg+curry+recipe",
    recipeUrl: "https://www.vegrecipesofindia.com/egg-curry-recipe/",
    emoji: "🥚",
  },

  // ── Japanese ─────────────────────────────────────────────────
  {
    name: "Tamago Gohan (TKG)",
    cuisine: "Japanese",
    tags: ["easy", "fast"],
    time: "5 min",
    calories: "~280 kcal",
    description: "Raw egg on hot rice with soy sauce. Japan's beloved 5-minute meal. Incredibly simple.",
    ingredients: ["Hot cooked rice", "1 fresh egg", "Soy sauce", "Sesame oil (optional)", "Spring onion"],
    youtubeUrl: "https://www.youtube.com/results?search_query=tamago+kake+gohan+recipe",
    recipeUrl: "https://www.justonecookbook.com/tamago-kake-gohan/",
    emoji: "🍳",
  },
  {
    name: "Miso Soup",
    cuisine: "Japanese",
    tags: ["easy", "fast"],
    time: "10 min",
    calories: "~80 kcal",
    description: "Simple Japanese soup with tofu and seaweed. Comforting and warming for cold Korean winters.",
    ingredients: ["Miso paste", "Tofu", "Dried wakame seaweed", "Green onion", "Water"],
    youtubeUrl: "https://www.youtube.com/results?search_query=easy+miso+soup+recipe",
    recipeUrl: "https://www.justonecookbook.com/homemade-miso-soup/",
    emoji: "🍵",
  },
  {
    name: "Oyakodon (Chicken & Egg Bowl)",
    cuisine: "Japanese",
    tags: ["easy", "fast", "heavy"],
    time: "20 min",
    calories: "~520 kcal",
    description: "Chicken and egg simmered in a sweet soy broth over rice. Incredibly comforting and filling.",
    ingredients: ["Chicken thigh", "Eggs", "Onion", "Soy sauce", "Mirin", "Dashi or water", "Sugar", "Rice"],
    youtubeUrl: "https://www.youtube.com/results?search_query=oyakodon+recipe+easy",
    recipeUrl: "https://www.justonecookbook.com/oyakodon/",
    emoji: "🍚",
  },

  // ── Middle Eastern ────────────────────────────────────────────
  {
    name: "Shakshuka",
    cuisine: "Middle Eastern",
    tags: ["easy", "fast", "heavy"],
    time: "20 min",
    calories: "~300 kcal",
    description: "Eggs poached in a spiced tomato sauce. One pan, minimal ingredients, deeply flavourful.",
    ingredients: ["Eggs", "Canned tomatoes", "Bell pepper", "Onion", "Garlic", "Cumin", "Paprika", "Chili", "Olive oil"],
    youtubeUrl: "https://www.youtube.com/results?search_query=shakshuka+recipe+easy",
    recipeUrl: "https://www.seriouseats.com/shakshuka-eggs-tomatoes-peppers-recipe",
    emoji: "🫑",
  },
  {
    name: "Lentil Soup (Shorbat Adas)",
    cuisine: "Middle Eastern",
    tags: ["easy", "heavy"],
    time: "30 min",
    calories: "~320 kcal",
    description: "Creamy red lentil soup with cumin and lemon. Warming, nutritious, and very affordable.",
    ingredients: ["Red lentils", "Onion", "Garlic", "Cumin", "Turmeric", "Lemon juice", "Olive oil", "Salt"],
    youtubeUrl: "https://www.youtube.com/results?search_query=middle+eastern+red+lentil+soup+recipe",
    recipeUrl: "https://www.themediterraneandish.com/red-lentil-soup/",
    emoji: "🥣",
  },
  {
    name: "Hummus with Flatbread",
    cuisine: "Middle Eastern",
    tags: ["easy", "fast"],
    time: "10 min",
    calories: "~250 kcal",
    description: "Creamy homemade hummus using canned chickpeas. Ready in 10 minutes with a blender.",
    ingredients: ["Canned chickpeas", "Tahini", "Lemon juice", "Garlic", "Olive oil", "Cumin", "Salt"],
    youtubeUrl: "https://www.youtube.com/results?search_query=easy+homemade+hummus+recipe",
    recipeUrl: "https://www.inspiredtaste.net/15938/easy-and-smooth-hummus-recipe/",
    emoji: "🫓",
  },

  // ── Western ───────────────────────────────────────────────────
  {
    name: "Classic Omelette",
    cuisine: "Western",
    tags: ["easy", "fast"],
    time: "8 min",
    calories: "~260 kcal",
    description: "The ultimate fast meal. Master this and you always have a solid meal option.",
    ingredients: ["Eggs", "Butter", "Salt", "Black pepper", "Cheese (optional)", "Vegetables of choice"],
    youtubeUrl: "https://www.youtube.com/results?search_query=perfect+omelette+recipe+gordon+ramsay",
    recipeUrl: "https://www.seriouseats.com/how-to-make-a-perfect-french-omelette",
    emoji: "🍳",
  },
  {
    name: "Chicken Stir-fry",
    cuisine: "Western",
    tags: ["easy", "fast", "heavy"],
    time: "18 min",
    calories: "~480 kcal",
    description: "High-protein chicken stir-fry with vegetables. Flexible — use whatever vegetables you have.",
    ingredients: ["Chicken breast", "Bell peppers", "Broccoli", "Garlic", "Soy sauce", "Oyster sauce", "Cornstarch", "Oil"],
    youtubeUrl: "https://www.youtube.com/results?search_query=easy+chicken+stir+fry+recipe",
    recipeUrl: "https://www.recipetineats.com/chicken-stir-fry/",
    emoji: "🥦",
  },
  {
    name: "Avocado Toast",
    cuisine: "Western",
    tags: ["easy", "fast"],
    time: "5 min",
    calories: "~280 kcal",
    description: "Quick, nutritious breakfast or snack. Add a fried egg to make it a full meal.",
    ingredients: ["Bread", "Avocado", "Lemon juice", "Salt", "Chili flakes", "Egg (optional)"],
    youtubeUrl: "https://www.youtube.com/results?search_query=avocado+toast+recipe",
    recipeUrl: "https://www.simplyrecipes.com/recipes/avocado_toast/",
    emoji: "🥑",
  },

  // ── Chinese ───────────────────────────────────────────────────
  {
    name: "Egg Fried Rice",
    cuisine: "Chinese",
    tags: ["easy", "fast", "heavy"],
    time: "12 min",
    calories: "~420 kcal",
    description: "The ultimate leftover-rice meal. Wok-fried with eggs, soy sauce, and green onion.",
    ingredients: ["Cooked rice (day-old)", "Eggs", "Soy sauce", "Sesame oil", "Green onion", "Garlic", "Oil", "Salt"],
    youtubeUrl: "https://www.youtube.com/results?search_query=egg+fried+rice+wok+recipe",
    recipeUrl: "https://www.seriouseats.com/the-food-lab-the-rice-question-how-to-make-egg-fried-rice",
    emoji: "🍳",
  },
  {
    name: "Mapo Tofu",
    cuisine: "Chinese",
    tags: ["easy", "heavy"],
    time: "25 min",
    calories: "~380 kcal",
    description: "Silky tofu in a spicy, numbing sauce. Satisfying, economical, and packed with flavour.",
    ingredients: ["Silken tofu", "Ground pork or beef (optional)", "Doubanjiang paste", "Garlic", "Ginger", "Soy sauce", "Cornstarch", "Green onion"],
    youtubeUrl: "https://www.youtube.com/results?search_query=mapo+tofu+recipe+easy",
    recipeUrl: "https://www.seriouseats.com/real-deal-mapo-tofu-口水鸡-recipe",
    emoji: "🌶️",
  },
  {
    name: "Congee (Rice Porridge)",
    cuisine: "Chinese",
    tags: ["easy", "heavy"],
    time: "35 min",
    calories: "~250 kcal",
    description: "Thick, comforting rice porridge. Perfect when you're sick, tired, or broke. Add any toppings.",
    ingredients: ["Rice", "Water or broth", "Ginger", "Soy sauce", "Sesame oil", "Green onion", "Egg (optional)"],
    youtubeUrl: "https://www.youtube.com/results?search_query=congee+rice+porridge+recipe",
    recipeUrl: "https://www.seriouseats.com/best-congee-recipe-rice-porridge",
    emoji: "🥣",
  },

  // ── Thai ─────────────────────────────────────────────────────
  {
    name: "Pad Kra Pao (Thai Basil Stir-fry)",
    cuisine: "Thai",
    tags: ["easy", "fast", "heavy"],
    time: "15 min",
    calories: "~460 kcal",
    description: "Spicy Thai basil stir-fry with minced meat and a fried egg on top. Fast and explosive.",
    ingredients: ["Ground chicken or pork", "Thai basil", "Garlic", "Chili", "Oyster sauce", "Soy sauce", "Fish sauce", "Egg", "Oil"],
    youtubeUrl: "https://www.youtube.com/results?search_query=pad+kra+pao+thai+basil+recipe",
    recipeUrl: "https://www.recipetineats.com/thai-basil-chicken/",
    emoji: "🌿",
  },
  {
    name: "Tom Yum Soup",
    cuisine: "Thai",
    tags: ["easy", "fast"],
    time: "20 min",
    calories: "~200 kcal",
    description: "Hot and sour Thai soup. Uses readily available ingredients — warming on cold Korean winters.",
    ingredients: ["Mushrooms", "Lemongrass", "Galangal or ginger", "Kaffir lime leaves", "Fish sauce", "Lime juice", "Chili", "Coconut milk (optional)"],
    youtubeUrl: "https://www.youtube.com/results?search_query=tom+yum+soup+recipe+easy",
    recipeUrl: "https://www.recipetineats.com/tom-yum-soup/",
    emoji: "🍲",
  },

  // ── Mexican ───────────────────────────────────────────────────
  {
    name: "Bean & Cheese Quesadilla",
    cuisine: "Mexican",
    tags: ["easy", "fast"],
    time: "10 min",
    calories: "~380 kcal",
    description: "Crispy tortilla filled with beans and melted cheese. Minimal ingredients, maximum satisfaction.",
    ingredients: ["Flour tortillas", "Canned beans", "Cheese", "Cumin", "Chili powder", "Oil"],
    youtubeUrl: "https://www.youtube.com/results?search_query=bean+cheese+quesadilla+recipe",
    recipeUrl: "https://www.simplyrecipes.com/recipes/bean_and_cheese_quesadillas/",
    emoji: "🌮",
  },
  {
    name: "Huevos Rancheros",
    cuisine: "Mexican",
    tags: ["easy", "fast", "heavy"],
    time: "15 min",
    calories: "~440 kcal",
    description: "Fried eggs on tortillas with a simple tomato-chili sauce. Filling, fast, and full of flavour.",
    ingredients: ["Eggs", "Tortillas", "Canned tomatoes", "Jalapeño or chili", "Garlic", "Cumin", "Oil", "Salt"],
    youtubeUrl: "https://www.youtube.com/results?search_query=huevos+rancheros+recipe+easy",
    recipeUrl: "https://www.simplyrecipes.com/recipes/huevos_rancheros/",
    emoji: "🍳",
  },
];

const ALL_CUISINES = Array.from(new Set(RECIPES.map((r) => r.cuisine))).sort();
const TAG_META: Record<Tag, { label: string; color: string; icon: React.ElementType }> = {
  easy: { label: "Easy", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Leaf },
  fast: { label: "Fast", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Zap },
  heavy: { label: "Filling", color: "bg-red-100 text-red-700 border-red-200", icon: Beef },
};

function TagBadge({ tag }: { tag: Tag }) {
  const m = TAG_META[tag];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${m.color}`}>
      <m.icon className="w-3 h-3" />
      {m.label}
    </span>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={fadeUp}
      data-testid={`card-recipe-${recipe.name.replace(/\s+/g, "-")}`}
      className="bg-card border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start gap-3">
          <span className="text-3xl mt-0.5">{recipe.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground text-base leading-snug">{recipe.name}</h3>
              <span className="text-xs bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 shrink-0">{recipe.cuisine}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {recipe.tags.map((t) => <TagBadge key={t} tag={t} />)}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" />{recipe.time}</span>
          <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-accent" />{recipe.calories}</span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{recipe.description}</p>

        {/* Ingredients */}
        <button onClick={() => setExpanded(!expanded)}
          data-testid={`button-expand-${recipe.name.replace(/\s+/g, "-")}`}
          className="text-xs text-primary font-medium text-left hover:underline flex items-center gap-1">
          {expanded ? "Hide ingredients" : `Show ingredients (${recipe.ingredients.length})`}
        </button>
        {expanded && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.ingredients.map((ing) => (
              <span key={ing} className="text-xs bg-muted/70 border border-border rounded-full px-2.5 py-1 text-muted-foreground">
                {ing}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      <div className="border-t border-border px-5 py-3 flex items-center gap-3 bg-muted/20">
        <a href={recipe.youtubeUrl} target="_blank" rel="noopener noreferrer"
          data-testid={`link-youtube-${recipe.name.replace(/\s+/g, "-")}`}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors">
          <Youtube className="w-4 h-4" />
          Watch on YouTube
        </a>
        <span className="w-px h-4 bg-border" />
        <a href={recipe.recipeUrl} target="_blank" rel="noopener noreferrer"
          data-testid={`link-recipe-${recipe.name.replace(/\s+/g, "-")}`}
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
          <ExternalLink className="w-3.5 h-3.5" />
          Full Recipe
        </a>
      </div>
    </motion.div>
  );
}

export default function Recipes() {
  const [search, setSearch] = useState("");
  const [activeCuisine, setActiveCuisine] = useState<string>("All");
  const [activeTag, setActiveTag] = useState<Tag | "All">("All");

  const filtered = RECIPES.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase()) ||
      r.ingredients.some((i) => i.toLowerCase().includes(search.toLowerCase()));
    const matchCuisine = activeCuisine === "All" || r.cuisine === activeCuisine;
    const matchTag = activeTag === "All" || r.tags.includes(activeTag);
    return matchSearch && matchCuisine && matchTag;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link href="/" data-testid="link-back-home"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground text-sm">🍽️</span>
            </span>
            <span className="font-serif text-lg font-bold text-foreground">Recipes</span>
          </div>
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} recipe{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-primary text-primary-foreground px-4 py-12 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3">Easy Recipes</h1>
          <p className="text-primary-foreground/80 max-w-lg mx-auto text-base">
            {RECIPES.length} recipes across {ALL_CUISINES.length} cuisines — from your dorm room in Korea. All with video links.
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="sticky top-[57px] z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 space-y-3">
        {/* Search */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input data-testid="input-recipe-search" type="text" placeholder="Search recipes or ingredients…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>

        {/* Tag filter */}
        <div className="flex flex-wrap gap-2 justify-center">
          {(["All", "easy", "fast", "heavy"] as const).map((tag) => {
            const isActive = activeTag === tag;
            const meta = tag !== "All" ? TAG_META[tag] : null;
            return (
              <button key={tag} data-testid={`filter-tag-${tag}`} onClick={() => setActiveTag(tag)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isActive
                    ? tag === "All" ? "bg-primary text-primary-foreground border-primary" : meta!.color + " border-current"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}>
                {meta && <meta.icon className="w-3 h-3" />}
                {tag === "All" ? "All" : TAG_META[tag].label}
              </button>
            );
          })}
        </div>

        {/* Cuisine filter */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {["All", ...ALL_CUISINES].map((c) => (
            <button key={c} data-testid={`filter-cuisine-${c}`} onClick={() => setActiveCuisine(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                activeCuisine === c
                  ? "bg-foreground text-background border-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe grid */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-4xl mb-3">🤷</p>
            <p className="font-medium">No recipes found</p>
            <p className="text-sm mt-1">Try a different search or filter</p>
            <button onClick={() => { setSearch(""); setActiveCuisine("All"); setActiveTag("All"); }}
              className="mt-4 text-sm text-primary underline">Clear filters</button>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => <RecipeCard key={r.name} recipe={r} />)}
          </motion.div>
        )}

        {/* Tip banner */}
        <div className="mt-10 p-5 rounded-2xl bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
          <strong className="text-foreground block mb-1">Student cooking tips for Korea</strong>
          <ul className="space-y-1 list-disc list-inside">
            <li>Rice cooker is the best investment for a student dorm — perfect rice every time</li>
            <li>Daiso (다이소) sells basic pots, pans, and kitchen tools very cheaply</li>
            <li>E-Mart and Lotte Mart are best for affordable vegetables and pantry staples</li>
            <li>Ansan's Wongok-dong has Bangladeshi spices, mustard oil, and South Asian ingredients</li>
            <li>Canned chickpeas, lentils, and beans are available at most supermarkets</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border text-center text-xs text-muted-foreground/60">
        Galib on the Go · Recipes from around the world for students in Korea · Video links open YouTube searches
      </footer>
    </div>
  );
}
