import { defineConfig } from "vite";
import { crx, defineManifest } from "@crxjs/vite-plugin";
import { join } from "path";

const manifest = defineManifest(async () => ({
  manifest_version: 3,
  name: "Fetcho",
  description: "Auto-download videos from Instagram, Twitter/X, YouTube Shorts, TikTok, Reddit, and Facebook",
  version: "1.0.0",
  action: {
    default_popup: "src/popup/index.html",
    default_icon: {
      "16": "src/assets/icon16.png",
      "48": "src/assets/icon48.png",
      "128": "src/assets/icon128.png",
    },
  },
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["https://igram.world/*"],
      js: ["src/content/igram.ts"],
    },
    {
      matches: ["https://ssstwitter.com/*"],
      js: ["src/content/ssstwitter.ts"],
    },
    {
      matches: ["https://ytshortsdl.io/*"],
      js: ["src/content/ytshorts.ts"],
    },
    {
      matches: ["https://ssstik.io/*"],
      js: ["src/content/snaptik.ts"],
    },
    {
      matches: ["https://rapidsave.com/*"],
      js: ["src/content/rapidsave.ts"],
    },
    {
      matches: ["https://fdown.net/*"],
      js: ["src/content/fdown.ts"],
    },
  ],
  permissions: ["clipboardRead", "storage", "tabs"],
  host_permissions: [
    "https://igram.world/*",
    "https://ssstwitter.com/*",
    "https://ytshortsdl.io/*",
    "https://ssstik.io/*",
    "https://rapidsave.com/*",
    "https://fdown.net/*",
  ],
  icons: {
    "16": "src/assets/icon16.png",
    "48": "src/assets/icon48.png",
    "128": "src/assets/icon128.png",
  },
}));

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    outDir: "dist",
  },
});
