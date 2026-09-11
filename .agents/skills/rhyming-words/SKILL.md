---
name: rhyming-words
description: Generates engaging rhyming word exercises and challenges across 200+ word family combinations with answers in a collapsible reveal state.
---

# Rhyming Words Challenge Skill (Three Rhyming Words for One)

This skill generates interactive rhyming word challenges and educational practice sets where learners **make and find three rhyming words for one base word** covering over 200 curated combinations across 36 phonics word families. All answers and phonetic explanations are formatted in a **collapsed state** (`<details><summary>...</summary></details>`) so learners can think, guess, and reveal the trio solution on demand.

## Word Families Covered (200+ Combinations)

1. **Short A Families**:
   - **-at**: cat, bat, hat, mat, rat, fat, sat, pat (e.g. *Cat ➔ Bat, Hat, Mat*)
   - **-an**: pan, fan, man, can, ran, van, tan (e.g. *Pan ➔ Fan, Man, Can*)
   - **-ap**: cap, map, tap, nap, lap, gap, clap (e.g. *Cap ➔ Map, Tap, Nap*)
   - **-ar**: car, star, far, jar, bar, tar (e.g. *Car ➔ Star, Far, Jar*)
   - **-ay**: day, play, say, ray, may, hay, pay (e.g. *Day ➔ Play, Say, Ray*)
   - **-all**: ball, tall, fall, call, wall, mall (e.g. *Ball ➔ Tall, Fall, Call*)

2. **Short E Families**:
   - **-ed**: bed, red, fed, led, shed, sled (e.g. *Bed ➔ Red, Fed, Sled*)
   - **-en**: hen, pen, ten, men, den, glen (e.g. *Hen ➔ Pen, Ten, Men*)
   - **-et**: net, pet, wet, jet, get, set (e.g. *Net ➔ Pet, Wet, Jet*)
   - **-ell**: bell, yell, tell, well, shell, spell (e.g. *Bell ➔ Yell, Tell, Well*)
   - **-est**: nest, vest, rest, best, test, chest (e.g. *Nest ➔ Vest, Rest, Best*)

3. **Short I Families**:
   - **-ig**: pig, big, dig, fig, wig, twig (e.g. *Pig ➔ Big, Dig, Wig*)
   - **-in**: pin, bin, fin, tin, win, chin (e.g. *Pin ➔ Bin, Fin, Tin*)
   - **-ip**: lip, tip, sip, dip, rip, ship (e.g. *Lip ➔ Tip, Sip, Dip*)
   - **-it**: hit, sit, fit, bit, kit, lit (e.g. *Hit ➔ Sit, Fit, Bit*)
   - **-ick**: kick, sick, pick, brick, stick, quick (e.g. *Kick ➔ Sick, Pick, Stick*)
   - **-ink**: pink, sink, drink, wink, blink, think (e.g. *Pink ➔ Sink, Drink, Wink*)
   - **-ing**: ring, king, wing, sing, string, spring (e.g. *Ring ➔ King, Wing, Sing*)

4. **Short O & U Families**:
   - **-og**: dog, frog, log, fog, jog, clog (e.g. *Dog ➔ Frog, Log, Fog*)
   - **-op**: top, mop, pop, hop, drop, stop (e.g. *Top ➔ Mop, Pop, Hop*)
   - **-ot**: pot, hot, dot, cot, lot, spot (e.g. *Pot ➔ Hot, Dot, Cot*)
   - **-ock**: lock, clock, rock, sock, block, knock (e.g. *Lock ➔ Clock, Rock, Sock*)
   - **-ub**: tub, cub, rub, sub, club, scrub (e.g. *Cub ➔ Rub, Sub, Club*)
   - **-ug**: bug, mug, hug, rug, jug, tug (e.g. *Bug ➔ Mug, Hug, Rug*)
   - **-un**: sun, run, bun, fun, nun, gun (e.g. *Sun ➔ Run, Bun, Fun*)
   - **-ut**: nut, hut, cut, gut, shut (e.g. *Nut ➔ Hut, Cut, Shut*)

5. **Long Vowels & Rimes**:
   - **-ake**: cake, bake, lake, make, take, wake (e.g. *Cake ➔ Bake, Lake, Make*)
   - **-ear**: dear, hear, near, tear, fear, gear (e.g. *Dear ➔ Hear, Near, Tear*)
   - **-ice**: mice, rice, ice, nice, dice, price (e.g. *Mice ➔ Rice, Ice, Nice*)
   - **-ight**: night, light, right, bright, sight, tight (e.g. *Night ➔ Light, Right, Bright*)
   - **-ook**: book, look, cook, took, hook, brook (e.g. *Book ➔ Look, Cook, Took*)
   - **-ool**: cool, pool, tool, school, fool (e.g. *Cool ➔ Pool, Tool, School*)
   - **-oon**: moon, spoon, noon, soon (e.g. *Moon ➔ Spoon, Noon, Soon*)
   - **-ore**: core, more, sore, store, score, chore (e.g. *Core ➔ More, Sore, Store*)
   - **-own**: clown, crown, brown, town, down, frown (e.g. *Clown ➔ Crown, Brown, Town*)

---

## Output Format: Question with Collapsed 3-Word Answer

When asked to generate rhyming challenges, formulate questions asking for **3 rhyming words of one base word**, with 4 options (each containing 3 words), and hide the 3-word answer inside a collapsed `<details>` block:

### Example Template

```markdown
### 🎵 Rhyme Trio Challenge: [Base Word]
**Which 3 words rhyme with [Base Word]?**

- [A] [Triplet 1, e.g. Bat, Hat, Mat]
- [B] [Triplet 2, e.g. Dog, Frog, Log]
- [C] [Triplet 3, e.g. Sun, Run, Fun]
- [D] [Triplet 4, e.g. Pig, Big, Wig]

<details>
<summary>👁️ Click to Reveal the 3 Rhyming Words & Clue</summary>

> **Base Word:** **[Base Word]**
>
> 🎯 **3 Rhyming Words:** **[Word 1] · [Word 2] · [Word 3]**  
> 🎵 **Sound Family:** `[Family, e.g. -at family]`  
> 💬 **Why:** [Base Word] rhymes with [Word 1], [Word 2], and [Word 3] because all three end with the same rhyming sound!
</details>
```
