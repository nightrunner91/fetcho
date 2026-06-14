import { runContentScript } from "./content-factory";

runContentScript({
  platformId: "twitter",
  waitSelector: 'input[type="text"], input[type="url"], #url',
  inputSelectors: ["#url", 'input[type="text"]', 'input[type="url"]'],
  buttonPattern: /download|save/i,
  siteName: "ssstwitter.com",
});
