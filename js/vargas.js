// ==========================================================================
// INDUS KUNDLI APP — DIVISIONAL CHARTS (VARGAS D1 TO D60) (vargas.js)
// ==========================================================================

const VARGA_METADATA = {
  D1: { num: 1, name: "Rashi", sanskrit: "राशि", group: "Shadvarga", arc: "30°00'", desc: "Physical constitution, vitality, body, environment, and general life destiny.", deityType: "Lagna Adhipati" },
  D2: { num: 2, name: "Hora", sanskrit: "होरा", group: "Shadvarga", arc: "15°00'", desc: "Wealth, financial prosperity, speech, liquid assets, and family reserves.", deityType: "Deva / Pitri (Solar/Lunar)" },
  D3: { num: 3, name: "Drekkana", sanskrit: "द्रेष्काण", group: "Shadvarga", arc: "10°00'", desc: "Siblings, courage, vitality, enterprise, and third-house initiatives.", deityType: "Narada / Agastya / Durvasa" },
  D4: { num: 4, name: "Chaturthamsa", sanskrit: "चतुर्थांश", group: "Dasavarga", arc: "7°30'", desc: "Fixed assets, real estate, vehicles, home, and fortune (Bhagya).", deityType: "Sanaka / Sanandana / Sanatkumara / Sanatsujata" },
  D5: { num: 5, name: "Panchamsha", sanskrit: "पञ्चमांश", group: "Harmonics", arc: "6°00'", desc: "Mantra siddhi, spiritual intellect, fame, Purva Punya, and intellectual creativity.", deityType: "Brahma / Shiva / Vishnu / Surya / Ganesha" },
  D6: { num: 6, name: "Shashtamsha", sanskrit: "षष्ठांश", group: "Harmonics", arc: "5°00'", desc: "Health vulnerabilities, chronic ailments, debts, litigations, and enemies.", deityType: "Shatrughna / Rogaharana" },
  D7: { num: 7, name: "Saptamsha", sanskrit: "सप्तमांश", group: "Saptavarga", arc: "4°17'09\"", desc: "Children, grandchildren, progeny, creative lineage, and partnerships.", deityType: "Sapta Rasas (Kshara, Ksheera, Dadhi, Ghrita, Ikshu, Madhu, Jala)" },
  D8: { num: 8, name: "Ashtamsha", sanskrit: "अष्टमांश", group: "Harmonics", arc: "3°45'", desc: "Longevity, sudden unexpected calamities, occult mysteries, and transformations.", deityType: "Ashta Vasus" },
  D9: { num: 9, name: "Navamsha", sanskrit: "नवांश", group: "Shadvarga", arc: "3°20'", desc: "Dharma, marriage compatibility, spouse's character, soul purpose, and destiny.", deityType: "Deva / Nara (Manushya) / Rakshasa" },
  D10: { num: 10, name: "Dashamsha", sanskrit: "दशमांश", group: "Dasavarga", arc: "3°00'", desc: "Career, professional stature, power, executive leadership, and social honor.", deityType: "Dasha Dikpalas (Indra, Agni, Yama, Nirriti, Varuna, Vayu, Kubera, Ishana, Brahma, Ananta)" },
  D11: { num: 11, name: "Rudramsha", sanskrit: "रुद्रांश", group: "Harmonics", arc: "2°43'38\"", desc: "Death-inflicting factors, destruction of enemies, victory in conflict, sudden financial swings.", deityType: "Ekadasa Rudras" },
  D12: { num: 12, name: "Dwadashamsha", sanskrit: "द्वादशांश", group: "Shadvarga", arc: "2°30'", desc: "Parents, ancestral lineage, heritage, past incarnations, and inherited karma.", deityType: "Ganesha / Ashwini / Yama / Sarpa" },
  D16: { num: 16, name: "Shodashamsha", sanskrit: "षोडशांश", group: "Dasavarga", arc: "1°52'30\"", desc: "Conveyances, vehicles, luxury, pleasures, accidents, and mental happiness.", deityType: "Brahma / Vishnu / Shiva / Surya" },
  D20: { num: 20, name: "Vimshamsha", sanskrit: "विंशांश", group: "Shodashavarga", arc: "1°30'", desc: "Spiritual practice, meditation, upasana, religious devotion, and inner light.", deityType: "Kalyana Devatas" },
  D24: { num: 24, name: "Chaturvimshamsha", sanskrit: "चतुर्विंशांश", group: "Shodashavarga", arc: "1°15'", desc: "Higher learning, academic prowess, skills, arts, and profound Vidya.", deityType: "Skanda / Parashurama" },
  D27: { num: 27, name: "Saptavimshamsha", sanskrit: "सप्तविंशांश", group: "Shodashavarga", arc: "1°06'40\"", desc: "Physical stamina, innate strengths, subconscious weaknesses, and general endurance.", deityType: "27 Gandharvas & Nakshatra Lords" },
  D30: { num: 30, name: "Trimsamsha", sanskrit: "त्रिंशांश", group: "Shadvarga", arc: "Unequal / 1°", desc: "Misfortunes, evils, arishta, chronic health issues, and subconscious shadows.", deityType: "Agni / Vayu / Indra / Varuna / Isha" },
  D40: { num: 40, name: "Khavedamsha", sanskrit: "खवेदांश", group: "Shodashavarga", arc: "45'00\"", desc: "Auspicious and inauspicious fruits of karma, maternal ancestral prosperity.", deityType: "Vishnu / Chandra / Marichi / Vayu" },
  D45: { num: 45, name: "Akshavedamsha", sanskrit: "अक्षवेदांश", group: "Shodashavarga", arc: "40'00\"", desc: "Moral character, ethical conduct, refinement of soul, and integrity.", deityType: "Brahma / Shiva / Vishnu" },
  D60: { num: 60, name: "Shashtiamsa", sanskrit: "षष्ट्यंश", group: "Shodashavarga", arc: "30'00\"", desc: "Root karmic blueprint, past-life deeds, minute distinctions, all life events.", deityType: "60 Classical Shashtiamsa Devatas (BPHS)" }
};

let currentVargaMethod = "parashara";

function computeVargaBody(lon, isRetrograde, isCombust, divKey, method = "parashara") {
  const r0 = Math.floor(lon / 30);
  const degInSign = lon % 30;
  const isOdd = (r0 % 2 === 0); // 0 = Aries (odd), 1 = Taurus (even)
  const modality = r0 % 3; // 0 = Movable, 1 = Fixed, 2 = Dual

  let sign = 1;
  let degInVarga = 0;
  let part = 0;
  let devataInfo = null;

  if (method === "parivritti") {
    // Parivritti Traya: continuous cyclic progression across the 12 signs
    const n = parseInt(divKey.replace("D", "")) || 1;
    const arc = 30.0 / n;
    part = Math.floor(degInSign / arc);
    if (part >= n) part = n - 1;
    sign = ((r0 * n + part) % 12) + 1;
    degInVarga = (degInSign % arc) * n;
  } else {
    // Parashara Classical & Recognized School Variants
    switch (divKey) {
      case "D1":
        sign = r0 + 1;
        degInVarga = degInSign;
        break;

      case "D2":
        part = Math.floor(degInSign / 15);
        if (part > 1) part = 1;
        degInVarga = (degInSign % 15) * 2;
        if (method === "kashinatha") {
          if (isOdd) {
            sign = (part === 0) ? (r0 + 1) : (((r0 + 11) % 12) + 1);
          } else {
            sign = (part === 0) ? (((r0 + 11) % 12) + 1) : (r0 + 1);
          }
        } else {
          sign = isOdd ? (part === 0 ? 5 : 4) : (part === 0 ? 4 : 5);
        }
        devataInfo = {
          name: isOdd ? (part === 0 ? "Surya (Sun/Deva)" : "Chandra (Moon/Pitri)") : (part === 0 ? "Chandra (Moon/Pitri)" : "Surya (Sun/Deva)"),
          nature: "Neutral"
        };
        break;

      case "D3":
        part = Math.floor(degInSign / 10);
        if (part > 2) part = 2;
        degInVarga = (degInSign % 10) * 3;
        if (method === "somnath") {
          const offsets = modality === 0 ? [0, 4, 8] : (modality === 1 ? [8, 0, 4] : [4, 8, 0]);
          sign = ((r0 + offsets[part]) % 12) + 1;
        } else {
          const offsets = [0, 4, 8];
          sign = ((r0 + offsets[part]) % 12) + 1;
        }
        const drekkanaDeities = ["Narada (Sattva)", "Agastya (Rajas)", "Durvasa (Tamas)"];
        devataInfo = { name: drekkanaDeities[part], nature: part === 0 ? "Shubha" : (part === 1 ? "Neutral" : "Ashubha") };
        break;

      case "D4":
        part = Math.floor(degInSign / 7.5);
        if (part > 3) part = 3;
        degInVarga = (degInSign % 7.5) * 4;
        sign = ((r0 + part * 3) % 12) + 1;
        const d4Deities = ["Sanaka", "Sanandana", "Sanatkumara", "Sanatsujata"];
        devataInfo = { name: d4Deities[part], nature: "Shubha" };
        break;

      case "D5":
        part = Math.floor(degInSign / 6.0);
        if (part > 4) part = 4;
        degInVarga = (degInSign % 6.0) * 5;
        const d5Base = modality === 0 ? 0 : (modality === 1 ? 4 : 8);
        sign = ((d5Base + part) % 12) + 1;
        break;

      case "D6":
        part = Math.floor(degInSign / 5.0);
        if (part > 5) part = 5;
        degInVarga = (degInSign % 5.0) * 6;
        const d6Base = isOdd ? 0 : 6;
        sign = ((d6Base + part) % 12) + 1;
        break;

      case "D7":
        part = Math.floor(degInSign / (30.0 / 7));
        if (part > 6) part = 6;
        degInVarga = (degInSign % (30.0 / 7)) * 7;
        const d7Base = isOdd ? r0 : (r0 + 6);
        sign = ((d7Base + part) % 12) + 1;
        break;

      case "D8":
        part = Math.floor(degInSign / 3.75);
        if (part > 7) part = 7;
        degInVarga = (degInSign % 3.75) * 8;
        const d8Base = modality === 0 ? 0 : (modality === 1 ? 8 : 4);
        sign = ((d8Base + part) % 12) + 1;
        break;

      case "D9":
        part = Math.floor(degInSign / (30.0 / 9));
        if (part > 8) part = 8;
        degInVarga = (degInSign % (30.0 / 9)) * 9;
        let d9Base = 0;
        if ([0, 4, 8].includes(r0)) d9Base = 0;
        else if ([1, 5, 9].includes(r0)) d9Base = 9;
        else if ([2, 6, 10].includes(r0)) d9Base = 6;
        else d9Base = 3;
        sign = ((d9Base + part) % 12) + 1;
        const navDeities = ["Deva (Divine)", "Nara (Human)", "Rakshasa (Demonic)"];
        devataInfo = { name: navDeities[part % 3], nature: (part % 3 === 0) ? "Shubha" : ((part % 3 === 1) ? "Neutral" : "Ashubha") };
        break;

      case "D10":
        part = Math.floor(degInSign / 3.0);
        if (part > 9) part = 9;
        degInVarga = (degInSign % 3.0) * 10;
        const d10Base = isOdd ? r0 : (r0 + 8);
        sign = ((d10Base + part) % 12) + 1;
        const dikpalas = ["Indra", "Agni", "Yama", "Nirriti", "Varuna", "Vayu", "Kubera", "Ishana", "Brahma", "Ananta"];
        devataInfo = { name: dikpalas[part], nature: "Shubha" };
        break;

      case "D11":
        part = Math.floor(degInSign / (30.0 / 11));
        if (part > 10) part = 10;
        degInVarga = (degInSign % (30.0 / 11)) * 11;
        sign = isOdd ? (((0 + part) % 12) + 1) : (((11 - part + 12) % 12) + 1);
        break;

      case "D12":
        part = Math.floor(degInSign / 2.5);
        if (part > 11) part = 11;
        degInVarga = (degInSign % 2.5) * 12;
        sign = ((r0 + part) % 12) + 1;
        const d12Deities = ["Ganesha", "Ashwini Kumaras", "Yama", "Sarpa"];
        devataInfo = { name: d12Deities[part % 4], nature: (part % 4 === 0) ? "Shubha" : "Neutral" };
        break;

      case "D16":
        part = Math.floor(degInSign / 1.875);
        if (part > 15) part = 15;
        degInVarga = (degInSign % 1.875) * 16;
        const d16Base = modality === 0 ? 0 : (modality === 1 ? 4 : 8);
        sign = ((d16Base + part) % 12) + 1;
        const d16Deities = ["Brahma", "Vishnu", "Shiva", "Surya"];
        devataInfo = { name: d16Deities[part % 4], nature: "Shubha" };
        break;

      case "D20":
        part = Math.floor(degInSign / 1.5);
        if (part > 19) part = 19;
        degInVarga = (degInSign % 1.5) * 20;
        const d20Base = modality === 0 ? 0 : (modality === 1 ? 8 : 4);
        sign = ((d20Base + part) % 12) + 1;
        break;

      case "D24":
        part = Math.floor(degInSign / 1.25);
        if (part > 23) part = 23;
        degInVarga = (degInSign % 1.25) * 24;
        const d24Base = isOdd ? 4 : 3;
        sign = ((d24Base + part) % 12) + 1;
        devataInfo = { name: (part % 2 === 0) ? "Skanda (Valorous Knowledge)" : "Parashurama (Righteous Knowledge)", nature: "Shubha" };
        break;

      case "D27":
        part = Math.floor(degInSign / (30.0 / 27));
        if (part > 26) part = 26;
        degInVarga = (degInSign % (30.0 / 27)) * 27;
        let d27Base = 0;
        if ([0, 4, 8].includes(r0)) d27Base = 0;
        else if ([1, 5, 9].includes(r0)) d27Base = 3;
        else if ([2, 6, 10].includes(r0)) d27Base = 6;
        else d27Base = 9;
        sign = ((d27Base + part) % 12) + 1;
        break;

      case "D30":
        if (isOdd) {
          if (degInSign < 5) { sign = 1; part = 0; }
          else if (degInSign < 10) { sign = 11; part = 1; }
          else if (degInSign < 18) { sign = 9; part = 2; }
          else if (degInSign < 25) { sign = 3; part = 3; }
          else { sign = 7; part = 4; }
        } else {
          if (degInSign < 5) { sign = 2; part = 0; }
          else if (degInSign < 12) { sign = 6; part = 1; }
          else if (degInSign < 20) { sign = 12; part = 2; }
          else if (degInSign < 25) { sign = 10; part = 3; }
          else { sign = 8; part = 4; }
        }
        degInVarga = degInSign;
        const d30Deities = ["Agni (Fire)", "Vayu (Wind)", "Indra (King of Devas)", "Varuna (Waters)", "Isha (Lord Shiva)"];
        devataInfo = { name: d30Deities[part], nature: "Neutral" };
        break;

      case "D40":
        part = Math.floor(degInSign / 0.75);
        if (part > 39) part = 39;
        degInVarga = (degInSign % 0.75) * 40;
        const d40Base = isOdd ? 0 : 6;
        sign = ((d40Base + part) % 12) + 1;
        break;

      case "D45":
        part = Math.floor(degInSign / (30.0 / 45));
        if (part > 44) part = 44;
        degInVarga = (degInSign % (30.0 / 45)) * 45;
        const d45Base = modality === 0 ? 0 : (modality === 1 ? 4 : 8);
        sign = ((d45Base + part) % 12) + 1;
        break;

      case "D60":
        part = Math.floor(degInSign / 0.5);
        if (part > 59) part = 59;
        degInVarga = (degInSign % 0.5) * 60;
        sign = ((r0 + part) % 12) + 1;
        const devataIdx = isOdd ? part : (59 - part);
        const dObj = SHASHTIAMSA_DEVATAS[devataIdx] || SHASHTIAMSA_DEVATAS[0];
        devataInfo = {
          idx: devataIdx + 1,
          name: dObj.name,
          nature: dObj.nature,
          desc: dObj.desc
        };
        break;

      default: {
        const n = parseInt(divKey.replace("D", "")) || 1;
        const arc = 30.0 / n;
        part = Math.floor(degInSign / arc);
        if (part >= n) part = n - 1;
        sign = ((r0 * n + part) % 12) + 1;
        degInVarga = (degInSign % arc) * n;
        break;
      }
    }
  }

  return {
    sign,
    deg: degInVarga,
    part,
    devata: devataInfo,
    isRetrograde: !!isRetrograde,
    isCombust: !!isCombust,
    lon
  };
}

function computeAllVargas(planetsData, ascData, method = currentVargaMethod) {
  const allBodies = { Lagna: ascData, ...planetsData };
  const vargaKeys = Object.keys(VARGA_METADATA);
  const vargas = {};

  vargaKeys.forEach(vKey => {
    vargas[vKey] = {};
    Object.entries(allBodies).forEach(([key, body]) => {
      vargas[vKey][key] = computeVargaBody(body.longitude, body.isRetrograde, body.isCombust, vKey, method);
    });
  });

  return vargas;
}
