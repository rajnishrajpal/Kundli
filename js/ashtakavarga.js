// ==========================================================================
// INDUS KUNDLI APP — ASHTAKAVARGA ENGINE (ashtakavarga.js)
// ==========================================================================

function computeAshtakavarga(planetsData, ascData) {
  const RULES = {
    Sun: {
      Sun: [1, 2, 4, 7, 8, 9, 10, 11],
      Moon: [3, 6, 10, 11],
      Mars: [1, 2, 4, 7, 8, 9, 10, 11],
      Mercury: [3, 5, 6, 9, 10, 11, 12],
      Jupiter: [5, 6, 9, 11],
      Venus: [6, 7, 12],
      Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
      Lagna: [3, 4, 6, 10, 11, 12]
    },
    Moon: {
      Sun: [3, 6, 7, 8, 10, 11],
      Moon: [1, 3, 6, 7, 10, 11],
      Mars: [2, 3, 5, 6, 9, 10, 11],
      Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
      Jupiter: [1, 4, 7, 8, 10, 11, 12],
      Venus: [3, 4, 5, 7, 9, 10, 11],
      Saturn: [3, 5, 6, 11],
      Lagna: [3, 6, 10, 11]
    },
    Mars: {
      Sun: [3, 5, 6, 10, 11],
      Moon: [3, 6, 11],
      Mars: [1, 2, 4, 7, 8, 10, 11],
      Mercury: [3, 5, 6, 11],
      Jupiter: [6, 10, 11, 12],
      Venus: [6, 8, 11, 12],
      Saturn: [1, 4, 7, 8, 9, 10, 11],
      Lagna: [1, 3, 6, 10, 11]
    },
    Mercury: {
      Sun: [5, 6, 9, 11, 12],
      Moon: [2, 4, 6, 8, 10, 11],
      Mars: [1, 2, 4, 7, 8, 9, 10, 11],
      Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
      Jupiter: [6, 8, 11, 12],
      Venus: [1, 2, 3, 4, 5, 8, 9, 11],
      Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
      Lagna: [1, 2, 4, 6, 8, 10, 11]
    },
    Jupiter: {
      Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
      Moon: [2, 5, 7, 9, 11],
      Mars: [1, 2, 4, 7, 8, 10, 11],
      Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
      Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
      Venus: [2, 5, 6, 9, 10, 11],
      Saturn: [3, 5, 6, 12],
      Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11]
    },
    Venus: {
      Sun: [8, 11, 12],
      Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
      Mars: [3, 5, 6, 9, 11, 12],
      Mercury: [3, 5, 6, 9, 11],
      Jupiter: [5, 8, 9, 10, 11],
      Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
      Saturn: [3, 4, 5, 8, 9, 10, 11],
      Lagna: [1, 2, 3, 4, 5, 8, 9, 11]
    },
    Saturn: {
      Sun: [1, 2, 4, 7, 8, 10, 11],
      Moon: [3, 6, 11],
      Mars: [3, 5, 6, 10, 11, 12],
      Mercury: [6, 8, 9, 10, 11, 12],
      Jupiter: [5, 6, 11, 12],
      Venus: [6, 11, 12],
      Saturn: [3, 5, 6, 11],
      Lagna: [1, 3, 4, 6, 10, 11]
    }
  };

  const bav = {};
  const sav = new Array(12).fill(0);
  const planetList = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  planetList.forEach(targetPlanet => {
    bav[targetPlanet] = new Array(12).fill(0);
    const rules = RULES[targetPlanet];

    planetList.forEach(donor => {
      const donorSign = planetsData[donor].rashi;
      const houses = rules[donor];
      houses.forEach(h => {
        const targetSignIdx = (donorSign - 1 + h - 1) % 12;
        bav[targetPlanet][targetSignIdx] += 1;
        sav[targetSignIdx] += 1;
      });
    });

    const ascSign = ascData.rashi;
    const ascHouses = rules.Lagna;
    ascHouses.forEach(h => {
      const targetSignIdx = (ascSign - 1 + h - 1) % 12;
      bav[targetPlanet][targetSignIdx] += 1;
      sav[targetSignIdx] += 1;
    });
  });

  return { bav, sav };
}

function updateAshtakavargaUI() {
  if (!currentChartData || !currentChartData.ashtakavarga) return;
  const { sav, bav } = currentChartData.ashtakavarga;

  const grid = document.getElementById("savGrid");
  if (grid) {
    grid.innerHTML = "";
    let maxPts = -1, maxSign = 1;

    sav.forEach((pts, idx) => {
      const signNum = idx + 1;
      if (pts > maxPts) { maxPts = pts; maxSign = signNum; }
      const rashi = RASHIS[idx];
      const isGood = pts >= 28;
      const card = document.createElement("div");
      card.className = `p-3 rounded-xl border ${isGood ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' : 'bg-rose-950/20 border-rose-500/30 text-rose-200'} flex flex-col items-center justify-center text-center transition hover:scale-105`;
      card.innerHTML = `
        <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400">${signNum}. ${rashi.sanskrit}</span>
        <span class="text-xl font-bold font-mono my-0.5 ${isGood ? 'text-emerald-300' : 'text-amber-400'}">${pts}</span>
        <span class="text-[10px] ${isGood ? 'text-emerald-400' : 'text-rose-400'}">${isGood ? 'Auspicious (≥28)' : 'Sensitive (<28)'}</span>
      `;
      grid.appendChild(card);
    });

    const highestEl = document.getElementById("savHighestSigns");
    if (highestEl) {
      highestEl.textContent = `Rashi ${maxSign} (${RASHIS[maxSign - 1].name} / ${RASHIS[maxSign - 1].sanskrit}) commands the highest potency with ${maxPts} points. Undertakings, new investments, and auspicious pursuits initiated when planets transit this sign bear abundant fruit.`;
    }
  }

  const bavTbody = document.getElementById("bavTableBody");
  if (bavTbody && bav) {
    bavTbody.innerHTML = "";
    const planetsList = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

    planetsList.forEach(p => {
      const row = document.createElement("tr");
      row.className = "hover:bg-slate-800/40 transition";
      let rowSum = 0;
      let cellsHtml = `<td class="py-2 px-3 text-left font-sans font-semibold text-white">${p}</td>`;

      bav[p].forEach(pts => {
        rowSum += pts;
        const high = pts >= 5;
        const low = pts <= 2;
        cellsHtml += `<td class="py-2 px-1 text-center font-mono ${high ? 'text-emerald-300 font-bold bg-emerald-900/10' : low ? 'text-rose-400 bg-rose-900/10' : 'text-slate-300'}">${pts}</td>`;
      });

      cellsHtml += `<td class="py-2 px-3 font-bold text-amber-300 bg-slate-900 font-mono">${rowSum}</td>`;
      row.innerHTML = cellsHtml;
      bavTbody.appendChild(row);
    });

    const totRow = document.createElement("tr");
    totRow.className = "bg-amber-500/10 font-bold border-t-2 border-amber-500/40 text-amber-300";
    let totHtml = `<td class="py-2.5 px-3 text-left font-sans">Total (SAV)</td>`;
    sav.forEach(tot => {
      totHtml += `<td class="py-2.5 px-1 text-center font-mono">${tot}</td>`;
    });
    totHtml += `<td class="py-2.5 px-3 bg-amber-500/20 text-white font-mono">337</td>`;
    totRow.innerHTML = totHtml;
    bavTbody.appendChild(totRow);
  }
}
