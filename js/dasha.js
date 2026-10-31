// ==========================================================================
// INDUS KUNDLI APP — VIMSHOTTARI DASHA TIMELINE (dasha.js)
// ==========================================================================

const DASHA_PERIODS = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
};

const DASHA_LORDS_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

function addYears(date, years) {
  const d = new Date(date.getTime());
  d.setFullYear(d.getFullYear() + Math.floor(years));
  const remainingDays = (years - Math.floor(years)) * 365.25;
  d.setDate(d.getDate() + Math.round(remainingDays));
  return d;
}

function formatDate(date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function computeVimshottariDasha(moonLong, birthDate) {
  const nakArc = 360.0 / 27.0; // 13° 20' = 13.33333°
  const nakIndex = Math.floor(moonLong / nakArc);
  const nakRem = moonLong % nakArc;

  const firstLordIndex = nakIndex % 9;
  const firstLord = DASHA_LORDS_ORDER[firstLordIndex];
  const firstTotalYears = DASHA_PERIODS[firstLord];

  // Fraction elapsed & remaining
  const fracElapsed = nakRem / nakArc;
  const fracRemaining = 1.0 - fracElapsed;
  const balanceYears = firstTotalYears * fracRemaining;

  const mahadashas = [];
  let currentDate = new Date(birthDate.getTime());

  // 1st Mahadasha (Partial balance)
  const firstEndDate = addYears(currentDate, balanceYears);
  mahadashas.push({
    lord: firstLord,
    years: balanceYears,
    totalYears: firstTotalYears,
    startDate: new Date(currentDate.getTime()),
    endDate: new Date(firstEndDate.getTime()),
    isBalance: true
  });
  currentDate = new Date(firstEndDate.getTime());

  // Subsequent 8 Mahadashas (Full periods)
  for (let i = 1; i < 9; i++) {
    const lordIdx = (firstLordIndex + i) % 9;
    const lord = DASHA_LORDS_ORDER[lordIdx];
    const totalYears = DASHA_PERIODS[lord];
    const endDate = addYears(currentDate, totalYears);

    mahadashas.push({
      lord: lord,
      years: totalYears,
      totalYears: totalYears,
      startDate: new Date(currentDate.getTime()),
      endDate: new Date(endDate.getTime()),
      isBalance: false
    });
    currentDate = new Date(endDate.getTime());
  }

  // Calculate Antardashas for each Mahadasha
  mahadashas.forEach(md => {
    md.antardashas = [];
    const mdLord = md.lord;
    const mdStartIdx = DASHA_LORDS_ORDER.indexOf(mdLord);
    let adCurrentDate = new Date(md.startDate.getTime());

    for (let j = 0; j < 9; j++) {
      const adLordIdx = (mdStartIdx + j) % 9;
      const adLord = DASHA_LORDS_ORDER[adLordIdx];
      // Formula: (MD years * AD years) / 120
      const adYears = (md.totalYears * DASHA_PERIODS[adLord]) / 120.0;
      const adEndDate = addYears(adCurrentDate, adYears);

      md.antardashas.push({
        mahadasha: mdLord,
        antardasha: adLord,
        years: adYears,
        startDate: new Date(adCurrentDate.getTime()),
        endDate: new Date(adEndDate.getTime()),
        startFormatted: formatDate(adCurrentDate),
        endFormatted: formatDate(adEndDate)
      });
      adCurrentDate = new Date(adEndDate.getTime());
    }
  });

  const getActiveDashaAt = (targetDate) => {
    const t = targetDate.getTime();
    for (const md of mahadashas) {
      if (t >= md.startDate.getTime() && t <= md.endDate.getTime()) {
        for (const ad of md.antardashas) {
          if (t >= ad.startDate.getTime() && t <= ad.endDate.getTime()) {
            const elapsed = t - ad.startDate.getTime();
            const total = ad.endDate.getTime() - ad.startDate.getTime();
            const pct = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
            const remainingDays = Math.max(0, Math.round((ad.endDate.getTime() - t) / (1000 * 60 * 60 * 24)));
            return {
              mahadasha: md.lord,
              antardasha: ad.antardasha,
              adStart: ad.startFormatted,
              adEnd: ad.endFormatted,
              pct,
              remainingDays
            };
          }
        }
      }
    }
    return null;
  };

  return {
    balance: { lord: firstLord, years: balanceYears },
    mahadashas,
    getActiveDashaAt
  };
}

function updateDashaUI() {
  if (!currentChartData || !currentChartData.dasha) return;
  const { dasha } = currentChartData;

  const targetDateInput = document.getElementById("dashaTargetDate");
  const checkDate = targetDateInput && targetDateInput.value ? new Date(targetDateInput.value) : new Date();
  const activeDasha = dasha.getActiveDashaAt(checkDate);

  if (activeDasha) {
    if (document.getElementById("heroDashaName")) {
      document.getElementById("heroDashaName").textContent = `${activeDasha.mahadasha} Mahadasha • ${activeDasha.antardasha} Antardasha`;
    }
    if (document.getElementById("heroDashaDates")) {
      document.getElementById("heroDashaDates").textContent = `Period: ${activeDasha.adStart} — ${activeDasha.adEnd}`;
    }
    if (document.getElementById("heroDashaRemaining")) {
      document.getElementById("heroDashaRemaining").textContent = `Remaining: ${activeDasha.remainingDays} days (${activeDasha.pct}% elapsed)`;
    }
    if (document.getElementById("heroDashaProgressBar")) {
      document.getElementById("heroDashaProgressBar").style.width = `${activeDasha.pct}%`;
    }
  }

  const container = document.getElementById("dashaTimelineContainer");
  if (!container) return;
  container.innerHTML = "";

  dasha.mahadashas.forEach((md, idx) => {
    const isCurrentMd = activeDasha && activeDasha.mahadasha === md.lord;
    const card = document.createElement("div");
    card.className = `p-4 rounded-xl border ${isCurrentMd ? 'bg-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-500/10' : 'bg-slate-900 border-slate-800'}`;

    let adRows = "";
    md.antardashas.forEach(ad => {
      const isCurrentAd = isCurrentMd && activeDasha.antardasha === ad.antardasha;
      adRows += `
        <div class="flex items-center justify-between py-1 px-2 rounded ${isCurrentAd ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'} text-[11px]">
          <span>${ad.mahadasha} / ${ad.antardasha}</span>
          <span class="font-mono text-[10px]">${ad.startFormatted} — ${ad.endFormatted}</span>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
        <div class="flex items-center gap-2">
          <strong class="font-cinzel text-base ${isCurrentMd ? 'text-amber-300' : 'text-white'}">${md.lord} Mahadasha</strong>
          <span class="text-xs px-2 py-0.5 rounded-full ${isCurrentMd ? 'bg-amber-500/20 text-amber-300 font-bold' : 'bg-slate-800 text-slate-400'}">${md.years.toFixed(1)} Years</span>
        </div>
        <span class="text-xs font-mono text-slate-400">${formatDate(md.startDate)} — ${formatDate(md.endDate)}</span>
      </div>
      <div class="space-y-0.5 mt-2 max-h-48 overflow-y-auto pr-1">
        ${adRows}
      </div>
    `;
    container.appendChild(card);
  });
}
