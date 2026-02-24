function cloneArray(arr) {
  return arr.slice();
}

function makeStep(array, message, highlights = {}) {
  return {
    array: cloneArray(array),
    message,
    highlights: {
      compare: [],
      active: [],
      range: null,
      found: [],
      ...highlights,
    },
  };
}

function linearSearchSteps(input, target) {
  const a = cloneArray(input);
  const steps = [makeStep(a, `在线性查找目标 ${target}`)];

  for (let i = 0; i < a.length; i += 1) {
    steps.push(makeStep(a, `比较 index=${i}，值=${a[i]}`, { compare: [i], active: [i] }));
    if (a[i] === target) {
      steps.push(makeStep(a, `找到目标，位置 ${i}`, { found: [i], active: [i] }));
      return steps;
    }
  }
  steps.push(makeStep(a, "未找到目标"));
  return steps;
}

function binarySearchSteps(input, target) {
  const a = cloneArray(input).sort((x, y) => x - y);
  const steps = [makeStep(a, `在有序数组中二分查找目标 ${target}`)];

  let left = 0;
  let right = a.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push(makeStep(a, `left=${left}, right=${right}, mid=${mid}`, { compare: [mid], range: [left, right], active: [mid] }));
    if (a[mid] === target) {
      steps.push(makeStep(a, `找到目标，位置 ${mid}`, { found: [mid], range: [left, right] }));
      return steps;
    }
    if (a[mid] < target) {
      left = mid + 1;
      steps.push(makeStep(a, `a[mid] < target，移动 left 到 ${left}`, { range: [left, right] }));
    } else {
      right = mid - 1;
      steps.push(makeStep(a, `a[mid] > target，移动 right 到 ${right}`, { range: [left, right] }));
    }
  }

  steps.push(makeStep(a, "区间为空，未找到目标"));
  return steps;
}

window.SearchAlgorithms = [
  {
    id: "linear-search",
    name: "Linear Search",
    category: "Search",
    description: "Scan from left to right.",
    needsTarget: true,
    generator: linearSearchSteps,
  },
  {
    id: "binary-search",
    name: "Binary Search",
    category: "Search",
    description: "Halve the range on sorted data.",
    needsTarget: true,
    generator: binarySearchSteps,
  },
];
