// ==========================================================================
// INDUS KUNDLI APP — ASTRONOMICAL ENGINE & EPHEMERIS (astronomy.js)
// ==========================================================================

function normDeg(d) {
  return ((d % 360) + 360) % 360;
}

function degToRad(d) {
  return (d * Math.PI) / 180.0;
}

function radToDeg(r) {
  return (r * 180.0) / Math.PI;
}

function formatDMS(deg) {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  const s = Math.floor(((deg - d) * 60 - m) * 60);
  return `${d}° ${String(m).padStart(2, "0")}' ${String(s).padStart(2, "0")}"`;
}

function calcJulianDay(year, month, day, hour, minute, second, tz) {
  let Y = year;
  let M = month;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFraction = day + (hour - tz + minute / 60.0 + second / 3600.0) / 24.0;
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + dayFraction + B - 1524.5;
}

function getAyanamsha(jd, type = "lahiri") {
  const T = (jd - 2451545.0) / 36525.0;
  // Lahiri (Chitrapaksha) Ayanamsha: 23° 51' 25.53" at J2000.0
  let baseLahiri = 23.85694 + 1.3969713 * T + 0.0003086 * T * T;
  if (type === "raman") {
    return baseLahiri - 1.416667;
  } else if (type === "krishnamurti") {
    return baseLahiri - 0.101389;
  }
  return baseLahiri;
}

function solveKepler(M_deg, e) {
  const M_rad = degToRad(M_deg);
  let E = M_rad;
  for (let i = 0; i < 15; i++) {
    const dE = (E - e * Math.sin(E) - M_rad) / (1 - e * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-7) break;
  }
  return radToDeg(E);
}

function getHeliocentricPos(T, elem) {
  const a = elem.a[0] + elem.a[1] * T;
  const e = elem.e[0] + elem.e[1] * T;
  const I = elem.I[0] + elem.I[1] * T;
  const L = elem.L[0] + elem.L[1] * T;
  const longPeri = elem.longPeri[0] + elem.longPeri[1] * T;
  const longNode = elem.longNode[0] + elem.longNode[1] * T;

  const M = normDeg(L - longPeri);
  const E = solveKepler(M, e);
  const E_rad = degToRad(E);

  const x_prime = a * (Math.cos(E_rad) - e);
  const y_prime = a * Math.sqrt(1 - e * e) * Math.sin(E_rad);

  const omega = normDeg(longPeri - longNode);
  const omega_rad = degToRad(omega);
  const Omega_rad = degToRad(longNode);
  const I_rad = degToRad(I);

  const cos_om = Math.cos(omega_rad);
  const sin_om = Math.sin(omega_rad);
  const cos_Om = Math.cos(Omega_rad);
  const sin_Om = Math.sin(Omega_rad);
  const cos_I = Math.cos(I_rad);

  const x = (cos_om * cos_Om - sin_om * sin_Om * cos_I) * x_prime + (-sin_om * cos_Om - cos_om * sin_Om * cos_I) * y_prime;
  const y = (cos_om * sin_Om + sin_om * cos_Om * cos_I) * x_prime + (-sin_om * sin_Om + cos_om * cos_Om * cos_I) * y_prime;
  const z = (sin_om * Math.sin(I_rad)) * x_prime + (cos_om * Math.sin(I_rad)) * y_prime;

  return { x, y, z };
}

function calcGeocentricPlanet(T, planetElem, earthElem) {
  const pHelio = getHeliocentricPos(T, planetElem);
  const eHelio = getHeliocentricPos(T, earthElem);

  const x = pHelio.x - eHelio.x;
  const y = pHelio.y - eHelio.y;
  const z = pHelio.z - eHelio.z;

  const lon = normDeg(radToDeg(Math.atan2(y, x)));
  const dist = Math.sqrt(x * x + y * y + z * z);
  return { lon, dist };
}

function calcSun(T) {
  const L0 = normDeg(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = normDeg(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const M_rad = degToRad(M);
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M_rad) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * M_rad) +
            0.000289 * Math.sin(3 * M_rad);
  return normDeg(L0 + C);
}

function calcMoon(T, sunMeanM) {
  const L_prime = normDeg(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  const D = normDeg(297.8501921 + 445267.1114034 * T);
  const M_prime = normDeg(134.9633964 + 477198.8675055 * T);
  const F = normDeg(93.272095 + 483202.0175233 * T);

  const D_rad = degToRad(D);
  const M_rad = degToRad(sunMeanM);
  const Mprime_rad = degToRad(M_prime);
  const F_rad = degToRad(F);

  const lonCorr = 6.288774 * Math.sin(Mprime_rad) +
                  1.274027 * Math.sin(2 * D_rad - Mprime_rad) +
                  0.658314 * Math.sin(2 * D_rad) +
                  0.213618 * Math.sin(2 * Mprime_rad) -
                  0.185116 * Math.sin(M_rad) -
                  0.114332 * Math.sin(2 * F_rad) +
                  0.058793 * Math.sin(2 * D_rad - 2 * Mprime_rad) +
                  0.057066 * Math.sin(2 * D_rad - M_rad - Mprime_rad) +
                  0.053322 * Math.sin(2 * D_rad + Mprime_rad) +
                  0.045758 * Math.sin(2 * D_rad - M_rad) -
                  0.040923 * Math.sin(M_rad - Mprime_rad) -
                  0.034720 * Math.sin(D_rad);

  return normDeg(L_prime + lonCorr);
}

function calcAscendant(jd, lat, lon) {
  const T = (jd - 2451545.0) / 36525.0;
  const d = jd - 2451545.0;
  const gmst0 = normDeg(280.46061837 + 360.98564736629 * d + 0.000387933 * T * T);
  const lst = normDeg(gmst0 + lon);

  const eps = 23.43929111 - 0.013004167 * T;
  const lstRad = degToRad(lst);
  const latRad = degToRad(lat);
  const epsRad = degToRad(eps);

  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad);
  const ascTrop = normDeg(radToDeg(Math.atan2(y, x)));

  return { ascTrop, ramc: lst };
}
