import { ContentPlatformConfig } from "../shared/types";
import { waitForElement, fillInput, findButton, delay } from "../shared/content-utils";

export async function runContentScript(config: ContentPlatformConfig) {
  const data = await chrome.storage.local.get(["downloadUrl", "platformId"]);
  const downloadUrl = data.downloadUrl as string | undefined;
  const platformId = data.platformId as string | undefined;

  if (!downloadUrl || platformId !== config.platformId) return;

  await chrome.storage.local.remove(["downloadUrl", "platformId"]);

  await waitForElement(config.waitSelector, 5000);

  let input: HTMLInputElement | HTMLTextAreaElement | null = null;
  for (const selector of config.inputSelectors) {
    input = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector);
    if (input) break;
  }

  if (!input) {
    console.error(`Fetcho: Could not find input field on ${config.siteName}`);
    return;
  }

  fillInput(input, downloadUrl);

  await delay(500);

  const downloadBtn = findButton(config.buttonPattern);
  if (downloadBtn) {
    downloadBtn.click();
  }
}
