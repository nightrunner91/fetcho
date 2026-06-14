export interface PlatformConfig {
  id: string;
  name: string;
  patterns: RegExp[];
  targetUrl: string;
  color: string;
}

export interface DetectedLink {
  platform: PlatformConfig;
  url: string;
}

export type PopupState = "idle" | "detected" | "error";

export interface ContentPlatformConfig {
  platformId: string;
  waitSelector: string;
  inputSelectors: string[];
  buttonPattern: RegExp;
  siteName: string;
}
