function cloneArray(arr) {
  return arr.slice();
}

function makeStep(array, message, highlights = {}) {
  return {
    array: cloneArray(array),
    message,
    highlights: {
      compare: [],
      swap: [],
      sorted: [],
      pivot: [],
      active: [],
      ...highlights,
    },
  };
}

function finalizeSortedFlags(steps) {
  if (steps.length === 0) {
    return steps;
  }
  const last = steps[steps.length - 1];
  last.highlights.sorted = last.array.map((_, idx) => idx);
  return steps;
}

function bubbleSortSteps(input) {
  const a = cloneArray(input);
  const steps = [makeStep(a, "初始状态")];
  const n = a.length;
  const sorted = new Set();

  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n - 1 - i; j += 1) {
      steps.push(makeStep(a, `比较 ${j} 和 ${j + 1}`, { compare: [j, j + 1], sorted: [...sorted] }));
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push(makeStep(a, `交换 ${j} 和 ${j + 1}`, { swap: [j, j + 1], sorted: [...sorted] }));
      }
    }
    sorted.add(n - 1 - i);
    steps.push(makeStep(a, `位置 ${n - 1 - i} 已有序`, { sorted: [...sorted] }));
  }

  return finalizeSortedFlags(steps);
}

function selectionSortSteps(input) {
  const a = cloneArray(input);
  const steps = [makeStep(a, "初始状态")];
  const n = a.length;
  const sorted = new Set();

  for (let i = 0; i < n; i += 1) {
    let minIndex = i;
    steps.push(makeStep(a, `在区间 [${i}, ${n - 1}] 寻找最小值`, { active: [i] }));
    for (let j = i + 1; j < n; j += 1) {
      steps.push(makeStep(a, `比较候选最小值 ${minIndex} 与 ${j}`, { compare: [minIndex, j], sorted: [...sorted] }));
      if (a[j] < a[minIndex]) {
        minIndex = j;
        steps.push(makeStep(a, `更新最小值下标为 ${minIndex}`, { active: [minIndex], sorted: [...sorted] }));
      }
    }
    if (minIndex !== i) {
      [a[i], a[minIndex]] = [a[minIndex], a[i]];
      steps.push(makeStep(a, `交换 ${i} 和 ${minIndex}`, { swap: [i, minIndex], sorted: [...sorted] }));
    }
    sorted.add(i);
    steps.push(makeStep(a, `位置 ${i} 已有序`, { sorted: [...sorted] }));
  }

  return finalizeSortedFlags(steps);
}

function insertionSortSteps(input) {
  const a = cloneArray(input);
  const steps = [makeStep(a, "初始状态")];
  const n = a.length;
  const sorted = new Set([0]);
  steps.push(makeStep(a, "第 0 位视为已排序", { sorted: [...sorted] }));

  for (let i = 1; i < n; i += 1) {
    const key = a[i];
    let j = i - 1;
    steps.push(makeStep(a, `取 key=a[${i}]=${key}`, { active: [i], sorted: [...sorted] }));
    while (j >= 0 && a[j] > key) {
      steps.push(makeStep(a, `a[${j}]=${a[j]} > key，右移`, { compare: [j, j + 1], sorted: [...sorted] }));
      a[j + 1] = a[j];
      steps.push(makeStep(a, `右移完成到 ${j + 1}`, { swap: [j, j + 1], sorted: [...sorted] }));
      j -= 1;
    }
    a[j + 1] = key;
    steps.push(makeStep(a, `key 插入到 ${j + 1}`, { active: [j + 1], sorted: [...sorted, ...Array.from({ length: i + 1 }, (_, k) => k)] }));
    sorted.add(i);
  }

  return finalizeSortedFlags(steps);
}

function shellSortSteps(input) {
  const a = cloneArray(input);
  const steps = [makeStep(a, "初始状态")];
  const n = a.length;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push(makeStep(a, `当前 gap = ${gap}`));
    for (let i = gap; i < n; i += 1) {
      const temp = a[i];
      let j = i;
      while (j >= gap && a[j - gap] > temp) {
        steps.push(makeStep(a, `比较 ${j - gap} 与 ${j}`, { compare: [j - gap, j] }));
        a[j] = a[j - gap];
        steps.push(makeStep(a, `移动 ${j - gap} 到 ${j}`, { swap: [j - gap, j] }));
        j -= gap;
      }
      a[j] = temp;
      steps.push(makeStep(a, `将 ${temp} 插入到 ${j}`, { active: [j] }));
    }
  }

  return finalizeSortedFlags(steps);
}

function quickSortSteps(input) {
  const a = cloneArray(input);
  const steps = [makeStep(a, "初始状态")];

  function partition(left, right) {
    const pivot = a[right];
    let i = left - 1;
    steps.push(makeStep(a, `选择 pivot=a[${right}]=${pivot}`, { pivot: [right], active: Array.from({ length: right - left + 1 }, (_, k) => left + k) }));
    for (let j = left; j < right; j += 1) {
      steps.push(makeStep(a, `比较 a[${j}] 与 pivot`, { compare: [j, right], pivot: [right] }));
      if (a[j] <= pivot) {
        i += 1;
        [a[i], a[j]] = [a[j], a[i]];
        steps.push(makeStep(a, `a[${j}] <= pivot，交换 ${i} 和 ${j}`, { swap: [i, j], pivot: [right] }));
      }
    }
    [a[i + 1], a[right]] = [a[right], a[i + 1]];
    steps.push(makeStep(a, `pivot 归位到 ${i + 1}`, { swap: [i + 1, right], pivot: [i + 1] }));
    return i + 1;
  }

  function quickSort(left, right) {
    if (left >= right) {
      return;
    }
    const p = partition(left, right);
    quickSort(left, p - 1);
    quickSort(p + 1, right);
  }

  quickSort(0, a.length - 1);
  return finalizeSortedFlags(steps);
}

function heapSortSteps(input) {
  const a = cloneArray(input);
  const steps = [makeStep(a, "初始状态")];
  const n = a.length;

  function heapify(heapSize, root) {
    let largest = root;
    const left = root * 2 + 1;
    const right = root * 2 + 2;

    if (left < heapSize) {
      steps.push(makeStep(a, `比较 root=${root} 与 left=${left}`, { compare: [root, left] }));
      if (a[left] > a[largest]) {
        largest = left;
      }
    }

    if (right < heapSize) {
      steps.push(makeStep(a, `比较 currentLargest=${largest} 与 right=${right}`, { compare: [largest, right] }));
      if (a[right] > a[largest]) {
        largest = right;
      }
    }

    if (largest !== root) {
      [a[root], a[largest]] = [a[largest], a[root]];
      steps.push(makeStep(a, `交换 ${root} 和 ${largest} 并继续堆化`, { swap: [root, largest] }));
      heapify(heapSize, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i -= 1) {
    heapify(n, i);
  }
  steps.push(makeStep(a, "大根堆构建完成"));

  const sorted = new Set();
  for (let i = n - 1; i > 0; i -= 1) {
    [a[0], a[i]] = [a[i], a[0]];
    sorted.add(i);
    steps.push(makeStep(a, `堆顶与 ${i} 交换`, { swap: [0, i], sorted: [...sorted] }));
    heapify(i, 0);
  }
  sorted.add(0);
  steps.push(makeStep(a, "排序完成", { sorted: [...sorted] }));

  return finalizeSortedFlags(steps);
}

window.SortingAlgorithms = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "Sorting",
    description: "Repeatedly compare adjacent elements.",
    generator: bubbleSortSteps,
  },
  {
    id: "selection-sort",
    name: "Selection Sort",
    category: "Sorting",
    description: "Select minimum each round.",
    generator: selectionSortSteps,
  },
  {
    id: "insertion-sort",
    name: "Insertion Sort",
    category: "Sorting",
    description: "Insert current element into sorted prefix.",
    generator: insertionSortSteps,
  },
  {
    id: "shell-sort",
    name: "Shell Sort",
    category: "Sorting",
    description: "Gap-based insertion sort.",
    generator: shellSortSteps,
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    category: "Sorting",
    description: "Divide and conquer by pivot partition.",
    generator: quickSortSteps,
  },
  {
    id: "heap-sort",
    name: "Heap Sort",
    category: "Sorting",
    description: "Build max heap and extract top.",
    generator: heapSortSteps,
  },
];
