// ==========================================================================
// INDUS KUNDLI APP — YOGAS & ARISHTA DETECTION ENGINE (yogas.js)
// ==========================================================================

function detectYogasAndArishtas(planets, ascData, lagnaRashi) {
  const yogas = [];
  const p = planets;

  // 1. Gaja Kesari Yoga (Jupiter in Kendra 1, 4, 7, 10 from Moon)
  const jupFromMoon = ((p.Jupiter.rashi - p.Moon.rashi + 12) % 12) + 1;
  if ([1, 4, 7, 10].includes(jupFromMoon)) {
    yogas.push({
      name: "Gaja Kesari Yoga",
      category: "raja",
      status: "Formed",
      desc: "Jupiter occupies an auspicious Kendra quadrant (1, 4, 7, 10) relative to the Moon.",
      effects: "Bestows commanding oratorical prowess, scholarly reputation, enduring royal prestige, and wealth.",
      planets: ["Jupiter", "Moon"]
    });
  }

  // 2. Budhaditya Yoga (Sun & Mercury conjoined in the same sign)
  if (p.Sun.rashi === p.Mercury.rashi) {
    yogas.push({
      name: "Budhaditya Yoga",
      category: "raja",
      status: "Formed",
      desc: `Sun and Mercury conjoin harmoniously in ${RASHIS[p.Sun.rashi - 1].name} (House ${p.Sun.house}).`,
      effects: "Grants intellectual brilliance, administrative acumen, sharp memory, and executive diplomacy.",
      planets: ["Sun", "Mercury"]
    });
  }

  // 3. Pancha Mahapurusha Yogas (Mars, Mercury, Jupiter, Venus, Saturn in Own/Exalted sign in Kendra 1, 4, 7, 10)
  const kendras = [1, 4, 7, 10];

  // Ruchaka (Mars)
  if (kendras.includes(p.Mars.house) && (p.Mars.dignity === "Exalted" || p.Mars.dignity === "Own Sign")) {
    yogas.push({
      name: "Ruchaka Yoga (Pancha Mahapurusha)",
      category: "raja",
      status: "Formed",
      desc: `Mars is ${p.Mars.dignity} in Kendra House ${p.Mars.house}.`,
      effects: "Heroic bravery, military leadership, command over properties, immense valor, and victorious enterprise.",
      planets: ["Mars"]
    });
  }

  // Bhadra (Mercury)
  if (kendras.includes(p.Mercury.house) && (p.Mercury.dignity === "Exalted" || p.Mercury.dignity === "Own Sign")) {
    yogas.push({
      name: "Bhadra Yoga (Pancha Mahapurusha)",
      category: "raja",
      status: "Formed",
      desc: `Mercury is ${p.Mercury.dignity} in Kendra House ${p.Mercury.house}.`,
      effects: "Exceptional mathematical genius, linguistic mastery, business enterprise, and philosophical wisdom.",
      planets: ["Mercury"]
    });
  }

  // Hamsa (Jupiter)
  if (kendras.includes(p.Jupiter.house) && (p.Jupiter.dignity === "Exalted" || p.Jupiter.dignity === "Own Sign")) {
    yogas.push({
      name: "Hamsa Yoga (Pancha Mahapurusha)",
      category: "raja",
      status: "Formed",
      desc: `Jupiter is ${p.Jupiter.dignity} in Kendra House ${p.Jupiter.house}.`,
      effects: "Virtuous spiritual character, revered teacher/counselor, pure conscience, and noble prosperity.",
      planets: ["Jupiter"]
    });
  }

  // Malavya (Venus)
  if (kendras.includes(p.Venus.house) && (p.Venus.dignity === "Exalted" || p.Venus.dignity === "Own Sign")) {
    yogas.push({
      name: "Malavya Yoga (Pancha Mahapurusha)",
      category: "raja",
      status: "Formed",
      desc: `Venus is ${p.Venus.dignity} in Kendra House ${p.Venus.house}.`,
      effects: "Refined aesthetic sensibilities, luxurious vehicles, artistic fame, marital bliss, and radiant charm.",
      planets: ["Venus"]
    });
  }

  // Sasa (Saturn)
  if (kendras.includes(p.Saturn.house) && (p.Saturn.dignity === "Exalted" || p.Saturn.dignity === "Own Sign")) {
    yogas.push({
      name: "Sasa Yoga (Pancha Mahapurusha)",
      category: "raja",
      status: "Formed",
      desc: `Saturn is ${p.Saturn.dignity} in Kendra House ${p.Saturn.house}.`,
      effects: "Mass authority, command over institutions/machinery, iron endurance, and deep strategic wisdom.",
      planets: ["Saturn"]
    });
  }

  // 4. Chandra-Mangala Dhana Yoga (Moon & Mars conjoined)
  if (p.Moon.rashi === p.Mars.rashi) {
    yogas.push({
      name: "Chandra-Mangala Yoga",
      category: "dhana",
      status: "Formed",
      desc: `Moon and Mars occupy the same rashi (${RASHIS[p.Moon.rashi - 1].name}).`,
      effects: "Dynamic commercial instincts, swift generation of financial assets, and material industriousness.",
      planets: ["Moon", "Mars"]
    });
  }

  // 5. Vipareeta Raja Yogas (Lords of 6, 8, 12 in 6, 8, 12)
  const sixthLord = RASHIS[((lagnaRashi - 1 + 5) % 12)].lord;
  const eighthLord = RASHIS[((lagnaRashi - 1 + 7) % 12)].lord;
  const twelfthLord = RASHIS[((lagnaRashi - 1 + 11) % 12)].lord;
  const dusthanas = [6, 8, 12];

  if (p[sixthLord] && dusthanas.includes(p[sixthLord].house)) {
    yogas.push({
      name: "Harsha Yoga (Vipareeta Raja Yoga)",
      category: "raja",
      status: "Formed",
      desc: `6th Lord (${sixthLord}) is situated in Dusthana House ${p[sixthLord].house}.`,
      effects: "Grants victory over adversaries, constitutional immunity, invincible confidence, and sudden gains.",
      planets: [sixthLord]
    });
  }

  if (p[eighthLord] && dusthanas.includes(p[eighthLord].house)) {
    yogas.push({
      name: "Sarala Yoga (Vipareeta Raja Yoga)",
      category: "raja",
      status: "Formed",
      desc: `8th Lord (${eighthLord}) is situated in Dusthana House ${p[eighthLord].house}.`,
      effects: "Endows long life, fearless courage, mastery over occult secrets, and prosperity through crisis.",
      planets: [eighthLord]
    });
  }

  if (p[twelfthLord] && dusthanas.includes(p[twelfthLord].house)) {
    yogas.push({
      name: "Vimala Yoga (Vipareeta Raja Yoga)",
      category: "raja",
      status: "Formed",
      desc: `12th Lord (${twelfthLord}) is situated in Dusthana House ${p[twelfthLord].house}.`,
      effects: "Spiritual expenditure, untainted noble reputation, independence, and protection from debt.",
      planets: [twelfthLord]
    });
  }

  // 6. Kuja / Manglik Dosha (Mars in 1, 2, 4, 7, 8, 12 from Lagna or Moon)
  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const marsFromLagna = p.Mars.house;
  const marsFromMoon = ((p.Mars.rashi - p.Moon.rashi + 12) % 12) + 1;

  if (manglikHouses.includes(marsFromLagna) || manglikHouses.includes(marsFromMoon)) {
    yogas.push({
      name: "Kuja Dosha (Manglik)",
      category: "arishta",
      status: "Arishta Present",
      desc: `Mars is located in House ${marsFromLagna} from Lagna and House ${marsFromMoon} from Moon.`,
      effects: "Demands emotional adjustment in matrimonial partnerships; channels intense drive and courage into marital dynamics.",
      planets: ["Mars"]
    });
  }

  // 7. Kaal Sarp Yoga (All planets hemmed between Rahu and Ketu)
  const rahuLong = p.Rahu.longitude;
  const ketuLong = p.Ketu.longitude;
  let allOneSide = true;
  let sideA = true, sideB = true;

  ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].forEach(pName => {
    const l = p[pName].longitude;
    const diffRahu = normDeg(l - rahuLong);
    if (diffRahu > 180) sideA = false;
    else sideB = false;
  });

  if (sideA || sideB) {
    yogas.push({
      name: "Kaal Sarp Yoga",
      category: "arishta",
      status: "Arishta Present",
      desc: "All physical celestial bodies are hemmed between the nodal axis of Rahu and Ketu.",
      effects: "Early life friction and intense karmic testing, culminating in dramatic late-career emergence and spiritual awakening.",
      planets: ["Rahu", "Ketu"]
    });
  }

  // 8. Kemadruma Yoga (No planets in 2nd or 12th from Moon)
  const secondFromMoon = ((p.Moon.rashi - 1 + 1) % 12) + 1;
  const twelfthFromMoon = ((p.Moon.rashi - 1 + 11) % 12) + 1;
  let hasFlankers = false;
  ["Sun", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].forEach(pl => {
    if (p[pl].rashi === secondFromMoon || p[pl].rashi === twelfthFromMoon) {
      hasFlankers = true;
    }
  });

  if (!hasFlankers) {
    yogas.push({
      name: "Kemadruma Yoga",
      category: "arishta",
      status: "Arishta Present",
      desc: "No physical planets (excluding Sun & nodes) flank the Moon in the 2nd or 12th house from it.",
      effects: "Intermittent feelings of mental isolation and solitary self-reliance; dissolved when benefics aspect the Moon.",
      planets: ["Moon"]
    });
  }

  return yogas;
}

function updateYogasUI(filter = "all") {
  if (!currentChartData || !currentChartData.yogas) return;
  const yogas = currentChartData.yogas;

  const counts = { all: yogas.length, raja: 0, dhana: 0, arishta: 0 };
  yogas.forEach(y => {
    if (counts[y.category] !== undefined) counts[y.category]++;
  });

  if (document.getElementById("countAllYogas")) document.getElementById("countAllYogas").textContent = counts.all;
  if (document.getElementById("countRajaYogas")) document.getElementById("countRajaYogas").textContent = counts.raja;
  if (document.getElementById("countDhanaYogas")) document.getElementById("countDhanaYogas").textContent = counts.dhana;
  if (document.getElementById("countArishtaYogas")) document.getElementById("countArishtaYogas").textContent = counts.arishta;

  const container = document.getElementById("yogasContainer");
  if (!container) return;
  container.innerHTML = "";

  const filtered = yogas.filter(y => {
    if (filter === "all") return true;
    return y.category === filter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-1 md:col-span-2 text-center py-8 text-slate-500">
        <p class="text-sm font-semibold text-slate-400">No combinations detected for this filter</p>
      </div>
    `;
    return;
  }

  filtered.forEach(y => {
    const isArishta = y.category === "arishta";
    const card = document.createElement("div");
    card.className = `p-4 rounded-xl border transition ${
      isArishta
        ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60'
        : y.category === 'dhana'
        ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60'
        : 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60'
    } flex flex-col justify-between`;

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
            isArishta ? 'bg-rose-500/20 text-rose-300' : (y.category === 'dhana' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300')
          }">
            ${y.category.toUpperCase()}
          </span>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded ${
            isArishta ? 'bg-rose-950 border border-rose-700/60 text-rose-300' : 'bg-emerald-950 border border-emerald-700/60 text-emerald-300'
          }">
            ${y.status}
          </span>
        </div>
        <h4 class="font-cinzel text-base font-bold text-white mb-1">${y.name}</h4>
        <p class="text-xs text-slate-300 leading-relaxed mb-2">${y.desc}</p>
        <p class="text-[11px] text-slate-400 leading-normal border-t border-slate-800/80 pt-2"><strong class="text-slate-300">Astrological Impact:</strong> ${y.effects}</p>
      </div>
      <div class="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
        <span class="text-slate-500 font-medium">Involved Grahas:</span>
        <span class="font-semibold text-amber-300">${y.planets.join(", ")}</span>
      </div>
    `;
    container.appendChild(card);
  });
}
