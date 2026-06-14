import { runContentScript } from "./content-factory";

runContentScript({
  platformId: "facebook",
  waitSelector: 'input[type="text"], input[type="url"], #url',
  inputSelectors: ["#url", 'input[type="text"]', 'input[type="url"]'],
  buttonPattern: /download|submit|search|get/i,
  siteName: "fdown.net",
});
