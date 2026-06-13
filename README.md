# <p align="center">Fetcho</p>

<p align="center">
  <strong>A Chromium browser extension that automates video downloads from social media.</strong>
</p>

<p align="center">
  <strong><img src="https://flagcdn.com/w20/us.png" width="20"> English</strong> | <a href="README.ru.md"><img src="https://flagcdn.com/w20/ru.png" width="20"> Russian</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
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
- [Permissions](#permissions)
- [Development](#development)
- [License](#license)

## Overview

Fetcho is a lightweight browser extension built with TypeScript and Vite. It detects video URLs from your clipboard, identifies the platform (Instagram, Twitter/X, or YouTube Shorts), and automatically routes them to the appropriate downloader service. A 3-second countdown gives you a chance to cancel before the download flow begins.

## Features

- **Auto-detection**: Reads clipboard on popup open and detects supported platforms
- **Multi-platform support**: Instagram, Twitter/X, and YouTube Shorts
- **3-second countdown**: Auto-triggers download with an option to cancel
- **Manual paste**: Paste URLs directly if clipboard detection is skipped
- **Content script automation**: Auto-fills URL inputs and clicks download buttons on downloader sites
- **Clean popup UI**: Minimal, accessible interface with platform badges

## Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Type-safe extension code |
| Vite | Fast bundling and HMR during development |
| CRXJS Vite Plugin | Manifest V3 extension build tooling |
| Chrome Extension APIs | `storage`, `tabs`, `clipboardRead` |
| CSS Variables | Theming and consistent styling |

## Project Structure

```
fetcho/
├── src/
│   ├── assets/            # Extension icons (16px, 48px, 128px)
│   ├── background/        # Service worker (install lifecycle)
│   ├── content/           # Content scripts per downloader site
│   │   ├── igram.ts       # Instagram downloader automation
│   │   ├── ssstwitter.ts  # Twitter/X downloader automation
│   │   └── ytshorts.ts    # YouTube Shorts downloader automation
│   ├── popup/             # Extension popup UI
│   │   ├── index.html     # Popup markup
│   │   ├── index.ts       # Popup logic (clipboard, countdown, download)
│   │   └── style.css      # Popup styles
│   └── shared/            # Shared utilities
│       ├── content-utils.ts  # DOM helpers (wait, fill, click)
│       ├── platforms.ts      # Platform configs and detection
│       └── types.ts          # TypeScript interfaces
├── dist/                  # Build output (load this into Chrome)
├── package.json
├── tsconfig.json
└── vite.config.ts         # Vite + CRXJS manifest config
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Chromium-based browser (Chrome, Edge, Brave, etc.)

### Installation

```bash
# Install dependencies
npm install

# Build the extension
npm run build
```

The compiled extension will be output to the `dist/` directory.

### Load into Browser

1. Open your browser and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `dist/` folder from this project
5. The extension icon will appear in your toolbar

## Usage

1. Copy a video URL from Instagram, Twitter/X, or YouTube Shorts
2. Click the extension icon in your toolbar
3. The popup will auto-detect the platform and start a 3-second countdown
4. Click **Cancel** to stop the auto-trigger, or let it proceed
5. A new tab opens on the downloader site with the URL pre-filled and download initiated

You can also paste URLs manually into the input field and click **Download**.

## How It Works

1. **Clipboard Detection**: On popup open, the extension reads your clipboard and checks if the URL matches a supported platform pattern
2. **Platform Routing**: The detected platform determines which downloader service to use:
   - Instagram -> `igram.world`
   - Twitter/X -> `ssstwitter.com`
   - YouTube Shorts -> `ytshortsdl.io`
3. **Storage Handoff**: The URL and platform ID are stored in `chrome.storage.local`
4. **Content Script Automation**: A content script on the downloader site reads the stored URL, fills the input field, and clicks the download button

## Permissions

| Permission | Reason |
|---|---|
| `clipboardRead` | Auto-detect video URLs from clipboard |
| `storage` | Pass URL and platform data between popup and content scripts |
| `tabs` | Open downloader sites in new tabs |

> [!IMPORTANT]
> This extension routes URLs through third-party downloader services. It does not host or process any video content itself. Use responsibly and respect content creators' rights.

## Development

```bash
# Start dev server with hot module reloading
npm run dev

# Build for production
npm run build

# Preview the build output
npm run preview
```

During development, use `npm run dev` and reload the extension from `chrome://extensions/` after changes. The CRXJS plugin supports HMR for popup and content scripts.

## License

MIT
