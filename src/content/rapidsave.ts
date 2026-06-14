import { runContentScript } from "./content-factory";

runContentScript({
  platformId: "reddit",
  waitSelector: 'input[type="text"], input[type="url"], #url',
  inputSelectors: ["#url", 'input[type="text"]', 'input[type="url"]'],
  buttonPattern: /download|submit|search|get/i,
  siteName: "rapidsave.com",
});
