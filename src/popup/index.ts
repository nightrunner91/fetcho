import { detectPlatform } from "../shared/platforms";
import { PopupState } from "../shared/types";
import { ICONS, type IconName } from "./icons";

const detectedSection = document.getElementById("detected-section")!;
const platformBadge = document.getElementById("platform-badge")!;
const urlInput = document.getElementById("url-input") as HTMLInputElement;
const pasteBtn = document.getElementById("paste-btn") as HTMLButtonElement;
const downloadBtn = document.getElementById("download-btn") as HTMLButtonElement;
const tipText = document.getElementById("tip-text")!;
const versionEl = document.getElementById("version")!;
const themeToggle = document.getElementById("theme-toggle") as HTMLButtonElement;

let currentUrl = "";
let tipTimeout: ReturnType<typeof setTimeout> | null = null;

const manifest = chrome.runtime.getManifest();
versionEl.textContent = `v${manifest.version}`;

const STORAGE_THEME_KEY = "theme";

function getPreferredTheme(): "light" | "dark" {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

async function setTheme(theme: "light" | "dark") {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-checked", String(theme === "dark"));
  await chrome.storage.local.set({ [STORAGE_THEME_KEY]: theme });
}

async function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  await setTheme(current === "dark" ? "light" : "dark");
}

async function initTheme() {
  const result = await chrome.storage.local.get(STORAGE_THEME_KEY);
  const saved = result[STORAGE_THEME_KEY] as string | undefined;
  if (saved === "light" || saved === "dark") {
    document.documentElement.setAttribute("data-theme", saved);
    themeToggle.setAttribute("aria-checked", String(saved === "dark"));
  } else {
    const preferred = getPreferredTheme();
    document.documentElement.setAttribute("data-theme", preferred);
    themeToggle.setAttribute("aria-checked", String(preferred === "dark"));
  }
}

themeToggle.addEventListener("click", toggleTheme);

async function init() {
  await initTheme();
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

function setTip(msg: string, icon?: IconName, autoClear = true) {
  if (tipTimeout) clearTimeout(tipTimeout);
  tipText.innerHTML = msg + (icon ? ` ${ICONS[icon]}` : "");
  if (autoClear) {
    tipTimeout = setTimeout(() => {
      tipText.innerHTML = "Paste a video link to get started";
      tipTimeout = null;
    }, 3000);
  }
}

function setState(state: PopupState) {
  if (tipTimeout) clearTimeout(tipTimeout);
  if (state === "idle") {
    tipText.textContent = "Paste a video link to get started";
    downloadBtn.disabled = true;
  } else if (state === "detected") {
    tipText.textContent = "";
    downloadBtn.disabled = false;
  } else if (state === "error") {
    tipText.textContent = "";
    downloadBtn.disabled = false;
  }
}

async function triggerDownload() {
  const url = urlInput.value.trim() || currentUrl;
  if (!url || !isValidUrl(url)) {
    setTip("Please enter a valid URL", "info");
    return;
  }

  const platform = detectPlatform(url);
  if (!platform) {
    setTip("Unsupported platform", "cross");
    return;
  }

  setTip(`Opening ${platform.name} downloader...`, undefined, false);

  await chrome.storage.local.set({ downloadUrl: url, platformId: platform.id });

  chrome.tabs.create({ url: platform.targetUrl });

  window.close();
}

pasteBtn.addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    const trimmed = text.trim();
    if (trimmed) {
      urlInput.value = trimmed;
      urlInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  } catch {
    setTip("Could not read clipboard", "warn");
  }
});

downloadBtn.addEventListener("click", triggerDownload);

urlInput.addEventListener("input", () => {
  const url = urlInput.value.trim();
  downloadBtn.disabled = !url;

  if (url && isValidUrl(url)) {
    const platform = detectPlatform(url);
    if (platform) {
      currentUrl = url;
      detectedSection.classList.remove("hidden");
      platformBadge.textContent = platform.name;
      platformBadge.style.backgroundColor = platform.color;
      setTip("Platform detected", "check", false);
    } else {
      detectedSection.classList.add("hidden");
      setTip("URL not supported yet", "cross");
    }
  } else if (url && !isValidUrl(url)) {
    detectedSection.classList.add("hidden");
    setTip("Invalid URL format", "cross");
  } else {
    detectedSection.classList.add("hidden");
    setState("idle");
  }
});

init();
