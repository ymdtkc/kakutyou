const MENU_ID = "mark-as-read";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "閲覧済みにする",
    contexts: ["all"],
    documentUrlPatterns: ["https://x.com/*", "https://twitter.com/*"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ID || !tab?.id) {
    return;
  }

  chrome.tabs.sendMessage(tab.id, { type: "MARK_POST_AS_READ" });
});
