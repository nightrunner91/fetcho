import { waitForElement, fillInput, findButton, delay } from "../shared/content-utils";

async function autoFillAndDownload() {
  const data = await chrome.storage.local.get(["downloadUrl", "platformId"]);
  const downloadUrl = data.downloadUrl as string | undefined;
  const platformId = data.platformId as string | undefined;

  if (!downloadUrl || platformId !== "twitter") return;

  await chrome.storage.local.remove(["downloadUrl", "platformId"]);

  await waitForElement('input[type="text"], input[type="url"], #url', 5000);

  const input =
    document.querySelector<HTMLInputElement>("#url") ||
    document.querySelector<HTMLInputElement>('input[type="text"]') ||
    document.querySelector<HTMLInputElement>('input[type="url"]');

  if (!input) {
    console.error("Video Downloader: Could not find input field on ssstwitter.com");
    return;
  }

  fillInput(input, downloadUrl);

  await delay(500);

  const downloadBtn = findButton(/download|save/i);
  if (downloadBtn) {
    downloadBtn.click();
  }
}

autoFillAndDownload();
