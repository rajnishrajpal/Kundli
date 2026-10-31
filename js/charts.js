// ==========================================================================
// INDUS KUNDLI APP — VISUAL CHARTS ENGINE (charts.js)
// Supports North Indian, South Indian, and East Indian (Bengali/Odia) Styles
// ==========================================================================

let currentChartStyle = "north";
let d1RotatedBhava = 1;

window.setD1Rotation = function(bhavaNum) {
  d1RotatedBhava = parseInt(bhavaNum) || 1;
  if (d1RotatedBhava < 1 || d1RotatedBhava > 12) d1RotatedBhava = 1;

  const sel = document.getElementById("d1BhavaSelect");
  if (sel) sel.value = d1RotatedBhava;

  const resetBtn = document.getElementById("btnResetD1Rotation");
  const title = document.getElementById("d1ChartTitle");
  const subtitle = document.getElementById("d1ChartSubtitle");

  if (d1RotatedBhava === 1) {
    if (resetBtn) resetBtn.classList.add("hidden");
    if (title) title.textContent = "Lagna Kundli (D1 Natal Chart)";
    if (subtitle) subtitle.textContent = "Physical body, environment, and foundational life vitality";
  } else {
    if (resetBtn) resetBtn.classList.remove("hidden");
    const bhavaNames = {
      2: "Dhana Bhava (Wealth & Speech)",
      3: "Sahaja Bhava (Courage & Siblings)",
      4: "Sukha Bhava (Mother & Property)",
      5: "Putra Bhava (Children & Intellect)",
      6: "Shatru Bhava (Health & Obstacles)",
      7: "Kalatra Bhava (Spouse & Partners)",
      8: "Ayur Bhava (Longevity & Occult)",
      9: "Bhagya Bhava (Fortune & Dharma)",
      10: "Karma Bhava (Career & Status)",
      11: "Labha Bhava (Gains & Network)",
      12: "Vyaya Bhava (Moksha & Foreign)"
    };
    if (title) title.textContent = `Rotated D1 Chart • ${bhavaNames[d1RotatedBhava]}`;
    if (subtitle) subtitle.textContent = `Analyzing natal potential with Bhava ${d1RotatedBhava} rotated to the Ascendant`;
  }

  renderChart("D1", "chartD1Container", false);
  if (typeof updateHouseSummaries === "function") updateHouseSummaries();
  if (typeof updatePlanetaryTable === "function") updatePlanetaryTable();
};

window.handleChartRightClick = function(event, targetBhava, vargaKey, containerId) {
  event.preventDefault();
  if (vargaKey !== "D1" || containerId !== "chartD1Container") return false;
  if (d1RotatedBhava === targetBhava && targetBhava !== 1) {
    window.setD1Rotation(1);
  } else {
    window.setD1Rotation(targetBhava);
  }
  return false;
};

// North Indian Chart Renderer
function renderNorthIndianChart(vargaKey, bodiesMap, containerId, isPrint = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isD1 = vargaKey === "D1" && containerId === "chartD1Container" && !isPrint;
  const rotBhava = isD1 ? d1RotatedBhava : 1;
  const ascSign = bodiesMap.Lagna ? bodiesMap.Lagna.sign : 1;
  const effectiveAscSign = rotBhava === 1 ? ascSign : (((ascSign - 1 + (rotBhava - 1)) % 12) + 1);

  const size = isPrint ? 280 : 380;
  const strokeClass = isPrint ? "print-chart-line" : "chart-line";
  const boxClass = isPrint ? "print-chart-box" : "chart-box";

  const signBodies = {};
  for (let s = 1; s <= 12; s++) signBodies[s] = [];

  Object.entries(bodiesMap).forEach(([name, b]) => {
    if (signBodies[b.sign]) {
      if (name === "Lagna") {
        if (isD1 && rotBhava !== 1) {
          signBodies[b.sign].push("NLg");
        } else {
          signBodies[b.sign].push("Lg");
        }
      } else {
        signBodies[b.sign].push(name.slice(0, 2) + (b.isRetrograde ? "ᴿ" : ""));
      }
    }
  });
  if (isD1 && rotBhava !== 1) {
    signBodies[effectiveAscSign].unshift("Lg");
  }

  const houseSigns = {};
  for (let h = 1; h <= 12; h++) {
    houseSigns[h] = ((effectiveAscSign - 1 + h - 1) % 12) + 1;
  }

  const scale = size / 380;
  const s = (v) => v * scale;

  const houseCenters = {
    1: { numX: s(190), numY: s(75), textX: s(190), textY: s(105) },
    2: { numX: s(110), numY: s(35), textX: s(95), textY: s(60) },
    3: { numX: s(40), numY: s(95), textX: s(45), textY: s(125) },
    4: { numX: s(75), numY: s(190), textX: s(105), textY: s(195) },
    5: { numX: s(40), numY: s(285), textX: s(45), textY: s(255) },
    6: { numX: s(110), numY: s(350), textX: s(95), textY: s(325) },
    7: { numX: s(190), numY: s(310), textX: s(190), textY: s(275) },
    8: { numX: s(275), numY: s(350), textX: s(285), textY: s(325) },
    9: { numX: s(340), numY: s(285), textX: s(335), textY: s(255) },
    10: { numX: s(310), numY: s(190), textX: s(275), textY: s(195) },
    11: { numX: s(340), numY: s(95), textX: s(335), textY: s(125) },
    12: { numX: s(275), numY: s(35), textX: s(285), textY: s(60) }
  };

  const housePolygons = {
    1: `${s(190)},${s(0)} ${s(285)},${s(95)} ${s(190)},${s(190)} ${s(95)},${s(95)}`,
    2: `${s(0)},${s(0)} ${s(190)},${s(0)} ${s(95)},${s(95)}`,
    3: `${s(0)},${s(0)} ${s(95)},${s(95)} ${s(0)},${s(190)}`,
    4: `${s(0)},${s(190)} ${s(95)},${s(95)} ${s(190)},${s(190)} ${s(95)},${s(285)}`,
    5: `${s(0)},${s(190)} ${s(95)},${s(285)} ${s(0)},${s(380)}`,
    6: `${s(0)},${s(380)} ${s(95)},${s(285)} ${s(190)},${s(380)}`,
    7: `${s(190)},${s(190)} ${s(285)},${s(285)} ${s(190)},${s(380)} ${s(95)},${s(285)}`,
    8: `${s(190)},${s(380)} ${s(285)},${s(285)} ${s(380)},${s(380)}`,
    9: `${s(380)},${s(190)} ${s(285)},${s(285)} ${s(380)},${s(380)}`,
    10: `${s(190)},${s(190)} ${s(285)},${s(95)} ${s(380)},${s(190)} ${s(285)},${s(285)}`,
    11: `${s(380)},${s(0)} ${s(285)},${s(95)} ${s(380)},${s(190)}`,
    12: `${s(190)},${s(0)} ${s(380)},${s(0)} ${s(285)},${s(95)}`
  };

  let svgHtml = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="select-none filter drop-shadow-md">
    <rect x="2" y="2" width="${size - 4}" height="${size - 4}" class="${boxClass} ${strokeClass}" />
    <line x1="2" y1="2" x2="${size - 2}" y2="${size - 2}" class="${strokeClass}" />
    <line x1="${size - 2}" y1="2" x2="2" y2="${size - 2}" class="${strokeClass}" />
    <polygon points="${size / 2},2 ${size - 2},${size / 2} ${size / 2},${size - 2} 2,${size / 2}" fill="none" class="${strokeClass}" />
  `;

  for (let h = 1; h <= 12; h++) {
    const signNum = houseSigns[h];
    const planetsInHouse = signBodies[signNum] || [];
    const pos = houseCenters[h];
    const poly = housePolygons[h];
    const natalBhava = isD1 ? (((rotBhava - 1 + (h - 1)) % 12) + 1) : h;

    svgHtml += `
    <g class="cursor-pointer group" 
       onclick="window.openHouseInspector(${h}, ${signNum}, ${isD1 ? rotBhava : 1})"
       oncontextmenu="window.handleChartRightClick(event, ${isD1 ? natalBhava : h}, '${vargaKey}', '${containerId}'); return false;">
      <polygon points="${poly}" fill="transparent" class="transition-colors duration-150 group-hover:fill-amber-500/15" />
      <title>${isD1 && rotBhava !== 1 ? `Rotated House ${h} (Natal Bhava ${natalBhava}) • Sign ${signNum}` : `House ${h} • Sign ${signNum}`}&#10;Left-click: Inspect significations&#10;Right-click: Rotate chart from this Bhava</title>
      <text x="${pos.numX}" y="${pos.numY}" text-anchor="middle" class="${isPrint ? 'font-serif text-[10px] fill-slate-700 font-bold' : 'chart-sign-num pointer-events-none group-hover:fill-amber-300'}">
        ${signNum}
      </text>
      <text x="${pos.textX}" y="${pos.textY}" text-anchor="middle" class="${isPrint ? 'font-sans text-[9px] fill-slate-900 font-bold' : 'chart-planet-tag fill-amber-200 pointer-events-none'}">
        ${planetsInHouse.join(" ")}
      </text>
    </g>`;
  }

  svgHtml += `</svg>`;
  container.innerHTML = svgHtml;
}

// South Indian Chart Renderer
function renderSouthIndianChart(vargaKey, bodiesMap, containerId, isPrint = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isD1 = vargaKey === "D1" && containerId === "chartD1Container" && !isPrint;
  const rotBhava = isD1 ? d1RotatedBhava : 1;
  const ascSign = bodiesMap.Lagna ? bodiesMap.Lagna.sign : 1;
  const effectiveAscSign = rotBhava === 1 ? ascSign : (((ascSign - 1 + (rotBhava - 1)) % 12) + 1);

  const size = isPrint ? 280 : 380;
  const cellSize = size / 4;
  const strokeClass = isPrint ? "print-chart-line" : "chart-line";
  const boxClass = isPrint ? "print-chart-box" : "chart-box";

  const rashiCells = {
    12: { c: 0, r: 0 }, 1: { c: 1, r: 0 }, 2: { c: 2, r: 0 }, 3: { c: 3, r: 0 },
    4: { c: 3, r: 1 }, 5: { c: 3, r: 2 }, 6: { c: 3, r: 3 },
    7: { c: 2, r: 3 }, 8: { c: 1, r: 3 }, 9: { c: 0, r: 3 },
    10: { c: 0, r: 2 }, 11: { c: 0, r: 1 }
  };

  const signBodies = {};
  for (let s = 1; s <= 12; s++) signBodies[s] = [];
  Object.entries(bodiesMap).forEach(([name, b]) => {
    if (signBodies[b.sign]) {
      if (name === "Lagna") {
        if (isD1 && rotBhava !== 1) {
          signBodies[b.sign].push("NLg");
        } else {
          signBodies[b.sign].push("ASC");
        }
      } else {
        signBodies[b.sign].push(name.slice(0, 2) + (b.isRetrograde ? "ᴿ" : ""));
      }
    }
  });
  if (isD1 && rotBhava !== 1) {
    signBodies[effectiveAscSign].unshift("ASC");
  }

  let svgHtml = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="select-none filter drop-shadow-md">
    <rect x="2" y="2" width="${size - 4}" height="${size - 4}" class="${boxClass} ${strokeClass}" />
    <rect x="${cellSize}" y="${cellSize}" width="${cellSize * 2}" height="${cellSize * 2}" fill="${isPrint ? '#f3f4f6' : '#050B18'}" class="${strokeClass}" />
    <line x1="${cellSize}" y1="0" x2="${cellSize}" y2="${size}" class="${strokeClass}" />
    <line x1="${cellSize * 2}" y1="0" x2="${cellSize * 2}" y2="${cellSize}" class="${strokeClass}" />
    <line x1="${cellSize * 2}" y1="${cellSize * 3}" x2="${cellSize * 2}" y2="${size}" class="${strokeClass}" />
    <line x1="${cellSize * 3}" y1="0" x2="${cellSize * 3}" y2="${size}" class="${strokeClass}" />
    
    <line x1="0" y1="${cellSize}" x2="${size}" y2="${cellSize}" class="${strokeClass}" />
    <line x1="0" y1="${cellSize * 2}" x2="${cellSize}" y2="${cellSize * 2}" class="${strokeClass}" />
    <line x1="${cellSize * 3}" y1="${cellSize * 2}" x2="${size}" y2="${cellSize * 2}" class="${strokeClass}" />
    <line x1="0" y1="${cellSize * 3}" x2="${size}" y2="${cellSize * 3}" class="${strokeClass}" />

    <text x="${size / 2}" y="${size / 2 - 12}" text-anchor="middle" class="${isPrint ? 'font-serif text-xs fill-slate-800 font-bold' : 'font-cinzel text-xs fill-amber-300 font-bold'}">
      ${vargaKey} Chart ${isD1 && rotBhava !== 1 ? `(H${rotBhava} Lagna)` : ''}
    </text>
    <text x="${size / 2}" y="${size / 2 + 8}" text-anchor="middle" class="${isPrint ? 'font-sans text-[9px] fill-slate-500' : 'font-sans text-[10px] fill-slate-400'}">
      ${isD1 && rotBhava !== 1 ? `Rotated: Bhava ${rotBhava}` : 'South Indian Style'}
    </text>
  `;

  for (let s = 1; s <= 12; s++) {
    const cell = rashiCells[s];
    const x = cell.c * cellSize;
    const y = cell.r * cellSize;
    const planetsInSign = signBodies[s] || [];
    const isLagna = s === effectiveAscSign;
    const isNatalLagna = isD1 && rotBhava !== 1 && s === ascSign;
    const houseFromAsc = ((s - effectiveAscSign + 12) % 12) + 1;
    const natalBhavaOfSign = ((s - ascSign + 12) % 12) + 1;

    svgHtml += `
    <g class="cursor-pointer group" 
       onclick="window.openHouseInspectorBySign(${s})"
       oncontextmenu="window.handleChartRightClick(event, ${isD1 ? natalBhavaOfSign : houseFromAsc}, '${vargaKey}', '${containerId}'); return false;">
      <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="transparent" class="transition-colors group-hover:fill-amber-500/15" />
      <title>Sign ${s} (${RASHIS[s - 1].name}) • House ${houseFromAsc}${isD1 && rotBhava !== 1 ? ` (Natal H${natalBhavaOfSign})` : ''}&#10;Left-click: Inspect significations&#10;Right-click: Rotate chart from this Bhava</title>
      <text x="${x + 6}" y="${y + 14}" class="${isPrint ? 'font-sans text-[8px] fill-slate-500 font-bold' : 'font-sans text-[9px] fill-slate-400 font-semibold group-hover:fill-amber-300'}">
        ${RASHIS[s - 1].sanskrit.slice(0, 4)} <tspan class="text-[8px] text-amber-500/70">H${houseFromAsc}</tspan>
      </text>
      ${isLagna ? `<line x1="${x + cellSize - 18}" y1="${y}" x2="${x + cellSize}" y2="${y + 18}" stroke="#EA580C" stroke-width="2.5" />` : ''}
      ${isNatalLagna ? `<line x1="${x}" y1="${y + 18}" x2="${x + 18}" y2="${y}" stroke="#3B82F6" stroke-width="2" stroke-dasharray="2 2" />` : ''}
      <text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 4}" text-anchor="middle" class="${isPrint ? 'font-sans text-[9px] fill-slate-900 font-bold' : 'chart-planet-tag fill-amber-200 pointer-events-none'}">
        ${planetsInSign.join(" ")}
      </text>
    </g>`;
  }

  svgHtml += `</svg>`;
  container.innerHTML = svgHtml;
}

// East Indian (Bengali / Odia) Chart Renderer
function renderEastIndianChart(vargaKey, bodiesMap, containerId, isPrint = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isD1 = vargaKey === "D1" && containerId === "chartD1Container" && !isPrint;
  const rotBhava = isD1 ? d1RotatedBhava : 1;
  const ascSign = bodiesMap.Lagna ? bodiesMap.Lagna.sign : 1;
  const effectiveAscSign = rotBhava === 1 ? ascSign : (((ascSign - 1 + (rotBhava - 1)) % 12) + 1);

  const size = isPrint ? 280 : 380;
  const strokeClass = isPrint ? "print-chart-line" : "chart-line";
  const boxClass = isPrint ? "print-chart-box" : "chart-box";

  const signBodies = {};
  for (let s = 1; s <= 12; s++) signBodies[s] = [];

  Object.entries(bodiesMap).forEach(([name, b]) => {
    if (signBodies[b.sign]) {
      if (name === "Lagna") {
        if (isD1 && rotBhava !== 1) {
          signBodies[b.sign].push("NLg");
        } else {
          signBodies[b.sign].push("Lg");
        }
      } else {
        signBodies[b.sign].push(name.slice(0, 2) + (b.isRetrograde ? "ᴿ" : ""));
      }
    }
  });
  if (isD1 && rotBhava !== 1) {
    signBodies[effectiveAscSign].unshift("Lg");
  }

  const scale = size / 380;
  const s = (v) => v * scale;

  const signCenters = {
    1: { numX: s(190), numY: s(75), textX: s(190), textY: s(105) },
    2: { numX: s(110), numY: s(35), textX: s(95), textY: s(60) },
    3: { numX: s(40), numY: s(95), textX: s(45), textY: s(125) },
    4: { numX: s(75), numY: s(190), textX: s(105), textY: s(195) },
    5: { numX: s(40), numY: s(285), textX: s(45), textY: s(255) },
    6: { numX: s(110), numY: s(350), textX: s(95), textY: s(325) },
    7: { numX: s(190), numY: s(310), textX: s(190), textY: s(275) },
    8: { numX: s(275), numY: s(350), textX: s(285), textY: s(325) },
    9: { numX: s(340), numY: s(285), textX: s(335), textY: s(255) },
    10: { numX: s(310), numY: s(190), textX: s(275), textY: s(195) },
    11: { numX: s(340), numY: s(95), textX: s(335), textY: s(125) },
    12: { numX: s(275), numY: s(35), textX: s(285), textY: s(60) }
  };

  const signPolygons = {
    1: `${s(190)},${s(0)} ${s(285)},${s(95)} ${s(190)},${s(190)} ${s(95)},${s(95)}`,
    2: `${s(0)},${s(0)} ${s(190)},${s(0)} ${s(95)},${s(95)}`,
    3: `${s(0)},${s(0)} ${s(95)},${s(95)} ${s(0)},${s(190)}`,
    4: `${s(0)},${s(190)} ${s(95)},${s(95)} ${s(190)},${s(190)} ${s(95)},${s(285)}`,
    5: `${s(0)},${s(190)} ${s(95)},${s(285)} ${s(0)},${s(380)}`,
    6: `${s(0)},${s(380)} ${s(95)},${s(285)} ${s(190)},${s(380)}`,
    7: `${s(190)},${s(190)} ${s(285)},${s(285)} ${s(190)},${s(380)} ${s(95)},${s(285)}`,
    8: `${s(190)},${s(380)} ${s(285)},${s(285)} ${s(380)},${s(380)}`,
    9: `${s(380)},${s(190)} ${s(285)},${s(285)} ${s(380)},${s(380)}`,
    10: `${s(190)},${s(190)} ${s(285)},${s(95)} ${s(380)},${s(190)} ${s(285)},${s(285)}`,
    11: `${s(380)},${s(0)} ${s(285)},${s(95)} ${s(380)},${s(190)}`,
    12: `${s(190)},${s(0)} ${s(380)},${s(0)} ${s(285)},${s(95)}`
  };

  let svgHtml = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="select-none filter drop-shadow-md">
    <rect x="2" y="2" width="${size - 4}" height="${size - 4}" class="${boxClass} ${strokeClass}" />
    <line x1="2" y1="2" x2="${size - 2}" y2="${size - 2}" class="${strokeClass}" />
    <line x1="${size - 2}" y1="2" x2="2" y2="${size - 2}" class="${strokeClass}" />
    <polygon points="${size / 2},2 ${size - 2},${size / 2} ${size / 2},${size - 2} 2,${size / 2}" fill="none" class="${strokeClass}" />
  `;

  for (let sNum = 1; sNum <= 12; sNum++) {
    const planetsInSign = signBodies[sNum] || [];
    const pos = signCenters[sNum];
    const poly = signPolygons[sNum];
    const houseFromAsc = ((sNum - effectiveAscSign + 12) % 12) + 1;
    const isLagnaSign = (sNum === effectiveAscSign);
    const natalBhavaOfSign = ((sNum - ascSign + 12) % 12) + 1;

    svgHtml += `
    <g class="cursor-pointer group" 
       onclick="window.openHouseInspectorBySign(${sNum})"
       oncontextmenu="window.handleChartRightClick(event, ${isD1 ? natalBhavaOfSign : houseFromAsc}, '${vargaKey}', '${containerId}'); return false;">
      <polygon points="${poly}" fill="${isLagnaSign ? (isPrint ? 'rgba(234, 88, 12, 0.08)' : 'rgba(234, 88, 12, 0.12)') : 'transparent'}" class="transition-colors duration-150 group-hover:fill-amber-500/15" />
      <title>East Indian (Fixed Sign ${sNum}: ${RASHIS[sNum - 1].name}) • House ${houseFromAsc}${isLagnaSign ? ' [Lagna]' : ''}&#10;Left-click: Inspect significations&#10;Right-click: Rotate chart</title>
      <text x="${pos.numX}" y="${pos.numY}" text-anchor="middle" class="${isPrint ? 'font-serif text-[10px] fill-slate-700 font-bold' : 'chart-sign-num pointer-events-none group-hover:fill-amber-300'}">
        ${RASHIS[sNum - 1].short} <tspan class="text-[9px] ${isLagnaSign ? 'fill-orange-400 font-bold' : 'fill-slate-400'}">H${houseFromAsc}</tspan>
      </text>
      <text x="${pos.textX}" y="${pos.textY}" text-anchor="middle" class="${isPrint ? 'font-sans text-[9px] fill-slate-900 font-bold' : 'chart-planet-tag fill-amber-200 pointer-events-none'}">
        ${planetsInSign.join(" ")}
      </text>
    </g>`;
  }

  svgHtml += `</svg>`;
  container.innerHTML = svgHtml;
}

// Unified Chart Render Dispatcher
function renderChart(vargaKey, containerId, isPrint = false) {
  if (!currentChartData) return;
  const vargaData = (currentChartData.vargas && currentChartData.vargas[vargaKey]) ? currentChartData.vargas[vargaKey] : (currentChartData.vargas ? currentChartData.vargas.D1 : null);
  if (!vargaData) return;

  if (currentChartStyle === "north") {
    renderNorthIndianChart(vargaKey, vargaData, containerId, isPrint);
  } else if (currentChartStyle === "south") {
    renderSouthIndianChart(vargaKey, vargaData, containerId, isPrint);
  } else if (currentChartStyle === "east") {
    renderEastIndianChart(vargaKey, vargaData, containerId, isPrint);
  }
}

// Render All 16 Vargas Grid (Sarvavarga Multi-Grid)
function renderAllVargasGrid() {
  const container = document.getElementById("allVargasGridContainer");
  if (!container || !currentChartData || !currentChartData.vargas) return;
  container.innerHTML = "";

  const shodashaKeys = ["D1", "D2", "D3", "D4", "D7", "D9", "D10", "D12", "D16", "D20", "D24", "D27", "D30", "D40", "D45", "D60"];

  shodashaKeys.forEach(vk => {
    const meta = VARGA_METADATA[vk] || { name: vk, desc: "" };
    const card = document.createElement("div");
    card.className = "bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3 flex flex-col items-center transition shadow";
    const chartDivId = `multiChart_${vk}`;

    card.innerHTML = `
      <div class="flex items-center justify-between w-full mb-1.5 pb-1 border-b border-slate-800 text-xs">
        <strong class="text-amber-300 font-cinzel">${vk} ${meta.name}</strong>
        <span class="text-[10px] text-slate-500 font-mono">1/${meta.num}</span>
      </div>
      <div id="${chartDivId}" class="w-full aspect-square flex items-center justify-center"></div>
      <p class="text-[10px] text-slate-400 mt-1.5 text-center truncate w-full" title="${meta.desc}">${meta.desc}</p>
    `;
    container.appendChild(card);

    // Render individual chart into grid card
    setTimeout(() => {
      renderChart(vk, chartDivId, true);
    }, 10);
  });
}
