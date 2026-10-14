---
name: shapes
description: Guides kids in recognizing and spelling 2D and 3D shapes (circle, square, triangle, hexagon, octagon, sphere, cylinder, etc.) through fill-in-the-blank spelling challenges with missing letters, geometric properties, and real-world visual clues. All answers are hidden by default in collapsible reveal blocks so children can figure them out independently.
---

# Shape Recognition & Missing Letter Spelling Skill

This skill creates engaging, child-friendly shape recognition challenges where learners identify 2D geometric shapes and 3D solids, then complete **fill-in-the-blank spelling puzzles** where one or more letters are missing.

---

## 🎯 Core Pedagogical Philosophy

1. **Child Deduces Independently**:
   - The child should figure out the shape name and missing letters on their own using visual cues, geometric properties (sides/corners/faces), and real-world object clues.
2. **At Least 2 Blanks Rule (Words > 3 Letters)**:
   - **Crucial Rule**: If the shape word has more than 3 letters (which applies to all standard geometric shapes: `CUBE`, `CONE`, `STAR`, `OVAL`, `CIRCLE`, `SQUARE`, `HEXAGON`, etc.), **there MUST ALWAYS be AT LEAST 2 BLANKS in the spelling**. Single-letter blanks are strictly prohibited.
   - For 4-letter words (e.g. `CUBE`, `CONE`, `OVAL`, `STAR`): Exactly 2 blanks (e.g. `C _ B _`, `_ O N _`, `O _ _ L`, `S _ _ R`).
   - For 5+ letter words (e.g. `CIRCLE`, `SQUARE`, `HEXAGON`, `OCTAGON`, `CYLINDER`): At least 2 blanks (e.g. `C _ R C L _`, `S Q _ A R _`, `H E X _ G _ N`), or 3+ blanks for advanced challenges (`H _ X _ G _ N`).
3. **Strictly Hidden Answers by Default**:
   - **Never reveal the answer or missing letters in open text** within the challenge prompt or questions.
   - All solutions, full spellings, and explanations must be enclosed within a **collapsed `<details><summary>...</summary></details>` state**.
   - In interactive multi-turn chat, withhold the solution until the child has attempted an answer or explicitly requested the reveal.
4. **Multi-Sensory Clues**:
   - Every puzzle provides **Visual hints** (Emoji, Unicode, SVG diagram, or shape beside the question), **Geometry hints** (number of sides, corners, or flat faces), and **Real-World clues** (everyday items kids recognize).

---

## 📐 Shape Catalog & Clues Reference

### 1. Foundational 2D Shapes (Ages 3–6)

| Shape | Symbol | Sides / Corners | Real-World Clues | Standard Blank (2 Letters) | Alternate Blank (2 Letters) | Challenger Blank (3+ Letters) |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **Circle** | ⭕ | 0 sides, 0 corners (round) | Coin, wall clock, full moon, pizza pie | `C _ R C L _` *(I, E)* | `C _ R C _ E` *(I, L)* | `_ _ R C L _` *(C, I, E)* |
| **Square** | ⬛ | 4 equal sides, 4 square corners | Chessboard tile, napkin, bread slice, dice face | `S Q _ A R _` *(U, E)* | `S _ U A R _` *(Q, E)* | `_ Q _ _ R _` *(S, U, A, E)* |
| **Triangle** | 🔺 | 3 straight sides, 3 corners | Pizza slice, yield road sign, hanger, mountain peak | `T R _ A N G L _` *(I, E)* | `T R I _ N G L _` *(A, E)* | `T R _ _ N G L _` *(I, A, E)* |
| **Rectangle** | ▭ | 4 straight sides (opposites equal), 4 corners | Door, notebook cover, TV screen, smartphone | `R _ C T A N G L _` *(E, E)* | `R E C T _ N G L _` *(A, E)* | `R _ C T _ N G L _` *(E, A, E)* |
| **Oval** | 🥚 | 0 straight sides, 0 corners (egg-shaped) | Chicken egg, watermelon, rugby ball, mirror | `O _ _ L` *(V, A)* | `_ V _ L` *(O, A)* | `_ _ _ L` *(O, V, A)* |
| **Star** | ⭐ | 5 or more pointy arms | Twinkling night sky, starfish, reward sticker | `S _ _ R` *(T, A)* | `_ T _ R` *(S, A)* | `_ _ _ R` *(S, T, A)* |
| **Heart** | ❤️ | 2 curved lobes, 1 pointy bottom | Valentine's card, sweet candy, symbol of love | `H _ A R _` *(E, T)* | `H E _ R _` *(A, T)* | `_ _ _ R T` *(H, E, A)* |
| **Diamond / Rhombus** | 🔶 | 4 equal slanted sides, 4 corners | Flying kite, playing card suit, road hazard sign | `D I _ M _ N D` *(A, O)* | `D _ A M _ N D` *(I, O)* | `D _ _ M _ N D` *(I, A, O)* |

---

### 2. Intermediate 2D Polygons (Ages 6–9+)

| Shape | Symbol | Sides / Corners | Real-World Clues | Standard Blank (2 Letters) | Alternate Blank (2 Letters) | Challenger Blank (3+ Letters) |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **Pentagon** | ⬟ | 5 straight sides, 5 corners | US Defense building, home plate in baseball, birdhouse front | `P _ N T A G _ N` *(E, O)* | `P E N T _ G _ N` *(A, O)* | `P _ N T _ G _ N` *(E, A, O)* |
| **Hexagon** | ⬡ | 6 straight sides, 6 corners | Honeycomb cell, metal bolt head, snowflake pattern | `H E X _ G _ N` *(A, O)* | `H _ X A G _ N` *(E, O)* | `H _ X _ G _ N` *(E, A, O)* |
| **Heptagon** | ⯁ | 7 straight sides, 7 corners | British 50-pence coin boundary, specialty badges | `H _ P T A G _ N` *(E, O)* | `H E P T _ G _ N` *(A, O)* | `H _ P T _ G _ N` *(E, A, O)* |
| **Octagon** | 🛑 | 8 straight sides, 8 corners | Red STOP sign, umbrella canopy ribs, martial arts ring | `O C T _ G _ N` *(A, O)* | `_ C T A G _ N` *(O, O)* | `_ C T _ G _ N` *(O, A, O)* |
| **Nonagon** | ⯂ | 9 straight sides, 9 corners | Bahá'í temple architecture, 9-sided coins | `N _ N A G _ N` *(O, O)* | `N O N _ G _ N` *(A, O)* | `N _ N _ G _ N` *(O, A, O)* |
| **Decagon** | ⯃ | 10 straight sides, 10 corners | 10-pointed star center, decorative coin medals | `D _ C A G _ N` *(E, O)* | `D E C _ G _ N` *(A, O)* | `D _ C _ G _ N` *(E, A, O)* |
| **Trapezoid** | ⏢ | 4 sides, only 1 pair of parallel sides | Popcorn tub, flowerpot silhouette, handbag outline | `T R A P _ Z O I _` *(E, D)* | `T R _ P E Z O I _` *(A, D)* | `T R _ P _ Z O _ D` *(A, E, I)* |
| **Parallelogram** | ▱ | 4 sides with opposite sides parallel & equal | Slanted eraser, roof truss beam, stripes on flags | `P A R _ L L E L O G R _ M` *(A, A)* | `P A R A L L _ L O G R _ M` *(E, A)* | `P _ R _ L L _ L O G R A M` *(A, A, E)* |
| **Crescent** | 🌙 | 2 curved lines coming to 2 points | Night crescent moon, curved banana slice, croissant | `C R _ S C E N _` *(E, T)* | `C R E S C _ N _` *(E, T)* | `C R _ S C _ N T` *(E, E)* |
| **Semicircle** | 🔲 | 1 straight diameter, 1 round curve | Half an orange, colorful rainbow, protractor | `S E M _ C I R C L _` *(I, E)* | `S _ M I C I R C L _` *(E, E)* | `S _ M _ C _ R C L E` *(E, I, I)* |

---

### 3. 3D Geometric Solids (Geometry Explorers)

| Shape | Symbol | Faces / Properties | Real-World Clues | Standard Blank (2 Letters) | Alternate Blank (2 Letters) | Challenger Blank (3+ Letters) |
| :--- | :---: | :---: | :--- | :--- | :--- | :--- |
| **Sphere** | ⚽ | Completely round 3D solid, 0 flat faces | Basketball, globe of Earth, soap bubble, marble | `S P H _ R _` *(E, E)* | `S P _ _ R E` *(H, E)* | `S P _ _ R _` *(H, E, E)* |
| **Cube** | 🎲 | 6 identical square faces, 8 vertices | Playing dice, Rubik's cube, ice cube, cardboard box | `C _ B _` *(U, E)* | `_ U B _` *(C, E)* | `_ _ B _` *(C, U, E)* |
| **Cylinder** | 🥫 | 2 flat circular ends + 1 curved side | Soup can, soda can, battery, pencil holder | `C Y L _ N D _ R` *(I, E)* | `C Y L I N D _ _` *(E, R)* | `C _ L _ N D _ R` *(Y, I, E)* |
| **Cone** | 🍦 | 1 circular flat base tapering to 1 point | Ice cream cone, traffic orange cone, birthday party hat | `C _ N _` *(O, E)* | `_ O N _` *(C, E)* | `_ _ N _` *(C, O, E)* |
| **Pyramid** | ⛺ | Square/triangular base with triangle sides meeting at apex | Great Pyramids of Egypt, camping tent, pyramid tea bag | `P Y R _ M I _` *(A, D)* | `P _ R A M I _` *(Y, D)* | `P _ R _ M _ D` *(Y, A, I)* |
| **Prism** | 🍫 | 2 identical polygon ends connected by rectangles | Toblerone chocolate box, glass light rainbow prism | `P R _ S _` *(I, M)* | `P _ I S _` *(R, M)* | `P _ _ S M` *(R, I)* |
| **Cuboid** | 📦 | 6 rectangular flat faces | Cereal box, brick, shoe box, book | `C _ B O I _` *(U, D)* | `C U B _ I _` *(O, D)* | `C _ B _ _ D` *(U, O, I)* |
| **Hemisphere** | 🥣 | Half of a sphere, 1 flat round face + 1 dome | Igloo, soup bowl, half an orange | `H E M _ S P H _ R E` *(I, E)* | `H E M I S P H _ R _` *(E, E)* | `H _ M _ S P H _ R E` *(E, I, E)* |

---

## 🧩 Difficulty Levels

- **Level 1 (Detective - 2 Letters Missing)**:
  - Omits 2 strategic letters (e.g. `C _ R C L _`, `S Q _ A R _`, `C _ B _`, `_ O N _`).
  - Required for all shape words since all shape names have > 3 letters.
- **Level 2 (Investigator - 2 Blended / Consonant-Vowel Missing)**:
  - Omits 2 letters requiring careful phonetics (e.g. `S _ U A R _`, `C _ R C _ E`, `S P _ _ R E`).
- **Level 3 (Master Architect - 3+ Letters Missing / Vowel Out)**:
  - Omits 3 letters or all vowels (e.g. `H _ X _ G _ N`, `_ C T _ G _ N`, `P _ N T _ G _ N`).

---

## 📋 Challenge Output Templates

Always structure outputs using one of the templates below. **Ensure the answer is strictly hidden inside `<details>` blocks.**

### Template 1: Single Shape Mystery Card

```markdown
### 🧩 Mystery Shape Challenge: Can You Spell Me?

🔍 **Clue 1 (Visual):** ⬡  
📐 **Clue 2 (Geometry):** I have **6 straight sides** and **6 corners**!  
🌍 **Clue 3 (Real-World):** Bees make their honeycombs in my exact shape!  

🔤 **Spell the Shape (Fill in the blanks):**
# `H  E  X  _  G  _  N`
*(Hint: 2 vowels are missing!)*

---

<details>
<summary>👁️ Click to Reveal Answer & Fun Facts</summary>

> 🎯 **Shape Name:** **HEXAGON**  
> 🔤 **Missing Letters:** **A**, **O** (`H E X [A] G [O] N`)  
> 📐 **Properties:** 6 sides · 6 vertices (corners) · 2D flat polygon  
> 🌟 **Fun Fact:** Hexagons fit together perfectly without leaving any gaps! That's why bees use them to store honey with the least amount of wax.
</details>
```

---

### Template 2: Shape Quest Worksheet (Multi-Shape Set)

When generating a multi-question quiz or worksheet (3–5 shapes), present all questions first without solutions. Provide a single consolidated `<details>` block at the very bottom:

```markdown
## 🏆 The Super Shape Spelling Quest!

Can you identify each shape and fill in the missing letters? Grab a pencil or guess out loud!

---

### 1️⃣ Shape #1
- **Picture:** ⭕
- **Clue:** I am round with no straight sides and no corners. You see me on wall clocks and coins!
- **Spelling:** `C  _  R  C  L  _`  *(2 missing letters)*

---

### 2️⃣ Shape #2
- **Picture:** 🔺
- **Clue:** I have 3 straight sides and 3 pointy corners. I look like a delicious slice of pizza!
- **Spelling:** `T  R  _  A  N  G  L  _`  *(2 missing letters)*

---

### 3️⃣ Shape #3
- **Picture:** 🛑
- **Clue:** I have 8 sides and 8 corners! Drivers stop when they see me in bright red on the road!
- **Spelling:** `O  C  T  _  G  _  N`  *(2 missing letters)*

---

### 4️⃣ Shape #4
- **Picture:** 🥫 (3D Solid!)
- **Clue:** I have 2 flat circle faces on top and bottom and a smooth curved body like a soup can!
- **Spelling:** `C  Y  L  _  N  D  _  R`  *(2 missing letters)*

---

<details>
<summary>👁️ Click to Reveal the Answer Key</summary>

### 🗝️ Answer Key

1. **CIRCLE**  
   - Missing: **I**, **E** (`C [I] R C L [E]`)  
   - 0 sides, 0 corners (2D)

2. **TRIANGLE**  
   - Missing: **I**, **E** (`T R [I] A N G L [E]`)  
   - 3 sides, 3 corners (2D)

3. **OCTAGON**  
   - Missing: **A**, **O** (`O C T [A] G [O] N`)  
   - 8 sides, 8 corners (2D)

4. **CYLINDER**  
   - Missing: **I**, **E** (`C Y L [I] N D [E] R`)  
   - 2 circular bases, 1 curved surface (3D solid)
</details>
```

---

### Template 3: Multiple-Choice Missing Letter Option Challenge

If the child prefers multiple choice options, provide 4 option sets for the missing letters, keeping the answer collapsed:

```markdown
### ❓ Which Letters Complete This Shape?

**Clue:** ⬛ I have 4 equal sides and 4 square corners like a chessboard tile!  
**Word:** `S  Q  _  A  R  _`  

Which two letters fill in the blanks?
- **[A]** `U` and `E`
- **[B]** `O` and `Y`
- **[C]** `A` and `T`
- **[D]** `I` and `E`

<details>
<summary>👁️ Click to Check Your Answer</summary>

> ✅ **Correct Option:** **[A] `U` and `E`**  
> 🔤 **Full Word:** **S Q [U] A R [E]**  
> 💡 **Explanation:** "Square" starts with the `SQ` blend, followed by `U`, `A`, `R`, and a silent `E` at the end!
</details>
```

---

## 💬 Interactive Chat Mode Rules

When interacting directly with a child or student in a conversational setting:

1. **First Message**: Present the mystery shape with the blank puzzle and clues. **Do NOT include the answer.**
2. **When Child Guesses Correctly**:
   - Celebrate warmly: *"Woohoo! You got it! 🎉 H-E-X-A-G-O-N! You found both missing letters 'A' and 'O'!"*
   - Share one fascinating geometry fun fact.
   - Ask if they are ready for the next shape challenge!
3. **When Child Guesses Incorrectly or Partially**:
   - Provide encouragement and a gentle hint without giving away the answer:
     - *"You got the first letter 'A' right! Fantastic listening! Now, what vowel sounds like 'ah-n' at the end of the word? Think of an octopus! 🐙"*
4. **When Child Says "I Don't Know" or "Tell Me"**:
   - Never make them feel bad.
   - Reveal the shape with cheerful celebration for trying: *"That was a tricky one! It's a HEXAGON! Let's say it together: H-E-X-A-G-O-N! Ready to try a fun 3D shape next?"*
