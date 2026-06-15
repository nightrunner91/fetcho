# <p align="center"><img src="src/assets/fetcho-logo-small.svg" width="24"> Fetcho</p>

<p align="center">
  <strong>A Chromium browser extension that simplifies video downloads from social media.</strong>
</p>

<p align="center">
  <strong><img src="https://flagcdn.com/w20/us.png" width="20"> English</strong> | <a href="README.ru.md"><img src="https://flagcdn.com/w20/ru.png" width="20"> Russian</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.1.2-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/Node.js-%3E%3D18-6da55f?style=for-the-badge&logo=node.js" alt="Node Version">
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Manifest-V3-orange?style=for-the-badge&logo=googlechrome" alt="Manifest V3">
</p>

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Load into Browser](#load-into-browser)
- [Usage](#usage)
- [How It Works](#how-it-works)
  - [Popup Flow](#popup-flow)
  - [Content Script Automation](#content-script-automation)
- [Configuration](#configuration)
- [Permissions](#permissions)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Overview

Fetcho is a lightweight Chromium browser extension (Manifest V3). It acts as a smart intermediary: you paste a video link, Fetcho opens the correct downloader site with that link pre-filled, and a content script clicks the download button for you. No manual tab-hopping, no copy-paste between sites.

Six platforms are supported out of the box.

| Platform | URL Patterns | Routes To |
|---|---|---|
| Instagram | `instagram.com`, `instagr.am` | `igram.world` |
| Twitter / X | `twitter.com`, `x.com` | `ssstwitter.com` |
| YouTube Shorts | `youtube.com/shorts`, `youtu.be` | `ytshortsdl.io` |
| TikTok | `tiktok.com` | `ssstik.io` |
| Reddit | `reddit.com` | `rapidsave.com` |
| Facebook | `facebook.com`, `fb.com`, `fb.watch` | `fdown.net` |

> [!NOTE]
> Fetcho does not host, store, download, or distribute any video content. It only routes URLs through publicly available third-party downloader services.

## Features

- **Content script automation** -- downloader sites are pre-filled and submitted without user interaction
- **Platform auto-detection** -- paste a URL; Fetcho identifies the platform and routes it to the correct downloader
- **One-click paste** -- the Paste button reads your clipboard and fills the input in a single tap
- **Dark / Light theme** -- toggle persisted to `chrome.storage.local`; respects OS-level preference
- **Minimal popup UI** -- tiny popup with straightforward functionality, nothing extraneous or distracting

## Load into Browser

1. Download <a href="https://github.com/nightrunner91/fetcho/releases">latest release</a> of Fetcho and unpack it
2. Open `chrome://extensions` or `brave://extensions` in your browser
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select unpacked folder in explorer
6. Done! (the Fetcho icon appears in your browser toolbar)

## Usage

1. Navigate to any supported social media site and copy a video URL
2. Click the Fetcho icon in your browser toolbar
3. Click the **Paste** button to pull the URL from your clipboard, or type / paste it manually
4. The popup detects the platform and shows a color-coded badge
5. Click **Download** -- Fetcho opens the appropriate downloader site in a new tab
6. The content script auto-fills the URL and clicks the download button; the file download begins

> [!TIP]
> If the Paste button does not work, the URL input also accepts manual paste (Ctrl+V / Cmd+V).

## How It Works

### Popup Flow

```
                    User copies a video URL
                               |
                    Clicks the extension icon
                               |
                        Pastes the link
                               |
               detectPlatform() identifies the platform
                               |
               User clicks the [Download] button
                               |
          Extension opens the downloader site and runs the script
```

## Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript 5.4 | Type-safe extension code |
| Vite 5.4 | Fast bundling with HMR during development |
| CRXJS Vite Plugin | Manifest V3 extension build tooling |
| Chrome Extension APIs | `storage`, `tabs`, `clipboardRead` |
| CSS Custom Properties | Light / dark theme system |

## Project Structure

```
fetcho/
├── src/
│   ├── assets/                  # Logos (light/dark SVGs) and icons (16, 48, 128 px)
│   ├── background/
│   │   └── index.ts             # Service worker -- install lifecycle logging
│   ├── content/
│   │   ├── content-factory.ts   # Shared automation logic (wait, fill, click)
│   │   ├── igram.ts             # Instagram -> igram.world
│   │   ├── ssstwitter.ts        # Twitter/X  -> ssstwitter.com
│   │   ├── ytshorts.ts          # YouTube    -> ytshortsdl.io
│   │   ├── snaptik.ts           # TikTok     -> ssstik.io
│   │   ├── rapidsave.ts         # Reddit     -> rapidsave.com
│   │   └── fdown.ts             # Facebook   -> fdown.net
│   ├── popup/
│   │   ├── icons.ts             # SVG icon components (info, cross, warn, check)
│   │   ├── index.html           # Popup markup
│   │   ├── index.ts             # Popup logic (paste, detect, download, theme)
│   │   └── style.css            # Popup styles with light/dark theme variables
│   └── shared/
│       ├── content-utils.ts     # DOM helpers: waitForElement, fillInput, findButton
│       ├── platforms.ts         # Platform configs and detectPlatform()
│       └── types.ts             # Shared TypeScript interfaces
├── dist/                        # Build output (load this into the browser)
├── package.json
├── tsconfig.json
└── vite.config.ts               # Vite config with CRXJS manifest declaration
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Chromium-based browser (Chrome, Edge, Brave, Opera, etc.)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/fetcho.git
cd fetcho

# Install dependencies
npm install

# Build the extension
npm run build
```

The compiled extension is placed in the `dist/` directory.

### Content Script Automation

Each downloader site has a dedicated content script (e.g. `igram.ts` for Instagram). Each script calls the shared `runContentScript()` factory function and then works with the specific service's DOM:

```typescript
// Example: src/content/igram.ts
import { runContentScript } from "./content-factory";

runContentScript({
  platformId: "instagram",
  waitSelector: 'input[type="text"], input[type="url"], #url',
  inputSelectors: ["#url", 'input[type="text"]', 'input[type="url"]'],
  buttonPattern: /download|submit|search|get/i,
  siteName: "igram.world",
});
```

The factory function:

1. Reads `downloadUrl` and `platformId` from `chrome.storage.local`
2. Clears the storage to prevent re-triggering
3. Waits for a matching input field to appear (up to 5 seconds)
4. Sets the input value using a native setter to trigger framework listeners
5. Dispatches `input` and `change` DOM events
6. Waits 500 ms, then finds and clicks the download button

This pattern keeps each content script to under 10 lines while supporting any number of downloader sites.

## Configuration

All configuration lives in `vite.config.ts` where the extension manifest is declared:

- **Content script matches** -- update the `content_scripts` array to add or modify downloader site injection rules
- **Host permissions** -- update the `host_permissions` array to grant access to additional domains
- **Platform definitions** -- add or edit entries in `src/shared/platforms.ts` to support new social networks

Theme preference is automatically persisted to `chrome.storage.local` under the `theme` key.

## Permissions

| Permission | Justification |
|---|---|
| `clipboardRead` | Read the clipboard when the Paste button is clicked |
| `storage` | Pass the URL and platform ID from the popup to content scripts |
| `tabs` | Open the downloader site in a new browser tab |

> [!IMPORTANT]
> Fetcho uses only the minimum set of permissions required for its functionality. The extension makes no network requests of its own -- all data flows through standard Chrome extension APIs and user gestures.

## Development

```bash
# Start Vite dev server with HMR
npm run dev

# Type-check and build for production
npm run build

# Preview the production build
npm run preview
```

During development, run `npm run dev` and load the `dist/` folder as an unpacked extension. Reload the extension from `chrome://extensions/` after each build. The CRXJS Vite plugin provides HMR for the popup and content scripts.

### Adding a New Platform

1. Add the platform definition to `src/shared/platforms.ts` (URL pattern, target URL, badge color)
2. Create a content script in `src/content/` that calls `runContentScript()` with the appropriate selectors
3. Register the content script match and host permission in `vite.config.ts`
4. Rebuild and reload the extension

## Contributing

Contributions are welcome. Please open an issue first to discuss the change you would like to make.

- Fork the repository
- Create a feature branch
- Run `npm run build` to verify the extension compiles
- Submit a pull request

## License

This project is licensed under the [ISC License](LICENSE).

---

<p align="center">
  Built with ❤ by <a href="https://t.me/nightrunner91">nightrunner91</a>
</p>
