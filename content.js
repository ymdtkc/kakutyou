(() => {
  if (window.__xReadMarkerInitialized) {
    // Prevent double-injection errors when the script is re-inserted.
    return;
  }
  window.__xReadMarkerInitialized = true;

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
    article.style.outline = "3px solid #1d9bf0";
    article.style.outlineOffset = "4px";
    article.style.position = "relative";

    const badge = document.createElement("span");
    badge.className = "x-read-marker__badge";
    badge.textContent = "閲覧済み";
    badge.style.position = "absolute";
    badge.style.top = "8px";
    badge.style.right = "8px";
    badge.style.background = "#1d9bf0";
    badge.style.color = "#fff";
    badge.style.fontSize = "12px";
    badge.style.fontWeight = "700";
    badge.style.padding = "4px 8px";
    badge.style.borderRadius = "999px";
    badge.style.zIndex = "10";
    badge.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.25)";
    article.appendChild(badge);
  };

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type !== "MARK_POST_AS_READ") {
      return;
    }

    const article = findPostElementFromEvent();
    markPost(article);
  });
})();
