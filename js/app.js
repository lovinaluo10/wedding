const GAS_URL = "https://script.google.com/macros/s/AKfycbyCgM_7WW2A4M7mNa2XHMFpekPX4UGNvdkGYwyc7E_UPacInQ8dVTg0wfsUtT3uEu-Ygw/exec";

const MONTHS = [
  {
    y: 2026,
    m: 11,
    en: "November 2026",
    caption: "2026 年 11 月 · 立冬",
    note: "日曆停在立冬這一天。",
    startDow: 0,
    days: 30,
    marked: 11,
  },
  {
    y: 2026,
    m: 12,
    en: "December 2026",
    caption: "2026 年 12 月",
    note: "歲末將至，再翻一頁看看。",
    startDow: 2,
    days: 31,
    marked: null,
  },
  {
    y: 2027,
    m: 1,
    en: "January 2027",
    caption: "2027 年 1 月",
    note: "新歲悄悄展開。",
    startDow: 5,
    days: 31,
    marked: null,
  },
  {
    y: 2027,
    m: 2,
    en: "February 2027",
    caption: "2027 年 2 月 21 日",
    note: "❤️ 喜宴・結婚紀念日",
    startDow: 1,
    days: 28,
    marked: 21,
    target: true,
  },
];

const PHOTOS = [
  { src: "images/photo1.jpg", caption: "相依" },
  { src: "images/photo2.jpg", caption: "相望" },
  { src: "images/photo3.jpg", caption: "同行" },
];

const state = {
  stage: "welcome",
  calIndex: 0,
  pin: "",
  photoIndex: 0,
  inspectModal: "",
  inspectDetail: "",
};

const $ = (id) => document.getElementById(id);

function goToStage(name) {
  state.stage = name;
  document.querySelectorAll(".stage").forEach((el) => {
    const on = el.dataset.stage === name;
    el.classList.toggle("is-active", on);
    el.hidden = !on;
  });
  const skip = $("skip-btn");
  if (skip) {
    const showSkip = name === "welcome" || name === "greeting" || name === "room";
    skip.hidden = !showSkip;
  }
  closeModal();
  closeInspect();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetInspectCopy() {
  state.inspectModal = "";
  state.inspectDetail = "";
  const detail = $("inspect-detail");
  if (detail) {
    detail.hidden = true;
    detail.textContent = "";
  }
  const openBtn = $("inspect-open");
  if (openBtn) openBtn.textContent = "仔細查看";
}

function openInspect(btn) {
  const stage = $("inspect-stage");
  const prop = btn.querySelector(".prop");
  stage.replaceChildren(prop.cloneNode(true));
  $("inspect-title").textContent = btn.dataset.title || "";
  $("inspect-hint").textContent = btn.dataset.hint || "";
  state.inspectModal = btn.dataset.modal || "";
  state.inspectDetail = btn.dataset.detail || "";
  $("inspect-detail").hidden = true;
  $("inspect-detail").textContent = "";
  $("inspect-open").textContent = "仔細查看";
  $("inspect").hidden = false;
}

function closeInspect() {
  const panel = $("inspect");
  if (!panel || panel.hidden) return;
  panel.hidden = true;
  $("inspect-stage").replaceChildren();
  resetInspectCopy();
}

function openModal(id) {
  const root = $("modal-root");
  root.hidden = false;
  root.classList.add("is-open");
  root.querySelectorAll(".modal").forEach((m) => {
    m.hidden = m.id !== `modal-${id}`;
  });
  if (id === "calendar") renderCalendar();
  if (id === "gallery") renderPhoto();
}

function closeModal() {
  const root = $("modal-root");
  root.hidden = true;
  root.classList.remove("is-open");
}

function renderCalendar() {
  const page = MONTHS[state.calIndex];
  $("cal-caption").textContent = page.caption;
  $("cal-month-en").textContent = page.en;
  $("cal-note").textContent = page.note;
  $("cal-prev").disabled = state.calIndex === 0;
  $("cal-next").disabled = state.calIndex === MONTHS.length - 1;

  const grid = $("cal-grid");
  const dows = ["日", "一", "二", "三", "四", "五", "六"];
  let html = dows.map((d) => `<span class="dow">${d}</span>`).join("");
  for (let i = 0; i < page.startDow; i += 1) html += "<span></span>";
  for (let d = 1; d <= page.days; d += 1) {
    const circled = page.target && d === 21;
    const marked = page.marked === d;
    const cls = ["day", circled ? "circled" : "", marked ? "marked" : ""]
      .filter(Boolean)
      .join(" ");
    html += `<span class="${cls}">${d}</span>`;
  }
  grid.innerHTML = html;

  const hint = $("cal-hint");
  hint.hidden = !page.target;
}

function renderPhoto() {
  const photo = PHOTOS[state.photoIndex];
  const img = $("gallery-photo");
  img.src = photo.src;
  img.alt = `新人合照 ${state.photoIndex + 1}`;
  $("gallery-caption").textContent = photo.caption;
  img.onerror = () => {
    img.onerror = null;
    img.alt = "請將真實合照放到 images/photo1.jpg、photo2.jpg、photo3.jpg";
    img.src =
      "data:image/svg+xml," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'><rect fill='#cbb48a' width='400' height='500'/><text x='50%' y='48%' text-anchor='middle' fill='#8B0000' font-size='28' font-family='serif'>${photo.caption}</text><text x='50%' y='56%' text-anchor='middle' fill='#5a3a1c' font-size='14'>images/photo${state.photoIndex + 1}.jpg</text></svg>`
      );
  };
}

function playUnlockSound() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  const ctx = new Ctx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "square";
  osc.frequency.value = 180;
  gain.gain.value = 0.05;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.18);
  osc.stop(ctx.currentTime + 0.22);
}

function updateSafeDisplay() {
  const shown = (state.pin + "--------").slice(0, 8);
  $("safe-display").textContent = shown.replace(/./g, (ch, i) =>
    i < state.pin.length ? ch : "-"
  );
}

function tryUnlock() {
  const ok = state.pin === "0221" || state.pin === "20270221";
  const err = $("safe-error");
  const hintBtn = $("safe-hint-btn");
  if (!ok) {
    err.hidden = false;
    hintBtn.hidden = false;
    $("safe-display").animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
      { duration: 280 }
    );
    return;
  }
  err.hidden = true;
  hintBtn.hidden = true;
  $("safe-unlock").hidden = false;
  playUnlockSound();
  setTimeout(() => goToStage("invite"), 900);
}

function bindKeyDrag() {
  const key = $("metal-key");
  const hole = $("keyhole");
  const plate = $("lock-plate");
  let dragging = false;
  let start = { x: 0, y: 0 };
  let origin = { x: 0, y: 0 };

  const place = (x, y) => {
    key.style.position = "fixed";
    key.style.left = `${x}px`;
    key.style.top = `${y}px`;
    key.style.transform = "translate(-50%, -50%)";
  };

  const reset = () => {
    key.style.position = "";
    key.style.left = "";
    key.style.top = "";
    key.style.transform = "";
    key.classList.remove("is-dragging");
    plate.classList.remove("is-target");
  };

  const overLock = (x, y) => {
    const r = hole.getBoundingClientRect();
    return x > r.left - 24 && x < r.right + 24 && y > r.top - 24 && y < r.bottom + 24;
  };

  const onDown = (e) => {
    const pt = "touches" in e ? e.touches[0] : e;
    dragging = true;
    key.classList.add("is-dragging");
    if (e.pointerId != null && key.setPointerCapture) {
      key.setPointerCapture(e.pointerId);
    }
    start = { x: pt.clientX, y: pt.clientY };
    const rect = key.getBoundingClientRect();
    origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    place(origin.x, origin.y);
  };

  const onMove = (e) => {
    if (!dragging) return;
    const pt = "touches" in e ? e.touches[0] : e;
    if ("touches" in e) e.preventDefault();
    place(origin.x + (pt.clientX - start.x), origin.y + (pt.clientY - start.y));
    plate.classList.toggle("is-target", overLock(pt.clientX, pt.clientY));
  };

  const onUp = (e) => {
    if (!dragging) return;
    dragging = false;
    const pt = "changedTouches" in e ? e.changedTouches[0] : e;
    if (overLock(pt.clientX, pt.clientY)) {
      $("gate-scene").classList.add("is-open");
      setTimeout(() => goToStage("greeting"), 1150);
    }
    reset();
  };

  key.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
}

function googleCalendarUrl() {
  const text = encodeURIComponent("圓山喜宴 · 觀禮與喜宴");
  const details = encodeURIComponent(
    "11:00 觀禮證婚儀式\n12:00 圓山大廳 貴賓尊榮大合影\n12:30 喜宴盛大開席"
  );
  const location = encodeURIComponent("台北圓山大飯店 崑崙廳（12樓）");
  // 台灣時間 2027/02/21 11:00–15:30 → UTC 03:00–07:30
  const dates = "20270221T030000Z/20270221T073000Z";
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`;
}

function collectForm() {
  const form = $("rsvp-form");
  const data = Object.fromEntries(new FormData(form).entries());
  data.submittedAt = new Date().toISOString();
  return data;
}

function normalizeForm(data) {
  const going = data.attendance === "準時赴約";
  const ceremonyYes = data.ceremony === "是，願意提早到場觀禮";
  const needPaper = data.paperInvite === "需要（請寄送實體喜帖）";

  if (!going) {
    data.ceremony = "N/A";
    data.ceremonyCount = "N/A";
    data.guestCount = "N/A";
    data.vegCount = "N/A";
    data.kidsChair = "N/A";
    data.paperInvite = "N/A";
    data.address = "N/A";
    return data;
  }

  if (!ceremonyYes) data.ceremonyCount = "N/A";
  if (!needPaper) data.address = "N/A";
  return data;
}

function validateForm(data) {
  if (!data.name || !String(data.name).trim()) return "請填寫貴賓姓名。";
  if (!data.phone || !String(data.phone).trim()) return "請填寫聯絡電話。";
  if (!data.attendance) return "請選擇是否出席喜宴。";
  if (data.attendance !== "準時赴約") return "";

  if (!data.ceremony) return "請選擇是否參與證婚儀式觀禮。";
  if (data.ceremony === "是，願意提早到場觀禮") {
    const count = Number(data.ceremonyCount);
    if (!Number.isFinite(count) || count < 1) return "請填寫證婚觀禮人數。";
  }
  if (!data.paperInvite) return "請選擇是否需要紙本喜帖。";
  if (data.paperInvite === "需要（請寄送實體喜帖）" && !String(data.address || "").trim()) {
    return "請填寫郵遞區號與寄送地址。";
  }
  return "";
}

async function submitRsvp(e) {
  e.preventDefault();
  const errBox = $("form-error");
  const btn = $("submit-btn");
  const raw = collectForm();
  const message = validateForm(raw);
  if (message) {
    errBox.hidden = false;
    errBox.textContent = message;
    return;
  }
  const formData = normalizeForm(raw);
  errBox.hidden = true;
  btn.disabled = true;
  btn.textContent = "傳送登記中...";

  const showVip = () => {
    const going = formData.attendance === "準時赴約";
    $("vip-attending").hidden = !going;
    $("vip-regret").hidden = going;
    if (going) {
      $("vip-name").textContent = formData.name;
      $("gcal-link").href = googleCalendarUrl();
    } else {
      $("vip-name-regret").textContent = formData.name;
    }
    goToStage("vip");
  };

  try {
    if (!GAS_URL || GAS_URL.includes("YOUR_GOOGLE_APPS_SCRIPT_URL")) {
      await new Promise((r) => setTimeout(r, 700));
      showVip();
      return;
    }
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("network");
    showVip();
  } catch (err) {
    errBox.hidden = false;
    errBox.textContent = "登記暫時無法送出，請稍後再試。";
    btn.disabled = false;
    btn.textContent = "送出賓客登記";
  }
}

function bindFormLogic() {
  const form = $("rsvp-form");
  const attending = $("attending-block");
  const ceremonyCount = $("ceremony-count-field");
  const address = $("address-field");
  const blessing = $("blessing-field");

  form.addEventListener("change", () => {
    const attendance = form.attendance.value;
    const going = attendance === "準時赴約";
    attending.hidden = !going;
    if (attendance === "遺憾無法出席") {
      ceremonyCount.hidden = true;
      address.hidden = true;
      blessing.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    const ceremonyYes = form.ceremony.value === "是，願意提早到場觀禮";
    ceremonyCount.hidden = !(going && ceremonyYes);
    const needPaper = form.paperInvite.value === "需要（請寄送實體喜帖）";
    address.hidden = !(going && needPaper);
  });

  form.addEventListener("submit", submitRsvp);
}

function init() {
  $("skip-btn").addEventListener("click", () => goToStage("invite"));
  $("enter-room-btn").addEventListener("click", () => goToStage("room"));
  bindKeyDrag();

  document.querySelectorAll(".hotspot").forEach((btn) => {
    btn.addEventListener("click", () => openInspect(btn));
  });
  $("inspect").addEventListener("click", (e) => {
    if (e.target.closest("[data-close-inspect]")) closeInspect();
  });
  $("inspect-open").addEventListener("click", () => {
    const detail = $("inspect-detail");
    if (state.inspectDetail && detail.hidden) {
      detail.textContent = state.inspectDetail;
      detail.hidden = false;
      $("inspect-open").textContent = "回到客房";
      return;
    }
    const id = state.inspectModal;
    closeInspect();
    if (id) openModal(id);
  });
  $("modal-root").addEventListener("click", (e) => {
    if (e.target.dataset.close) closeModal();
  });
  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.openModal));
  });

  $("cal-prev").addEventListener("click", () => {
    state.calIndex = Math.max(0, state.calIndex - 1);
    renderCalendar();
  });
  $("cal-next").addEventListener("click", () => {
    state.calIndex = Math.min(MONTHS.length - 1, state.calIndex + 1);
    renderCalendar();
  });

  $("keypad").addEventListener("click", (e) => {
    const key = e.target.dataset.key;
    if (!key) return;
    $("safe-unlock").hidden = true;
    if (key === "C") state.pin = "";
    else if (key === "OK") tryUnlock();
    else if (state.pin.length < 8) state.pin += key;
    updateSafeDisplay();
  });
  $("safe-hint-btn").addEventListener("click", () => openModal("calendar"));

  $("play-message").addEventListener("click", () => {
    $("phone-wave").hidden = false;
    $("phone-script").hidden = false;
  });

  $("photo-prev").addEventListener("click", () => {
    state.photoIndex = (state.photoIndex + PHOTOS.length - 1) % PHOTOS.length;
    renderPhoto();
  });
  $("photo-next").addEventListener("click", () => {
    state.photoIndex = (state.photoIndex + 1) % PHOTOS.length;
    renderPhoto();
  });

  bindFormLogic();
  updateSafeDisplay();
}

document.addEventListener("DOMContentLoaded", init);
