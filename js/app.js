// ==========================================================================
// INDUS KUNDLI APP — MAIN COORDINATOR & APPLICATION LOGIC (app.js)
// ==========================================================================

let currentChartData = null;

function showToast(msg, type = "info") {
  const c = document.getElementById("toastContainer");
  if (!c) return;
  const t = document.createElement("div");
  t.className = `px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xl border ${
    type === 'error'
      ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
      : type === 'success'
      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
      : 'bg-slate-900/90 text-amber-300 border-amber-500/40'
  }`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => {
    if (typeof t.remove === 'function') t.remove();
  }, 3500);
}

function calculateFullKundli(birthData) {
  const { year, month, day, hour, minute, second, tz, lat, lon, ayanamshaType, name, gender, placeName } = birthData;
  const jd = calcJulianDay(year, month, day, hour, minute, second, tz);
  const T = (jd - 2451545.0) / 36525.0;
  const ayanamsha = getAyanamsha(jd, ayanamshaType);

  // Ascendant
  const ascInfo = calcAscendant(jd, lat, lon);
  const lagnaSidereal = normDeg(ascInfo.ascTrop - ayanamsha);
  const lagnaRashi = Math.floor(lagnaSidereal / 30) + 1;
  const lagnaDegInSign = lagnaSidereal % 30;
  const ascNakIdx = Math.floor(lagnaSidereal / (360 / 27));
  const ascNak = NAKSHATRAS[ascNakIdx];
  const ascPada = Math.floor((lagnaSidereal % (360 / 27)) / (360 / 108)) + 1;

  const ascData = {
    name: "Lagna (Ascendant)",
    longitude: lagnaSidereal,
    rashi: lagnaRashi,
    rashiName: RASHIS[lagnaRashi - 1].name,
    rashiSanskrit: RASHIS[lagnaRashi - 1].sanskrit,
    degInSign: lagnaDegInSign,
    nakshatra: ascNak.name,
    pada: ascPada,
    nakshatraLord: ascNak.lord,
    house: 1,
    dignity: "Lagna",
    charaKaraka: "Self",
    isRetrograde: false,
    isCombust: false
  };

  // Sun
  const sunTrop = calcSun(T);
  const sunSidereal = normDeg(sunTrop - ayanamsha);
  const sunMeanM = normDeg(357.52911 + 35999.05029 * T);

  // Moon
  const moonTrop = calcMoon(T, sunMeanM);
  const moonSidereal = normDeg(moonTrop - ayanamsha);

  // Rahu & Ketu (Mean Nodes)
  const rahuTrop = normDeg(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
  const rahuSidereal = normDeg(rahuTrop - ayanamsha);
  const ketuSidereal = normDeg(rahuSidereal + 180.0);

  // Keplerian elements for outer & inner planets
  const ELEMENTS = {
    Earth: {
      a: [1.00000261, 0.00000562],
      e: [0.01671123, -0.00004392],
      I: [-0.00001531, -0.01294668],
      L: [100.46457166, 35999.37244981],
      longPeri: [102.93768193, 0.32327364],
      longNode: [0.0, 0.0]
    },
    Mars: {
      a: [1.52371034, 0.00001847],
      e: [0.0933941, 0.00007882],
      I: [1.84969142, -0.00813131],
      L: [-4.55343205, 19140.30268499],
      longPeri: [-23.94362959, 0.44441088],
      longNode: [49.55953891, -0.29257343]
    },
    Mercury: {
      a: [0.38709927, 0.00000037],
      e: [0.20563593, 0.00001906],
      I: [7.00497902, -0.00594749],
      L: [252.2503235, 149472.67411175],
      longPeri: [77.45779628, 0.16047689],
      longNode: [48.33076593, -0.12534081]
    },
    Jupiter: {
      a: [5.202887, -0.00011607],
      e: [0.04838624, -0.00013253],
      I: [1.30439695, -0.00183714],
      L: [34.39644051, 3034.74612775],
      longPeri: [14.72847983, 0.21252668],
      longNode: [100.47390909, 0.20469106]
    },
    Venus: {
      a: [0.72333566, 0.0000039],
      e: [0.00677672, -0.00004107],
      I: [3.39467605, -0.0007889],
      L: [181.9790995, 58517.81538729],
      longPeri: [131.60246718, 0.00268329],
      longNode: [76.67984255, -0.27769418]
    },
    Saturn: {
      a: [9.53667594, -0.0012506],
      e: [0.05386179, -0.00050991],
      I: [2.48599187, 0.00193609],
      L: [49.95424423, 1222.49362201],
      longPeri: [92.59887831, -0.41897216],
      longNode: [113.66242448, -0.28867794]
    }
  };

  const planetsOrder = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const planetsData = {};

  planetsOrder.forEach(pName => {
    let sidLon = 0;
    let isRetro = false;

    if (pName === "Sun") {
      sidLon = sunSidereal;
    } else if (pName === "Moon") {
      sidLon = moonSidereal;
    } else if (pName === "Rahu") {
      sidLon = rahuSidereal;
      isRetro = true;
    } else if (pName === "Ketu") {
      sidLon = ketuSidereal;
      isRetro = true;
    } else {
      const geo = calcGeocentricPlanet(T, ELEMENTS[pName], ELEMENTS.Earth);
      sidLon = normDeg(geo.lon - ayanamsha);

      // Check retrograde motion by sampling +1 hour
      const T_next = T + 1.0 / (24.0 * 36525.0);
      const geo_next = calcGeocentricPlanet(T_next, ELEMENTS[pName], ELEMENTS.Earth);
      let diff = geo_next.lon - geo.lon;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      isRetro = diff < 0;
    }

    const r0 = Math.floor(sidLon / 30);
    const degInSign = sidLon % 30;
    const house = ((r0 + 1 - lagnaRashi + 12) % 12) + 1;
    const nakIdx = Math.floor(sidLon / (360 / 27));
    const nak = NAKSHATRAS[nakIdx];
    const pada = Math.floor((sidLon % (360 / 27)) / (360 / 108)) + 1;

    // Combustion check (proximity to Sun within orb)
    let isCombust = false;
    if (!["Sun", "Rahu", "Ketu"].includes(pName)) {
      let sunDiff = Math.abs(sidLon - sunSidereal);
      if (sunDiff > 180) sunDiff = 360 - sunDiff;
      const orbs = { Moon: 12, Mars: 17, Mercury: 14, Jupiter: 11, Venus: 10, Saturn: 15 };
      isCombust = sunDiff <= (orbs[pName] || 10);
    }

    // Dignity evaluation
    let dignity = "Neutral";
    const signNum = r0 + 1;
    if (EXALTATION[pName] && signNum === EXALTATION[pName].sign) {
      dignity = "Exalted";
    } else if (DEBILITATION[pName] && signNum === DEBILITATION[pName].sign) {
      dignity = "Debilitated";
    } else if (OWN_SIGNS[pName] && OWN_SIGNS[pName].includes(signNum)) {
      dignity = "Own Sign";
    }

    planetsData[pName] = {
      name: pName,
      longitude: sidLon,
      rashi: signNum,
      rashiName: RASHIS[r0].name,
      rashiSanskrit: RASHIS[r0].sanskrit,
      degInSign,
      nakshatra: nak.name,
      pada,
      nakshatraLord: nak.lord,
      house,
      isRetrograde: isRetro,
      isCombust,
      dignity,
      charaKaraka: "—"
    };
  });

  // Calculate Chara Karakas (7 Classical Karakas as per Parashara: Sun to Saturn by degrees in sign)
  const karakaCandidates = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].map(pName => ({
    name: pName,
    deg: planetsData[pName].degInSign
  }));
  karakaCandidates.sort((a, b) => b.deg - a.deg);
  const KARAKA_NAMES = [
    "Atmakaraka (AK)",
    "Amatyakaraka (AmK)",
    "Bhratrikaraka (BK)",
    "Matrikaraka (MK)",
    "Pitrikaraka (PiK)",
    "Putrakaraka (PK)",
    "Gnatikaraka (GK)",
    "Darakaraka (DK)"
  ];
  karakaCandidates.forEach((c, idx) => {
    if (planetsData[c.name]) {
      planetsData[c.name].charaKaraka = KARAKA_NAMES[idx] || "—";
    }
  });

  // Panchanga elements
  const tithiDiff = normDeg(moonSidereal - sunSidereal);
  const tithiNum = Math.floor(tithiDiff / 12) + 1;
  const tithiName = tithiNum <= 15 ? `Shukla ${tithiNum}` : `Krishna ${tithiNum - 15}`;
  const VARA_NAMES = ["Sunday (Ravivara)", "Monday (Somavara)", "Tuesday (Mangalavara)", "Wednesday (Budhavara)", "Thursday (Guruvara)", "Friday (Shukravara)", "Saturday (Shanivara)"];
  const dayOfWeek = (Math.floor(jd + 1.5)) % 7;
  const vara = VARA_NAMES[dayOfWeek];
  const yogaLon = normDeg(sunSidereal + moonSidereal);
  const yogaIdx = Math.floor(yogaLon / (360 / 27));
  const YOGA_NAMES = ["Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
  const yoga = YOGA_NAMES[yogaIdx] || "Auspicious";
  const karanaIdx = Math.floor(tithiDiff / 6);
  const KARANA_NAMES = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti (Bhadra)"];
  let karana = KARANA_NAMES[(karanaIdx - 1) % 7] || "Bava";

  // Calculate Vishesh Lagnas and Upagrahas
  const visheshLagnas = calculateVisheshLagnas(sunSidereal, moonSidereal, lagnaSidereal, hour, minute, second, 6.0);
  const upagrahas = calculateUpaGrahas(sunSidereal, lagnaSidereal, hour, minute, second, 6.0);

  // Calculate Divisional Charts, Ashtakavarga, Yogas & Vimshottari Dasha
  const vargas = computeAllVargas(planetsData, ascData, currentVargaMethod);
  const ashtakavarga = computeAshtakavarga(planetsData, ascData);
  const yogas = detectYogasAndArishtas(planetsData, ascData, lagnaRashi);
  const dasha = computeVimshottariDasha(planetsData.Moon.longitude, new Date(year, month - 1, day, hour, minute, second));

  return {
    meta: { name, gender, year, month, day, hour, minute, second, tz, lat, lon, ayanamshaType, ayanamsha, placeName },
    ascendant: ascData,
    planets: planetsData,
    visheshLagnas,
    upagrahas,
    panchanga: { tithi: tithiName, vara, yoga, karana },
    vargas,
    ashtakavarga,
    yogas,
    dasha
  };
}

// Update Planetary Tab (Tables for Planets, Vishesh Lagnas, and Upa-grahas)
function updatePlanetaryTable() {
  if (!currentChartData) return;

  // 1. Graha Sphuta Main Table
  const tbody = document.getElementById("planetaryTableBody");
  if (tbody) {
    tbody.innerHTML = "";
    const pList = [currentChartData.ascendant, ...Object.values(currentChartData.planets)];
    const ascRashi = currentChartData.ascendant.rashi;
    const effectiveAsc = d1RotatedBhava === 1 ? ascRashi : (((ascRashi - 1 + (d1RotatedBhava - 1)) % 12) + 1);

    pList.forEach(p => {
      const isAsc = p.name.includes("Ascendant");
      const speedText = isAsc ? "—" : `${p.isRetrograde ? '<span class="text-amber-400 font-bold">(R) Vakri</span>' : 'Direct'} ${p.isCombust ? '<span class="text-rose-400 font-bold ml-1">(C) Asta</span>' : ''}`;
      
      let dignityBadge = `<span class="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">${p.dignity}</span>`;
      if (p.dignity === "Exalted") dignityBadge = `<span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">Uchcha (Exalted)</span>`;
      if (p.dignity === "Debilitated") dignityBadge = `<span class="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">Neecha (Debilitated)</span>`;
      if (p.dignity === "Own Sign") dignityBadge = `<span class="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">Swakshetra (Own)</span>`;

      const rotHouseNum = ((p.rashi - effectiveAsc + 12) % 12) + 1;
      const houseDisplay = d1RotatedBhava === 1
        ? `H${p.house}`
        : `<span>H${p.house}</span><span class="text-[10px] text-amber-300 font-semibold block">(Rot: H${rotHouseNum})</span>`;

      const row = document.createElement("tr");
      row.className = "hover:bg-slate-800/40 transition";
      row.innerHTML = `
        <td class="py-2.5 px-3 font-semibold text-white flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full ${isAsc ? 'bg-amber-400' : 'bg-slate-500'}"></span>
          <span>${p.name}</span>
        </td>
        <td class="py-2.5 px-3 text-slate-400 font-mono text-[11px]">${speedText}</td>
        <td class="py-2.5 px-3 font-medium text-slate-200">${p.rashiName} (${p.rashiSanskrit})</td>
        <td class="py-2.5 px-3 font-mono text-amber-300">${formatDMS(p.degInSign)}</td>
        <td class="py-2.5 px-3 text-slate-300">${p.nakshatra} <span class="text-slate-500 text-[10px]">P${p.pada}</span></td>
        <td class="py-2.5 px-3 text-slate-400">${p.nakshatraLord}</td>
        <td class="py-2.5 px-3 font-bold text-amber-400">${houseDisplay}</td>
        <td class="py-2.5 px-3">${dignityBadge}</td>
        <td class="py-2.5 px-3 text-[11px] font-medium text-amber-200/90">${p.charaKaraka}</td>
      `;
      tbody.appendChild(row);
    });
  }

  // 2. Vishesh Lagnas Table
  const vlBody = document.getElementById("visheshLagnasTableBody");
  if (vlBody && currentChartData.visheshLagnas) {
    vlBody.innerHTML = "";
    currentChartData.visheshLagnas.forEach(vl => {
      const tr = document.createElement("tr");
      tr.className = "hover:bg-slate-800/40 transition";
      tr.innerHTML = `
        <td class="py-2 px-3 font-semibold text-white flex items-center gap-2">
          <span class="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px]">${vl.symbol}</span>
          <span>${vl.name}</span>
        </td>
        <td class="py-2 px-3 text-amber-300 font-medium">${vl.rashiName} (${vl.rashiSanskrit})</td>
        <td class="py-2 px-3 font-mono text-slate-300 text-[11px]">${formatDMS(vl.degInSign)}</td>
        <td class="py-2 px-3 text-slate-300">${vl.nakshatra} <span class="text-slate-500 text-[10px]">P${vl.pada}</span></td>
        <td class="py-2 px-3 font-bold text-slate-200">H${vl.house}</td>
        <td class="py-2 px-3 text-[11px] text-slate-400 leading-tight">${vl.purpose}</td>
      `;
      vlBody.appendChild(tr);
    });
  }

  // 3. Upa-Grahas Table
  const ugBody = document.getElementById("upagrahasTableBody");
  if (ugBody && currentChartData.upagrahas) {
    ugBody.innerHTML = "";
    currentChartData.upagrahas.forEach(ug => {
      const tr = document.createElement("tr");
      tr.className = "hover:bg-slate-800/40 transition";
      tr.innerHTML = `
        <td class="py-2 px-3 font-semibold text-white">
          <span>${ug.name}</span>
          <span class="block text-[10px] text-slate-500">${ug.category}</span>
        </td>
        <td class="py-2 px-3 text-slate-400 text-[11px]">${ug.lord}</td>
        <td class="py-2 px-3 text-amber-300 font-medium">${ug.rashiName} (${ug.rashiSanskrit})</td>
        <td class="py-2 px-3 font-mono text-slate-300 text-[11px]">${formatDMS(ug.degInSign)}</td>
        <td class="py-2 px-3 text-slate-300">${ug.nakshatra} <span class="text-slate-500 text-[10px]">P${ug.pada}</span></td>
        <td class="py-2 px-3 font-bold text-slate-200">H${ug.house}</td>
        <td class="py-2 px-3 text-[11px] text-slate-400 leading-tight">${ug.effect}</td>
      `;
      ugBody.appendChild(tr);
    });
  }

  if (document.getElementById("ayanamshaDisplay")) {
    document.getElementById("ayanamshaDisplay").textContent = `Lahiri Ayanamsha: ${formatDMS(currentChartData.meta.ayanamsha)}`;
  }
}

// Master UI Update Orchestrator (Completely isolated with try/catch)
function updateUIWithData(data) {
  currentChartData = data;

  try {
    if (typeof updateHouseSummaries === "function") updateHouseSummaries();
  } catch (e) {
    console.warn("updateHouseSummaries warning:", e);
  }

  try {
    if (typeof renderAllVargasGrid === "function") renderAllVargasGrid();
  } catch (e) {
    console.warn("renderAllVargasGrid warning:", e);
  }

  // Banner Details
  try {
    if (document.getElementById("bannerName")) document.getElementById("bannerName").textContent = data.meta.name;
    if (document.getElementById("bannerMeta")) document.getElementById("bannerMeta").textContent = `${data.meta.gender} • ${data.meta.day}/${data.meta.month}/${data.meta.year} • ${String(data.meta.hour).padStart(2,'0')}:${String(data.meta.minute).padStart(2,'0')}`;
    if (document.getElementById("bannerPlace")) document.getElementById("bannerPlace").textContent = data.meta.placeName;

    if (document.getElementById("bannerLagna")) document.getElementById("bannerLagna").textContent = `${data.ascendant.rashiName} (${data.ascendant.rashiSanskrit})`;
    if (document.getElementById("bannerLagnaDeg")) document.getElementById("bannerLagnaDeg").textContent = formatDMS(data.ascendant.degInSign);
    if (document.getElementById("bannerLagnaLord")) document.getElementById("bannerLagnaLord").textContent = `Lord: ${RASHIS[data.ascendant.rashi - 1].lord}`;

    const moon = data.planets.Moon;
    if (moon) {
      if (document.getElementById("bannerMoonRashi")) document.getElementById("bannerMoonRashi").textContent = `${moon.rashiName} (${moon.rashiSanskrit})`;
      if (document.getElementById("bannerMoonDeg")) document.getElementById("bannerMoonDeg").textContent = formatDMS(moon.degInSign);
      if (document.getElementById("bannerMoonLord")) document.getElementById("bannerMoonLord").textContent = `Lord: ${RASHIS[moon.rashi - 1].lord}`;

      if (document.getElementById("bannerNakshatra")) document.getElementById("bannerNakshatra").textContent = moon.nakshatra;
      if (document.getElementById("bannerPada")) document.getElementById("bannerPada").textContent = `Pada ${moon.pada}`;
      if (document.getElementById("bannerNakLord")) document.getElementById("bannerNakLord").textContent = `Lord: ${moon.nakshatraLord}`;
    }

    if (document.getElementById("bannerTithi")) document.getElementById("bannerTithi").textContent = `Tithi: ${data.panchanga.tithi}`;
    if (document.getElementById("bannerVara")) document.getElementById("bannerVara").textContent = `Vara: ${data.panchanga.vara}`;
    if (document.getElementById("bannerYogaKarana")) document.getElementById("bannerYogaKarana").textContent = `Yoga: ${data.panchanga.yoga} • Karana: ${data.panchanga.karana}`;

    const checkDateInput = document.getElementById("dashaTargetDate");
    const checkDate = checkDateInput && checkDateInput.value ? new Date(checkDateInput.value) : new Date();
    const activeDasha = data.dasha ? data.dasha.getActiveDashaAt(checkDate) : null;
    if (activeDasha) {
      if (document.getElementById("bannerActiveDasha")) document.getElementById("bannerActiveDasha").textContent = `${activeDasha.mahadasha} / ${activeDasha.antardasha}`;
      if (document.getElementById("bannerActiveDashaDates")) document.getElementById("bannerActiveDashaDates").textContent = `Until ${activeDasha.adEnd}`;
      if (document.getElementById("bannerDashaProgress")) document.getElementById("bannerDashaProgress").style.width = `${activeDasha.pct}%`;

      if (document.getElementById("heroDashaName")) document.getElementById("heroDashaName").textContent = `${activeDasha.mahadasha} Mahadasha • ${activeDasha.antardasha} Antardasha`;
      if (document.getElementById("heroDashaDates")) document.getElementById("heroDashaDates").textContent = `Period: ${activeDasha.adStart} — ${activeDasha.adEnd}`;
      if (document.getElementById("heroDashaRemaining")) document.getElementById("heroDashaRemaining").textContent = `Remaining: ${activeDasha.remainingDays} days (${activeDasha.pct}% elapsed)`;
      if (document.getElementById("heroDashaProgressBar")) document.getElementById("heroDashaProgressBar").style.width = `${activeDasha.pct}%`;
    }
  } catch (e) {
    console.warn("Banner warning:", e);
  }

  // Render Core Charts
  try {
    renderChart("D1", "chartD1Container", false);
    renderChart("D9", "chartD9Container", false);
    renderChart("D1", "prChartD1", true);
    renderChart("D9", "prChartD9", true);
    renderChart("D10", "prChartD10", true);
  } catch (e) {
    console.warn("Chart render warning:", e);
  }

  // Render Selected Varga
  try {
    const vSelector = document.getElementById("vargaSelector");
    const vKey = vSelector ? vSelector.value : "D9";
    if (document.getElementById("vargaMainChartContainer")) {
      renderChart(vKey, "vargaMainChartContainer", false);
    }
    if (typeof updateVargaTable === "function") {
      updateVargaTable(vKey);
    }
  } catch (e) {
    console.warn("Varga selector warning:", e);
  }

  // Update Planetary Table (Graha Sphuta, Vishesh Lagnas, Upagrahas)
  try {
    updatePlanetaryTable();
  } catch (e) {
    console.error("updatePlanetaryTable error:", e);
  }

  // Update Ashtakavarga (SAV & BAV)
  try {
    updateAshtakavargaUI();
  } catch (e) {
    console.error("updateAshtakavargaUI error:", e);
  }

  // Update Yogas & Arishtas
  try {
    updateYogasUI();
  } catch (e) {
    console.error("updateYogasUI error:", e);
  }

  // Update Dasha
  try {
    updateDashaUI();
  } catch (e) {
    console.warn("updateDashaUI warning:", e);
  }

  // Update Print Report
  try {
    updatePrintableReport();
  } catch (e) {
    console.warn("updatePrintableReport warning:", e);
  }
}

function triggerCalculation() {
  const name = document.getElementById("nativeName") ? document.getElementById("nativeName").value || "Shri Jataka" : "Shri Jataka";
  const gender = document.getElementById("nativeGender") ? document.getElementById("nativeGender").value : "Male";
  const dateStr = document.getElementById("birthDate") ? document.getElementById("birthDate").value : "1995-10-24";
  const timeStr = document.getElementById("birthTime") ? document.getElementById("birthTime").value : "14:30:00";
  const lat = parseFloat(document.getElementById("customLat") ? document.getElementById("customLat").value : 28.4089) || 28.4089;
  const lon = parseFloat(document.getElementById("customLon") ? document.getElementById("customLon").value : 77.3178) || 77.3178;
  const tz = parseFloat(document.getElementById("customTZ") ? document.getElementById("customTZ").value : 5.5) || 5.5;
  const ayanamshaType = document.getElementById("ayanamshaSelect") ? document.getElementById("ayanamshaSelect").value || "lahiri" : "lahiri";

  const placeSelect = document.getElementById("birthPlaceSelect");
  let placeName = "Faridabad, Haryana, India";
  if (placeSelect && placeSelect.options && placeSelect.selectedIndex >= 0 && placeSelect.options[placeSelect.selectedIndex]) {
    placeName = placeSelect.options[placeSelect.selectedIndex].text;
  }

  const [y, m, d] = (dateStr || "1995-10-24").split("-").map(Number);
  const timeParts = (timeStr || "14:30:00").split(":").map(Number);
  const hour = timeParts[0] || 0;
  const minute = timeParts[1] || 0;
  const second = timeParts[2] || 0;

  const birthData = {
    name, gender, year: y, month: m, day: d, hour, minute, second, tz, lat, lon, ayanamshaType, placeName
  };

  const result = calculateFullKundli(birthData);
  updateUIWithData(result);
  showToast("Kundli calculated successfully!", "success");
}

function updatePrintableReport() {
  if (!currentChartData) return;
  const data = currentChartData;

  if (document.getElementById("prNativeName")) document.getElementById("prNativeName").textContent = data.meta.name;
  if (document.getElementById("prGender")) document.getElementById("prGender").textContent = data.meta.gender;
  if (document.getElementById("prDOB")) document.getElementById("prDOB").textContent = `${data.meta.day}/${data.meta.month}/${data.meta.year}`;
  if (document.getElementById("prTOB")) document.getElementById("prTOB").textContent = `${String(data.meta.hour).padStart(2,'0')}:${String(data.meta.minute).padStart(2,'0')}`;
  if (document.getElementById("prPOB")) document.getElementById("prPOB").textContent = data.meta.placeName;
  if (document.getElementById("prCoords")) document.getElementById("prCoords").textContent = `Lat: ${data.meta.lat}°, Lon: ${data.meta.lon}°, TZ: ${data.meta.tz}h`;

  if (document.getElementById("prLagna")) document.getElementById("prLagna").textContent = `${data.ascendant.rashiName} (${data.ascendant.rashiSanskrit}) at ${formatDMS(data.ascendant.degInSign)}`;
  if (document.getElementById("prRashi")) document.getElementById("prRashi").textContent = `${data.planets.Moon.rashiName} (${data.planets.Moon.rashiSanskrit})`;
  if (document.getElementById("prNakshatra")) document.getElementById("prNakshatra").textContent = `${data.planets.Moon.nakshatra} (Pada ${data.planets.Moon.pada}, Lord: ${data.planets.Moon.nakshatraLord})`;
  if (document.getElementById("prTithi")) document.getElementById("prTithi").textContent = data.panchanga.tithi;
  if (document.getElementById("prVara")) document.getElementById("prVara").textContent = data.panchanga.vara;
  if (document.getElementById("prAyanamsha")) document.getElementById("prAyanamsha").textContent = `Lahiri (${formatDMS(data.meta.ayanamsha)})`;

  const prTable = document.getElementById("prPlanetsBody");
  if (prTable) {
    prTable.innerHTML = "";
    const pList = [data.ascendant, ...Object.values(data.planets)];
    pList.forEach(p => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-slate-200";
      tr.innerHTML = `
        <td class="py-1 px-2 font-bold">${p.name} ${p.isRetrograde ? '(R)' : ''}</td>
        <td class="py-1 px-2">${p.rashiName}</td>
        <td class="py-1 px-2 font-mono">${formatDMS(p.degInSign)}</td>
        <td class="py-1 px-2">${p.nakshatra} (P${p.pada})</td>
        <td class="py-1 px-2">${p.nakshatraLord}</td>
        <td class="py-1 px-2 font-bold">H${p.house}</td>
        <td class="py-1 px-2">${p.dignity}</td>
        <td class="py-1 px-2 font-semibold text-slate-700">${p.charaKaraka}</td>
      `;
      prTable.appendChild(tr);
    });
  }

  const prSavGrid = document.getElementById("prSavGrid");
  if (prSavGrid && data.ashtakavarga && data.ashtakavarga.sav) {
    prSavGrid.innerHTML = "";
    data.ashtakavarga.sav.forEach((pts, i) => {
      const d = document.createElement("div");
      d.className = "border border-slate-300 p-1 rounded bg-slate-50";
      d.innerHTML = `<span class="text-[9px] block text-slate-600">${RASHIS[i].short}</span><strong>${pts}</strong>`;
      prSavGrid.appendChild(d);
    });
  }

  // Populate Printable Shodashavarga Matrix
  const prShodashaBody = document.getElementById("prShodashaBody");
  if (prShodashaBody && data.vargas) {
    prShodashaBody.innerHTML = "";
    const vKeyList = ["D1", "D2", "D3", "D4", "D7", "D9", "D10", "D12", "D16", "D20", "D24", "D27", "D30", "D40", "D45", "D60"];
    const bodies = ["Lagna", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

    bodies.forEach(bName => {
      const d1Sign = data.vargas.D1 && data.vargas.D1[bName] ? data.vargas.D1[bName].sign : 1;
      const isD9Vargottama = data.vargas.D9 && data.vargas.D9[bName] && (data.vargas.D9[bName].sign === d1Sign);

      let rowHtml = `<td class="py-1 px-1.5 font-bold ${bName === 'Lagna' ? 'text-amber-900' : 'text-slate-800'}">${bName}</td>`;
      vKeyList.forEach(vk => {
        const vSign = data.vargas[vk] && data.vargas[vk][bName] ? data.vargas[vk][bName].sign : 1;
        const isSame = (vSign === d1Sign);
        const signCode = RASHIS[vSign - 1].short;
        const highlightClass = isSame ? "font-bold text-emerald-800 bg-emerald-50" : "text-slate-700";
        rowHtml += `<td class="py-1 px-1 text-center ${highlightClass}">${signCode}</td>`;
      });

      rowHtml += `<td class="py-1 px-1 text-center font-semibold ${isD9Vargottama ? 'text-emerald-700 font-bold' : 'text-slate-400'}">${isD9Vargottama ? 'Vargottama' : '—'}</td>`;

      const tr = document.createElement("tr");
      tr.className = "border-b border-slate-200";
      tr.innerHTML = rowHtml;
      prShodashaBody.appendChild(tr);
    });
  }
}
