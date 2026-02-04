let lastContextTarget = null;

const storeContextTarget = (event) => {
  lastContextTarget = event.target;
};

document.addEventListener("contextmenu", storeContextTarget, true);

const findPostElement = (node) => {
  if (!node) {
    return null;
  }
  return node.closest("article");
};

const markPost = (article) => {
  if (!article) {
    return;
  }

  if (article.dataset.readMarkerApplied === "true") {
    return;
  }

  article.dataset.readMarkerApplied = "true";
  article.classList.add("x-read-marker");

  const badge = document.createElement("span");
  badge.className = "x-read-marker__badge";
  badge.textContent = "閲覧済み";
  article.appendChild(badge);
};

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type !== "MARK_POST_AS_READ") {
    return;
  }

  const article = findPostElement(lastContextTarget);
  markPost(article);
});
