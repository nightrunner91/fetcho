import { runContentScript } from "./content-factory";

runContentScript({
  platformId: "instagram",
  waitSelector: 'input[type="text"], input[type="url"], textarea',
  inputSelectors: ['input[type="text"]', 'input[type="url"]', "textarea"],
  buttonPattern: /download|grab|fetch/i,
  siteName: "igram.world",
});
