export function getViewport(referenceWindow) {
  const win = referenceWindow || window;

  return {
    width: win.innerWidth,
    height: win.innerHeight,
  };
}

export function isInViewport(rect, viewport) {
  if (!rect || (rect.width <= 0 || rect.height <= 0)) {
    return false;
  }

  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < viewport.height &&
    rect.left < viewport.width
  );
}

export function percentage(element, referenceWindow) {
  const rect = element.getBoundingClientRect();
  const view = getViewport(referenceWindow);

  if (!isInViewport(rect, view)) {
    return 0;
  }

  let vh = 0; // visible height
  let vw = 0; // visible width

  if (rect.top >= 0) {
    vh = Math.min(rect.height, view.height - rect.top);
  } else if (rect.bottom > 0) {
    vh = Math.min(view.height, rect.bottom);
  }

  if (rect.left >= 0) {
    vw = Math.min(rect.width, view.width - rect.left);
  } else if (rect.right > 0) {
    vw = Math.min(view.width, rect.right);
  }

  return (vh * vw) / (rect.height * rect.width);
}

export function isElementXPercentInViewport(element, percent) {
  return percentage(element) > percent;
}

export function elementIsFocused(element) {
  return (
    document.activeElement === element ||
    element.contains(document.activeElement)
  );
}
