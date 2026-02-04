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

  const sendMessage = () => {
    chrome.tabs.sendMessage(tab.id, { type: "MARK_POST_AS_READ" }, () => {
      if (chrome.runtime.lastError) {
        return;
      }
    });
  };

  chrome.tabs.sendMessage(tab.id, { type: "MARK_POST_AS_READ" }, () => {
    if (!chrome.runtime.lastError) {
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"]
      },
      () => {
        if (chrome.runtime.lastError) {
          return;
        }

        chrome.scripting.insertCSS(
          {
            target: { tabId: tab.id },
            files: ["styles.css"]
          },
          () => {
            if (chrome.runtime.lastError) {
              return;
            }
            sendMessage();
          }
        );
      }
    );
  });
});
