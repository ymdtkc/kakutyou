let lastContextTarget = null;
let lastContextPosition = null;

const storeContextTarget = (event) => {
  lastContextTarget = event.target;
  lastContextPosition = { x: event.clientX, y: event.clientY };
};

document.addEventListener("contextmenu", storeContextTarget, true);

const findPostElement = (node) => {
  if (!node) {
    return null;
  }
  return node.closest?.("article") ?? null;
};

const findPostElementFromEvent = () => {
  if (lastContextTarget) {
    const fromTarget = findPostElement(lastContextTarget);
    if (fromTarget) {
      return fromTarget;
    }
  }

  if (lastContextPosition) {
    const elementAtPoint = document.elementFromPoint(
      lastContextPosition.x,
      lastContextPosition.y
    );
    const fromPoint = findPostElement(elementAtPoint);
    if (fromPoint) {
      return fromPoint;
    }
  }

  return null;
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

  const article = findPostElementFromEvent();
  markPost(article);
});
