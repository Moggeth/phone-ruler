const PHONES = [
  { make: "Apple", model: "iPhone 17 Pro Max", diagonalIn: 6.86, resolution: [1320, 2868], source: "Apple technical specs" },
  { make: "Apple", model: "iPhone 17 Pro", diagonalIn: 6.27, resolution: [1206, 2622], source: "Apple technical specs" },
  { make: "Apple", model: "iPhone 17", diagonalIn: 6.27, resolution: [1206, 2622], source: "Apple technical specs" },
  { make: "Apple", model: "iPhone Air", diagonalIn: 6.55, resolution: [1260, 2736], source: "Apple technical specs" },
  { make: "Apple", model: "iPhone 16 Pro Max", diagonalIn: 6.9, resolution: [1320, 2868] },
  { make: "Apple", model: "iPhone 16 Pro", diagonalIn: 6.3, resolution: [1206, 2622] },
  { make: "Apple", model: "iPhone 16 Plus", diagonalIn: 6.7, resolution: [1290, 2796] },
  { make: "Apple", model: "iPhone 16", diagonalIn: 6.1, resolution: [1179, 2556] },
  { make: "Apple", model: "iPhone 15 Pro Max", diagonalIn: 6.7, resolution: [1290, 2796] },
  { make: "Apple", model: "iPhone 15 Pro", diagonalIn: 6.1, resolution: [1179, 2556] },
  { make: "Apple", model: "iPhone 15 Plus", diagonalIn: 6.7, resolution: [1290, 2796] },
  { make: "Apple", model: "iPhone 15", diagonalIn: 6.1, resolution: [1179, 2556] },
  { make: "Apple", model: "iPhone 14 Pro Max", diagonalIn: 6.7, resolution: [1290, 2796] },
  { make: "Apple", model: "iPhone 14 Pro", diagonalIn: 6.1, resolution: [1179, 2556] },
  { make: "Apple", model: "iPhone 14 Plus", diagonalIn: 6.7, resolution: [1284, 2778] },
  { make: "Apple", model: "iPhone 14", diagonalIn: 6.1, resolution: [1170, 2532] },
  { make: "Apple", model: "iPhone 13 Pro Max", diagonalIn: 6.7, resolution: [1284, 2778] },
  { make: "Apple", model: "iPhone 13 Pro", diagonalIn: 6.1, resolution: [1170, 2532] },
  { make: "Apple", model: "iPhone 13", diagonalIn: 6.1, resolution: [1170, 2532] },
  { make: "Apple", model: "iPhone 13 mini", diagonalIn: 5.4, resolution: [1080, 2340] },
  { make: "Samsung", model: "Galaxy S25 Ultra", diagonalIn: 6.9, resolution: [1440, 3120] },
  { make: "Samsung", model: "Galaxy S25+", diagonalIn: 6.7, resolution: [1440, 3120] },
  { make: "Samsung", model: "Galaxy S25", diagonalIn: 6.2, resolution: [1080, 2340] },
  { make: "Samsung", model: "Galaxy S24 Ultra", diagonalIn: 6.8, resolution: [1440, 3120] },
  { make: "Samsung", model: "Galaxy S24+", diagonalIn: 6.7, resolution: [1440, 3120] },
  { make: "Samsung", model: "Galaxy S24", diagonalIn: 6.2, resolution: [1080, 2340] },
  { make: "Google", model: "Pixel 10 Pro XL", diagonalIn: 6.8, resolution: [1344, 2992] },
  { make: "Google", model: "Pixel 10 Pro", diagonalIn: 6.3, resolution: [1280, 2856] },
  { make: "Google", model: "Pixel 10", diagonalIn: 6.3, resolution: [1080, 2424] },
  { make: "Google", model: "Pixel 9 Pro XL", diagonalIn: 6.8, resolution: [1344, 2992] },
  { make: "Google", model: "Pixel 9 Pro", diagonalIn: 6.3, resolution: [1280, 2856] },
  { make: "Google", model: "Pixel 9", diagonalIn: 6.3, resolution: [1080, 2424] }
];

const state = {
  unit: localStorage.getItem("unit") || "cm",
  zeroY: Number(localStorage.getItem("zeroY")) || 0.62,
  locked: localStorage.getItem("locked") === "true",
  make: localStorage.getItem("make") || "Apple",
  model: localStorage.getItem("model") || "iPhone 17 Pro",
  heightOverride: Number(localStorage.getItem("heightOverride")) || null,
  phoneQuery: ""
};

const els = {
  canvas: document.querySelector("#rulerCanvas"),
  ruler: document.querySelector("#ruler"),
  zeroMarker: document.querySelector("#zeroMarker"),
  phoneSettingsButton: document.querySelector("#phoneSettingsButton"),
  closeSettingsButton: document.querySelector("#closeSettingsButton"),
  settingsBackdrop: document.querySelector("#settingsBackdrop"),
  settingsSheet: document.querySelector("#settingsSheet"),
  selectedPhoneLabel: document.querySelector("#selectedPhoneLabel"),
  phoneSearchInput: document.querySelector("#phoneSearchInput"),
  phoneResults: document.querySelector("#phoneResults"),
  detectionStatus: document.querySelector("#detectionStatus"),
  topReadout: document.querySelector("#topReadout"),
  spanReadout: document.querySelector("#spanReadout"),
  calibrateButton: document.querySelector("#calibrateButton"),
  calibrationForm: document.querySelector("#calibrationForm"),
  heightOverride: document.querySelector("#heightOverride"),
  resetCalibration: document.querySelector("#resetCalibration"),
  lockButton: document.querySelector("#lockButton")
};

function displayHeightMm(phone) {
  const [widthPx, heightPx] = phone.resolution;
  const diagonalPx = Math.hypot(widthPx, heightPx);
  return (phone.diagonalIn * 25.4 * heightPx) / diagonalPx;
}

function currentPhone() {
  const phone = PHONES.find((item) => item.make === state.make && item.model === state.model) || PHONES[0];
  state.make = phone.make;
  state.model = phone.model;
  return phone;
}

function currentVisibleHeightMm() {
  if (state.heightOverride) {
    return state.heightOverride;
  }

  const screenCssHeight = Math.max(window.screen?.height || window.innerHeight, 1);
  const viewportCssHeight = Math.max(window.visualViewport?.height || window.innerHeight, 1);
  return displayHeightMm(currentPhone()) * (viewportCssHeight / screenCssHeight);
}

function pxPerUnit() {
  const rulerRect = els.ruler.getBoundingClientRect();
  const visibleMm = currentVisibleHeightMm() * (rulerRect.height / Math.max(window.visualViewport?.height || window.innerHeight, 1));
  const pxPerMm = rulerRect.height / visibleMm;
  return state.unit === "cm" ? pxPerMm * 10 : pxPerMm * 25.4;
}

function unitLabel() {
  return state.unit === "cm" ? "cm" : "in";
}

function formatMeasurement(value) {
  const precision = state.unit === "cm" ? 1 : 2;
  return `${value.toFixed(precision)} ${unitLabel()}`;
}

function phoneLabel(phone = currentPhone()) {
  return `${phone.make} ${phone.model}`;
}

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function matchingPhones() {
  const query = normalize(state.phoneQuery);
  if (!query) {
    return PHONES;
  }

  const parts = query.split(/\s+/);
  return PHONES.filter((phone) => {
    const haystack = normalize(phoneLabel(phone));
    return parts.every((part) => haystack.includes(part));
  });
}

function updateSelectedPhoneLabel() {
  els.selectedPhoneLabel.textContent = phoneLabel();
}

function renderPhoneResults() {
  const matches = matchingPhones().slice(0, 14);
  const selected = currentPhone();

  if (!matches.length) {
    els.phoneResults.replaceChildren(Object.assign(document.createElement("p"), {
      className: "empty-results",
      textContent: "No matching phones yet."
    }));
    return;
  }

  const buttons = matches.map((phone) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "phone-option";
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(phone.make === selected.make && phone.model === selected.model));
    button.innerHTML = `<strong>${phone.model}</strong><span>${phone.make}</span>`;
    button.addEventListener("click", () => selectPhone(phone));
    return button;
  });

  els.phoneResults.replaceChildren(...buttons);
}

function openSettings() {
  state.phoneQuery = "";
  els.phoneSearchInput.value = state.phoneQuery;
  renderPhoneResults();
  els.settingsBackdrop.hidden = false;
  els.settingsSheet.hidden = false;
  els.phoneSettingsButton.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => {
    els.phoneSearchInput.focus();
  });
}

function closeSettings() {
  els.settingsBackdrop.hidden = true;
  els.settingsSheet.hidden = true;
  els.phoneSettingsButton.setAttribute("aria-expanded", "false");
  els.phoneSettingsButton.focus();
  scheduleDraw();
}

function selectPhone(phone) {
  state.make = phone.make;
  state.model = phone.model;
  state.phoneQuery = phoneLabel(phone);
  els.phoneSearchInput.value = state.phoneQuery;
  updateSelectedPhoneLabel();
  renderPhoneResults();
  persist();
  scheduleDraw();
}

function persist() {
  localStorage.setItem("unit", state.unit);
  localStorage.setItem("zeroY", String(state.zeroY));
  localStorage.setItem("locked", String(state.locked));
  localStorage.setItem("make", state.make);
  localStorage.setItem("model", state.model);
  if (state.heightOverride) {
    localStorage.setItem("heightOverride", String(state.heightOverride));
  } else {
    localStorage.removeItem("heightOverride");
  }
}

function setStatus(text, className = "warn") {
  els.detectionStatus.textContent = text;
  els.detectionStatus.className = `status-dot ${className}`;
}

async function detectDevice() {
  const ua = navigator.userAgent;
  if (/iPhone/i.test(ua)) {
    state.make = state.make || "Apple";
    setStatus("iPhone detected; choose exact model", "warn");
    updateSelectedPhoneLabel();
    renderPhoneResults();
    persist();
    scheduleDraw();
    return;
  }

  const uaData = navigator.userAgentData;
  if (uaData?.getHighEntropyValues) {
    try {
      const data = await uaData.getHighEntropyValues(["model", "platform"]);
      const match = PHONES.find((phone) => data.model && phone.model.toLowerCase().includes(data.model.toLowerCase()));
      if (match) {
        state.make = match.make;
        state.model = match.model;
        setStatus(`Detected ${match.model}`, "good");
        updateSelectedPhoneLabel();
        renderPhoneResults();
        persist();
        scheduleDraw();
        return;
      }
    } catch {
      setStatus("Choose model to calibrate", "warn");
      return;
    }
  }

  setStatus("Choose model to calibrate", "warn");
}

function drawTicks(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#101214";
  ctx.fillRect(0, 0, width, height);

  const scale = window.devicePixelRatio || 1;
  const zeroY = state.zeroY * height;
  const minorStep = pxPerUnit() / 10 * scale;
  const labelStep = pxPerUnit() * scale;
  const maxOffset = Math.ceil(Math.max(zeroY, height - zeroY) / minorStep) * minorStep;

  ctx.strokeStyle = "#f7fafc";
  ctx.fillStyle = "#f7fafc";
  ctx.lineCap = "butt";
  ctx.textBaseline = "middle";

  for (let offset = -maxOffset; offset <= maxOffset; offset += minorStep) {
    const y = zeroY + offset;
    if (y < -2 || y > height + 2) continue;

    const minorIndex = Math.round(offset / minorStep);
    const isMajor = minorIndex % 10 === 0;
    const isHalf = minorIndex % 5 === 0;
    const length = isMajor ? width : isHalf ? Math.min(140 * scale, width * 0.23) : Math.min(74 * scale, width * 0.13);
    ctx.lineWidth = isMajor ? 3 * scale : 1.5 * scale;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(length, y);
    ctx.moveTo(width - length, y);
    ctx.lineTo(width, y);
    ctx.stroke();

    if (isMajor && Math.abs(offset) > minorStep) {
      const value = Math.abs(Math.round(offset / labelStep));
      ctx.globalAlpha = 1;
      ctx.font = `700 ${Math.round(18 * scale)}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillText(String(value), width / 2 + 24 * scale, y);
      ctx.beginPath();
      ctx.moveTo(width / 2 - 16 * scale, y);
      ctx.lineTo(width / 2 + 10 * scale, y);
      ctx.stroke();
    } else if (isHalf && Math.abs(offset) > labelStep * 0.75) {
      const value = Math.abs(offset / labelStep);
      ctx.globalAlpha = 0.7;
      ctx.font = `650 ${Math.round(12 * scale)}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillText(value.toFixed(1), width / 2 + 24 * scale, y);
      ctx.globalAlpha = 1;
    } else if (!isMajor && minorIndex % 2 === 0) {
      ctx.beginPath();
      ctx.moveTo(width / 2 - 10 * scale, y);
      ctx.lineTo(width / 2 + 10 * scale, y);
      ctx.stroke();
    }
  }
}

function updateReadouts() {
  const rect = els.ruler.getBoundingClientRect();
  const unitsPerPx = 1 / pxPerUnit();
  const zeroYPx = rect.height * state.zeroY;
  const topDistance = zeroYPx * unitsPerPx;
  const span = rect.height * unitsPerPx;
  els.topReadout.value = `${formatMeasurement(topDistance)} at top`;
  els.spanReadout.value = formatMeasurement(span);
  els.zeroMarker.setAttribute("aria-valuenow", "0");
  els.heightOverride.value = state.heightOverride ? state.heightOverride.toFixed(1) : currentVisibleHeightMm().toFixed(1);
}

let pendingDraw = 0;

function scheduleDraw() {
  cancelAnimationFrame(pendingDraw);
  pendingDraw = requestAnimationFrame(draw);
}

function draw() {
  const rect = els.ruler.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) {
    scheduleDraw();
    return;
  }

  const scale = window.devicePixelRatio || 1;
  els.canvas.width = Math.max(1, Math.round(rect.width * scale));
  els.canvas.height = Math.max(1, Math.round(rect.height * scale));
  els.canvas.style.width = `${rect.width}px`;
  els.canvas.style.height = `${rect.height}px`;
  els.ruler.style.setProperty("--zero-y", `${state.zeroY * 100}%`);
  els.zeroMarker.classList.toggle("locked", state.locked);
  els.lockButton.setAttribute("aria-pressed", String(state.locked));

  const ctx = els.canvas.getContext("2d");
  drawTicks(ctx, els.canvas.width, els.canvas.height);
  updateReadouts();
}

function bindEvents() {
  document.querySelectorAll(".unit-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.unit === state.unit);
    button.addEventListener("click", () => {
      state.unit = button.dataset.unit;
      document.querySelectorAll(".unit-button").forEach((item) => item.classList.toggle("active", item === button));
      persist();
      scheduleDraw();
    });
  });

  els.phoneSettingsButton.addEventListener("click", openSettings);
  els.closeSettingsButton.addEventListener("click", closeSettings);
  els.settingsBackdrop.addEventListener("click", closeSettings);
  els.phoneSearchInput.addEventListener("input", () => {
    state.phoneQuery = els.phoneSearchInput.value;
    renderPhoneResults();
  });
  els.phoneSearchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const first = matchingPhones()[0];
      if (first) {
        selectPhone(first);
        closeSettings();
      }
    } else if (event.key === "Escape") {
      closeSettings();
    }
  });

  let dragging = false;
  const moveZero = (clientY) => {
    if (state.locked) return;
    const rect = els.ruler.getBoundingClientRect();
    state.zeroY = Math.min(0.98, Math.max(0.02, (clientY - rect.top) / rect.height));
    persist();
    scheduleDraw();
  };

  els.zeroMarker.addEventListener("pointerdown", (event) => {
    if (state.locked) return;
    dragging = true;
    els.zeroMarker.setPointerCapture(event.pointerId);
    moveZero(event.clientY);
  });

  els.zeroMarker.addEventListener("pointermove", (event) => {
    if (dragging) moveZero(event.clientY);
  });

  els.zeroMarker.addEventListener("pointerup", () => {
    dragging = false;
  });

  els.zeroMarker.addEventListener("keydown", (event) => {
    if (state.locked) return;
    const delta = event.key === "ArrowDown" ? 0.01 : event.key === "ArrowUp" ? -0.01 : 0;
    if (delta) {
      event.preventDefault();
      state.zeroY = Math.min(0.98, Math.max(0.02, state.zeroY + delta));
      persist();
      scheduleDraw();
    }
  });

  els.lockButton.addEventListener("click", () => {
    state.locked = !state.locked;
    persist();
    scheduleDraw();
  });

  els.calibrateButton.addEventListener("click", () => {
    const isHidden = els.calibrationForm.hidden;
    els.calibrationForm.hidden = !isHidden;
    els.calibrateButton.setAttribute("aria-expanded", String(isHidden));
    if (isHidden) els.heightOverride.focus();
    scheduleDraw();
  });

  els.calibrationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = Number(els.heightOverride.value);
    if (Number.isFinite(value) && value >= 40 && value <= 260) {
      state.heightOverride = value;
      persist();
      scheduleDraw();
    }
  });

  els.resetCalibration.addEventListener("click", () => {
    state.heightOverride = null;
    persist();
    scheduleDraw();
  });

  window.addEventListener("resize", scheduleDraw);
  window.visualViewport?.addEventListener("resize", scheduleDraw);
  document.addEventListener("visibilitychange", scheduleDraw);
}

updateSelectedPhoneLabel();
renderPhoneResults();
bindEvents();
detectDevice();
scheduleDraw();
