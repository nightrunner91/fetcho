import { runContentScript } from "./content-factory";

runContentScript({
  platformId: "youtube",
  waitSelector: 'input[type="text"], input[type="url"], #url, #video',
  inputSelectors: ["#url", "#video", 'input[type="text"]', 'input[type="url"]'],
  buttonPattern: /download|fetch|get|start/i,
  siteName: "ytshortsdl.io",
});
