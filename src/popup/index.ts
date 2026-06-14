import { detectPlatform, platforms } from "../shared/platforms";
import { PopupState } from "../shared/types";

const detectedSection = document.getElementById("detected-section")!;
const platformBadge = document.getElementById("platform-badge")!;
const urlInput = document.getElementById("url-input") as HTMLInputElement;
const downloadBtn = document.getElementById("download-btn") as HTMLButtonElement;
const cancelBtn = document.getElementById("cancel-btn") as HTMLButtonElement;
const statusEl = document.getElementById("status")!;
const tipText = document.getElementById("tip-text")!;
const versionEl = document.getElementById("version")!;

let countdownTimer: ReturnType<typeof setTimeout> | null = null;
let currentUrl = "";
let countdownSeconds = 3;

const manifest = chrome.runtime.getManifest();
versionEl.textContent = `v${manifest.version}`;

async function init() {
  try {
    const text = await navigator.clipboard.readText();
    const trimmed = text.trim();
    if (trimmed && isValidUrl(trimmed)) {
      handleDetectedUrl(trimmed);
      return;
    }
  } catch {
    // Clipboard permission denied or empty
  }
  setState("idle");
}

function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

function handleDetectedUrl(url: string) {
  const platform = detectPlatform(url);
  if (!platform) {
    setState("error");
    statusEl.textContent = "Unsupported platform. Paste URL manually below.";
    urlInput.value = url;
    return;
  }

  currentUrl = url;
  detectedSection.classList.remove("hidden");
  platformBadge.textContent = platform.name;
  platformBadge.style.backgroundColor = platform.color;
  urlInput.value = url;

  startCountdown(platform);
}

function startCountdown(platform: ReturnType<typeof detectPlatform>) {
  if (!platform) return;
  countdownSeconds = 3;
  setState("loading");
  updateCountdownStatus();

  countdownTimer = setInterval(() => {
    countdownSeconds--;
    if (countdownSeconds <= 0) {
      clearInterval(countdownTimer!);
      triggerDownload();
    } else {
      updateCountdownStatus();
    }
  }, 1000);
}

function updateCountdownStatus() {
  statusEl.textContent = `Opening in ${countdownSeconds}s...`;
  cancelBtn.classList.remove("hidden");
}

function setState(state: PopupState) {
  statusEl.className = "status";
  if (state === "idle") {
    tipText.textContent = "Paste a video link to get started";
    statusEl.textContent = "";
    downloadBtn.disabled = true;
  } else if (state === "detected" || state === "loading") {
    tipText.textContent = "";
    downloadBtn.disabled = false;
  } else if (state === "error") {
    tipText.textContent = "";
    statusEl.classList.add("error");
    downloadBtn.disabled = false;
  }
}

async function triggerDownload() {
  const url = urlInput.value.trim() || currentUrl;
  if (!url || !isValidUrl(url)) {
    statusEl.textContent = "Please enter a valid URL";
    statusEl.classList.add("error");
    return;
  }

  const platform = detectPlatform(url);
  if (!platform) {
    statusEl.textContent = "Unsupported platform";
    statusEl.classList.add("error");
    return;
  }

  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  statusEl.textContent = `Opening ${platform.name} downloader...`;
  statusEl.className = "status";

  await chrome.storage.local.set({ downloadUrl: url, platformId: platform.id });

  chrome.tabs.create({ url: platform.targetUrl });

  window.close();
}

downloadBtn.addEventListener("click", triggerDownload);

cancelBtn.addEventListener("click", () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  cancelBtn.classList.add("hidden");
  statusEl.textContent = "Auto-trigger cancelled. Click Download to proceed.";
  setState("detected");
});

urlInput.addEventListener("input", () => {
  const url = urlInput.value.trim();
  downloadBtn.disabled = !url;
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  cancelBtn.classList.add("hidden");
  statusEl.textContent = "";

  if (url && isValidUrl(url)) {
    const platform = detectPlatform(url);
    if (platform) {
      currentUrl = url;
      detectedSection.classList.remove("hidden");
      platformBadge.textContent = platform.name;
      platformBadge.style.backgroundColor = platform.color;
    }
  }
});

init();
