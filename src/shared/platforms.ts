import { PlatformConfig } from "./types";

export const platforms: PlatformConfig[] = [
  {
    id: "instagram",
    name: "Instagram",
    patterns: [/instagram\.com/i, /instagr\.am/i],
    targetUrl: "https://igram.world/en1/",
    color: "#e1306c",
  },
  {
    id: "twitter",
    name: "Twitter/X",
    patterns: [/twitter\.com/i, /x\.com/i],
    targetUrl: "https://ssstwitter.com/",
    color: "#000000",
  },
  {
    id: "youtube",
    name: "YouTube Shorts",
    patterns: [/youtube\.com\/shorts/i, /youtu\.be/i],
    targetUrl: "https://ytshortsdl.io/",
    color: "#FE0032",
  },
];

export function detectPlatform(url: string): PlatformConfig | null {
  for (const platform of platforms) {
    if (platform.patterns.some((p) => p.test(url))) {
      return platform;
    }
  }
  return null;
}
