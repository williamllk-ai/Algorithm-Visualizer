const { algorithms, getAlgorithmById } = window.AlgorithmsRegistry;
const { renderArray } = window.AlgoRenderer;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateData(size) {
  return Array.from({ length: size }, () => randomInt(5, 99));
}

const state = {
  data: generateData(28),
  steps: [],
  stepIndex: 0,
  isPlaying: false,
  speed: 1,
  timer: null,
  selectedAlgorithmId: algorithms[0] ? algorithms[0].id : "",
};

const el = {
  algorithmSelect: document.getElementById("algorithmSelect"),
  sizeInput: document.getElementById("sizeInput"),
  sizeValue: document.getElementById("sizeValue"),
  speedInput: document.getElementById("speedInput"),
  speedValue: document.getElementById("speedValue"),
  targetWrap: document.getElementById("targetWrap"),
  targetInput: document.getElementById("targetInput"),
  randomBtn: document.getElementById("randomBtn"),
  runBtn: document.getElementById("runBtn"),
  playBtn: document.getElementById("playBtn"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  resetBtn: document.getElementById("resetBtn"),
  timelineInput: document.getElementById("timelineInput"),
  stepLabel: document.getElementById("stepLabel"),
  algorithmMeta: document.getElementById("algorithmMeta"),
  canvas: document.getElementById("canvas"),
  message: document.getElementById("message"),
};

function clearTimer() {
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
}

function setPlaying(nextPlaying) {
  state.isPlaying = nextPlaying;
  clearTimer();
  if (state.isPlaying) {
    const interval = Math.max(40, 220 / state.speed);
    state.timer = window.setInterval(() => {
      if (state.stepIndex >= state.steps.length - 1) {
        setPlaying(false);
        return;
      }
      state.stepIndex += 1;
      syncView();
    }, interval);
  }
  el.playBtn.textContent = state.isPlaying ? "Pause (Space)" : "Play (Space)";
}

function getCurrentAlgorithm() {
  return getAlgorithmById(state.selectedAlgorithmId);
}

function refreshAlgorithmOptions() {
  el.algorithmSelect.innerHTML = "";
  algorithms.forEach((algo) => {
    const opt = document.createElement("option");
    opt.value = algo.id;
    opt.textContent = `${algo.category} | ${algo.name}`;
    el.algorithmSelect.appendChild(opt);
  });
  el.algorithmSelect.value = state.selectedAlgorithmId;
}

function randomizeData() {
  const size = Number(el.sizeInput.value);
  state.data = generateData(size);
  state.steps = [{
    array: state.data.slice(),
    message: "Generated random data.",
    highlights: {},
  }];
  state.stepIndex = 0;
  syncView();
}

function runAlgorithm() {
  const algo = getCurrentAlgorithm();
  const input = state.data.slice();
  let steps = [];
  if (algo.needsTarget) {
    const target = Number(el.targetInput.value);
    steps = algo.generator(input, target);
    el.algorithmMeta.textContent = `${algo.name} | target: ${target} | ${algo.description}`;
  } else {
    steps = algo.generator(input);
    el.algorithmMeta.textContent = `${algo.name} | ${algo.description}`;
  }

  state.steps = steps;
  state.stepIndex = 0;
  setPlaying(false);
  syncView();
}

function syncView() {
  const current = state.steps[state.stepIndex] || {
    array: state.data,
    message: "Not started.",
    highlights: {},
  };

  renderArray(el.canvas, current);
  el.message.textContent = current.message || "";
  el.stepLabel.textContent = `Step ${state.stepIndex} / ${Math.max(0, state.steps.length - 1)}`;
  el.timelineInput.max = String(Math.max(0, state.steps.length - 1));
  el.timelineInput.value = String(state.stepIndex);
  el.sizeValue.textContent = String(el.sizeInput.value);
  el.speedValue.textContent = `${state.speed.toFixed(2)}x`;
  el.targetWrap.style.display = getCurrentAlgorithm().needsTarget ? "flex" : "none";
}

function stepForward() {
  if (state.stepIndex < state.steps.length - 1) {
    state.stepIndex += 1;
    syncView();
  }
}

function stepBackward() {
  if (state.stepIndex > 0) {
    state.stepIndex -= 1;
    syncView();
  }
}

function resetPlayback() {
  setPlaying(false);
  state.stepIndex = 0;
  syncView();
}

function bindEvents() {
  el.algorithmSelect.addEventListener("change", () => {
    state.selectedAlgorithmId = el.algorithmSelect.value;
    syncView();
  });

  el.sizeInput.addEventListener("input", () => {
    el.sizeValue.textContent = el.sizeInput.value;
  });

  el.speedInput.addEventListener("input", () => {
    state.speed = Number(el.speedInput.value);
    el.speedValue.textContent = `${state.speed.toFixed(2)}x`;
    if (state.isPlaying) {
      setPlaying(true);
    }
  });

  el.timelineInput.addEventListener("input", () => {
    state.stepIndex = Number(el.timelineInput.value);
    syncView();
  });

  el.randomBtn.addEventListener("click", randomizeData);
  el.runBtn.addEventListener("click", runAlgorithm);
  el.playBtn.addEventListener("click", () => setPlaying(!state.isPlaying));
  el.prevBtn.addEventListener("click", () => {
    setPlaying(false);
    stepBackward();
  });
  el.nextBtn.addEventListener("click", () => {
    setPlaying(false);
    stepForward();
  });
  el.resetBtn.addEventListener("click", resetPlayback);

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      setPlaying(!state.isPlaying);
      return;
    }
    if (event.code === "ArrowRight") {
      event.preventDefault();
      setPlaying(false);
      stepForward();
      return;
    }
    if (event.code === "ArrowLeft") {
      event.preventDefault();
      setPlaying(false);
      stepBackward();
      return;
    }
    if (event.code === "KeyR") {
      event.preventDefault();
      randomizeData();
      return;
    }
    if (event.code === "Home") {
      event.preventDefault();
      resetPlayback();
    }
  });
}

function init() {
  refreshAlgorithmOptions();
  bindEvents();
  randomizeData();
}

init();
