// ==========================================================================
// INDUS KUNDLI APP — VEDIC CONSTANTS & LOOKUP TABLES (constants.js)
// ==========================================================================

const RASHIS = [
  { num: 1, name: "Aries", sanskrit: "Mesha", short: "Ar", lord: "Mars", element: "Fire", modality: "Movable" },
  { num: 2, name: "Taurus", sanskrit: "Vrishabha", short: "Ta", lord: "Venus", element: "Earth", modality: "Fixed" },
  { num: 3, name: "Gemini", sanskrit: "Mithuna", short: "Ge", lord: "Mercury", element: "Air", modality: "Dual" },
  { num: 4, name: "Cancer", sanskrit: "Karka", short: "Cn", lord: "Moon", element: "Water", modality: "Movable" },
  { num: 5, name: "Leo", sanskrit: "Simha", short: "Le", lord: "Sun", element: "Fire", modality: "Fixed" },
  { num: 6, name: "Virgo", sanskrit: "Kanya", short: "Vi", lord: "Mercury", element: "Earth", modality: "Dual" },
  { num: 7, name: "Libra", sanskrit: "Tula", short: "Li", lord: "Venus", element: "Air", modality: "Movable" },
  { num: 8, name: "Scorpio", sanskrit: "Vrishchika", short: "Sc", lord: "Mars", element: "Water", modality: "Fixed" },
  { num: 9, name: "Sagittarius", sanskrit: "Dhanu", short: "Sg", lord: "Jupiter", element: "Fire", modality: "Dual" },
  { num: 10, name: "Capricorn", sanskrit: "Makara", short: "Cp", lord: "Saturn", element: "Earth", modality: "Movable" },
  { num: 11, name: "Aquarius", sanskrit: "Kumbha", short: "Aq", lord: "Saturn", element: "Air", modality: "Fixed" },
  { num: 12, name: "Pisces", sanskrit: "Meena", short: "Pi", lord: "Jupiter", element: "Water", modality: "Dual" }
];

const NAKSHATRAS = [
  { name: "Ashwini", lord: "Ketu", span: "00°00' - 13°20' Mesha" },
  { name: "Bharani", lord: "Venus", span: "13°20' - 26°40' Mesha" },
  { name: "Krittika", lord: "Sun", span: "26°40' Mesha - 10°00' Vrishabha" },
  { name: "Rohini", lord: "Moon", span: "10°00' - 23°20' Vrishabha" },
  { name: "Mrigashira", lord: "Mars", span: "23°20' Vrishabha - 06°40' Mithuna" },
  { name: "Ardra", lord: "Rahu", span: "06°40' - 20°00' Mithuna" },
  { name: "Punarvasu", lord: "Jupiter", span: "20°00' Mithuna - 03°20' Karka" },
  { name: "Pushya", lord: "Saturn", span: "03°20' - 16°40' Karka" },
  { name: "Ashlesha", lord: "Mercury", span: "16°40' - 30°00' Karka" },
  { name: "Magha", lord: "Ketu", span: "00°00' - 13°20' Simha" },
  { name: "Purva Phalguni", lord: "Venus", span: "13°20' - 26°40' Simha" },
  { name: "Uttara Phalguni", lord: "Sun", span: "26°40' Simha - 10°00' Kanya" },
  { name: "Hasta", lord: "Moon", span: "10°00' - 23°20' Kanya" },
  { name: "Chitra", lord: "Mars", span: "23°20' Kanya - 06°40' Tula" },
  { name: "Swati", lord: "Rahu", span: "06°40' - 20°00' Tula" },
  { name: "Vishakha", lord: "Jupiter", span: "20°00' Tula - 03°20' Vrishchika" },
  { name: "Anuradha", lord: "Saturn", span: "03°20' - 16°40' Vrishchika" },
  { name: "Jyeshtha", lord: "Mercury", span: "16°40' - 30°00' Vrishchika" },
  { name: "Mula", lord: "Ketu", span: "00°00' - 13°20' Dhanu" },
  { name: "Purva Ashadha", lord: "Venus", span: "13°20' - 26°40' Dhanu" },
  { name: "Uttara Ashadha", lord: "Sun", span: "26°40' Dhanu - 10°00' Makara" },
  { name: "Shravana", lord: "Moon", span: "10°00' - 23°20' Makara" },
  { name: "Dhanishta", lord: "Mars", span: "23°20' Makara - 06°40' Kumbha" },
  { name: "Shatabhisha", lord: "Rahu", span: "06°40' - 20°00' Kumbha" },
  { name: "Purva Bhadrapada", lord: "Jupiter", span: "20°00' Kumbha - 03°20' Meena" },
  { name: "Uttara Bhadrapada", lord: "Saturn", span: "03°20' - 16°40' Meena" },
  { name: "Revati", lord: "Mercury", span: "16°40' - 30°00' Meena" }
];

const EXALTATION = {
  Sun: { sign: 1, deg: 10 },
  Moon: { sign: 2, deg: 3 },
  Mars: { sign: 10, deg: 28 },
  Mercury: { sign: 6, deg: 15 },
  Jupiter: { sign: 4, deg: 5 },
  Venus: { sign: 12, deg: 27 },
  Saturn: { sign: 7, deg: 20 },
  Rahu: { sign: 2, deg: 15 },
  Ketu: { sign: 8, deg: 15 }
};

const DEBILITATION = {
  Sun: { sign: 7, deg: 10 },
  Moon: { sign: 8, deg: 3 },
  Mars: { sign: 4, deg: 28 },
  Mercury: { sign: 12, deg: 15 },
  Jupiter: { sign: 10, deg: 5 },
  Venus: { sign: 6, deg: 27 },
  Saturn: { sign: 1, deg: 20 },
  Rahu: { sign: 8, deg: 15 },
  Ketu: { sign: 2, deg: 15 }
};

const OWN_SIGNS = {
  Sun: [5],
  Moon: [4],
  Mars: [1, 8],
  Mercury: [3, 6],
  Jupiter: [9, 12],
  Venus: [2, 7],
  Saturn: [10, 11],
  Rahu: [11],
  Ketu: [8]
};

const MOOLATRIKONA = {
  Sun: { sign: 5, from: 0, to: 20 },
  Moon: { sign: 2, from: 3, to: 30 },
  Mars: { sign: 1, from: 0, to: 12 },
  Mercury: { sign: 6, from: 15, to: 20 },
  Jupiter: { sign: 9, from: 0, to: 10 },
  Venus: { sign: 7, from: 0, to: 15 },
  Saturn: { sign: 11, from: 0, to: 20 }
};

// Planetary Ray Kalas for Indu Lagna (BPHS)
const PLANETARY_KALAS = {
  Sun: 30,
  Moon: 16,
  Mars: 6,
  Mercury: 8,
  Jupiter: 10,
  Venus: 12,
  Saturn: 1
};

// 60 Shashtiamsa Presiding Devatas (BPHS Ch. 6)
const SHASHTIAMSA_DEVATAS = [
  { name: "Ghora", nature: "Ashubha", desc: "Terrible, dread and sudden peril" },
  { name: "Rakshasa", nature: "Ashubha", desc: "Demonic, destructive tendencies" },
  { name: "Deva", nature: "Shubha", desc: "Divine grace, righteousness and virtue" },
  { name: "Kubera", nature: "Shubha", desc: "Lord of wealth and material abundance" },
  { name: "Yaksha", nature: "Shubha", desc: "Mystical guardian of subterranean treasures" },
  { name: "Kinnara", nature: "Shubha", desc: "Celestial musician, artistic harmony" },
  { name: "Bhrashta", nature: "Ashubha", desc: "Fallen, loss of honor and moral prestige" },
  { name: "Kulaghna", nature: "Ashubha", desc: "Ruin or disruption of ancestral lineage" },
  { name: "Garala", nature: "Ashubha", desc: "Poisonous, bitter and toxic experiences" },
  { name: "Vahni", nature: "Ashubha", desc: "Fiery, intense trials and consuming obstacles" },
  { name: "Maya", nature: "Ashubha", desc: "Illusion, deceptive appearances, glamour" },
  { name: "Purishaka", nature: "Ashubha", desc: "Impurity, debasing associations" },
  { name: "Apampati", nature: "Shubha", desc: "Lord Varuna, flow of vital resources" },
  { name: "Marutvan", nature: "Shubha", desc: "Deity of swift vitality, energetic enterprise" },
  { name: "Kaala", nature: "Ashubha", desc: "Time's inescapable reckoning and delay" },
  { name: "Sarpa", nature: "Ashubha", desc: "Serpentine venom, jealousy and intrigue" },
  { name: "Amrita", nature: "Shubha", desc: "Nectar of rejuvenation and longevity" },
  { name: "Indu", nature: "Shubha", desc: "Luminous moon, soothing domestic comfort" },
  { name: "Mridu", nature: "Shubha", desc: "Gentle compassion, amiable social disposition" },
  { name: "Komala", nature: "Shubha", desc: "Delicate aesthetic sensitivity, grace" },
  { name: "Heramba", nature: "Shubha", desc: "Lord Ganesha, vanquisher of all obstacles" },
  { name: "Brahma", nature: "Shubha", desc: "Cosmic creator, innovative intellect" },
  { name: "Vishnu", nature: "Shubha", desc: "Cosmic preserver, righteous prosperity" },
  { name: "Maheshwara", nature: "Shubha", desc: "Lord Shiva, supreme spiritual transformation" },
  { name: "Deva", nature: "Shubha", desc: "Celestial illumination and virtue" },
  { name: "Aardra", nature: "Shubha", desc: "Moistening compassion and spiritual fertility" },
  { name: "Kalinasana", nature: "Shubha", desc: "Destruction of conflict and litigation" },
  { name: "Kshiteesa", nature: "Shubha", desc: "Ruler of lands, stability and authority" },
  { name: "Kamalakara", nature: "Shubha", desc: "Lotus lake, abundance of Sri Lakshmi" },
  { name: "Gulika", nature: "Ashubha", desc: "Son of Saturn, heavy karmic sorrow and burden" },
  { name: "Mrityu", nature: "Ashubha", desc: "Mortal danger, sudden radical terminations" },
  { name: "Kaala", nature: "Ashubha", desc: "Rigorous passage of destined accountability" },
  { name: "Daavagni", nature: "Ashubha", desc: "Wild forest fire, unquenchable worldly thirst" },
  { name: "Ghora", nature: "Ashubha", desc: "Severe environmental austerity and hardships" },
  { name: "Yama", nature: "Ashubha", desc: "God of cosmic justice and strict moral audit" },
  { name: "Kantaka", nature: "Ashubha", desc: "Piercing thorn, chronic irritating hindrance" },
  { name: "Sudha", nature: "Shubha", desc: "Pure ambrosia, continuous vital sustenance" },
  { name: "Amrita", nature: "Shubha", desc: "Nectar of life, spiritual immunity" },
  { name: "Purnachandra", nature: "Shubha", desc: "Full moon, peak emotional and mental joy" },
  { name: "Vishadagdha", nature: "Ashubha", desc: "Scorched by poison, heavy suffering" },
  { name: "Kulanaasa", nature: "Ashubha", desc: "Erosion of domestic roots and family wealth" },
  { name: "Vamshakshaya", nature: "Ashubha", desc: "Extinction of legacy or difficulty in progeny" },
  { name: "Utpaata", nature: "Ashubha", desc: "Cataclysmic upheaval, startling surprise" },
  { name: "Kaala", nature: "Ashubha", desc: "Temporal constraints, impending deadlines" },
  { name: "Saumya", nature: "Shubha", desc: "Peaceful benevolence, pleasant demeanor" },
  { name: "Komala", nature: "Shubha", desc: "Tender kindness and refined sensitivity" },
  { name: "Sheetala", nature: "Shubha", desc: "Cooling peace, healing of hot afflictions" },
  { name: "Karaladamshtra", nature: "Ashubha", desc: "Terrifying fangs, ferocious adversary" },
  { name: "Chandramukhi", nature: "Shubha", desc: "Moon-faced radiance, captivating charm" },
  { name: "Praveena", nature: "Shubha", desc: "Skillful mastery, intellectual expertise" },
  { name: "Kaalapaavaka", nature: "Ashubha", desc: "Doomsday fire, destructive retribution" },
  { name: "Dhandayudha", nature: "Ashubha", desc: "Staff of punishment, disciplinary karmas" },
  { name: "Nirmala", nature: "Shubha", desc: "Pristine purity, transparent integrity" },
  { name: "Saumya", nature: "Shubha", desc: "Auspicious serenity, harmony with nature" },
  { name: "Kroora", nature: "Ashubha", desc: "Cruel hardness, unforgiving circumstance" },
  { name: "Atisheetala", nature: "Shubha", desc: "Profoundly cooling, tranquil enlightenment" },
  { name: "Amrita", nature: "Shubha", desc: "Immortal nectar of truth and health" },
  { name: "Payodhi", nature: "Shubha", desc: "Ocean of milk, unfathomable cosmic riches" },
  { name: "Bhramana", nature: "Ashubha", desc: "Aimless wandering, restless instability" },
  { name: "Chandrarekha", nature: "Shubha", desc: "Ray of crescent moon, visionary wisdom" }
];

// Expanded 200+ Cities Database
const CITIES_DB = [{"name": "Faridabad, Haryana, India", "lat": 28.4089, "lon": 77.3178, "tz": 5.5}, {"name": "New Delhi, Delhi, India", "lat": 28.6139, "lon": 77.209, "tz": 5.5}, {"name": "Gurugram (Gurgaon), Haryana, India", "lat": 28.4595, "lon": 77.0266, "tz": 5.5}, {"name": "Noida, Uttar Pradesh, India", "lat": 28.5355, "lon": 77.391, "tz": 5.5}, {"name": "Greater Noida, Uttar Pradesh, India", "lat": 28.4744, "lon": 77.504, "tz": 5.5}, {"name": "Ghaziabad, Uttar Pradesh, India", "lat": 28.6692, "lon": 77.4538, "tz": 5.5}, {"name": "Panipat, Haryana, India", "lat": 29.3909, "lon": 76.9635, "tz": 5.5}, {"name": "Sonipat, Haryana, India", "lat": 28.9931, "lon": 77.0151, "tz": 5.5}, {"name": "Karnal, Haryana, India", "lat": 29.6857, "lon": 76.9905, "tz": 5.5}, {"name": "Rohtak, Haryana, India", "lat": 28.8955, "lon": 76.6066, "tz": 5.5}, {"name": "Hisar, Haryana, India", "lat": 29.1492, "lon": 75.7217, "tz": 5.5}, {"name": "Ambala, Haryana, India", "lat": 30.3782, "lon": 76.7767, "tz": 5.5}, {"name": "Panchkula, Haryana, India", "lat": 30.6942, "lon": 76.8606, "tz": 5.5}, {"name": "Chandigarh, India", "lat": 30.7333, "lon": 76.7794, "tz": 5.5}, {"name": "Kurukshetra, Haryana, India", "lat": 29.9695, "lon": 76.8783, "tz": 5.5}, {"name": "Rewari, Haryana, India", "lat": 28.1928, "lon": 76.6191, "tz": 5.5}, {"name": "Yamunanagar, Haryana, India", "lat": 30.129, "lon": 77.2674, "tz": 5.5}, {"name": "Sirsa, Haryana, India", "lat": 29.5349, "lon": 75.0294, "tz": 5.5}, {"name": "Ludhiana, Punjab, India", "lat": 30.901, "lon": 75.8573, "tz": 5.5}, {"name": "Amritsar, Punjab, India", "lat": 31.634, "lon": 74.8723, "tz": 5.5}, {"name": "Jalandhar, Punjab, India", "lat": 31.326, "lon": 75.5762, "tz": 5.5}, {"name": "Patiala, Punjab, India", "lat": 30.3398, "lon": 76.3869, "tz": 5.5}, {"name": "Bathinda, Punjab, India", "lat": 30.211, "lon": 74.9455, "tz": 5.5}, {"name": "Mohali, Punjab, India", "lat": 30.7046, "lon": 76.7179, "tz": 5.5}, {"name": "Shimla, Himachal Pradesh, India", "lat": 31.1048, "lon": 77.1734, "tz": 5.5}, {"name": "Dharamshala, Himachal Pradesh, India", "lat": 32.219, "lon": 76.3234, "tz": 5.5}, {"name": "Kullu, Himachal Pradesh, India", "lat": 31.9579, "lon": 77.1095, "tz": 5.5}, {"name": "Manali, Himachal Pradesh, India", "lat": 32.2432, "lon": 77.1892, "tz": 5.5}, {"name": "Srinagar, Jammu & Kashmir, India", "lat": 34.0837, "lon": 74.7973, "tz": 5.5}, {"name": "Jammu, Jammu & Kashmir, India", "lat": 32.7266, "lon": 74.857, "tz": 5.5}, {"name": "Leh, Ladakh, India", "lat": 34.1526, "lon": 77.5771, "tz": 5.5}, {"name": "Dehradun, Uttarakhand, India", "lat": 30.3165, "lon": 78.0322, "tz": 5.5}, {"name": "Haridwar, Uttarakhand, India", "lat": 29.9457, "lon": 78.1642, "tz": 5.5}, {"name": "Rishikesh, Uttarakhand, India", "lat": 30.0869, "lon": 78.2676, "tz": 5.5}, {"name": "Nainital, Uttarakhand, India", "lat": 29.3919, "lon": 79.4542, "tz": 5.5}, {"name": "Haldwani, Uttarakhand, India", "lat": 29.2183, "lon": 79.513, "tz": 5.5}, {"name": "Kedarnath, Uttarakhand, India", "lat": 30.7352, "lon": 79.0669, "tz": 5.5}, {"name": "Badrinath, Uttarakhand, India", "lat": 30.7433, "lon": 79.4938, "tz": 5.5}, {"name": "Jaipur, Rajasthan, India", "lat": 26.9124, "lon": 75.7873, "tz": 5.5}, {"name": "Jodhpur, Rajasthan, India", "lat": 26.2389, "lon": 73.0243, "tz": 5.5}, {"name": "Udaipur, Rajasthan, India", "lat": 24.5854, "lon": 73.7125, "tz": 5.5}, {"name": "Kota, Rajasthan, India", "lat": 25.1804, "lon": 75.836, "tz": 5.5}, {"name": "Bikaner, Rajasthan, India", "lat": 28.0229, "lon": 73.3119, "tz": 5.5}, {"name": "Ajmer, Rajasthan, India", "lat": 26.4499, "lon": 74.6399, "tz": 5.5}, {"name": "Pushkar, Rajasthan, India", "lat": 26.4897, "lon": 74.5511, "tz": 5.5}, {"name": "Alwar, Rajasthan, India", "lat": 27.553, "lon": 76.6346, "tz": 5.5}, {"name": "Bhilwara, Rajasthan, India", "lat": 25.3407, "lon": 74.6313, "tz": 5.5}, {"name": "Mount Abu, Rajasthan, India", "lat": 24.5926, "lon": 72.7156, "tz": 5.5}, {"name": "Lucknow, Uttar Pradesh, India", "lat": 26.8467, "lon": 80.9462, "tz": 5.5}, {"name": "Kanpur, Uttar Pradesh, India", "lat": 26.4499, "lon": 80.3319, "tz": 5.5}, {"name": "Varanasi (Kashi), Uttar Pradesh, India", "lat": 25.3176, "lon": 82.9739, "tz": 5.5}, {"name": "Prayagraj (Allahabad), Uttar Pradesh, India", "lat": 25.4358, "lon": 81.8463, "tz": 5.5}, {"name": "Ayodhya, Uttar Pradesh, India", "lat": 26.7922, "lon": 82.1998, "tz": 5.5}, {"name": "Mathura, Uttar Pradesh, India", "lat": 27.4924, "lon": 77.6737, "tz": 5.5}, {"name": "Vrindavan, Uttar Pradesh, India", "lat": 27.5806, "lon": 77.7006, "tz": 5.5}, {"name": "Agra, Uttar Pradesh, India", "lat": 27.1767, "lon": 78.0081, "tz": 5.5}, {"name": "Meerut, Uttar Pradesh, India", "lat": 28.9845, "lon": 77.7064, "tz": 5.5}, {"name": "Gorakhpur, Uttar Pradesh, India", "lat": 26.7606, "lon": 83.3732, "tz": 5.5}, {"name": "Bareilly, Uttar Pradesh, India", "lat": 28.367, "lon": 79.4304, "tz": 5.5}, {"name": "Aligarh, Uttar Pradesh, India", "lat": 27.8974, "lon": 78.088, "tz": 5.5}, {"name": "Jhansi, Uttar Pradesh, India", "lat": 25.4484, "lon": 78.5685, "tz": 5.5}, {"name": "Moradabad, Uttar Pradesh, India", "lat": 28.8351, "lon": 78.7747, "tz": 5.5}, {"name": "Saharanpur, Uttar Pradesh, India", "lat": 29.9671, "lon": 77.551, "tz": 5.5}, {"name": "Patna, Bihar, India", "lat": 25.5941, "lon": 85.1376, "tz": 5.5}, {"name": "Gaya, Bihar, India", "lat": 24.7914, "lon": 85.0002, "tz": 5.5}, {"name": "Muzaffarpur, Bihar, India", "lat": 26.1209, "lon": 85.3647, "tz": 5.5}, {"name": "Bhagalpur, Bihar, India", "lat": 25.2425, "lon": 86.9842, "tz": 5.5}, {"name": "Darbhanga, Bihar, India", "lat": 26.1542, "lon": 85.8918, "tz": 5.5}, {"name": "Ranchi, Jharkhand, India", "lat": 23.3441, "lon": 85.3096, "tz": 5.5}, {"name": "Jamshedpur, Jharkhand, India", "lat": 22.8046, "lon": 86.2029, "tz": 5.5}, {"name": "Dhanbad, Jharkhand, India", "lat": 23.7957, "lon": 86.4304, "tz": 5.5}, {"name": "Deoghar (Baidyanath), Jharkhand, India", "lat": 24.4826, "lon": 86.7001, "tz": 5.5}, {"name": "Bhopal, Madhya Pradesh, India", "lat": 23.2599, "lon": 77.4126, "tz": 5.5}, {"name": "Indore, Madhya Pradesh, India", "lat": 22.7196, "lon": 75.8577, "tz": 5.5}, {"name": "Ujjain (Mahakaleshwar), Madhya Pradesh, India", "lat": 23.1765, "lon": 75.7885, "tz": 5.5}, {"name": "Jabalpur, Madhya Pradesh, India", "lat": 23.1815, "lon": 79.9864, "tz": 5.5}, {"name": "Gwalior, Madhya Pradesh, India", "lat": 26.2183, "lon": 78.1828, "tz": 5.5}, {"name": "Omkareshwar, Madhya Pradesh, India", "lat": 22.2443, "lon": 76.1506, "tz": 5.5}, {"name": "Sagar, Madhya Pradesh, India", "lat": 23.8388, "lon": 78.7378, "tz": 5.5}, {"name": "Raipur, Chhattisgarh, India", "lat": 21.2514, "lon": 81.6296, "tz": 5.5}, {"name": "Bilaspur, Chhattisgarh, India", "lat": 22.0797, "lon": 82.1409, "tz": 5.5}, {"name": "Bhilai, Chhattisgarh, India", "lat": 21.1938, "lon": 81.3509, "tz": 5.5}, {"name": "Mumbai, Maharashtra, India", "lat": 19.076, "lon": 72.8777, "tz": 5.5}, {"name": "Pune, Maharashtra, India", "lat": 18.5204, "lon": 73.8567, "tz": 5.5}, {"name": "Nagpur, Maharashtra, India", "lat": 21.1458, "lon": 79.0882, "tz": 5.5}, {"name": "Thane, Maharashtra, India", "lat": 19.2183, "lon": 72.9781, "tz": 5.5}, {"name": "Nashik (Trimbak), Maharashtra, India", "lat": 19.9975, "lon": 73.7898, "tz": 5.5}, {"name": "Chhatrapati Sambhajinagar (Aurangabad), Maharashtra, India", "lat": 19.8762, "lon": 75.3433, "tz": 5.5}, {"name": "Shirdi, Maharashtra, India", "lat": 19.7667, "lon": 74.4764, "tz": 5.5}, {"name": "Kolhapur, Maharashtra, India", "lat": 16.705, "lon": 74.2433, "tz": 5.5}, {"name": "Solapur, Maharashtra, India", "lat": 17.6599, "lon": 75.9064, "tz": 5.5}, {"name": "Amravati, Maharashtra, India", "lat": 20.9374, "lon": 77.7796, "tz": 5.5}, {"name": "Ahmedabad, Gujarat, India", "lat": 23.0225, "lon": 72.5714, "tz": 5.5}, {"name": "Surat, Gujarat, India", "lat": 21.1702, "lon": 72.8311, "tz": 5.5}, {"name": "Vadodara, Gujarat, India", "lat": 22.3072, "lon": 73.1812, "tz": 5.5}, {"name": "Rajkot, Gujarat, India", "lat": 22.3039, "lon": 70.8022, "tz": 5.5}, {"name": "Gandhinagar, Gujarat, India", "lat": 23.2156, "lon": 72.6369, "tz": 5.5}, {"name": "Bhavnagar, Gujarat, India", "lat": 21.7645, "lon": 72.1519, "tz": 5.5}, {"name": "Jamnagar, Gujarat, India", "lat": 22.4707, "lon": 70.0577, "tz": 5.5}, {"name": "Dwarka, Gujarat, India", "lat": 22.2442, "lon": 68.9685, "tz": 5.5}, {"name": "Somnath (Veraval), Gujarat, India", "lat": 20.9015, "lon": 70.4022, "tz": 5.5}, {"name": "Panaji, Goa, India", "lat": 15.4909, "lon": 73.8278, "tz": 5.5}, {"name": "Kolkata, West Bengal, India", "lat": 22.5726, "lon": 88.3639, "tz": 5.5}, {"name": "Howrah, West Bengal, India", "lat": 22.5958, "lon": 88.2636, "tz": 5.5}, {"name": "Siliguri, West Bengal, India", "lat": 26.7271, "lon": 88.3953, "tz": 5.5}, {"name": "Asansol, West Bengal, India", "lat": 23.6739, "lon": 86.9524, "tz": 5.5}, {"name": "Durgapur, West Bengal, India", "lat": 23.5204, "lon": 87.3119, "tz": 5.5}, {"name": "Darjeeling, West Bengal, India", "lat": 27.041, "lon": 88.2663, "tz": 5.5}, {"name": "Bhubaneswar, Odisha, India", "lat": 20.2961, "lon": 85.8245, "tz": 5.5}, {"name": "Cuttack, Odisha, India", "lat": 20.4625, "lon": 85.8828, "tz": 5.5}, {"name": "Puri (Jagannath), Odisha, India", "lat": 19.8135, "lon": 85.8312, "tz": 5.5}, {"name": "Rourkela, Odisha, India", "lat": 22.2604, "lon": 84.8536, "tz": 5.5}, {"name": "Berhampur, Odisha, India", "lat": 19.3149, "lon": 84.7941, "tz": 5.5}, {"name": "Sambalpur, Odisha, India", "lat": 21.4669, "lon": 83.9812, "tz": 5.5}, {"name": "Guwahati (Kamakhya), Assam, India", "lat": 26.1445, "lon": 91.7362, "tz": 5.5}, {"name": "Silchar, Assam, India", "lat": 24.8333, "lon": 92.7789, "tz": 5.5}, {"name": "Dibrugarh, Assam, India", "lat": 27.4728, "lon": 94.912, "tz": 5.5}, {"name": "Shillong, Meghalaya, India", "lat": 25.5788, "lon": 91.8933, "tz": 5.5}, {"name": "Agartala, Tripura, India", "lat": 23.8315, "lon": 91.2868, "tz": 5.5}, {"name": "Imphal, Manipur, India", "lat": 24.817, "lon": 93.9368, "tz": 5.5}, {"name": "Aizawl, Mizoram, India", "lat": 23.7271, "lon": 92.7176, "tz": 5.5}, {"name": "Kohima, Nagaland, India", "lat": 25.6751, "lon": 94.1086, "tz": 5.5}, {"name": "Gangtok, Sikkim, India", "lat": 27.3314, "lon": 88.6138, "tz": 5.5}, {"name": "Bengaluru, Karnataka, India", "lat": 12.9716, "lon": 77.5946, "tz": 5.5}, {"name": "Mysuru (Mysore), Karnataka, India", "lat": 12.2958, "lon": 76.6394, "tz": 5.5}, {"name": "Mangaluru (Mangalore), Karnataka, India", "lat": 12.9141, "lon": 74.856, "tz": 5.5}, {"name": "Hubballi-Dharwad, Karnataka, India", "lat": 15.3647, "lon": 75.124, "tz": 5.5}, {"name": "Belagavi (Belgaum), Karnataka, India", "lat": 15.8497, "lon": 74.4977, "tz": 5.5}, {"name": "Udupi, Karnataka, India", "lat": 13.3409, "lon": 74.7421, "tz": 5.5}, {"name": "Hyderabad, Telangana, India", "lat": 17.385, "lon": 78.4867, "tz": 5.5}, {"name": "Warangal, Telangana, India", "lat": 17.9689, "lon": 79.5941, "tz": 5.5}, {"name": "Visakhapatnam, Andhra Pradesh, India", "lat": 17.6868, "lon": 83.2185, "tz": 5.5}, {"name": "Vijayawada, Andhra Pradesh, India", "lat": 16.5062, "lon": 80.648, "tz": 5.5}, {"name": "Guntur, Andhra Pradesh, India", "lat": 16.3067, "lon": 80.4365, "tz": 5.5}, {"name": "Tirupati (Balaji), Andhra Pradesh, India", "lat": 13.6288, "lon": 79.4192, "tz": 5.5}, {"name": "Nellore, Andhra Pradesh, India", "lat": 14.4426, "lon": 79.9865, "tz": 5.5}, {"name": "Kurnool, Andhra Pradesh, India", "lat": 15.8281, "lon": 78.0373, "tz": 5.5}, {"name": "Chennai, Tamil Nadu, India", "lat": 13.0827, "lon": 80.2707, "tz": 5.5}, {"name": "Coimbatore, Tamil Nadu, India", "lat": 11.0168, "lon": 76.9558, "tz": 5.5}, {"name": "Madurai, Tamil Nadu, India", "lat": 9.9252, "lon": 78.1198, "tz": 5.5}, {"name": "Tiruchirappalli (Trichy), Tamil Nadu, India", "lat": 10.7905, "lon": 78.7047, "tz": 5.5}, {"name": "Salem, Tamil Nadu, India", "lat": 11.6643, "lon": 78.146, "tz": 5.5}, {"name": "Tirunelveli, Tamil Nadu, India", "lat": 8.7139, "lon": 77.7567, "tz": 5.5}, {"name": "Rameshwaram, Tamil Nadu, India", "lat": 9.2876, "lon": 79.3129, "tz": 5.5}, {"name": "Kanchipuram, Tamil Nadu, India", "lat": 12.8342, "lon": 79.7036, "tz": 5.5}, {"name": "Kanyakumari, Tamil Nadu, India", "lat": 8.0883, "lon": 77.5385, "tz": 5.5}, {"name": "Thiruvananthapuram, Kerala, India", "lat": 8.5241, "lon": 76.9366, "tz": 5.5}, {"name": "Kochi, Kerala, India", "lat": 9.9312, "lon": 76.2673, "tz": 5.5}, {"name": "Kozhikode (Calicut), Kerala, India", "lat": 11.2588, "lon": 75.7804, "tz": 5.5}, {"name": "Thrissur, Kerala, India", "lat": 10.5276, "lon": 76.2144, "tz": 5.5}, {"name": "Kollam, Kerala, India", "lat": 8.8932, "lon": 76.6141, "tz": 5.5}, {"name": "Alappuzha, Kerala, India", "lat": 9.4981, "lon": 76.3388, "tz": 5.5}, {"name": "Dubai, United Arab Emirates", "lat": 25.2048, "lon": 55.2708, "tz": 4.0}, {"name": "Abu Dhabi, United Arab Emirates", "lat": 24.4539, "lon": 54.3773, "tz": 4.0}, {"name": "Sharjah, United Arab Emirates", "lat": 25.3463, "lon": 55.4209, "tz": 4.0}, {"name": "Doha, Qatar", "lat": 25.2854, "lon": 51.531, "tz": 3.0}, {"name": "Riyadh, Saudi Arabia", "lat": 24.7136, "lon": 46.6753, "tz": 3.0}, {"name": "Jeddah, Saudi Arabia", "lat": 21.4858, "lon": 39.1925, "tz": 3.0}, {"name": "Muscat, Oman", "lat": 23.588, "lon": 58.3829, "tz": 4.0}, {"name": "Kuwait City, Kuwait", "lat": 29.3759, "lon": 47.9774, "tz": 3.0}, {"name": "Manama, Bahrain", "lat": 26.2285, "lon": 50.586, "tz": 3.0}, {"name": "New York, NY, USA", "lat": 40.7128, "lon": -74.006, "tz": -5.0}, {"name": "Jersey City, NJ, USA", "lat": 40.7178, "lon": -74.0431, "tz": -5.0}, {"name": "San Francisco, CA, USA", "lat": 37.7749, "lon": -122.4194, "tz": -8.0}, {"name": "San Jose (Silicon Valley), CA, USA", "lat": 37.3382, "lon": -121.8863, "tz": -8.0}, {"name": "Fremont, CA, USA", "lat": 37.5485, "lon": -121.9886, "tz": -8.0}, {"name": "Los Angeles, CA, USA", "lat": 34.0522, "lon": -118.2437, "tz": -8.0}, {"name": "Seattle, WA, USA", "lat": 47.6062, "lon": -122.3321, "tz": -8.0}, {"name": "Chicago, IL, USA", "lat": 41.8781, "lon": -87.6298, "tz": -6.0}, {"name": "Houston, TX, USA", "lat": 29.7604, "lon": -95.3698, "tz": -6.0}, {"name": "Dallas, TX, USA", "lat": 32.7767, "lon": -96.797, "tz": -6.0}, {"name": "Austin, TX, USA", "lat": 30.2672, "lon": -97.7431, "tz": -6.0}, {"name": "Atlanta, GA, USA", "lat": 33.749, "lon": -84.388, "tz": -5.0}, {"name": "Boston, MA, USA", "lat": 42.3601, "lon": -71.0589, "tz": -5.0}, {"name": "Washington DC, USA", "lat": 38.9072, "lon": -77.0369, "tz": -5.0}, {"name": "Toronto, Ontario, Canada", "lat": 43.6532, "lon": -79.3832, "tz": -5.0}, {"name": "Brampton, Ontario, Canada", "lat": 43.7315, "lon": -79.7624, "tz": -5.0}, {"name": "Mississauga, Ontario, Canada", "lat": 43.589, "lon": -79.6441, "tz": -5.0}, {"name": "Vancouver, BC, Canada", "lat": 49.2827, "lon": -123.1207, "tz": -8.0}, {"name": "Calgary, Alberta, Canada", "lat": 51.0447, "lon": -114.0719, "tz": -7.0}, {"name": "London, United Kingdom", "lat": 51.5074, "lon": -0.1278, "tz": 0.0}, {"name": "Birmingham, United Kingdom", "lat": 52.4862, "lon": -1.8904, "tz": 0.0}, {"name": "Leicester, United Kingdom", "lat": 52.6369, "lon": -1.1398, "tz": 0.0}, {"name": "Manchester, United Kingdom", "lat": 53.4808, "lon": -2.2426, "tz": 0.0}, {"name": "Edinburgh, United Kingdom", "lat": 55.9533, "lon": -3.1883, "tz": 0.0}, {"name": "Dublin, Ireland", "lat": 53.3498, "lon": -6.2603, "tz": 0.0}, {"name": "Paris, France", "lat": 48.8566, "lon": 2.3522, "tz": 1.0}, {"name": "Berlin, Germany", "lat": 52.52, "lon": 13.405, "tz": 1.0}, {"name": "Frankfurt, Germany", "lat": 50.1109, "lon": 8.6821, "tz": 1.0}, {"name": "Munich, Germany", "lat": 48.1351, "lon": 11.582, "tz": 1.0}, {"name": "Amsterdam, Netherlands", "lat": 52.3676, "lon": 4.9041, "tz": 1.0}, {"name": "Zurich, Switzerland", "lat": 47.3769, "lon": 8.5417, "tz": 1.0}, {"name": "Geneva, Switzerland", "lat": 46.2044, "lon": 6.1432, "tz": 1.0}, {"name": "Rome, Italy", "lat": 41.9028, "lon": 12.4964, "tz": 1.0}, {"name": "Madrid, Spain", "lat": 40.4168, "lon": -3.7038, "tz": 1.0}, {"name": "Moscow, Russia", "lat": 55.7558, "lon": 37.6173, "tz": 3.0}, {"name": "Singapore", "lat": 1.3521, "lon": 103.8198, "tz": 8.0}, {"name": "Kuala Lumpur, Malaysia", "lat": 3.139, "lon": 101.6869, "tz": 8.0}, {"name": "Bangkok, Thailand", "lat": 13.7563, "lon": 100.5018, "tz": 7.0}, {"name": "Jakarta, Indonesia", "lat": -6.2088, "lon": 106.8456, "tz": 7.0}, {"name": "Tokyo, Japan", "lat": 35.6762, "lon": 139.6503, "tz": 9.0}, {"name": "Hong Kong", "lat": 22.3193, "lon": 114.1694, "tz": 8.0}, {"name": "Sydney, Australia", "lat": -33.8688, "lon": 151.2093, "tz": 10.0}, {"name": "Melbourne, Australia", "lat": -37.8136, "lon": 144.9631, "tz": 10.0}, {"name": "Perth, Australia", "lat": -31.9505, "lon": 115.8605, "tz": 8.0}, {"name": "Auckland, New Zealand", "lat": -36.8485, "lon": 174.7633, "tz": 12.0}, {"name": "Kathmandu, Nepal", "lat": 27.7172, "lon": 85.324, "tz": 5.75}, {"name": "Pokhara, Nepal", "lat": 28.2096, "lon": 83.9856, "tz": 5.75}, {"name": "Colombo, Sri Lanka", "lat": 6.9271, "lon": 79.8612, "tz": 5.5}, {"name": "Dhaka, Bangladesh", "lat": 23.8103, "lon": 90.4125, "tz": 6.0}, {"name": "Thimphu, Bhutan", "lat": 27.4728, "lon": 89.6393, "tz": 6.0}, {"name": "Port Louis, Mauritius", "lat": -20.1609, "lon": 57.5012, "tz": 4.0}, {"name": "Johannesburg, South Africa", "lat": -26.2041, "lon": 28.0473, "tz": 2.0}, {"name": "Nairobi, Kenya", "lat": -1.2921, "lon": 36.8219, "tz": 3.0}];
