// ==========================================================================
// INDUS KUNDLI APP — AUTHENTICATION, VAULT & MASTER ADMIN (auth_vault.js)
// ==========================================================================

const INDUS_STORAGE_KEY = "indus_kundli_app_db_v1";

const DEFAULT_INDUS_DB = {
  users: [
    {
      id: "usr_admin",
      name: "Indus Master Admin",
      email: "admin@indusjyotish.in",
      password: "indusadmin2026",
      role: "admin",
      tier: "unlimited_3000",
      tierName: "Master Consultant (Unlimited)",
      maxCredits: 999999,
      savedKundlis: [],
      createdAt: new Date().toLocaleDateString()
    },
    {
      id: "usr_default",
      name: "Indus Seeker",
      email: "seeker@indusjyotish.in",
      password: "free",
      role: "user",
      tier: "free",
      tierName: "Free Plan (10 Kundlis Max)",
      maxCredits: 10,
      savedKundlis: [],
      createdAt: new Date().toLocaleDateString()
    }
  ],
  currentUserId: "usr_default"
};

class IndusAuthManager {
  constructor() {
    this.db = this.loadDB();
  }

  loadDB() {
    try {
      const raw = localStorage.getItem(INDUS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users) && parsed.users.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Using default Indus DB:", e);
    }
    this.saveDB(DEFAULT_INDUS_DB);
    return JSON.parse(JSON.stringify(DEFAULT_INDUS_DB));
  }

  saveDB(db = this.db) {
    try {
      localStorage.setItem(INDUS_STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error("Error saving Indus DB:", e);
    }
  }

  getCurrentUser() {
    const u = this.db.users.find(x => x.id === this.db.currentUserId);
    return u || this.db.users[0];
  }

  register(name, email, password) {
    const existing = this.db.users.find(x => x.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: "An account with this email already exists." };
    }
    const newUser = {
      id: "usr_" + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: "user",
      tier: "free",
      tierName: "Free Plan (10 Kundlis Max)",
      maxCredits: 10,
      savedKundlis: [],
      createdAt: new Date().toLocaleDateString()
    };
    this.db.users.push(newUser);
    this.db.currentUserId = newUser.id;
    this.saveDB();
    return { success: true, user: newUser };
  }

  login(email, password) {
    const u = this.db.users.find(x => x.email.toLowerCase() === email.toLowerCase().trim());
    if (!u || u.password !== password) {
      return { success: false, message: "Invalid email or password." };
    }
    this.db.currentUserId = u.id;
    this.saveDB();
    return { success: true, user: u };
  }

  adminLogin(passcode) {
    const clean = passcode.trim();
    if (clean === "indusadmin2026" || clean === "7788" || clean === "admin") {
      let admin = this.db.users.find(x => x.role === "admin");
      if (!admin) {
        admin = DEFAULT_INDUS_DB.users[0];
        this.db.users.unshift(admin);
      }
      this.db.currentUserId = admin.id;
      this.saveDB();
      return { success: true, user: admin };
    }
    return { success: false, message: "Invalid Master Admin Passcode / PIN." };
  }

  logout() {
    let defaultUser = this.db.users.find(x => x.id === "usr_default");
    if (!defaultUser) defaultUser = this.db.users[0];
    this.db.currentUserId = defaultUser.id;
    this.saveDB();
    return defaultUser;
  }

  saveKundli(kundliData) {
    const user = this.getCurrentUser();
    const count = user.savedKundlis.length;
    if (user.tier !== "unlimited_3000" && count >= user.maxCredits) {
      return {
        success: false,
        error: "limit_reached",
        count,
        max: user.maxCredits,
        tier: user.tier,
        tierName: user.tierName
      };
    }
    const newRecord = {
      id: "knd_" + Date.now(),
      ...kundliData,
      savedAt: new Date().toLocaleString()
    };
    user.savedKundlis.unshift(newRecord);
    this.saveDB();
    return {
      success: true,
      record: newRecord,
      count: user.savedKundlis.length,
      max: user.maxCredits
    };
  }

  deleteKundli(kundliId) {
    const user = this.getCurrentUser();
    const initialLen = user.savedKundlis.length;
    user.savedKundlis = user.savedKundlis.filter(k => k.id !== kundliId);
    this.saveDB();
    return user.savedKundlis.length < initialLen;
  }

  adminSetTier(userId, tierKey) {
    const u = this.db.users.find(x => x.id === userId);
    if (!u) return false;
    u.tier = tierKey;
    if (tierKey === "free") {
      u.maxCredits = 10;
      u.tierName = "Free Plan (10 Kundlis Max)";
    } else if (tierKey === "pro_500") {
      u.maxCredits = 100;
      u.tierName = "Astrologer Pro (100 Kundlis)";
    } else if (tierKey === "unlimited_3000") {
      u.maxCredits = 999999;
      u.tierName = "Master Consultant (Unlimited)";
    }
    this.saveDB();
    return true;
  }

  adminAddCredits(userId, amount) {
    const u = this.db.users.find(x => x.id === userId);
    if (!u) return false;
    u.maxCredits = (u.maxCredits || 10) + amount;
    this.saveDB();
    return true;
  }

  adminDeleteUser(userId) {
    if (userId === "usr_admin") return false;
    this.db.users = this.db.users.filter(x => x.id !== userId);
    if (this.db.currentUserId === userId) {
      this.db.currentUserId = this.db.users[0].id;
    }
    this.saveDB();
    return true;
  }

  exportBackup() {
    return JSON.stringify(this.db, null, 2);
  }

  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.users)) {
        this.db = parsed;
        this.saveDB();
        return true;
      }
    } catch (e) {
      console.error("Invalid import format:", e);
    }
    return false;
  }
}

const indusAuth = new IndusAuthManager();

function updateIndusAuthUI() {
  const user = indusAuth.getCurrentUser();
  const isAdmin = (user.role === "admin");
  const count = user.savedKundlis.length;
  const isUnlimited = (user.tier === "unlimited_3000" || user.maxCredits >= 999999);
  const limitStr = isUnlimited ? "Unlimited" : `${count}/${user.maxCredits}`;

  const headerAuthContainer = document.getElementById("headerAuthContainer");
  if (headerAuthContainer) {
    headerAuthContainer.innerHTML = `
      <button id="headerProfileBtn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-amber-300 transition shadow">
        <span class="w-2 h-2 rounded-full ${isAdmin ? 'bg-purple-400' : 'bg-emerald-400'}"></span>
        <span class="truncate max-w-[100px] sm:max-w-[130px]">${user.name}</span>
        <span class="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">${count}/10</span>
      </button>
    `;
    const btn = document.getElementById("headerProfileBtn");
    if (btn) btn.addEventListener("click", openSavedKundlisModal);
  }

  const headerAdminBtn = document.getElementById("headerAdminBtn");
  if (headerAdminBtn) {
    if (isAdmin) headerAdminBtn.classList.remove("hidden");
    else headerAdminBtn.classList.add("hidden");
  }

  const headerVaultCount = document.getElementById("headerVaultCount");
  if (headerVaultCount) headerVaultCount.textContent = limitStr;

  const savedCountBadge = document.getElementById("savedCountBadge");
  if (savedCountBadge) savedCountBadge.textContent = limitStr;

  const userTierName = document.getElementById("userTierName");
  if (userTierName) userTierName.textContent = isUnlimited ? "Unlimited VIP" : `${user.maxCredits || 10} Saved Kundlis`;

  const vaultUsageIndicator = document.getElementById("vaultUsageIndicator");
  if (vaultUsageIndicator) vaultUsageIndicator.textContent = `${count} of ${isUnlimited ? '∞' : user.maxCredits} Saved`;
}

function openSavedKundlisModal() {
  const modal = document.getElementById("savedKundlisModal");
  if (!modal) return;
  const searchInput = document.getElementById("savedKundliSearch");
  if (searchInput) searchInput.value = "";
  renderSavedKundlisList();
  modal.classList.remove("hidden");
}

function renderSavedKundlisList(filterText = "") {
  const user = indusAuth.getCurrentUser();
  const list = document.getElementById("savedKundlisList");
  if (!list) return;
  list.innerHTML = "";

  const query = filterText.toLowerCase().trim();
  const filtered = user.savedKundlis.filter(k => {
    if (!query) return true;
    return (
      (k.name && k.name.toLowerCase().includes(query)) ||
      (k.placeName && k.placeName.toLowerCase().includes(query)) ||
      (k.tag && k.tag.toLowerCase().includes(query)) ||
      (k.notes && k.notes.toLowerCase().includes(query))
    );
  });

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="text-center py-8 text-slate-400">
        <span class="text-3xl block mb-2">📁</span>
        <p class="font-semibold text-slate-300">No saved Kundlis found</p>
        <p class="text-[11px] text-slate-500 mt-1">Calculate a horoscope and click "Save This Kundli" to archive it here.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(k => {
    const card = document.createElement("div");
    card.className = "p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3";
    card.innerHTML = `
      <div class="space-y-0.5">
        <div class="flex items-center gap-2">
          <strong class="text-white text-sm font-cinzel">${k.name}</strong>
          <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">${k.tag || 'Personal'}</span>
          <span class="text-[10px] text-slate-500">${k.savedAt}</span>
        </div>
        <p class="text-slate-300 text-[11px]">
          📅 ${k.day || ''}/${k.month || ''}/${k.year || ''} • ⏰ ${String(k.hour || 0).padStart(2,'0')}:${String(k.minute || 0).padStart(2,'0')} • 📍 ${k.placeName || 'India'}
        </p>
        ${k.notes ? `<p class="text-[10px] text-slate-400 italic">"${k.notes}"</p>` : ''}
      </div>
      <div class="flex items-center gap-1.5 self-end sm:self-center">
        <button class="btn-load-kundli px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold flex items-center gap-1" data-id="${k.id}">
          <span>⚡</span> Load
        </button>
        <button class="btn-print-kundli px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold flex items-center gap-1" data-id="${k.id}">
          <span>🖨️</span> Print
        </button>
        <button class="btn-del-kundli px-2 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] transition" data-id="${k.id}">
          ✕
        </button>
      </div>
    `;
    list.appendChild(card);
  });

  list.querySelectorAll(".btn-load-kundli").forEach(btn => {
    btn.addEventListener("click", () => {
      const kid = btn.getAttribute("data-id");
      const kRec = user.savedKundlis.find(x => x.id === kid);
      if (kRec) {
        loadKundliRecord(kRec);
        document.getElementById("savedKundlisModal").classList.add("hidden");
        showToast(`Loaded Kundli for ${kRec.name}!`, "success");
      }
    });
  });

  list.querySelectorAll(".btn-print-kundli").forEach(btn => {
    btn.addEventListener("click", () => {
      const kid = btn.getAttribute("data-id");
      const kRec = user.savedKundlis.find(x => x.id === kid);
      if (kRec) {
        loadKundliRecord(kRec);
        document.getElementById("savedKundlisModal").classList.add("hidden");
        setTimeout(() => window.print(), 350);
      }
    });
  });

  list.querySelectorAll(".btn-del-kundli").forEach(btn => {
    btn.addEventListener("click", () => {
      const kid = btn.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this saved horoscope? This will free up 1 slot in your vault.")) {
        indusAuth.deleteKundli(kid);
        updateIndusAuthUI();
        renderSavedKundlisList(document.getElementById("savedKundliSearch") ? document.getElementById("savedKundliSearch").value : "");
        showToast("Horoscope removed from vault.", "info");
      }
    });
  });
}

function loadKundliRecord(kRec) {
  if (document.getElementById("nativeName")) document.getElementById("nativeName").value = kRec.name || "";
  if (document.getElementById("nativeGender")) document.getElementById("nativeGender").value = kRec.gender || "Male";
  if (document.getElementById("birthDate")) {
    const yStr = String(kRec.year || 1995).padStart(4, '0');
    const mStr = String(kRec.month || 10).padStart(2, '0');
    const dStr = String(kRec.day || 24).padStart(2, '0');
    document.getElementById("birthDate").value = `${yStr}-${mStr}-${dStr}`;
  }
  if (document.getElementById("birthTime")) {
    const hStr = String(kRec.hour || 14).padStart(2, '0');
    const minStr = String(kRec.minute || 30).padStart(2, '0');
    const sStr = String(kRec.second || 0).padStart(2, '0');
    document.getElementById("birthTime").value = `${hStr}:${minStr}:${sStr}`;
  }
  if (document.getElementById("customLat")) document.getElementById("customLat").value = kRec.lat || 28.4089;
  if (document.getElementById("customLon")) document.getElementById("customLon").value = kRec.lon || 77.3178;
  if (document.getElementById("customTZ")) document.getElementById("customTZ").value = kRec.tz || 5.5;
  if (document.getElementById("ayanamshaSelect")) {
    document.getElementById("ayanamshaSelect").value = kRec.ayanamshaType || "lahiri";
  }

  triggerCalculation();
}

function openSaveKundliPromptModal() {
  if (!currentChartData || !currentChartData.meta) {
    showToast("Please calculate a horoscope first before saving.", "error");
    return;
  }

  const user = indusAuth.getCurrentUser();
  const meta = currentChartData.meta;
  const isUnlimited = (user.tier === "unlimited_3000" || user.maxCredits >= 999999);
  const isAtLimit = (!isUnlimited && user.savedKundlis.length >= user.maxCredits);

  if (document.getElementById("savePromptName")) document.getElementById("savePromptName").textContent = meta.name;
  if (document.getElementById("savePromptDetails")) document.getElementById("savePromptDetails").textContent = `${meta.day}/${meta.month}/${meta.year} at ${meta.hour}:${meta.minute}`;
  if (document.getElementById("savePromptPlace")) document.getElementById("savePromptPlace").textContent = meta.placeName;

  const box = document.getElementById("saveLimitStatusBox");
  const confirmBtn = document.getElementById("confirmSaveBtn");

  if (isAtLimit) {
    box.className = "p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300";
    box.innerHTML = `
      ⚠️ <strong>Storage Limit Reached (${user.savedKundlis.length}/${user.maxCredits} Kundlis):</strong><br>
      You have reached the maximum storage capacity of ${user.maxCredits} saved horoscopes. To save a new horoscope, please delete an older one from your Saved Kundlis vault.
    `;
    confirmBtn.disabled = true;
    confirmBtn.className = "flex-1 bg-slate-800 text-slate-500 font-bold py-2 rounded-lg cursor-not-allowed";
  } else {
    const remaining = isUnlimited ? "Unlimited" : (user.maxCredits - user.savedKundlis.length);
    box.className = "p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300";
    box.innerHTML = `✓ Ready to archive. Remaining available slots: <strong>${remaining}</strong>`;
    confirmBtn.disabled = false;
    confirmBtn.className = "flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold py-2 rounded-lg transition shadow-md shadow-amber-500/20";
  }

  document.getElementById("saveKundliModal").classList.remove("hidden");
}

function openMasterAdminModal() {
  const user = indusAuth.getCurrentUser();
  if (user.role !== "admin") {
    const pin = prompt("Enter Master Admin Passcode / PIN:");
    if (!pin) return;
    const res = indusAuth.adminLogin(pin);
    if (!res.success) {
      showToast("Incorrect Master Admin Passcode.", "error");
      return;
    }
    updateIndusAuthUI();
    showToast("Master Admin privileges unlocked!", "success");
  }

  renderAdminDashboard();
  document.getElementById("masterAdminModal").classList.remove("hidden");
}

function renderAdminDashboard(filterText = "") {
  const db = indusAuth.db;
  const totalUsers = db.users.length;
  let totalKundlis = 0;
  let freeCount = 0;
  let proCount = 0;
  let unlimitedCount = 0;

  db.users.forEach(u => {
    totalKundlis += (u.savedKundlis || []).length;
    if (u.tier === "unlimited_3000") unlimitedCount++;
    else if (u.tier === "pro_500") proCount++;
    else freeCount++;
  });

  if (document.getElementById("adminStatUsers")) document.getElementById("adminStatUsers").textContent = totalUsers;
  if (document.getElementById("adminStatKundlis")) document.getElementById("adminStatKundlis").textContent = totalKundlis;
  if (document.getElementById("adminStatFree")) document.getElementById("adminStatFree").textContent = freeCount;
  if (document.getElementById("adminStatPro")) document.getElementById("adminStatPro").textContent = proCount;
  if (document.getElementById("adminStatUnlimited")) document.getElementById("adminStatUnlimited").textContent = unlimitedCount;

  const tbody = document.getElementById("adminUserTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const query = filterText.toLowerCase().trim();
  const filtered = db.users.filter(u => {
    if (!query) return true;
    return (
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.tier.toLowerCase().includes(query)
    );
  });

  filtered.forEach(u => {
    const isUnlimited = (u.tier === "unlimited_3000" || u.maxCredits >= 999999);
    const savedCount = (u.savedKundlis || []).length;
    const tierBadge = isUnlimited 
      ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">VIP Unlimited</span>`
      : u.tier === "pro_500"
      ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">Pro (100)</span>`
      : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">Free (10 Max)</span>`;

    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-800/40 transition";
    tr.innerHTML = `
      <td class="py-2 px-3 font-semibold text-white">
        <div class="flex items-center gap-1.5">
          <span>${u.name}</span>
          ${u.role === 'admin' ? '<span class="text-[9px] bg-purple-600 text-white px-1 rounded font-mono font-bold">ADMIN</span>' : ''}
        </div>
        <span class="text-[10px] text-slate-400 block">${u.email}</span>
      </td>
      <td class="py-2 px-3">${tierBadge}</td>
      <td class="py-2 px-3 font-mono font-bold text-amber-300">${savedCount}</td>
      <td class="py-2 px-3 font-mono text-slate-300">${isUnlimited ? '∞' : u.maxCredits}</td>
      <td class="py-2 px-3 text-right space-x-1 whitespace-nowrap">
        <button class="admin-set-pro px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold" data-id="${u.id}" title="Set 100 credits">
          Set 100
        </button>
        <button class="admin-set-vip px-2 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] font-bold" data-id="${u.id}" title="Set Unlimited">
          Set ∞
        </button>
        <button class="admin-set-free px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]" data-id="${u.id}" title="Reset to Free (10)">
          Free 10
        </button>
        <button class="admin-add-10 px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold" data-id="${u.id}" title="Add +10 credits">
          +10
        </button>
        ${u.role !== 'admin' ? `<button class="admin-del-user px-1.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px]" data-id="${u.id}">✕</button>` : ''}
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll(".admin-set-pro").forEach(b => {
    b.addEventListener("click", () => {
      indusAuth.adminSetTier(b.getAttribute("data-id"), "pro_500");
      renderAdminDashboard(document.getElementById("adminUserSearch") ? document.getElementById("adminUserSearch").value : "");
      updateIndusAuthUI();
      showToast("User upgraded to 100 credits!", "success");
    });
  });

  tbody.querySelectorAll(".admin-set-vip").forEach(b => {
    b.addEventListener("click", () => {
      indusAuth.adminSetTier(b.getAttribute("data-id"), "unlimited_3000");
      renderAdminDashboard(document.getElementById("adminUserSearch") ? document.getElementById("adminUserSearch").value : "");
      updateIndusAuthUI();
      showToast("User upgraded to Unlimited VIP credits!", "success");
    });
  });

  tbody.querySelectorAll(".admin-set-free").forEach(b => {
    b.addEventListener("click", () => {
      indusAuth.adminSetTier(b.getAttribute("data-id"), "free");
      renderAdminDashboard(document.getElementById("adminUserSearch") ? document.getElementById("adminUserSearch").value : "");
      updateIndusAuthUI();
      showToast("User set to Free Tier (10 credits).", "info");
    });
  });

  tbody.querySelectorAll(".admin-add-10").forEach(b => {
    b.addEventListener("click", () => {
      indusAuth.adminAddCredits(b.getAttribute("data-id"), 10);
      renderAdminDashboard(document.getElementById("adminUserSearch") ? document.getElementById("adminUserSearch").value : "");
      updateIndusAuthUI();
      showToast("+10 save credits added to user account!", "success");
    });
  });

  tbody.querySelectorAll(".admin-del-user").forEach(b => {
    b.addEventListener("click", () => {
      const uid = b.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this user and all their saved horoscopes?")) {
        indusAuth.adminDeleteUser(uid);
        renderAdminDashboard(document.getElementById("adminUserSearch") ? document.getElementById("adminUserSearch").value : "");
        updateIndusAuthUI();
        showToast("User account deleted.", "info");
      }
    });
  });
}
