import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "wouter";
import { Search, Clock, Flame, ChevronLeft, Youtube, Zap, Beef, Leaf, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

type Tag = "easy" | "fast" | "heavy" | "viral";
type Cuisine =
  | "Bangladeshi" | "Korean" | "Italian" | "Indian" | "Japanese"
  | "Middle Eastern" | "Western" | "Chinese" | "Thai" | "Mexican";

interface Recipe {
  name: string;
  cuisine: Cuisine;
  tags: Tag[];
  time: string;
  calories: string;
  description: string;
  ingredients: string[];
  steps: string[];
  youtubeUrl: string;
  photoUrl: string;
}

const TAG_META: Record<Tag, { label: string; color: string; icon: React.ElementType }> = {
  easy:  { label: "Easy",   color: "bg-blue-100 text-blue-700 border-blue-200",   icon: Leaf },
  fast:  { label: "Fast",   color: "bg-amber-100 text-amber-700 border-amber-200", icon: Zap },
  heavy: { label: "Filling",color: "bg-red-100 text-red-700 border-red-200",       icon: Beef },
  viral: { label: "Viral",  color: "bg-purple-100 text-purple-700 border-purple-200", icon: Sparkles },
};

const RECIPES: Recipe[] = [
  // ── VIRAL / CHEAT MEALS ──────────────────────────────────────────────────
  {
    name: "Gochujang Butter Noodles",
    cuisine: "Korean",
    tags: ["viral", "fast", "easy"],
    time: "10 min",
    calories: "~480 kcal",
    description: "TikTok's most-made Korean noodle dish — spicy, buttery, garlicky. Goes with any noodle you have.",
    ingredients: ["Any noodles (ramen, spaghetti, or udon)", "2 tbsp butter", "2 garlic cloves (minced)", "2 tbsp gochujang paste", "1 tbsp soy sauce", "1 tsp honey or sugar", "1 tsp sesame oil", "Fried egg", "Spring onion", "Sesame seeds"],
    steps: [
      "Cook noodles according to packet — save a mug of pasta water before draining.",
      "Melt butter in the same pot over medium heat.",
      "Add minced garlic, fry 60 seconds until fragrant.",
      "Add gochujang, soy sauce, honey, sesame oil — stir into a glossy paste, 30 seconds.",
      "Add drained noodles, toss vigorously to coat every strand. Add a splash of saved pasta water if it looks too dry.",
      "Plate up and immediately top with a fried egg, sliced spring onion, and sesame seeds.",
      "Break the yolk over the noodles and mix — the yolk makes it even creamier.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=gochujang+butter+noodles+tiktok",
    photoUrl: "https://images.unsplash.com/photo-1476718406336-bb5a37c462aa?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "TikTok Baked Feta Pasta",
    cuisine: "Italian",
    tags: ["viral", "easy"],
    time: "45 min",
    calories: "~580 kcal",
    description: "The pasta that broke the internet in 2021. Block of feta + cherry tomatoes baked together = instant creamy sauce.",
    ingredients: ["200g block of feta cheese", "400g cherry tomatoes", "4 garlic cloves (whole)", "5 tbsp olive oil", "Chili flakes", "Salt & black pepper", "250g pasta (any short shape)", "Fresh basil"],
    steps: [
      "Preheat oven to 200°C / 400°F.",
      "Pour cherry tomatoes into a baking dish, scatter garlic cloves around them.",
      "Place the block of feta right in the center of the tomatoes.",
      "Drizzle everything generously with olive oil. Season with chili flakes, salt, and pepper.",
      "Bake 35-40 minutes until tomatoes blister and burst, feta is golden on top.",
      "Meanwhile cook pasta in heavily salted boiling water until al dente. Save 1 cup pasta water, then drain.",
      "Pull the dish out of the oven. Use a fork to mash the feta and burst tomatoes together into a rough sauce.",
      "Add drained pasta and toss to combine. Add pasta water gradually until sauce is silky.",
      "Tear fresh basil over the top, drizzle more olive oil.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=tiktok+baked+feta+pasta+recipe",
    photoUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Smash Burger",
    cuisine: "Western",
    tags: ["viral", "fast", "heavy"],
    time: "15 min",
    calories: "~650 kcal",
    description: "The viral technique that makes a basic burger 10x better. Thin, lacy, caramelised edges — impossible to resist.",
    ingredients: ["200g ground beef (80/20 fat ratio)", "Salt & black pepper", "2 slices American cheese", "Burger buns", "Butter for buns", "Sauce: mayo + ketchup + mustard + pickle relish", "Pickles, onion"],
    steps: [
      "Divide beef into 2 equal loose balls — do NOT compact or overwork the meat.",
      "Heat a cast iron pan or heavy skillet over maximum heat for 3-4 minutes — it must be SMOKING hot.",
      "Toast bun halves in butter in a separate pan, set aside.",
      "Mix mayo, ketchup, mustard, and relish for the sauce.",
      "Place a beef ball on the screaming hot dry pan. Immediately place a sheet of parchment on top and SMASH it flat with a spatula — press hard for 10 full seconds. Remove parchment.",
      "Season the top with salt and pepper. Cook 90 seconds without touching — you need the crust to form.",
      "Flip. Immediately add a cheese slice on top. Cook 30-45 more seconds.",
      "Stack two patties if making a double. Assemble: sauce on bun, then pickles, then onion, then patties.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=smash+burger+recipe+home",
    photoUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Marry Me Chicken",
    cuisine: "Western",
    tags: ["viral", "heavy"],
    time: "35 min",
    calories: "~560 kcal",
    description: "So good it'll get you a marriage proposal. Creamy sun-dried tomato sauce that tastes like a restaurant.",
    ingredients: ["4 chicken thighs (bone-in or boneless)", "Salt, pepper, dried thyme, garlic powder", "2 tbsp olive oil", "4 garlic cloves (minced)", "1 cup heavy cream", "½ cup chicken broth", "½ cup sun-dried tomatoes (chopped)", "½ cup parmesan (grated)", "Chili flakes", "Dried basil or Italian seasoning"],
    steps: [
      "Pat chicken dry. Season generously with salt, pepper, thyme, garlic powder on both sides.",
      "Heat olive oil in an oven-safe pan over medium-high. Sear chicken 4 min each side until golden. Set aside on a plate.",
      "In same pan, add garlic — cook 1 min until fragrant.",
      "Pour in cream and broth. Stir to lift the brown bits from the bottom (that's flavour!).",
      "Add sun-dried tomatoes, parmesan, chili flakes, basil. Stir until sauce forms.",
      "Return chicken to pan, spoon sauce all over it.",
      "Bake in oven at 190°C / 375°F for 18-20 minutes until chicken is cooked through.",
      "Serve over pasta, rice, or with crusty bread to mop up the sauce.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=marry+me+chicken+recipe",
    photoUrl: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Egg Drop Ramen",
    cuisine: "Korean",
    tags: ["viral", "fast", "easy"],
    time: "8 min",
    calories: "~450 kcal",
    description: "Instant ramen hacked to feel like a real restaurant dish. Silky egg ribbons — not chunks — that's the secret.",
    ingredients: ["1 packet instant ramen + soup powder", "2 eggs", "1 tbsp cornstarch", "Spring onion", "Sesame oil", "400ml water"],
    steps: [
      "Cook ramen noodles as directed. Drain and set aside in a bowl.",
      "In a separate pot, bring 400ml fresh water to a gentle simmer.",
      "Add the ramen soup powder packet to the water, stir well.",
      "In a cup, whisk 2 eggs + 1 tbsp cornstarch until completely smooth — this is the key step.",
      "Keep broth at a gentle simmer (NOT a rolling boil). Use a spoon to stir the broth in one direction creating a slow swirl.",
      "Slowly pour the egg mixture in a thin steady stream into the swirling broth. The egg will set into silky ribbons within 10 seconds. Stop stirring immediately after pouring.",
      "Pour the silky egg broth over the noodles. Finish with sesame oil and spring onion.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=egg+drop+ramen+tiktok+silky",
    photoUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "3-Ingredient Nutella Mug Cake",
    cuisine: "Western",
    tags: ["viral", "fast", "easy"],
    time: "3 min",
    calories: "~380 kcal",
    description: "Zero effort, no oven, 3 minutes. Possibly the most dangerous recipe in this list — too easy to make every night.",
    ingredients: ["3 tbsp Nutella (heaped)", "1 egg", "2 tbsp plain flour", "Pinch of salt"],
    steps: [
      "Get a large microwave-safe mug.",
      "Add 3 heaped tablespoons of Nutella to the mug.",
      "Crack 1 egg in.",
      "Add 2 tbsp plain flour and a small pinch of salt.",
      "Mix VIGOROUSLY with a fork for about 30 seconds until completely smooth — no streaks, no lumps.",
      "Microwave on HIGH for 60-75 seconds. Check at 60s — center should be just barely set (slightly wobbly is fine).",
      "Let cool 1-2 minutes before eating — it firms up as it cools. Eat straight from the mug.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=3+ingredient+nutella+mug+cake+microwave",
    photoUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Dubai Chocolate Bar",
    cuisine: "Middle Eastern",
    tags: ["viral", "easy"],
    time: "25 min + 1 hr chill",
    calories: "~420 kcal per bar",
    description: "The viral chocolate bar that sold out worldwide. Pistachio cream + crispy kataifi inside melted chocolate.",
    ingredients: ["300g dark or milk chocolate (chopped or chips)", "100g kataifi pastry (or crushed fine vermicelli noodles)", "2 tbsp butter", "4 tbsp pistachio cream or pistachio paste", "2 tbsp tahini", "Pinch of salt"],
    steps: [
      "Melt butter in a pan over medium heat. Add kataifi/vermicelli and toast, stirring constantly, until golden and crispy (5-8 min). Let cool.",
      "Mix the toasted crispy pastry with pistachio cream, tahini, and a pinch of salt. It should be crumbly but hold together when pressed.",
      "Melt chocolate in a double boiler (bowl over hot water) or microwave in 30-second bursts, stirring each time.",
      "Line a rectangular mold or ice cube tray with parchment paper.",
      "Pour half the melted chocolate in. Tilt and tap to coat the bottom and sides evenly. Let set in fridge 10 min.",
      "Spoon the pistachio filling over the chocolate layer, pressing gently and evenly.",
      "Pour remaining chocolate over the filling to seal. Tap to level.",
      "Refrigerate 1 hour minimum until fully set. Unmold and break or slice into pieces.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=dubai+chocolate+bar+recipe+pistachio",
    photoUrl: "https://images.unsplash.com/photo-1548940392-7a2d29c75f93?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Viral Crispy Garlic Butter Noodles",
    cuisine: "Chinese",
    tags: ["viral", "fast", "easy"],
    time: "12 min",
    calories: "~460 kcal",
    description: "Ultra-simple noodles with crispy garlic bits and rich butter. Better than most restaurant noodle dishes.",
    ingredients: ["200g any noodles", "3 tbsp butter", "1 tbsp neutral oil", "6-8 garlic cloves (minced)", "1.5 tbsp soy sauce", "1 tsp oyster sauce", "1 tsp sesame oil", "Fried egg", "Spring onion"],
    steps: [
      "Cook noodles, drain well. Pat dry with a kitchen cloth — dry noodles = crispy noodles.",
      "Heat butter + oil in a wok or large pan over medium heat.",
      "Add all the minced garlic at once — let it sizzle in the butter. Don't walk away! Stir every 30 sec until golden and fragrant, about 3 min. Keep heat medium-low so it doesn't burn.",
      "Turn heat to high. Add noodles — spread flat, press down, and DON'T STIR for 2 minutes to build crispy bits.",
      "Toss, press flat again, another minute. You want some crispy, some chewy sections.",
      "Add soy sauce, oyster sauce, sesame oil. Toss everything to coat evenly.",
      "Plate up immediately with a fried egg on top and spring onion.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=crispy+garlic+butter+noodles+viral",
    photoUrl: "https://images.unsplash.com/photo-1476718406336-bb5a37c462aa?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Spicy Gochujang Fried Rice",
    cuisine: "Korean",
    tags: ["viral", "fast", "easy"],
    time: "12 min",
    calories: "~420 kcal",
    description: "The Korean stir-fry that's permanently on rotation for students. Smoky, spicy, and deeply satisfying.",
    ingredients: ["2 cups day-old cooked rice (cold)", "2 tbsp gochujang paste", "1 tbsp soy sauce", "1 tbsp butter", "2 garlic cloves (minced)", "1 tsp sesame oil", "Fried egg", "Spring onion"],
    steps: [
      "IMPORTANT: use cold day-old rice — fresh warm rice will be mushy.",
      "Heat butter in a pan or wok over high heat until it starts to brown slightly.",
      "Add minced garlic, stir 30 seconds.",
      "Add cold rice, break up clumps with the spatula. Press flat against the pan — don't stir for 2 minutes to get crispy bits.",
      "Make a small well in the center of the rice. Add gochujang paste to the well and let it fry and toast in the exposed pan for 30 seconds.",
      "Stir everything together — the toasted gochujang coats the rice with a smoky deep flavour.",
      "Add soy sauce and sesame oil, toss again. Top with a fried egg and spring onion.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=gochujang+fried+rice+recipe",
    photoUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb054?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Viral Cucumber Salad",
    cuisine: "Korean",
    tags: ["viral", "fast", "easy"],
    time: "15 min",
    calories: "~90 kcal",
    description: "The salad that went viral for a reason — crunchy, spicy, tangy, and completely addictive as a side dish.",
    ingredients: ["2 cucumbers", "1 tsp salt (for prep)", "1 tbsp gochugaru (Korean chili flakes)", "2 garlic cloves (minced)", "1 tbsp rice vinegar", "1 tbsp soy sauce", "1 tsp sesame oil", "1 tsp sugar", "Sesame seeds", "Spring onion"],
    steps: [
      "Slice cucumbers very thin — use a mandoline or sharp knife. Diagonal slices look nicest.",
      "Put sliced cucumbers in a bowl, add 1 tsp salt, toss, and let sit 10 minutes. The salt draws out excess water.",
      "After 10 minutes, squeeze the cucumbers FIRMLY with your hands in batches, getting out as much water as possible. This is the most important step for crunch.",
      "Mix the dressing in the bowl: gochugaru, minced garlic, rice vinegar, soy sauce, sesame oil, sugar.",
      "Add the squeezed cucumbers to the dressing, toss until every slice is coated.",
      "Garnish with sesame seeds and spring onion.",
      "Can eat immediately or let sit 15-20 min for even more flavour. Keeps in fridge for 2 days.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=viral+korean+cucumber+salad+recipe",
    photoUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Birria-Style Beef Tacos",
    cuisine: "Mexican",
    tags: ["viral", "heavy"],
    time: "2 hr",
    calories: "~620 kcal",
    description: "The cheesy dippable tacos that exploded on social media. Rich braised beef with a consommé for dunking — worth every minute.",
    ingredients: ["500g beef chuck (cut into chunks)", "3 dried chilies (ancho or guajillo) or 2 tbsp chili powder", "1 onion", "4 garlic cloves", "1 can crushed tomatoes", "Cumin, oregano, salt, pepper", "Corn tortillas", "Mozzarella or cheddar cheese", "Fresh onion and cilantro"],
    steps: [
      "Season beef chunks with salt, pepper, cumin, and oregano.",
      "Brown beef in oil in a heavy pot over high heat — 2-3 min each side. Don't crowd the pot.",
      "Add chopped onion + garlic, cook 2 min. Add canned tomatoes, chili powder/dried chilies, 2 cups water.",
      "Bring to boil, then reduce to lowest heat. Cover and braise 1.5-2 hours until beef is fall-apart tender.",
      "Remove beef, shred with two forks. Strain and reserve the broth (consommé) in a bowl.",
      "Heat a pan. Dip a tortilla into the consommé, then lay it flat in the hot pan.",
      "Add shredded beef and cheese to one half of the tortilla.",
      "Fold closed, press down, cook until crispy and cheese melts — flip once.",
      "Serve with a small bowl of hot consommé for dipping. Top with raw onion, cilantro, and lime.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=birria+tacos+recipe+home",
    photoUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop&auto=format&q=80",
  },

  // ── BANGLADESHI ──────────────────────────────────────────────────────────
  {
    name: "Khichuri",
    cuisine: "Bangladeshi",
    tags: ["easy", "heavy"],
    time: "30 min",
    calories: "~450 kcal",
    description: "Comforting one-pot rice and lentil dish. Perfect for rainy days and when you miss home.",
    ingredients: ["½ cup rice", "½ cup masoor or moong dal", "1 onion", "1 tsp ginger-garlic paste", "½ tsp turmeric", "1 tsp cumin", "2 tbsp oil", "Salt", "3 cups water"],
    steps: [
      "Wash rice and dal together under cold water until water runs mostly clear. Soak 10 minutes.",
      "Heat oil in a pot over medium heat. Add whole cumin seeds, let them sizzle 30 seconds.",
      "Add finely sliced onion, fry until golden-brown — about 7-8 minutes.",
      "Add ginger-garlic paste, turmeric, and cumin powder. Fry 1-2 minutes until fragrant.",
      "Drain the soaked rice and dal, add to pot. Stir to coat everything with the spiced oil.",
      "Add 3 cups water and salt to taste. Bring to a full boil.",
      "Reduce heat to the lowest setting, cover with a lid, cook 20-25 minutes. Stir occasionally.",
      "The khichuri is ready when it's thick and porridge-like. Serve topped with a fried egg and a drizzle of mustard oil.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=bangladeshi+khichuri+recipe",
    photoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Egg Bhaji (Dimer Bhaji)",
    cuisine: "Bangladeshi",
    tags: ["easy", "fast"],
    time: "15 min",
    calories: "~280 kcal",
    description: "Spiced scrambled eggs with onion and green chili. A staple student meal — quick, cheap, deeply filling.",
    ingredients: ["4 eggs", "1 large onion (sliced thin)", "2 green chilies (chopped)", "¼ tsp turmeric", "2 tbsp oil", "Salt"],
    steps: [
      "Heat oil in a non-stick or regular pan over medium heat.",
      "Add thinly sliced onion. Fry, stirring occasionally, until soft and starting to turn golden — about 5-6 minutes.",
      "Add chopped green chilies and turmeric. Stir for 30 seconds.",
      "Crack 4 eggs directly into the pan.",
      "Break the yolks with a spatula and let cook undisturbed for 1 minute — you want some structure.",
      "Gently stir and fold, mixing egg and onion together. Keep heat medium-low.",
      "Season with salt. Cook 2-3 more minutes until eggs are just set — slightly moist is better than dry.",
      "Serve immediately with steamed rice.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=bangladeshi+egg+bhaji+dimer+bhaji",
    photoUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Dal Bhat",
    cuisine: "Bangladeshi",
    tags: ["easy", "heavy"],
    time: "25 min",
    calories: "~400 kcal",
    description: "The everyday rice and lentil meal of Bangladesh. Simple ingredients, deeply satisfying.",
    ingredients: ["1 cup red lentils", "1 onion", "3 garlic cloves (sliced)", "2 green chilies", "½ tsp turmeric", "1 tbsp mustard oil", "Salt", "Steamed rice"],
    steps: [
      "Rinse lentils until water runs clear. Put in pot with 2.5 cups water.",
      "Add turmeric and bring to a boil. Skim any foam that rises.",
      "Reduce heat and simmer 15-18 minutes, stirring occasionally, until lentils are completely soft and falling apart.",
      "Meanwhile, heat mustard oil in a small pan until it just starts to smoke (this removes the sharp raw smell).",
      "Add sliced garlic — fry until golden.",
      "Add green chilies, fry 30 seconds, then immediately pour this tadka (tempering) over the cooked dal.",
      "Season with salt, stir well. The dal should be thick but still pourable.",
      "Serve over steamed rice. Add more mustard oil on top if desired.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=bangladeshi+dal+bhat+recipe",
    photoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Bangladeshi Chicken Curry",
    cuisine: "Bangladeshi",
    tags: ["easy", "heavy"],
    time: "40 min",
    calories: "~520 kcal",
    description: "Bold, aromatic Bangladeshi-style chicken curry. Serve with rice or roti.",
    ingredients: ["500g chicken (pieces with bone)", "2 onions (sliced)", "2 tomatoes (chopped)", "2 tbsp ginger-garlic paste", "1 tsp coriander powder", "1 tsp cumin powder", "1 tsp chili powder", "½ tsp turmeric", "1 tsp garam masala", "3 tbsp oil", "Salt", "Fresh coriander"],
    steps: [
      "Heat oil in a heavy pot. Add onions and fry over medium heat until dark golden — 10-12 minutes. Don't rush this step.",
      "Add ginger-garlic paste, stir 2 minutes.",
      "Add coriander, cumin, chili, turmeric. Fry the dry spices 1 minute.",
      "Add chopped tomatoes. Cook 5-7 minutes until tomatoes break down and oil separates from the masala.",
      "Add chicken pieces, stir to coat in the masala. Increase heat to medium-high.",
      "Brown the chicken 3-4 minutes — this develops flavour. Stir regularly.",
      "Add 1 cup water. Reduce heat, cover and simmer 20-25 minutes until chicken is cooked through.",
      "Finish with garam masala, stir. Garnish with fresh coriander. Serve with rice.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=bangladeshi+chicken+curry+recipe",
    photoUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Aloo Bhorta",
    cuisine: "Bangladeshi",
    tags: ["easy", "fast"],
    time: "20 min",
    calories: "~220 kcal",
    description: "Mashed potato with mustard oil, onion, and chili. The simplest comfort food from home.",
    ingredients: ["4 medium potatoes", "1 tbsp mustard oil", "½ onion (finely chopped)", "2 green chilies (finely chopped)", "Salt"],
    steps: [
      "Wash potatoes and boil whole in salted water until completely soft when pierced with a fork — about 15-18 minutes.",
      "Drain and peel while still warm. The skin comes off easily.",
      "Put peeled potatoes in a bowl and mash roughly with a fork.",
      "Add mustard oil — use real mustard oil for authentic flavour.",
      "Add finely chopped onion and green chilies. Season generously with salt.",
      "Mix and knead with your hands, pressing everything together firmly until well combined.",
      "Taste and adjust salt. The texture should be slightly chunky, not completely smooth.",
      "Serve with steamed rice and dal.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=aloo+bhorta+bangladeshi+mashed+potato",
    photoUrl: "https://images.unsplash.com/photo-1518977264203-91f69d63a8fd?w=600&h=400&fit=crop&auto=format&q=80",
  },

  // ── KOREAN ───────────────────────────────────────────────────────────────
  {
    name: "Kimchi Fried Rice",
    cuisine: "Korean",
    tags: ["easy", "fast"],
    time: "12 min",
    calories: "~380 kcal",
    description: "Classic Korean pantry meal. Day-old rice + kimchi = one of the best 10-minute meals on earth.",
    ingredients: ["2 cups day-old cold rice", "½ cup kimchi (chopped)", "1 tbsp kimchi juice", "1 tbsp soy sauce", "1 tsp sesame oil", "1 tbsp butter", "1 egg", "Spring onion", "Sesame seeds"],
    steps: [
      "MUST USE cold day-old rice — fresh rice turns mushy. Break up any clumps with your hands.",
      "Heat butter in a large pan or wok over HIGH heat until sizzling.",
      "Add chopped kimchi + kimchi juice. Stir-fry 2 minutes until kimchi is slightly caramelised.",
      "Add cold rice. Break up clumps. Press flat against pan — don't stir for 1 minute to crisp the bottom.",
      "Stir, add soy sauce and sesame oil. Toss to combine.",
      "Push rice to one side. In the empty side, crack the egg. Let it set slightly, then break yolk and scramble just until half-cooked.",
      "Fold egg through the rice. Plate up. Top with spring onion and sesame seeds.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=kimchi+fried+rice+recipe+easy",
    photoUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb054?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Ramyeon Upgrade",
    cuisine: "Korean",
    tags: ["easy", "fast"],
    time: "5 min",
    calories: "~500 kcal",
    description: "Korea's national student food, hacked to be actually impressive. Simple upgrades that feel like cheating.",
    ingredients: ["1 packet instant ramen (any brand)", "Water", "1 egg", "1 slice processed cheese", "Spring onion", "Sesame oil", "Optional: kimchi, rice cake (tteok)"],
    steps: [
      "Bring 500ml water to a FULL rolling boil.",
      "Add noodles, cook 2 minutes, stirring to separate strands.",
      "Add soup powder packet. Stir well.",
      "Crack egg directly into the pot. Do NOT stir — let it poach on top for 90 seconds.",
      "Lay the cheese slice on top of the egg and close the lid for 30 seconds to melt.",
      "Drizzle a few drops of sesame oil in right before serving.",
      "Pour into a bowl (or eat from the pot), top with spring onion. Don't waste the broth.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=ramyeon+upgrade+recipe+korean",
    photoUrl: "https://images.unsplash.com/photo-1557499305-f35a62e4e2b4?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Doenjang Jjigae",
    cuisine: "Korean",
    tags: ["easy", "heavy"],
    time: "25 min",
    calories: "~300 kcal",
    description: "Hearty Korean fermented soybean paste stew. Rich, deeply umami — the kind of stew that feels like a hug.",
    ingredients: ["2 tbsp doenjang paste (Korean soybean paste)", "1 block firm tofu (cubed)", "½ zucchini (sliced)", "4 mushrooms (sliced)", "½ onion (chopped)", "2 cups water or anchovy stock", "1 green chili", "Spring onion"],
    steps: [
      "Put 2 cups water or anchovy stock in a pot. Bring to a simmer.",
      "Add doenjang paste — use a spoon to break it up and dissolve it into the liquid.",
      "Add cubed tofu, sliced zucchini, mushrooms, and onion.",
      "Bring back to a simmer. Cook 10-12 minutes until vegetables are tender.",
      "Add sliced green chili. Taste before adding salt — doenjang is very salty already.",
      "Top with sliced spring onion. Serve in the pot with a bowl of steamed rice on the side.",
      "Optional: add a raw egg in the last 2 minutes, cover and let it half-set.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=doenjang+jjigae+recipe",
    photoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Bibimbap",
    cuisine: "Korean",
    tags: ["easy", "heavy"],
    time: "30 min",
    calories: "~550 kcal",
    description: "Korea's iconic rice bowl — colourful, nutritious, and deeply satisfying. Mix everything vigorously before eating.",
    ingredients: ["2 cups cooked rice", "1 cup spinach", "1 carrot (julienned)", "1 cup bean sprouts", "4 mushrooms (sliced)", "1 egg", "2 tbsp gochujang", "2 tbsp soy sauce", "Sesame oil", "Garlic", "Salt"],
    steps: [
      "Blanch spinach in boiling water 30 seconds, squeeze out all water, season with sesame oil + minced garlic + salt.",
      "Sauté carrots in oil with pinch of salt over medium heat 2-3 minutes until just tender.",
      "Blanch bean sprouts 1 minute, drain, season same as spinach.",
      "Sauté mushrooms with 1 tbsp soy sauce until tender and slightly caramelised.",
      "Fry egg sunny-side up — yolk should remain runny.",
      "Put warm rice in a large bowl. Arrange all prepared vegetables in separate neat sections around the edges.",
      "Place the fried egg in the very center. Add 1-2 tbsp gochujang on top.",
      "Drizzle 1 tsp sesame oil all over. When ready to eat, mix EVERYTHING together vigorously — this is essential.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=bibimbap+recipe+home+easy",
    photoUrl: "https://images.unsplash.com/photo-1590301157890-4d7b8c37dc10?w=600&h=400&fit=crop&auto=format&q=80",
  },

  // ── ITALIAN ──────────────────────────────────────────────────────────────
  {
    name: "Pasta Aglio e Olio",
    cuisine: "Italian",
    tags: ["easy", "fast"],
    time: "15 min",
    calories: "~430 kcal",
    description: "The greatest 15-minute pasta — just garlic and olive oil. Cheap, stunning, and infinitely satisfying.",
    ingredients: ["200g spaghetti", "5 garlic cloves (sliced thin)", "¼ cup olive oil", "½ tsp chili flakes", "Handful of fresh parsley (or dried)", "Salt", "Black pepper"],
    steps: [
      "Cook spaghetti in a large pot of HEAVILY salted boiling water (should taste like sea water). Save 1 cup pasta water before draining.",
      "While pasta cooks, slice garlic very thin — thin slices toast evenly, thick ones burn on one side.",
      "Heat olive oil in a wide pan over MEDIUM-LOW heat. Add garlic + chili flakes.",
      "Cook garlic gently, stirring, until light golden and fragrant — about 3-4 minutes. Golden is good. Brown means bitter. Keep the heat low.",
      "Add drained pasta to the pan immediately with a big splash of pasta water.",
      "Toss vigorously — the starchy pasta water + oil emulsify into a sauce that coats every strand.",
      "Add more pasta water tablespoon by tablespoon until the sauce is glossy and coats the pasta.",
      "Finish with fresh parsley and lots of black pepper.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=pasta+aglio+e+olio+recipe",
    photoUrl: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Tomato Basil Pasta",
    cuisine: "Italian",
    tags: ["easy", "fast"],
    time: "20 min",
    calories: "~400 kcal",
    description: "The perfect simple tomato pasta. Four ingredients, twenty minutes, actually delicious.",
    ingredients: ["200g pasta (any shape)", "1 can crushed tomatoes (400g)", "4 garlic cloves (minced)", "4 tbsp olive oil", "Fresh or dried basil", "Salt, sugar, black pepper"],
    steps: [
      "Cook pasta in heavily salted boiling water. Save 1 cup pasta water, drain.",
      "Heat olive oil in a pan. Add minced garlic, cook 2 minutes over medium heat until fragrant.",
      "Pour in canned tomatoes. Add a pinch of sugar to balance the acidity. Season with salt and pepper.",
      "Simmer 10-12 minutes, stirring occasionally, until sauce thickens slightly.",
      "Add drained pasta directly into the sauce. Toss to combine. Add pasta water if needed for consistency.",
      "Tear in fresh basil (or add dried). Drizzle extra olive oil.",
      "Taste and adjust salt. Serve immediately.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=simple+tomato+basil+pasta+recipe",
    photoUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Spaghetti Carbonara",
    cuisine: "Italian",
    tags: ["easy", "heavy"],
    time: "20 min",
    calories: "~620 kcal",
    description: "Authentic Roman carbonara — silky, rich, and completely creamless. The technique is everything here.",
    ingredients: ["200g spaghetti", "150g bacon or pancetta", "3 egg yolks + 1 whole egg", "60g parmesan or pecorino (grated)", "Lots of black pepper", "Salt for pasta water"],
    steps: [
      "In a bowl, whisk together egg yolks, 1 whole egg, all the grated parmesan, and a very generous amount of black pepper. Set aside.",
      "Cook spaghetti in heavily salted boiling water until al dente. Save 1 full cup pasta water — this is critical.",
      "Cook bacon/pancetta in a large pan until crispy and fat has rendered. Turn OFF the heat completely. This is crucial — heat kills carbonara.",
      "Add drained pasta to the bacon pan (still off heat). Toss to combine with the fat.",
      "Wait 1 minute for the pan to cool slightly, then pour the egg mixture over the pasta.",
      "Toss rapidly and continuously while adding pasta water 1 tbsp at a time. The goal is a glossy, creamy sauce — not scrambled eggs.",
      "Keep adding pasta water and tossing until you reach a silky consistency. Serve immediately with extra parmesan and black pepper.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=authentic+carbonara+recipe+no+cream",
    photoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&auto=format&q=80",
  },

  // ── INDIAN ────────────────────────────────────────────────────────────────
  {
    name: "Dal Tadka",
    cuisine: "Indian",
    tags: ["easy", "heavy"],
    time: "30 min",
    calories: "~350 kcal",
    description: "Tempered lentils with spices. Complete protein-rich meal, deeply comforting, goes with anything.",
    ingredients: ["1 cup toor dal (split pigeon peas) or yellow lentils", "2 tomatoes (chopped)", "1 onion (chopped)", "4 garlic cloves (minced)", "1 tsp cumin seeds", "½ tsp turmeric", "1 tsp chili powder", "2 tbsp ghee or oil", "Salt", "Lemon juice"],
    steps: [
      "Cook dal: rinse lentils, put in pot with 3 cups water + turmeric. Bring to boil, skim foam. Simmer 20-25 minutes until very soft and mashable.",
      "Mash dal smooth with the back of a spoon. Season with salt.",
      "Make the tadka: heat ghee in a small pan until shimmering.",
      "Add cumin seeds — they should sizzle and pop immediately.",
      "Add minced garlic, cook 1 minute until golden.",
      "Add chopped tomato + chili powder. Cook 3-4 minutes until tomato breaks down.",
      "Pour this sizzling tadka directly into the cooked dal. It will splutter — that's fine.",
      "Stir, add lemon juice, taste and adjust salt. Serve with rice or chapati.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=dal+tadka+recipe+easy",
    photoUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Chana Masala",
    cuisine: "Indian",
    tags: ["easy", "heavy"],
    time: "25 min",
    calories: "~380 kcal",
    description: "Spiced chickpea curry using canned chickpeas — protein-packed, filling, and endlessly versatile.",
    ingredients: ["1 can chickpeas (400g, drained)", "1 onion (finely chopped)", "2 tomatoes (chopped or 1 can)", "1 tbsp ginger-garlic paste", "1 tsp cumin", "1 tsp coriander powder", "½ tsp turmeric", "1 tsp chili powder", "1 tsp garam masala", "3 tbsp oil", "Salt", "Lemon juice"],
    steps: [
      "Heat oil in a pan. Add finely chopped onion, cook until dark golden — 8-10 minutes. Don't rush.",
      "Add ginger-garlic paste, cook 1-2 minutes.",
      "Add cumin, coriander, turmeric, chili powder. Stir and fry the dry spices 1 minute.",
      "Add chopped tomatoes. Cook 5-6 minutes, mashing them down, until oil separates from masala.",
      "Add drained chickpeas and ½ cup water. Stir to coat chickpeas in the sauce.",
      "Use the back of a spoon to crush a few chickpeas — this thickens the sauce naturally.",
      "Simmer 8-10 minutes until sauce is thick. Add more water if too dry.",
      "Finish with garam masala and a squeeze of lemon. Serve with rice or flatbread.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=chana+masala+recipe+canned+chickpeas",
    photoUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Egg Curry",
    cuisine: "Indian",
    tags: ["easy", "fast"],
    time: "20 min",
    calories: "~340 kcal",
    description: "Budget-friendly curry that comes together in 20 minutes. Boiled eggs in a spiced tomato gravy.",
    ingredients: ["4 eggs", "1 onion (finely chopped)", "2 tomatoes (chopped)", "1 tbsp ginger-garlic paste", "½ tsp turmeric", "1 tsp chili powder", "1 tsp coriander powder", "½ tsp garam masala", "2 tbsp oil", "Salt"],
    steps: [
      "Hard boil eggs: place in cold water, bring to boil, cook 9 minutes. Cool in cold water, peel.",
      "Lightly score each egg with a knife and shallow-fry in oil 2-3 minutes until golden all over. Set aside.",
      "In same oil, sauté onion until golden — 6-7 minutes.",
      "Add ginger-garlic paste, cook 1 minute.",
      "Add all dry spices (turmeric, chili, coriander). Fry 1 minute.",
      "Add tomatoes, cook 5 minutes until thick and oil separates.",
      "Add ½ cup water, stir to make a gravy. Season with salt.",
      "Add fried eggs, coat in sauce, simmer 4-5 minutes. Finish with garam masala.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=egg+curry+recipe+easy",
    photoUrl: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=600&h=400&fit=crop&auto=format&q=80",
  },

  // ── JAPANESE ─────────────────────────────────────────────────────────────
  {
    name: "Tamago Kake Gohan (TKG)",
    cuisine: "Japanese",
    tags: ["easy", "fast"],
    time: "5 min",
    calories: "~280 kcal",
    description: "Japan's beloved 5-minute meal — raw egg on hot rice. Sounds basic, tastes magical.",
    ingredients: ["1 bowl hot freshly cooked rice", "1 very fresh egg", "1 tsp soy sauce", "Sesame oil (optional)", "Spring onion"],
    steps: [
      "Rice must be very hot and freshly cooked — this is essential for partially cooking the egg.",
      "Crack 1 fresh egg over the rice. The egg must be very fresh — don't use this with old eggs.",
      "Add soy sauce and a few drops of sesame oil if using.",
      "Beat everything rapidly with chopsticks or a spoon for about 30 seconds until frothy and pale yellow.",
      "The heat from the rice lightly cooks the egg as you beat — it becomes creamy and almost custardy.",
      "Top with sliced spring onion. Eat immediately before the rice cools.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=tamago+kake+gohan+TKG+recipe",
    photoUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Oyakodon (Chicken & Egg Bowl)",
    cuisine: "Japanese",
    tags: ["easy", "fast", "heavy"],
    time: "20 min",
    calories: "~520 kcal",
    description: "Chicken and egg simmered in sweet soy broth over rice. One of Japan's ultimate comfort foods.",
    ingredients: ["200g chicken thigh (bite-size pieces)", "3 eggs", "½ onion (thinly sliced)", "3 tbsp soy sauce", "2 tbsp mirin", "1 tbsp sugar", "½ cup dashi stock or water", "2 bowls hot cooked rice"],
    steps: [
      "In a wide pan or small skillet, combine soy sauce, mirin, sugar, and dashi/water. Stir.",
      "Add sliced onion, bring to a simmer over medium heat. Cook 3 minutes until onion softens.",
      "Add chicken pieces, spread evenly. Cook 4-5 minutes until cooked through, turning once.",
      "Beat eggs LIGHTLY — do not fully mix. You should still see streaks of yolk and white.",
      "Pour beaten eggs over the chicken in a circular motion, covering the surface.",
      "Cover the pan with a lid immediately. Cook on LOW heat for exactly 1 minute.",
      "The egg should be just set on top but still slightly glossy and wobbly in the center — this is correct and intentional.",
      "Slide the entire portion over a bowl of hot rice without breaking the egg.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=oyakodon+recipe+Japanese+chicken+egg+bowl",
    photoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&auto=format&q=80",
  },

  // ── MIDDLE EASTERN ────────────────────────────────────────────────────────
  {
    name: "Shakshuka",
    cuisine: "Middle Eastern",
    tags: ["easy", "fast", "heavy"],
    time: "20 min",
    calories: "~300 kcal",
    description: "Eggs poached in a spiced tomato sauce. One pan, minimal effort, maximum flavour.",
    ingredients: ["4 eggs", "1 can crushed tomatoes (400g)", "1 bell pepper (chopped)", "1 onion (chopped)", "3 garlic cloves (minced)", "1 tsp cumin", "1 tsp paprika", "½ tsp chili powder", "3 tbsp olive oil", "Salt, pepper", "Flatbread to serve"],
    steps: [
      "Heat olive oil in a wide pan over medium heat. Add onion and bell pepper, cook 5-6 minutes until soft.",
      "Add minced garlic, cook 1 minute.",
      "Add cumin, paprika, chili powder. Stir and fry the spices 30 seconds.",
      "Pour in crushed tomatoes. Season with salt and pepper. Stir well.",
      "Simmer 8-10 minutes until sauce thickens. Taste and adjust seasoning.",
      "Make 4 wells in the sauce using a spoon. Crack 1 egg into each well carefully.",
      "Cover the pan with a lid. Reduce heat to low-medium. Cook 5-7 minutes.",
      "Check: whites should be set but yolks still runny. Serve straight from the pan with flatbread.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=shakshuka+recipe+easy",
    photoUrl: "https://images.unsplash.com/photo-1616501268025-7afa75ec4e9c?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Red Lentil Soup",
    cuisine: "Middle Eastern",
    tags: ["easy", "heavy"],
    time: "30 min",
    calories: "~320 kcal",
    description: "Velvety, warming lentil soup. Cheap, nutritious, and ready in 30 minutes.",
    ingredients: ["1 cup red lentils", "1 onion (chopped)", "3 garlic cloves (minced)", "1 tsp cumin", "½ tsp turmeric", "Pinch of chili", "4 cups water or stock", "3 tbsp olive oil", "Salt", "Juice of 1 lemon"],
    steps: [
      "Heat olive oil in a pot. Sauté onion until soft and translucent — 5 minutes.",
      "Add garlic, cumin, turmeric, chili. Cook 1 minute.",
      "Add rinsed red lentils and water or stock. Bring to a boil.",
      "Skim foam. Reduce heat, simmer 20-25 minutes until lentils are completely dissolved.",
      "Use an immersion blender to blend until smooth, or leave it chunky — both are correct.",
      "Add lemon juice. Taste and adjust salt.",
      "Serve with a drizzle of olive oil and a pinch of paprika or cumin on top. Bread for dipping.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=middle+eastern+red+lentil+soup+recipe",
    photoUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop&auto=format&q=80",
  },

  // ── WESTERN ───────────────────────────────────────────────────────────────
  {
    name: "Perfect Omelette",
    cuisine: "Western",
    tags: ["easy", "fast"],
    time: "8 min",
    calories: "~260 kcal",
    description: "Master this and you always have a meal ready in under 10 minutes.",
    ingredients: ["3 fresh eggs", "1 tbsp butter", "Salt, white pepper", "Filling of choice: cheese, mushrooms, spring onion"],
    steps: [
      "Crack 3 eggs into a bowl. Season with salt and a pinch of white pepper. Beat well — the mixture should be uniform pale yellow.",
      "Heat butter in a non-stick pan over medium-HIGH heat until butter foams and just stops foaming.",
      "Pour eggs in immediately. Within the first 20 seconds, drag a spatula rapidly across the pan in small quick movements — you're creating small soft curds.",
      "When top is 80% set but still slightly wet-looking, stop stirring. Let it cook 10 seconds.",
      "Add any filling to the CENTER of the omelette.",
      "Tilt the pan and fold one third of the omelette over the center, then fold again as you slide it onto the plate.",
      "The omelette should be pale yellow, barely browned, and slightly glossy. That's how you know it's perfect.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=perfect+omelette+gordon+ramsay+french",
    photoUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Easy Chicken Stir-Fry",
    cuisine: "Western",
    tags: ["easy", "fast", "heavy"],
    time: "18 min",
    calories: "~480 kcal",
    description: "High-protein one-pan meal. Ready in under 20 minutes. Use whatever vegetables you have.",
    ingredients: ["300g chicken breast (sliced thin)", "Mixed vegetables (bell pepper, broccoli, carrot, or any)", "4 garlic cloves (minced)", "2 tbsp oyster sauce", "1 tbsp soy sauce", "1 tsp sesame oil", "1 tsp cornstarch", "2 tbsp oil"],
    steps: [
      "Slice chicken very thin — thinner slices cook faster and stay juicy.",
      "Marinate: toss chicken with 1 tsp soy sauce + 1 tsp cornstarch. Set aside 5 min.",
      "Mix your sauce in a bowl: oyster sauce + remaining soy sauce + sesame oil. Set aside.",
      "Heat wok or pan until SMOKING HOT. Add oil.",
      "Add chicken in a single layer. Leave without stirring for 1 minute to sear. Stir, cook through, set aside.",
      "In same hot pan, add garlic — 30 seconds. Add harder vegetables first (carrot, broccoli), stir-fry 2 min. Add softer vegetables, 1 more min.",
      "Return chicken, pour sauce over everything. Toss 1 minute until sauce is glossy and coats everything.",
      "Serve immediately over rice.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=easy+chicken+stir+fry+recipe+home",
    photoUrl: "https://images.unsplash.com/photo-1544025162-d76538b1a6c7?w=600&h=400&fit=crop&auto=format&q=80",
  },

  // ── CHINESE ───────────────────────────────────────────────────────────────
  {
    name: "Egg Fried Rice",
    cuisine: "Chinese",
    tags: ["easy", "fast", "heavy"],
    time: "12 min",
    calories: "~420 kcal",
    description: "The ultimate leftover-rice meal. Gets better the older and colder your rice is.",
    ingredients: ["2 cups cold day-old cooked rice", "2 eggs", "2 garlic cloves (minced)", "1.5 tbsp soy sauce", "1 tsp sesame oil", "2 tbsp oil", "Spring onion", "Salt"],
    steps: [
      "Day-old cold rice is NON-NEGOTIABLE — fresh rice is too wet and won't fry properly.",
      "Heat wok or large pan over MAXIMUM heat. Add oil.",
      "Add minced garlic — stir 30 seconds.",
      "Add cold rice, breaking up any clumps. Press flat against the pan — DO NOT STIR for 2 minutes. This creates crispy bits on the bottom.",
      "Stir, press flat again for 1 minute. You want some crispy, some chewy.",
      "Push rice to the sides. Crack eggs into the center. Scramble eggs until JUST set (about 30 seconds) — don't fully cook them.",
      "Fold rice over the slightly runny eggs and mix through. The residual heat finishes cooking the egg.",
      "Add soy sauce and sesame oil, toss. Garnish with spring onion.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=egg+fried+rice+wok+recipe",
    photoUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb054?w=600&h=400&fit=crop&auto=format&q=80",
  },
  {
    name: "Congee (Rice Porridge)",
    cuisine: "Chinese",
    tags: ["easy", "heavy"],
    time: "35 min",
    calories: "~250 kcal",
    description: "The ultimate comfort food — silky broken-down rice porridge. Perfect when sick, tired, or needing something gentle.",
    ingredients: ["½ cup rice", "5 cups water or stock", "2cm ginger (grated)", "1 tbsp soy sauce", "1 tsp sesame oil", "Salt", "Any toppings: egg, spring onion, soy sauce, crispy shallots"],
    steps: [
      "Rinse ½ cup rice under cold water.",
      "Add rice + 5 cups water or stock to a pot. Bring to a full boil.",
      "Reduce heat to the lowest possible simmer. Add grated ginger.",
      "Cook 30-40 minutes, stirring every 5-10 minutes. The rice should completely dissolve into a thick, creamy porridge.",
      "The consistency should coat a spoon — add more water if too thick.",
      "Season with soy sauce, sesame oil, and salt.",
      "Serve with any toppings. Fried egg is the most satisfying. A drizzle of soy sauce and sesame oil is the minimum.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=congee+rice+porridge+recipe",
    photoUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&auto=format&q=80",
  },

  // ── THAI ─────────────────────────────────────────────────────────────────
  {
    name: "Pad Kra Pao (Thai Basil Stir-fry)",
    cuisine: "Thai",
    tags: ["easy", "fast", "heavy"],
    time: "15 min",
    calories: "~460 kcal",
    description: "Spicy Thai basil stir-fry with minced meat and a crispy fried egg. Thailand's most-eaten everyday dish.",
    ingredients: ["250g minced chicken or beef", "2 tbsp Thai basil (or regular basil)", "4 garlic cloves", "3 Thai chilies (or chili flakes)", "1 tbsp oyster sauce", "1 tbsp soy sauce", "1 tsp fish sauce", "½ tsp sugar", "2 tbsp oil", "1 egg per person"],
    steps: [
      "Finely mince (or pound) garlic and chilies together — this is what makes it authentic.",
      "For the crispy egg: heat oil in a separate pan until almost smoking. Crack egg in — it should puff and crisp around edges immediately. Cook 90 seconds — the edge should be golden and crispy, yolk still runny. Set aside.",
      "In a wok or large pan, heat oil over highest heat.",
      "Add garlic-chili mixture. Fry 20-30 seconds — very fast.",
      "Add minced meat. Spread flat, leave without stirring for 1 minute to brown.",
      "Break up meat and stir-fry until cooked through.",
      "Add oyster sauce, soy sauce, fish sauce, and sugar. Toss to combine.",
      "Add basil. Stir just until wilted — about 10 seconds. Too long = bitter.",
      "Serve immediately over rice with the crispy egg on top.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=pad+kra+pao+thai+basil+stir+fry+recipe",
    photoUrl: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=600&h=400&fit=crop&auto=format&q=80",
  },

  // ── MEXICAN ───────────────────────────────────────────────────────────────
  {
    name: "Black Bean Quesadillas",
    cuisine: "Mexican",
    tags: ["easy", "fast"],
    time: "10 min",
    calories: "~380 kcal",
    description: "Crispy tortilla loaded with beans and melted cheese. 10 minutes, zero skill required, completely satisfying.",
    ingredients: ["2 large flour tortillas", "1 can black or pinto beans (drained)", "1 cup shredded cheese (any melting cheese)", "½ tsp cumin", "¼ tsp chili powder", "Salt", "Oil"],
    steps: [
      "Drain and rinse canned beans. Put in a bowl and mash roughly with a fork — leave some beans whole.",
      "Season mashed beans with cumin, chili powder, and salt. Stir.",
      "Heat a dry pan over medium-high heat.",
      "Lay one tortilla flat. Spread beans over the entire surface. Sprinkle cheese evenly on top.",
      "Fold the tortilla in half to make a half-moon.",
      "Place in the hot pan. Cook 2-3 minutes until golden-brown and crispy on the bottom.",
      "Flip carefully. Cook 2 more minutes on the other side.",
      "Slide out, cut into triangles with a knife or scissors. Serve with sour cream, salsa, or sliced avocado.",
    ],
    youtubeUrl: "https://www.youtube.com/results?search_query=black+bean+quesadilla+recipe+easy",
    photoUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop&auto=format&q=80",
  },
];

const ALL_CUISINES = Array.from(new Set(RECIPES.map((r) => r.cuisine))).sort();

function TagBadge({ tag }: { tag: Tag }) {
  const m = TAG_META[tag];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${m.color}`}>
      <m.icon className="w-3 h-3" />{m.label}
    </span>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [showIngredients, setShowIngredients] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      data-testid={`card-recipe-${recipe.name.replace(/\s+/g, "-")}`}
      className={`bg-card border rounded-2xl shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-shadow ${
        recipe.tags.includes("viral") ? "border-purple-200" : "border-border"
      }`}
    >
      {/* Food photo */}
      <div className="relative h-44 overflow-hidden bg-muted shrink-0">
        {!imgError ? (
          <img
            src={recipe.photoUrl}
            alt={recipe.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${
            recipe.tags.includes("viral")
              ? "bg-gradient-to-br from-purple-400 to-pink-500"
              : recipe.cuisine === "Korean" ? "bg-gradient-to-br from-red-400 to-orange-400"
              : recipe.cuisine === "Bangladeshi" ? "bg-gradient-to-br from-green-600 to-emerald-500"
              : recipe.cuisine === "Italian" ? "bg-gradient-to-br from-amber-400 to-orange-500"
              : recipe.cuisine === "Indian" ? "bg-gradient-to-br from-orange-500 to-yellow-400"
              : recipe.cuisine === "Japanese" ? "bg-gradient-to-br from-rose-400 to-pink-400"
              : recipe.cuisine === "Middle Eastern" ? "bg-gradient-to-br from-amber-600 to-yellow-500"
              : recipe.cuisine === "Chinese" ? "bg-gradient-to-br from-red-500 to-orange-400"
              : recipe.cuisine === "Thai" ? "bg-gradient-to-br from-teal-500 to-green-500"
              : recipe.cuisine === "Mexican" ? "bg-gradient-to-br from-red-500 to-amber-500"
              : "bg-gradient-to-br from-primary to-primary/70"
          }`}>
            <span className="text-4xl">
              {recipe.cuisine === "Korean" ? "🇰🇷"
               : recipe.cuisine === "Bangladeshi" ? "🇧🇩"
               : recipe.cuisine === "Italian" ? "🇮🇹"
               : recipe.cuisine === "Indian" ? "🇮🇳"
               : recipe.cuisine === "Japanese" ? "🇯🇵"
               : recipe.cuisine === "Middle Eastern" ? "☪️"
               : recipe.cuisine === "Chinese" ? "🇨🇳"
               : recipe.cuisine === "Thai" ? "🇹🇭"
               : recipe.cuisine === "Mexican" ? "🇲🇽"
               : "🍽️"}
            </span>
            <span className="text-white/90 text-xs font-semibold text-center px-4 leading-tight">{recipe.name}</span>
          </div>
        )}
        {recipe.tags.includes("viral") && (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">Viral / Cheat Meal</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground text-base leading-snug">{recipe.name}</h3>
            <span className="text-xs bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 shrink-0">{recipe.cuisine}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {recipe.tags.map((t) => <TagBadge key={t} tag={t} />)}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary" />{recipe.time}</span>
          <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" />{recipe.calories}</span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{recipe.description}</p>

        {/* Ingredients */}
        <button
          onClick={() => setShowIngredients(!showIngredients)}
          className="flex items-center justify-between text-xs text-primary font-medium w-full hover:text-primary/80 transition-colors"
        >
          <span>{showIngredients ? "Hide ingredients" : `Show ingredients (${recipe.ingredients.length})`}</span>
          {showIngredients ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showIngredients && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {recipe.ingredients.map((ing) => (
              <span key={ing} className="text-xs bg-muted/70 border border-border rounded-full px-2.5 py-1 text-muted-foreground">
                {ing}
              </span>
            ))}
          </div>
        )}

        {/* Steps */}
        <button
          onClick={() => setShowSteps(!showSteps)}
          className={`flex items-center justify-between text-xs font-semibold w-full transition-colors rounded-lg px-3 py-2 mt-1 ${
            recipe.tags.includes("viral")
              ? "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
              : "bg-primary/8 text-primary hover:bg-primary/15 border border-primary/20"
          }`}
          style={{ background: showSteps ? undefined : undefined }}
        >
          <span>{showSteps ? "Hide step-by-step" : `Show step-by-step (${recipe.steps.length} steps)`}</span>
          {showSteps ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showSteps && (
          <ol className="space-y-2.5 pt-1">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                  recipe.tags.includes("viral")
                    ? "bg-purple-100 text-purple-700"
                    : "bg-primary/10 text-primary"
                }`}>
                  {i + 1}
                </span>
                <span className="text-muted-foreground leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* YouTube link */}
      <div className="border-t border-border px-5 py-3 flex items-center gap-3 bg-muted/20">
        <a
          href={recipe.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={`link-youtube-${recipe.name.replace(/\s+/g, "-")}`}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
        >
          <Youtube className="w-4 h-4" />
          Watch on YouTube
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
    const q = search.toLowerCase();
    const matchSearch =
      q === "" ||
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.ingredients.some((i) => i.toLowerCase().includes(q));
    const matchCuisine = activeCuisine === "All" || r.cuisine === activeCuisine;
    const matchTag = activeTag === "All" || r.tags.includes(activeTag);
    return matchSearch && matchCuisine && matchTag;
  });

  const viralCount = RECIPES.filter((r) => r.tags.includes("viral")).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link href="/" data-testid="link-back-home" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />Back
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">🍽️</span>
            <span className="font-serif text-lg font-bold text-foreground">Recipes</span>
          </div>
          <span className="ml-auto text-xs text-muted-foreground">{filtered.length} recipe{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-primary text-primary-foreground px-4 py-12 text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-3">Easy Recipes</h1>
          <p className="text-primary-foreground/80 max-w-lg mx-auto">
            {RECIPES.length} recipes across {ALL_CUISINES.length} cuisines · {viralCount} viral cheat meals · Full steps inside every card
          </p>
        </motion.div>
      </div>

      {/* Sticky filters */}
      <div className="sticky top-[57px] z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 space-y-3">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            data-testid="input-recipe-search"
            type="text" placeholder="Search recipes or ingredients…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          {(["All", "viral", "easy", "fast", "heavy"] as const).map((tag) => {
            const isActive = activeTag === tag;
            const meta = tag !== "All" ? TAG_META[tag] : null;
            return (
              <button key={tag} onClick={() => setActiveTag(tag)} data-testid={`filter-tag-${tag}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  isActive
                    ? tag === "All" ? "bg-primary text-primary-foreground border-primary"
                    : meta!.color + " border-current"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}>
                {meta && <meta.icon className="w-3 h-3" />}
                {tag === "All" ? "All" : TAG_META[tag].label}
              </button>
            );
          })}
        </div>

        {/* Cuisine filters */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {["All", ...ALL_CUISINES].map((c) => (
            <button key={c} onClick={() => setActiveCuisine(c)} data-testid={`filter-cuisine-${c}`}
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

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-4xl mb-3">🤷</p>
            <p className="font-medium">No recipes found</p>
            <button onClick={() => { setSearch(""); setActiveCuisine("All"); setActiveTag("All"); }}
              className="mt-4 text-sm text-primary underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => <RecipeCard key={r.name} recipe={r} />)}
          </div>
        )}

        {/* Tip banner */}
        <div className="mt-10 p-5 rounded-2xl bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
          <strong className="text-foreground block mb-2">Student cooking tips for Korea 🇰🇷</strong>
          <ul className="space-y-1 list-disc list-inside">
            <li>Rice cooker (밥솥) is the best ₩15,000 investment for any student dorm</li>
            <li>Daiso (다이소) sells basic pots, pans, and kitchen tools very cheaply</li>
            <li>E-Mart and Lotte Mart near campus have affordable vegetables and pantry items</li>
            <li>Cheonan (천안, 15 min from Asan) has halal grocery stores for Bangladeshi spices</li>
            <li>Canned chickpeas, beans, and lentils are available at most large supermarkets</li>
            <li>Korean instant noodles come in dozens of varieties — explore the whole aisle</li>
          </ul>
        </div>
      </main>

      <footer className="py-8 px-4 border-t border-border text-center text-xs text-muted-foreground/60">
        Galib on the Go · Recipes for students in Korea · All steps written inside each card · Video links open YouTube
      </footer>
    </div>
  );
}
