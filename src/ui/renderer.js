function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function colorForIndex(index, highlights) {
  if (highlights.found?.includes(index)) return "var(--ok)";
  if (highlights.swap?.includes(index)) return "var(--swap)";
  if (highlights.compare?.includes(index)) return "var(--compare)";
  if (highlights.pivot?.includes(index)) return "var(--pivot)";
  if (highlights.sorted?.includes(index)) return "var(--sorted)";
  if (highlights.active?.includes(index)) return "var(--active)";
  if (highlights.range && (index < highlights.range[0] || index > highlights.range[1])) return "var(--dim)";
  return "var(--bar)";
}

function createBarNode(value, maxValue, color, index) {
  const bar = document.createElement("div");
  bar.className = "bar";
  bar.style.height = `${clamp((value / maxValue) * 100, 4, 100)}%`;
  bar.style.background = color;
  bar.title = `index ${index}: ${value}`;
  return bar;
}

function renderArray(container, step) {
  container.innerHTML = "";
  if (!step || !Array.isArray(step.array) || step.array.length === 0) {
    return;
  }

  const maxValue = Math.max(...step.array);
  const track = document.createElement("div");
  track.className = "bar-track";

  step.array.forEach((value, index) => {
    const color = colorForIndex(index, step.highlights ?? {});
    track.appendChild(createBarNode(value, maxValue, color, index));
  });

  container.appendChild(track);
}

window.AlgoRenderer = {
  renderArray,
};
