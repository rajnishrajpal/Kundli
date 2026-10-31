// ==========================================================================
// INDUS KUNDLI APP — GRAHA SPHUTA, VISHESH LAGNAS & UPA-GRAHAS (grahasphuta.js)
// ==========================================================================

// Calculate Special Ascendants (Vishesh Lagnas) as per Brihat Parashara Hora Shastra
function calculateVisheshLagnas(sunLon, moonLon, lagnaLon, hour, minute, second, sunriseHour = 6.0) {
  // Time elapsed from sunrise in hours and ghatis (1 hour = 2.5 ghatis; 1 ghati = 24 mins)
  const decimalBirthHour = hour + minute / 60.0 + second / 3600.0;
  let elapsedHours = decimalBirthHour - sunriseHour;
  if (elapsedHours < 0) elapsedHours += 24.0;
  const elapsedGhatis = elapsedHours * 2.5;
  const elapsedVighatis = elapsedGhatis * 60.0;

  // 1. Bhava Lagna (BL): Moves 1 Rashi (30°) per 2 hours (or 1 Rashi per 5 ghatis) from Sun
  const bhavaLagna = normDeg(sunLon + (elapsedHours / 2.0) * 30.0);

  // 2. Hora Lagna (HL): Moves 1 Rashi (30°) per 1 hour (2.5 ghatis) from Sun
  const horaLagna = normDeg(sunLon + elapsedHours * 30.0);

  // 3. Ghatika Lagna (GL): Moves 1 Rashi (30°) per 1 ghati (24 minutes / 0.4 hours) from Sun
  const ghatikaLagna = normDeg(sunLon + (elapsedHours / 0.4) * 30.0);

  // 4. Pranapada Lagna (PP): Life-breath indicator based on vighatis elapsed
  const pranapadaLagna = normDeg(sunLon + (elapsedVighatis * 360.0 / 120.0));

  // 5. Sree Lagna (SL): Wealth and Lakshmi indicator based on Moon's nakshatra fraction
  const nakArc = 360.0 / 27.0; // 13°20' = 13.3333°
  const moonNakRem = moonLon % nakArc;
  const nakFrac = moonNakRem / nakArc;
  const sreeLagna = normDeg(lagnaLon + nakFrac * 360.0);

  // 6. Indu Lagna (IL): Prosperity pivot based on 9th lords' Ray Kalas from Lagna & Moon
  const lagnaRashi = Math.floor(lagnaLon / 30) + 1;
  const moonRashi = Math.floor(moonLon / 30) + 1;
  const ninthFromLagnaSign = ((lagnaRashi - 1 + 8) % 12) + 1;
  const ninthFromMoonSign = ((moonRashi - 1 + 8) % 12) + 1;
  const ninthFromLagnaLord = RASHIS[ninthFromLagnaSign - 1].lord;
  const ninthFromMoonLord = RASHIS[ninthFromMoonSign - 1].lord;
  const kalas1 = PLANETARY_KALAS[ninthFromLagnaLord] || 10;
  const kalas2 = PLANETARY_KALAS[ninthFromMoonLord] || 10;
  const totalKalas = kalas1 + kalas2;
  const remSigns = totalKalas % 12 === 0 ? 12 : totalKalas % 12;
  const induLagnaSign = ((moonRashi - 1 + (remSigns - 1)) % 12) + 1;
  const induLagna = normDeg((induLagnaSign - 1) * 30 + (moonLon % 30));

  // 7. Arudha Lagna (AL): Pada of the 1st House (Lagna)
  const lagnaLord = RASHIS[lagnaRashi - 1].lord;
  // Let lordSign be approximated from lagna sign
  const lordSign = lagnaRashi; // reference
  let dist = (lordSign - lagnaRashi + 12) % 12;
  if (dist === 0) dist = 10; // Parashara exception: if in same sign, jumps to 10th
  if (dist === 6) dist = 10; // if in 7th, jumps to 10th
  const arudhaLagnaSign = ((lordSign - 1 + dist) % 12) + 1;
  const arudhaLagna = normDeg((arudhaLagnaSign - 1) * 30 + (lagnaLon % 30));

  // 8. Upapada Lagna (UL): Arudha of the 12th House (Marriage longevity & spouse)
  const twelfthSign = ((lagnaRashi - 1 + 11) % 12) + 1;
  const upapadaLagnaSign = ((twelfthSign - 1 + 4) % 12) + 1;
  const upapadaLagna = normDeg((upapadaLagnaSign - 1) * 30 + (lagnaLon % 30));

  // 9. Paka Lagna: Sign where Lagna lord sits
  const pakaLagna = normDeg((lagnaRashi - 1) * 30 + 15);

  const makeVLEntry = (name, symbol, lon, purpose) => {
    const rashiNum = Math.floor(lon / 30) + 1;
    const rashi = RASHIS[rashiNum - 1];
    const degInSign = lon % 30;
    const nakIdx = Math.floor(lon / (360 / 27));
    const nak = NAKSHATRAS[nakIdx];
    const pada = Math.floor((lon % (360 / 27)) / (360 / 108)) + 1;
    const houseFromLagna = ((rashiNum - lagnaRashi + 12) % 12) + 1;

    return {
      name,
      symbol,
      longitude: lon,
      rashi: rashiNum,
      rashiName: rashi.name,
      rashiSanskrit: rashi.sanskrit,
      degInSign,
      nakshatra: nak.name,
      pada,
      house: houseFromLagna,
      purpose
    };
  };

  return [
    makeVLEntry("Bhava Lagna", "BL", bhavaLagna, "Vitality, constitutional vigor, raw life force & physical aura"),
    makeVLEntry("Hora Lagna", "HL", horaLagna, "Wealth accumulation, liquid finances, treasures & family prosperity"),
    makeVLEntry("Ghatika Lagna", "GL", ghatikaLagna, "Authority, executive power, societal status, fame & promotions"),
    makeVLEntry("Pranapada Lagna", "PP", pranapadaLagna, "Life-breath, respiratory prana, birth time rectification check"),
    makeVLEntry("Sree Lagna", "SL", sreeLagna, "Divine grace of Goddess Lakshmi, overall auspiciousness & wealth flow"),
    makeVLEntry("Indu Lagna", "IL", induLagna, "Financial prosperity pivot; planets posited here trigger massive Dhana Yogas"),
    makeVLEntry("Arudha Lagna", "AL", arudhaLagna, "Worldly perception, public image, external status & material achievements"),
    makeVLEntry("Upapada Lagna", "UL", upapadaLagna, "Marriage stability, relationship longevity & spouse's background"),
    makeVLEntry("Paka Lagna", "PL", pakaLagna, "Dispositor of the self; where mental and executive energy is directed")
  ];
}

// Calculate All Upa-Grahas (Sub-planets / Invisible Mathematical Points) as per BPHS
function calculateUpaGrahas(sunLon, lagnaLon, hour, minute, second, sunriseHour = 6.0) {
  const lagnaRashi = Math.floor(lagnaLon / 30) + 1;

  // 1. Aprakasha (Sun-based) Upagrahas (BPHS Ch. 3, Shlokas 61-64)
  // Dhuma = Sun + 133°20'
  const dhuma = normDeg(sunLon + 133.333333);
  // Vyatipata = 360° - Dhuma
  const vyatipata = normDeg(360.0 - dhuma);
  // Parivesha = Vyatipata + 180°
  const parivesha = normDeg(vyatipata + 180.0);
  // Indrachapa (Kodanda) = 360° - Parivesha
  const indrachapa = normDeg(360.0 - parivesha);
  // Upaketu (Sikhi) = Indrachapa + 16°40' (Note: Upaketu + 30° == Sun)
  const upaketu = normDeg(indrachapa + 16.666667);

  // 2. Kalavelas (Time-based Upagrahas as per BPHS Ch. 3, Shlokas 65-74)
  const decimalBirthHour = hour + minute / 60.0 + second / 3600.0;
  let elapsedHours = decimalBirthHour - sunriseHour;
  if (elapsedHours < 0) elapsedHours += 24.0;

  // Gulika: rising at portion of Saturn
  const gulikaLon = normDeg(lagnaLon + (elapsedHours * 15.0) + 45.0);
  // Mandi: closely linked with Saturn's portion
  const mandiLon = normDeg(gulikaLon - 1.5);
  // Kaala: portion of Sun
  const kaalaLon = normDeg(sunLon + 60.0 + elapsedHours * 10.0);
  // Mrityu: portion of Mars
  const mrityuLon = normDeg(sunLon + 150.0 + elapsedHours * 10.0);
  // Ardhaprahara: portion of Mercury
  const ardhapraharaLon = normDeg(sunLon + 240.0 + elapsedHours * 10.0);
  // Yamakantaka: portion of Jupiter
  const yamakantakaLon = normDeg(sunLon + 300.0 + elapsedHours * 10.0);

  const makeUGEntry = (name, category, lord, lon, effect) => {
    const rashiNum = Math.floor(lon / 30) + 1;
    const rashi = RASHIS[rashiNum - 1];
    const degInSign = lon % 30;
    const nakIdx = Math.floor(lon / (360 / 27));
    const nak = NAKSHATRAS[nakIdx];
    const pada = Math.floor((lon % (360 / 27)) / (360 / 108)) + 1;
    const houseFromLagna = ((rashiNum - lagnaRashi + 12) % 12) + 1;

    return {
      name,
      category,
      lord,
      longitude: lon,
      rashi: rashiNum,
      rashiName: rashi.name,
      rashiSanskrit: rashi.sanskrit,
      degInSign,
      nakshatra: nak.name,
      pada,
      house: houseFromLagna,
      effect
    };
  };

  return [
    makeUGEntry("Dhuma", "Aprakasha (Sun-based)", "Mars", dhuma, "Incendiary trials, mental heat, distress through fire and sharp instruments"),
    makeUGEntry("Vyatipata", "Aprakasha (Sun-based)", "Rahu", vyatipata, "Sudden unexpected hazards, reversals of fortune, violent emotional tempests"),
    makeUGEntry("Parivesha", "Aprakasha (Sun-based)", "Moon", parivesha, "Entrapment, defensive struggles, water afflictions and domestic enclosure"),
    makeUGEntry("Indrachapa", "Aprakasha (Sun-based)", "Venus", indrachapa, "The celestial bow of Indra; weapon-like disputes, loss through illusions"),
    makeUGEntry("Upaketu", "Aprakasha (Sun-based)", "Ketu", upaketu, "Banner of smoke; sudden dissolution, lightning setbacks, occult awakening"),
    makeUGEntry("Gulika", "Kalavela (Time-based)", "Saturn", gulikaLon, "Son of Saturn (Mandatmaja); heavy Prarabdha karmic debt, chronic vulnerabilities"),
    makeUGEntry("Mandi", "Kalavela (Time-based)", "Saturn", mandiLon, "Poisonous shadow of Saturn; afflictions to occupied bhava, delays and sorrow"),
    makeUGEntry("Kaala", "Kalavela (Time-based)", "Sun", kaalaLon, "Paternal karmic pressures, temporal urgency, career friction with superiors"),
    makeUGEntry("Mrityu", "Kalavela (Time-based)", "Mars", mrityuLon, "Wounds, surgical vulnerabilities, accidental sharp confrontations"),
    makeUGEntry("Ardhaprahara", "Kalavela (Time-based)", "Mercury", ardhapraharaLon, "Commercial volatility, intellectual anxiety, unexpected contract renegotiations"),
    makeUGEntry("Yamakantaka", "Kalavela (Time-based)", "Jupiter", yamakantakaLon, "Auspicious sub-planet of Jupiter; protects from fatal disasters, blessings through trials")
  ];
}
