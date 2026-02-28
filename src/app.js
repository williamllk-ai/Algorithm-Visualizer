(function () {
  "use strict";

  function cloneArray(arr) {
    return arr.slice();
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateData(size) {
    var arr = [];
    for (var i = 0; i < size; i += 1) arr.push(randomInt(5, 99));
    return arr;
  }

  function range(n) {
    var out = [];
    for (var i = 0; i < n; i += 1) out.push(i);
    return out;
  }

  function barStep(array, message, highlights) {
    return {
      view: "bars",
      array: cloneArray(array),
      message: message,
      highlights: {
        compare: (highlights && highlights.compare) || [],
        swap: (highlights && highlights.swap) || [],
        sorted: (highlights && highlights.sorted) || [],
        pivot: (highlights && highlights.pivot) || [],
        active: (highlights && highlights.active) || [],
        found: (highlights && highlights.found) || [],
        range: highlights ? highlights.range : null,
      },
    };
  }

  function dsStep(view, message, data) {
    return { view: view, message: message, data: deepClone(data) };
  }

  function bubbleSortSteps(input) {
    var a = cloneArray(input);
    var steps = [barStep(a, "Initial state", {})];
    var sorted = [];
    for (var i = 0; i < a.length; i += 1) {
      for (var j = 0; j < a.length - 1 - i; j += 1) {
        steps.push(barStep(a, "Compare " + j + " and " + (j + 1), { compare: [j, j + 1], sorted: cloneArray(sorted) }));
        if (a[j] > a[j + 1]) {
          var t = a[j];
          a[j] = a[j + 1];
          a[j + 1] = t;
          steps.push(barStep(a, "Swap " + j + " and " + (j + 1), { swap: [j, j + 1], sorted: cloneArray(sorted) }));
        }
      }
      sorted.push(a.length - 1 - i);
      steps.push(barStep(a, "Index " + (a.length - 1 - i) + " fixed", { sorted: cloneArray(sorted) }));
    }
    steps.push(barStep(a, "Done", { sorted: range(a.length) }));
    return steps;
  }

  function selectionSortSteps(input) {
    var a = cloneArray(input);
    var steps = [barStep(a, "Initial state", {})];
    var sorted = [];
    for (var i = 0; i < a.length; i += 1) {
      var minIndex = i;
      for (var j = i + 1; j < a.length; j += 1) {
        steps.push(barStep(a, "Compare " + minIndex + " and " + j, { compare: [minIndex, j], sorted: cloneArray(sorted) }));
        if (a[j] < a[minIndex]) {
          minIndex = j;
          steps.push(barStep(a, "New minimum at " + minIndex, { active: [minIndex], sorted: cloneArray(sorted) }));
        }
      }
      if (minIndex !== i) {
        var t = a[i];
        a[i] = a[minIndex];
        a[minIndex] = t;
        steps.push(barStep(a, "Swap " + i + " and " + minIndex, { swap: [i, minIndex], sorted: cloneArray(sorted) }));
      }
      sorted.push(i);
      steps.push(barStep(a, "Index " + i + " fixed", { sorted: cloneArray(sorted) }));
    }
    steps.push(barStep(a, "Done", { sorted: range(a.length) }));
    return steps;
  }

  function quickSortSteps(input) {
    var a = cloneArray(input);
    var steps = [barStep(a, "Initial state", {})];

    function partition(l, r) {
      var pivot = a[r];
      var i = l - 1;
      steps.push(barStep(a, "Choose pivot index " + r, { pivot: [r] }));
      for (var j = l; j < r; j += 1) {
        steps.push(barStep(a, "Compare index " + j + " with pivot", { compare: [j, r], pivot: [r] }));
        if (a[j] <= pivot) {
          i += 1;
          var t = a[i];
          a[i] = a[j];
          a[j] = t;
          steps.push(barStep(a, "Swap " + i + " and " + j, { swap: [i, j], pivot: [r] }));
        }
      }
      var x = a[i + 1];
      a[i + 1] = a[r];
      a[r] = x;
      steps.push(barStep(a, "Pivot to index " + (i + 1), { swap: [i + 1, r], pivot: [i + 1] }));
      return i + 1;
    }

    function solve(l, r) {
      if (l >= r) return;
      var p = partition(l, r);
      solve(l, p - 1);
      solve(p + 1, r);
    }

    solve(0, a.length - 1);
    steps.push(barStep(a, "Done", { sorted: range(a.length) }));
    return steps;
  }

  function heapSortSteps(input) {
    var a = cloneArray(input);
    var steps = [barStep(a, "Initial state", {})];

    function heapify(size, root) {
      var largest = root;
      var left = root * 2 + 1;
      var right = root * 2 + 2;
      if (left < size) {
        steps.push(barStep(a, "Compare " + root + " and " + left, { compare: [root, left] }));
        if (a[left] > a[largest]) largest = left;
      }
      if (right < size) {
        steps.push(barStep(a, "Compare " + largest + " and " + right, { compare: [largest, right] }));
        if (a[right] > a[largest]) largest = right;
      }
      if (largest !== root) {
        var t = a[root];
        a[root] = a[largest];
        a[largest] = t;
        steps.push(barStep(a, "Swap " + root + " and " + largest, { swap: [root, largest] }));
        heapify(size, largest);
      }
    }

    for (var i = Math.floor(a.length / 2) - 1; i >= 0; i -= 1) heapify(a.length, i);
    for (var k = a.length - 1; k > 0; k -= 1) {
      var t2 = a[0];
      a[0] = a[k];
      a[k] = t2;
      steps.push(barStep(a, "Move max to " + k, { swap: [0, k], sorted: range(a.length).slice(k) }));
      heapify(k, 0);
    }
    steps.push(barStep(a, "Done", { sorted: range(a.length) }));
    return steps;
  }

  function linearSearchSteps(input, target) {
    var a = cloneArray(input);
    var steps = [barStep(a, "Linear search target " + target, {})];
    for (var i = 0; i < a.length; i += 1) {
      steps.push(barStep(a, "Check index " + i, { compare: [i], active: [i] }));
      if (a[i] === target) {
        steps.push(barStep(a, "Found at " + i, { found: [i], active: [i] }));
        return steps;
      }
    }
    steps.push(barStep(a, "Not found", {}));
    return steps;
  }

  function binarySearchSteps(input, target) {
    var a = cloneArray(input).sort(function (x, y) { return x - y; });
    var steps = [barStep(a, "Binary search target " + target + " (array sorted first)", {})];
    var left = 0;
    var right = a.length - 1;
    while (left <= right) {
      var mid = Math.floor((left + right) / 2);
      steps.push(barStep(a, "left=" + left + ", right=" + right + ", mid=" + mid, { compare: [mid], active: [mid], range: [left, right] }));
      if (a[mid] === target) {
        steps.push(barStep(a, "Found at " + mid, { found: [mid], range: [left, right] }));
        return steps;
      }
      if (a[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    steps.push(barStep(a, "Not found", {}));
    return steps;
  }
  function singlyLinkedListSteps(input) {
    var list = cloneArray(input.slice(0, 5));
    var steps = [];

    function pushStep(msg, activeIndex) {
      steps.push(dsStep("list", msg, {
        nodes: cloneArray(list),
        doubly: false,
        head: list.length > 0 ? 0 : -1,
        tail: list.length > 0 ? list.length - 1 : -1,
        activeIndex: typeof activeIndex === "number" ? activeIndex : -1,
      }));
    }

    pushStep("Initialize singly linked list", -1);
    var hv = randomInt(10, 99);
    list.unshift(hv);
    pushStep("Insert " + hv + " at head", 0);

    var tv = randomInt(10, 99);
    list.push(tv);
    pushStep("Insert " + tv + " at tail", list.length - 1);

    var pos = Math.min(2, list.length);
    var mv = randomInt(10, 99);
    list.splice(pos, 0, mv);
    pushStep("Insert " + mv + " at index " + pos, pos);

    var del = Math.floor(list.length / 2);
    var removed = list.splice(del, 1)[0];
    pushStep("Delete index " + del + " (value " + removed + ")", Math.min(del, list.length - 1));

    var target = list[Math.floor(list.length / 2)];
    for (var i = 0; i < list.length; i += 1) {
      pushStep("Traverse node " + i + " looking for " + target, i);
      if (list[i] === target) {
        pushStep("Found value " + target + " at index " + i, i);
        break;
      }
    }
    return steps;
  }

  function doublyLinkedListSteps(input) {
    var list = cloneArray(input.slice(0, 5));
    var steps = [];

    function pushStep(msg, activeIndex) {
      steps.push(dsStep("list", msg, {
        nodes: cloneArray(list),
        doubly: true,
        head: list.length > 0 ? 0 : -1,
        tail: list.length > 0 ? list.length - 1 : -1,
        activeIndex: typeof activeIndex === "number" ? activeIndex : -1,
      }));
    }

    pushStep("Initialize doubly linked list", -1);
    var frontVal = randomInt(10, 99);
    list.unshift(frontVal);
    pushStep("Insert " + frontVal + " at head", 0);

    var backVal = randomInt(10, 99);
    list.push(backVal);
    pushStep("Insert " + backVal + " at tail", list.length - 1);

    var p = Math.min(1, list.length);
    var v = randomInt(10, 99);
    list.splice(p, 0, v);
    pushStep("Insert " + v + " at index " + p, p);

    var tailRemoved = list.pop();
    pushStep("Delete tail value " + tailRemoved, list.length - 1);

    for (var i = list.length - 1; i >= 0; i -= 1) {
      pushStep("Reverse traversal visits index " + i, i);
    }
    return steps;
  }

  function stackSteps(input) {
    var stack = [];
    var steps = [];

    function pushStep(msg, active) {
      steps.push(dsStep("stack", msg, {
        items: cloneArray(stack),
        activeIndex: typeof active === "number" ? active : -1,
      }));
    }

    pushStep("Initialize empty stack", -1);
    var seed = input.slice(0, 6);
    for (var i = 0; i < seed.length; i += 1) {
      stack.push(seed[i]);
      pushStep("Push " + seed[i], stack.length - 1);
    }

    if (stack.length > 0) pushStep("Pop " + stack.pop(), stack.length - 1);
    if (stack.length > 0) pushStep("Pop " + stack.pop(), stack.length - 1);

    var add = randomInt(10, 99);
    stack.push(add);
    pushStep("Push " + add, stack.length - 1);
    if (stack.length > 0) pushStep("Top is " + stack[stack.length - 1], stack.length - 1);

    return steps;
  }

  function queueSteps(input) {
    var queue = [];
    var steps = [];

    function pushStep(msg, active) {
      steps.push(dsStep("queue", msg, {
        items: cloneArray(queue),
        front: queue.length ? 0 : -1,
        rear: queue.length ? queue.length - 1 : -1,
        activeIndex: typeof active === "number" ? active : -1,
      }));
    }

    pushStep("Initialize empty queue", -1);
    var seed = input.slice(0, 6);
    for (var i = 0; i < seed.length; i += 1) {
      queue.push(seed[i]);
      pushStep("Enqueue " + seed[i], queue.length - 1);
    }

    if (queue.length > 0) pushStep("Dequeue " + queue.shift(), 0);
    if (queue.length > 0) pushStep("Dequeue " + queue.shift(), 0);

    var add = randomInt(10, 99);
    queue.push(add);
    pushStep("Enqueue " + add, queue.length - 1);
    if (queue.length > 0) pushStep("Front is " + queue[0], 0);

    return steps;
  }

  function unionFindSteps(input) {
    var n = Math.max(6, Math.min(10, Math.floor(input.length / 2)));
    var parent = [];
    var size = [];
    var steps = [];

    for (var i = 0; i < n; i += 1) {
      parent.push(i);
      size.push(1);
    }

    function rootNoCompress(x) {
      var cur = x;
      while (parent[cur] !== cur) cur = parent[cur];
      return cur;
    }

    function collectGroups() {
      var map = {};
      for (var i = 0; i < n; i += 1) {
        var r = rootNoCompress(i);
        if (!map[r]) map[r] = [];
        map[r].push(i);
      }
      var out = [];
      for (var key in map) if (Object.prototype.hasOwnProperty.call(map, key)) out.push(map[key]);
      return out;
    }

    function tracePath(x) {
      var p = [x];
      var cur = x;
      while (parent[cur] !== cur) {
        cur = parent[cur];
        p.push(cur);
      }
      return p;
    }

    function compress(x) {
      var path = [];
      var cur = x;
      while (parent[cur] !== cur) {
        path.push(cur);
        cur = parent[cur];
      }
      for (var i = 0; i < path.length; i += 1) parent[path[i]] = cur;
      path.push(cur);
      return path;
    }

    function pushStep(msg, active) {
      steps.push(dsStep("uf", msg, {
        parent: cloneArray(parent),
        size: cloneArray(size),
        groups: collectGroups(),
        active: active || [],
      }));
    }

    pushStep("Initialize Union-Find with " + n + " nodes", []);
    var pairs = [[0, 1], [2, 3], [1, 2], [4, 5], [6, 7], [0, 7], [3, 5]];
    for (var k = 0; k < pairs.length; k += 1) {
      var a = pairs[k][0];
      var b = pairs[k][1];
      if (a >= n || b >= n) continue;
      var ra = rootNoCompress(a);
      var rb = rootNoCompress(b);
      pushStep("Union(" + a + ", " + b + "), roots = (" + ra + ", " + rb + ")", [a, b, ra, rb]);
      if (ra !== rb) {
        if (size[ra] < size[rb]) {
          var t = ra;
          ra = rb;
          rb = t;
        }
        parent[rb] = ra;
        size[ra] += size[rb];
        pushStep("Attach root " + rb + " under root " + ra, [ra, rb]);
      }
    }

    var queries = [n - 1, Math.floor(n / 2), 1];
    for (var q = 0; q < queries.length; q += 1) {
      var node = queries[q];
      var path = tracePath(node);
      pushStep("Find(" + node + ") path: " + path.join(" -> "), path);
      var compressed = compress(node);
      pushStep("Path compression for " + node, compressed);
    }

    return steps;
  }
  function heapStructureSteps(input) {
    var heap = [];
    var steps = [];

    function pushStep(msg, active) {
      steps.push(dsStep("heap", msg, {
        heap: cloneArray(heap),
        active: active || [],
      }));
    }

    function siftUp(idx) {
      var i = idx;
      while (i > 0) {
        var p = Math.floor((i - 1) / 2);
        pushStep("Compare child " + i + " with parent " + p, [i, p]);
        if (heap[p] >= heap[i]) break;
        var t = heap[p];
        heap[p] = heap[i];
        heap[i] = t;
        pushStep("Swap " + p + " and " + i, [p, i]);
        i = p;
      }
    }

    function siftDown(idx) {
      var i = idx;
      while (true) {
        var l = i * 2 + 1;
        var r = l + 1;
        var largest = i;
        if (l < heap.length) {
          pushStep("Compare " + i + " and " + l, [i, l]);
          if (heap[l] > heap[largest]) largest = l;
        }
        if (r < heap.length) {
          pushStep("Compare " + largest + " and " + r, [largest, r]);
          if (heap[r] > heap[largest]) largest = r;
        }
        if (largest === i) break;
        var t = heap[i];
        heap[i] = heap[largest];
        heap[largest] = t;
        pushStep("Swap " + i + " and " + largest, [i, largest]);
        i = largest;
      }
    }

    pushStep("Initialize empty max heap", []);
    var seed = input.slice(0, 8);
    for (var i = 0; i < seed.length; i += 1) {
      heap.push(seed[i]);
      pushStep("Insert " + seed[i], [heap.length - 1]);
      siftUp(heap.length - 1);
    }

    for (var x = 0; x < 2; x += 1) {
      if (!heap.length) break;
      var maxVal = heap[0];
      var last = heap.length - 1;
      var tmp = heap[0];
      heap[0] = heap[last];
      heap[last] = tmp;
      pushStep("Swap root with last for extract-max", [0, last]);
      heap.pop();
      pushStep("Extract max value " + maxVal, [0]);
      if (heap.length) siftDown(0);
    }

    return steps;
  }

  function trieSteps() {
    var nodes = [{ id: 0, ch: "root", parent: -1, end: false, children: {} }];
    var words = [];
    var steps = [];
    var seed = ["cat", "car", "code", "dog", "dot", "data"];

    function cloneNodes() {
      var out = [];
      for (var i = 0; i < nodes.length; i += 1) {
        out.push({
          id: nodes[i].id,
          ch: nodes[i].ch,
          parent: nodes[i].parent,
          end: nodes[i].end,
          children: deepClone(nodes[i].children),
        });
      }
      return out;
    }

    function pushStep(msg, path, query, result) {
      steps.push(dsStep("trie", msg, {
        nodes: cloneNodes(),
        words: cloneArray(words),
        activePath: path ? cloneArray(path) : [],
        query: query || "",
        result: result || "",
      }));
    }

    function addNode(parentId, ch) {
      var id = nodes.length;
      nodes.push({ id: id, ch: ch, parent: parentId, end: false, children: {} });
      nodes[parentId].children[ch] = id;
      return id;
    }

    function insertWord(word) {
      var cur = 0;
      var path = [0];
      pushStep("Insert word '" + word + "'", path, word, "inserting");
      for (var i = 0; i < word.length; i += 1) {
        var ch = word[i];
        if (!Object.prototype.hasOwnProperty.call(nodes[cur].children, ch)) {
          var id = addNode(cur, ch);
          path.push(id);
          pushStep("Create node '" + ch + "'", path, word, "creating");
          cur = id;
        } else {
          cur = nodes[cur].children[ch];
          path.push(cur);
          pushStep("Traverse edge '" + ch + "'", path, word, "traversing");
        }
      }
      nodes[cur].end = true;
      words.push(word);
      pushStep("Mark terminal for '" + word + "'", path, word, "inserted");
    }

    function searchWord(word) {
      var cur = 0;
      var path = [0];
      pushStep("Search word '" + word + "'", path, word, "searching");
      for (var i = 0; i < word.length; i += 1) {
        var ch = word[i];
        if (!Object.prototype.hasOwnProperty.call(nodes[cur].children, ch)) {
          pushStep("Missing edge '" + ch + "'", path, word, "not found");
          return;
        }
        cur = nodes[cur].children[ch];
        path.push(cur);
        pushStep("Follow edge '" + ch + "'", path, word, "searching");
      }
      if (nodes[cur].end) pushStep("Word '" + word + "' found", path, word, "found");
      else pushStep("Prefix exists, not a full word", path, word, "prefix");
    }

    pushStep("Initialize empty trie", [0], "", "ready");
    for (var i = 0; i < seed.length; i += 1) insertWord(seed[i]);
    searchWord("code");
    searchWord("cow");
    return steps;
  }

  function edgeKey(u, v, directed) {
    if (directed) return u + ">" + v;
    return u < v ? u + "-" + v : v + "-" + u;
  }

  function graphStep(message, graph, state) {
    return dsStep("graph", message, {
      nodes: deepClone(graph.nodes),
      edges: deepClone(graph.edges),
      directed: !!graph.directed,
      activeNodes: (state && state.activeNodes) ? cloneArray(state.activeNodes) : [],
      visitedNodes: (state && state.visitedNodes) ? cloneArray(state.visitedNodes) : [],
      doneNodes: (state && state.doneNodes) ? cloneArray(state.doneNodes) : [],
      activeEdges: (state && state.activeEdges) ? cloneArray(state.activeEdges) : [],
      selectedEdges: (state && state.selectedEdges) ? cloneArray(state.selectedEdges) : [],
      matchEdges: (state && state.matchEdges) ? cloneArray(state.matchEdges) : [],
      source: (state && typeof state.source === "number") ? state.source : -1,
      dist: (state && state.dist) ? cloneArray(state.dist) : null,
      parent: (state && state.parent) ? cloneArray(state.parent) : null,
      order: (state && state.order) ? cloneArray(state.order) : [],
      queue: (state && state.queue) ? cloneArray(state.queue) : [],
      nodeColors: (state && state.nodeColors) ? deepClone(state.nodeColors) : {},
      leftSet: (state && state.leftSet) ? cloneArray(state.leftSet) : [],
      rightSet: (state && state.rightSet) ? cloneArray(state.rightSet) : [],
      extra: (state && state.extra) ? String(state.extra) : "",
    });
  }

  function matrixStep(message, matrix, state) {
    return dsStep("matrix", message, {
      matrix: deepClone(matrix),
      inf: (state && state.inf) || 1000000000,
      active: (state && state.active) ? deepClone(state.active) : null,
      updated: (state && state.updated) ? deepClone(state.updated) : null,
      pivot: (state && typeof state.pivot === "number") ? state.pivot : -1,
    });
  }

  function buildGraph(nodes, edges, directed) {
    var graphNodes = [];
    for (var i = 0; i < nodes.length; i += 1) {
      graphNodes.push({
        id: i,
        x: nodes[i][0],
        y: nodes[i][1],
        label: String(i),
      });
    }
    var graphEdges = [];
    for (var j = 0; j < edges.length; j += 1) {
      var item = edges[j];
      graphEdges.push({
        id: edgeKey(item[0], item[1], directed),
        u: item[0],
        v: item[1],
        w: (typeof item[2] === "number") ? item[2] : null,
        directed: !!directed,
      });
    }
    return { nodes: graphNodes, edges: graphEdges, directed: !!directed };
  }

  function buildAdjList(n, edges, directed) {
    var adj = [];
    for (var i = 0; i < n; i += 1) adj.push([]);
    for (var j = 0; j < edges.length; j += 1) {
      var e = edges[j];
      adj[e.u].push({ to: e.v, w: e.w, id: e.id });
      if (!directed) adj[e.v].push({ to: e.u, w: e.w, id: e.id });
    }
    for (var k = 0; k < n; k += 1) {
      adj[k].sort(function (a, b) { return a.to - b.to; });
    }
    return adj;
  }

  function listVisited(visited) {
    var out = [];
    for (var i = 0; i < visited.length; i += 1) if (visited[i]) out.push(i);
    return out;
  }

  function listDone(done) {
    return cloneArray(done);
  }

  function parentEdgeList(parent, directed) {
    var edges = [];
    for (var i = 0; i < parent.length; i += 1) {
      if (parent[i] !== -1) edges.push(edgeKey(parent[i], i, directed));
    }
    return edges;
  }

  function graphTraversalFixture() {
    return buildGraph(
      [[12, 42], [30, 20], [30, 64], [48, 14], [50, 42], [52, 70], [76, 50]],
      [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [4, 5], [5, 6]],
      false
    );
  }

  function graphDagFixture() {
    return buildGraph(
      [[12, 42], [30, 18], [30, 66], [50, 42], [68, 20], [84, 42]],
      [[0, 1], [0, 2], [1, 3], [2, 3], [1, 4], [3, 5], [4, 5]],
      true
    );
  }

  function graphWeightedFixture() {
    return buildGraph(
      [[10, 46], [28, 20], [30, 68], [54, 24], [78, 46], [54, 74]],
      [[0, 1, 7], [0, 2, 9], [0, 5, 14], [1, 2, 10], [1, 3, 15], [2, 3, 11], [2, 5, 2], [5, 4, 9], [4, 3, 6]],
      true
    );
  }

  function graphNegativeFixture() {
    return buildGraph(
      [[10, 46], [30, 20], [30, 72], [56, 42], [82, 42]],
      [[0, 1, 4], [0, 2, 5], [1, 2, -2], [1, 3, 6], [2, 3, 1], [3, 4, 2], [2, 4, 5]],
      true
    );
  }

  function graphMstFixture() {
    return buildGraph(
      [[12, 46], [30, 18], [30, 74], [52, 26], [56, 70], [82, 48]],
      [[0, 1, 4], [0, 2, 4], [1, 2, 2], [1, 3, 5], [2, 3, 5], [2, 4, 11], [3, 4, 2], [3, 5, 6], [4, 5, 3]],
      false
    );
  }

  function graphBipartiteFixture() {
    return buildGraph(
      [[22, 16], [22, 36], [22, 58], [22, 80], [78, 16], [78, 36], [78, 58], [78, 80]],
      [[0, 4], [0, 5], [1, 5], [1, 6], [2, 6], [2, 7], [3, 4], [3, 7]],
      false
    );
  }

  function dfsGraphSteps() {
    var graph = graphTraversalFixture();
    var n = graph.nodes.length;
    var adj = buildAdjList(n, graph.edges, false);
    var visited = [];
    var done = [];
    var order = [];
    var treeEdges = [];
    var steps = [graphStep("DFS starts at node 0", graph, { activeNodes: [0], order: [] })];

    for (var i = 0; i < n; i += 1) visited.push(false);

    function dfs(u) {
      visited[u] = true;
      order.push(u);
      steps.push(graphStep("Visit node " + u, graph, {
        activeNodes: [u],
        visitedNodes: listVisited(visited),
        selectedEdges: treeEdges,
        order: order,
      }));

      for (var k = 0; k < adj[u].length; k += 1) {
        var edge = adj[u][k];
        var v = edge.to;
        steps.push(graphStep("Explore edge " + u + "-" + v, graph, {
          activeNodes: [u, v],
          activeEdges: [edge.id],
          visitedNodes: listVisited(visited),
          selectedEdges: treeEdges,
          order: order,
        }));
        if (!visited[v]) {
          treeEdges.push(edge.id);
          steps.push(graphStep("Take tree edge " + u + "-" + v, graph, {
            activeNodes: [u, v],
            activeEdges: [edge.id],
            visitedNodes: listVisited(visited),
            selectedEdges: treeEdges,
            order: order,
          }));
          dfs(v);
        }
      }

      done.push(u);
      steps.push(graphStep("Finish node " + u, graph, {
        visitedNodes: listVisited(visited),
        doneNodes: listDone(done),
        selectedEdges: treeEdges,
        order: order,
      }));
    }

    dfs(0);
    steps.push(graphStep("DFS order: " + order.join(" -> "), graph, {
      visitedNodes: listVisited(visited),
      doneNodes: listDone(done),
      selectedEdges: treeEdges,
      order: order,
    }));
    return steps;
  }

  function bfsGraphSteps() {
    var graph = graphTraversalFixture();
    var n = graph.nodes.length;
    var adj = buildAdjList(n, graph.edges, false);
    var visited = [];
    var order = [];
    var treeEdges = [];
    var queue = [0];
    var steps = [];
    for (var i = 0; i < n; i += 1) visited.push(false);
    visited[0] = true;

    steps.push(graphStep("BFS starts at node 0", graph, {
      activeNodes: [0],
      visitedNodes: listVisited(visited),
      queue: queue,
      order: order,
    }));

    while (queue.length > 0) {
      var u = queue.shift();
      order.push(u);
      steps.push(graphStep("Pop " + u + " from queue", graph, {
        activeNodes: [u],
        visitedNodes: listVisited(visited),
        selectedEdges: treeEdges,
        queue: queue,
        order: order,
      }));

      for (var k = 0; k < adj[u].length; k += 1) {
        var edge = adj[u][k];
        var v = edge.to;
        steps.push(graphStep("Inspect edge " + u + "-" + v, graph, {
          activeNodes: [u, v],
          activeEdges: [edge.id],
          visitedNodes: listVisited(visited),
          selectedEdges: treeEdges,
          queue: queue,
          order: order,
        }));
        if (!visited[v]) {
          visited[v] = true;
          queue.push(v);
          treeEdges.push(edge.id);
          steps.push(graphStep("Discover node " + v + ", enqueue it", graph, {
            activeNodes: [v],
            activeEdges: [edge.id],
            visitedNodes: listVisited(visited),
            selectedEdges: treeEdges,
            queue: queue,
            order: order,
          }));
        }
      }
    }

    steps.push(graphStep("BFS order: " + order.join(" -> "), graph, {
      visitedNodes: listVisited(visited),
      selectedEdges: treeEdges,
      order: order,
    }));
    return steps;
  }

  function topoSortSteps() {
    var graph = graphDagFixture();
    var n = graph.nodes.length;
    var adj = buildAdjList(n, graph.edges, true);
    var indeg = [];
    var queue = [];
    var order = [];
    var steps = [];

    for (var i = 0; i < n; i += 1) indeg.push(0);
    for (var e = 0; e < graph.edges.length; e += 1) indeg[graph.edges[e].v] += 1;
    for (var j = 0; j < n; j += 1) if (indeg[j] === 0) queue.push(j);

    steps.push(graphStep("Initial indegree: [" + indeg.join(", ") + "]", graph, {
      queue: queue,
      order: order,
      extra: "nodes with indegree 0 are in queue",
    }));

    while (queue.length > 0) {
      var u = queue.shift();
      order.push(u);
      steps.push(graphStep("Output node " + u + " in topological order", graph, {
        activeNodes: [u],
        queue: queue,
        order: order,
      }));

      for (var k = 0; k < adj[u].length; k += 1) {
        var edge = adj[u][k];
        var v = edge.to;
        indeg[v] -= 1;
        steps.push(graphStep("Decrease indegree of " + v + " to " + indeg[v], graph, {
          activeNodes: [u, v],
          activeEdges: [edge.id],
          queue: queue,
          order: order,
          extra: "indegree: [" + indeg.join(", ") + "]",
        }));
        if (indeg[v] === 0) {
          queue.push(v);
          steps.push(graphStep("Enqueue " + v + " (indegree becomes 0)", graph, {
            activeNodes: [v],
            queue: queue,
            order: order,
          }));
        }
      }
    }

    steps.push(graphStep("Topological order: " + order.join(" -> "), graph, {
      doneNodes: order,
      order: order,
    }));
    return steps;
  }

  function dijkstraSteps() {
    var INF = 1000000000;
    var graph = graphWeightedFixture();
    var n = graph.nodes.length;
    var adj = buildAdjList(n, graph.edges, true);
    var dist = [];
    var parent = [];
    var used = [];
    var steps = [];
    var source = 0;

    for (var i = 0; i < n; i += 1) {
      dist.push(INF);
      parent.push(-1);
      used.push(false);
    }
    dist[source] = 0;

    steps.push(graphStep("Initialize Dijkstra from source 0", graph, {
      source: source,
      dist: dist,
      parent: parent,
      doneNodes: [],
      selectedEdges: parentEdgeList(parent, true),
    }));

    for (var iter = 0; iter < n; iter += 1) {
      var u = -1;
      for (var j = 0; j < n; j += 1) {
        if (!used[j] && (u === -1 || dist[j] < dist[u])) u = j;
      }
      if (u === -1 || dist[u] >= INF) break;
      used[u] = true;

      steps.push(graphStep("Choose node " + u + " with minimum tentative distance", graph, {
        source: source,
        activeNodes: [u],
        dist: dist,
        parent: parent,
        doneNodes: listVisited(used),
        selectedEdges: parentEdgeList(parent, true),
      }));

      for (var k = 0; k < adj[u].length; k += 1) {
        var edge = adj[u][k];
        var v = edge.to;
        var w = edge.w;
        steps.push(graphStep("Relax edge " + u + "->" + v + " (w=" + w + ")", graph, {
          source: source,
          activeNodes: [u, v],
          activeEdges: [edge.id],
          dist: dist,
          parent: parent,
          doneNodes: listVisited(used),
          selectedEdges: parentEdgeList(parent, true),
        }));
        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          parent[v] = u;
          steps.push(graphStep("Update dist[" + v + "] = " + dist[v], graph, {
            source: source,
            activeNodes: [v],
            activeEdges: [edge.id],
            dist: dist,
            parent: parent,
            doneNodes: listVisited(used),
            selectedEdges: parentEdgeList(parent, true),
          }));
        }
      }
    }

    steps.push(graphStep("Dijkstra finished", graph, {
      source: source,
      dist: dist,
      parent: parent,
      doneNodes: listVisited(used),
      selectedEdges: parentEdgeList(parent, true),
    }));
    return steps;
  }

  function bellmanFordSteps() {
    var INF = 1000000000;
    var graph = graphNegativeFixture();
    var n = graph.nodes.length;
    var dist = [];
    var parent = [];
    var steps = [];
    var source = 0;

    for (var i = 0; i < n; i += 1) {
      dist.push(INF);
      parent.push(-1);
    }
    dist[source] = 0;

    steps.push(graphStep("Initialize Bellman-Ford from source 0", graph, {
      source: source,
      dist: dist,
      parent: parent,
      selectedEdges: parentEdgeList(parent, true),
    }));

    for (var round = 1; round <= n - 1; round += 1) {
      var changed = false;
      for (var e = 0; e < graph.edges.length; e += 1) {
        var edge = graph.edges[e];
        steps.push(graphStep("Round " + round + ", relax " + edge.u + "->" + edge.v + " (w=" + edge.w + ")", graph, {
          source: source,
          activeNodes: [edge.u, edge.v],
          activeEdges: [edge.id],
          dist: dist,
          parent: parent,
          selectedEdges: parentEdgeList(parent, true),
        }));
        if (dist[edge.u] < INF && dist[edge.u] + edge.w < dist[edge.v]) {
          dist[edge.v] = dist[edge.u] + edge.w;
          parent[edge.v] = edge.u;
          changed = true;
          steps.push(graphStep("Update dist[" + edge.v + "] = " + dist[edge.v], graph, {
            source: source,
            activeNodes: [edge.v],
            activeEdges: [edge.id],
            dist: dist,
            parent: parent,
            selectedEdges: parentEdgeList(parent, true),
          }));
        }
      }
      if (!changed) {
        steps.push(graphStep("No update in this round, stop early", graph, {
          source: source,
          dist: dist,
          parent: parent,
          selectedEdges: parentEdgeList(parent, true),
        }));
        break;
      }
    }

    var hasNegativeCycle = false;
    for (var c = 0; c < graph.edges.length; c += 1) {
      var ed = graph.edges[c];
      if (dist[ed.u] < INF && dist[ed.u] + ed.w < dist[ed.v]) {
        hasNegativeCycle = true;
        break;
      }
    }

    steps.push(graphStep(hasNegativeCycle ? "Negative cycle detected" : "Bellman-Ford finished", graph, {
      source: source,
      dist: dist,
      parent: parent,
      selectedEdges: parentEdgeList(parent, true),
    }));
    return steps;
  }

  function spfaSteps() {
    var INF = 1000000000;
    var graph = graphNegativeFixture();
    var n = graph.nodes.length;
    var adj = buildAdjList(n, graph.edges, true);
    var dist = [];
    var parent = [];
    var inQueue = [];
    var relaxCount = [];
    var queue = [0];
    var steps = [];
    var source = 0;

    for (var i = 0; i < n; i += 1) {
      dist.push(INF);
      parent.push(-1);
      inQueue.push(false);
      relaxCount.push(0);
    }
    dist[source] = 0;
    inQueue[source] = true;

    steps.push(graphStep("Initialize SPFA from source 0", graph, {
      source: source,
      dist: dist,
      parent: parent,
      queue: queue,
      selectedEdges: parentEdgeList(parent, true),
    }));

    while (queue.length > 0) {
      var u = queue.shift();
      inQueue[u] = false;
      steps.push(graphStep("Pop node " + u + " from queue", graph, {
        source: source,
        activeNodes: [u],
        dist: dist,
        parent: parent,
        queue: queue,
        selectedEdges: parentEdgeList(parent, true),
      }));

      for (var k = 0; k < adj[u].length; k += 1) {
        var edge = adj[u][k];
        var v = edge.to;
        var w = edge.w;
        steps.push(graphStep("Relax edge " + u + "->" + v + " (w=" + w + ")", graph, {
          source: source,
          activeNodes: [u, v],
          activeEdges: [edge.id],
          dist: dist,
          parent: parent,
          queue: queue,
          selectedEdges: parentEdgeList(parent, true),
        }));
        if (dist[u] < INF && dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          parent[v] = u;
          relaxCount[v] += 1;
          steps.push(graphStep("Update dist[" + v + "] = " + dist[v], graph, {
            source: source,
            activeNodes: [v],
            activeEdges: [edge.id],
            dist: dist,
            parent: parent,
            queue: queue,
            selectedEdges: parentEdgeList(parent, true),
          }));
          if (!inQueue[v]) {
            queue.push(v);
            inQueue[v] = true;
            steps.push(graphStep("Enqueue " + v, graph, {
              source: source,
              activeNodes: [v],
              dist: dist,
              parent: parent,
              queue: queue,
              selectedEdges: parentEdgeList(parent, true),
            }));
          }
        }
      }
    }

    steps.push(graphStep("SPFA finished", graph, {
      source: source,
      dist: dist,
      parent: parent,
      selectedEdges: parentEdgeList(parent, true),
    }));
    return steps;
  }

  function floydSteps() {
    var INF = 1000000000;
    var n = 5;
    var dist = [];
    var steps = [];
    var edges = [
      [0, 1, 3], [0, 2, 8], [0, 4, 7],
      [1, 0, 8], [1, 2, 2],
      [2, 3, 1],
      [3, 0, 2], [3, 4, 1],
      [4, 3, 2],
    ];

    for (var i = 0; i < n; i += 1) {
      dist.push([]);
      for (var j = 0; j < n; j += 1) {
        dist[i].push(i === j ? 0 : INF);
      }
    }
    for (var e = 0; e < edges.length; e += 1) {
      dist[edges[e][0]][edges[e][1]] = edges[e][2];
    }

    steps.push(matrixStep("Initial distance matrix", dist, { inf: INF }));

    for (var k = 0; k < n; k += 1) {
      steps.push(matrixStep("Use node " + k + " as intermediate", dist, {
        inf: INF,
        pivot: k,
      }));
      for (var i2 = 0; i2 < n; i2 += 1) {
        for (var j2 = 0; j2 < n; j2 += 1) {
          var candidate = dist[i2][k] + dist[k][j2];
          if (candidate < dist[i2][j2]) {
            dist[i2][j2] = candidate;
            steps.push(matrixStep("Update d[" + i2 + "][" + j2 + "] = " + candidate, dist, {
              inf: INF,
              pivot: k,
              active: { i: i2, j: j2, k: k },
              updated: { i: i2, j: j2 },
            }));
          } else {
            steps.push(matrixStep("Check d[" + i2 + "][" + j2 + "] via " + k, dist, {
              inf: INF,
              pivot: k,
              active: { i: i2, j: j2, k: k },
            }));
          }
        }
      }
    }

    steps.push(matrixStep("Floyd finished", dist, { inf: INF }));
    return steps;
  }

  function primSteps() {
    var INF = 1000000000;
    var graph = graphMstFixture();
    var n = graph.nodes.length;
    var adj = buildAdjList(n, graph.edges, false);
    var key = [];
    var parent = [];
    var inMst = [];
    var selected = [];
    var steps = [];

    for (var i = 0; i < n; i += 1) {
      key.push(INF);
      parent.push(-1);
      inMst.push(false);
    }
    key[0] = 0;

    steps.push(graphStep("Initialize Prim from node 0", graph, {
      source: 0,
      dist: key,
      parent: parent,
      selectedEdges: selected,
    }));

    for (var iter = 0; iter < n; iter += 1) {
      var u = -1;
      for (var v = 0; v < n; v += 1) {
        if (!inMst[v] && (u === -1 || key[v] < key[u])) u = v;
      }
      if (u === -1 || key[u] >= INF) break;
      inMst[u] = true;
      if (parent[u] !== -1) selected.push(edgeKey(parent[u], u, false));

      steps.push(graphStep("Add node " + u + " into MST", graph, {
        activeNodes: [u],
        doneNodes: listVisited(inMst),
        dist: key,
        parent: parent,
        selectedEdges: selected,
      }));

      for (var k = 0; k < adj[u].length; k += 1) {
        var edge = adj[u][k];
        var to = edge.to;
        var w = edge.w;
        if (!inMst[to] && w < key[to]) {
          key[to] = w;
          parent[to] = u;
          steps.push(graphStep("Update best edge for node " + to + " to weight " + w, graph, {
            activeNodes: [u, to],
            activeEdges: [edge.id],
            doneNodes: listVisited(inMst),
            dist: key,
            parent: parent,
            selectedEdges: selected,
          }));
        }
      }
    }

    steps.push(graphStep("Prim finished", graph, {
      doneNodes: listVisited(inMst),
      dist: key,
      parent: parent,
      selectedEdges: selected,
    }));
    return steps;
  }

  function kruskalSteps() {
    var graph = graphMstFixture();
    var n = graph.nodes.length;
    var edges = deepClone(graph.edges).sort(function (a, b) { return a.w - b.w; });
    var parent = [];
    var rank = [];
    var chosen = [];
    var steps = [];

    for (var i = 0; i < n; i += 1) {
      parent.push(i);
      rank.push(0);
    }

    function find(x) {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function unite(a, b) {
      var ra = find(a);
      var rb = find(b);
      if (ra === rb) return false;
      if (rank[ra] < rank[rb]) {
        var tmp = ra;
        ra = rb;
        rb = tmp;
      }
      parent[rb] = ra;
      if (rank[ra] === rank[rb]) rank[ra] += 1;
      return true;
    }

    steps.push(graphStep("Sort edges by weight for Kruskal", graph, {
      selectedEdges: chosen,
      extra: "sorted edges: " + edges.map(function (e) { return e.u + "-" + e.v + "(" + e.w + ")"; }).join(", "),
    }));

    for (var e = 0; e < edges.length; e += 1) {
      var edge = edges[e];
      steps.push(graphStep("Consider edge " + edge.u + "-" + edge.v + " (w=" + edge.w + ")", graph, {
        activeNodes: [edge.u, edge.v],
        activeEdges: [edge.id],
        selectedEdges: chosen,
      }));
      if (unite(edge.u, edge.v)) {
        chosen.push(edge.id);
        steps.push(graphStep("Choose edge " + edge.u + "-" + edge.v, graph, {
          activeNodes: [edge.u, edge.v],
          activeEdges: [edge.id],
          selectedEdges: chosen,
        }));
      }
      if (chosen.length === n - 1) break;
    }

    steps.push(graphStep("Kruskal finished", graph, {
      selectedEdges: chosen,
    }));
    return steps;
  }

  function bipartiteColoringSteps() {
    var graph = graphBipartiteFixture();
    var n = graph.nodes.length;
    var adj = buildAdjList(n, graph.edges, false);
    var color = [];
    var queue = [];
    var steps = [];
    var left = [0, 1, 2, 3];
    var right = [4, 5, 6, 7];

    for (var i = 0; i < n; i += 1) color.push(-1);

    function colorMap() {
      var map = {};
      for (var c = 0; c < color.length; c += 1) {
        if (color[c] !== -1) map[c] = color[c];
      }
      return map;
    }

    for (var s = 0; s < n; s += 1) {
      if (color[s] !== -1) continue;
      color[s] = 0;
      queue.push(s);
      steps.push(graphStep("Start BFS coloring from node " + s, graph, {
        activeNodes: [s],
        queue: queue,
        nodeColors: colorMap(),
        leftSet: left,
        rightSet: right,
      }));

      while (queue.length > 0) {
        var u = queue.shift();
        steps.push(graphStep("Pop node " + u + " for coloring", graph, {
          activeNodes: [u],
          queue: queue,
          nodeColors: colorMap(),
          leftSet: left,
          rightSet: right,
        }));
        for (var k = 0; k < adj[u].length; k += 1) {
          var edge = adj[u][k];
          var v = edge.to;
          if (color[v] === -1) {
            color[v] = 1 - color[u];
            queue.push(v);
            steps.push(graphStep("Color node " + v + " with color " + color[v], graph, {
              activeNodes: [u, v],
              activeEdges: [edge.id],
              queue: queue,
              nodeColors: colorMap(),
              leftSet: left,
              rightSet: right,
            }));
          } else if (color[v] === color[u]) {
            steps.push(graphStep("Conflict found: graph is not bipartite", graph, {
              activeNodes: [u, v],
              activeEdges: [edge.id],
              queue: queue,
              nodeColors: colorMap(),
              leftSet: left,
              rightSet: right,
            }));
            return steps;
          }
        }
      }
    }

    steps.push(graphStep("Bipartite coloring finished", graph, {
      nodeColors: colorMap(),
      leftSet: left,
      rightSet: right,
    }));
    return steps;
  }

  function hungarianSteps() {
    var graph = graphBipartiteFixture();
    var left = [0, 1, 2, 3];
    var right = [4, 5, 6, 7];
    var adj = buildAdjList(graph.nodes.length, graph.edges, false);
    var matchR = {};
    var steps = [];
    var i;

    for (i = 0; i < right.length; i += 1) matchR[right[i]] = -1;

    function matchEdges() {
      var arr = [];
      for (var r = 0; r < right.length; r += 1) {
        var rightNode = right[r];
        if (matchR[rightNode] !== -1) arr.push(edgeKey(matchR[rightNode], rightNode, false));
      }
      return arr;
    }

    function dfsAug(u, seenRight) {
      for (var k = 0; k < adj[u].length; k += 1) {
        var v = adj[u][k].to;
        if (!hasIndex(right, v)) continue;
        var eid = edgeKey(u, v, false);
        steps.push(graphStep("Try matching edge " + u + "-" + v, graph, {
          activeNodes: [u, v],
          activeEdges: [eid],
          matchEdges: matchEdges(),
          leftSet: left,
          rightSet: right,
        }));

        if (seenRight[v]) continue;
        seenRight[v] = true;

        if (matchR[v] === -1) {
          matchR[v] = u;
          steps.push(graphStep("Match " + u + " with " + v, graph, {
            activeNodes: [u, v],
            activeEdges: [eid],
            matchEdges: matchEdges(),
            leftSet: left,
            rightSet: right,
          }));
          return true;
        }

        steps.push(graphStep("Node " + v + " is matched with " + matchR[v] + ", try rematch", graph, {
          activeNodes: [u, v, matchR[v]],
          activeEdges: [eid],
          matchEdges: matchEdges(),
          leftSet: left,
          rightSet: right,
        }));

        if (dfsAug(matchR[v], seenRight)) {
          matchR[v] = u;
          steps.push(graphStep("Augment path success, rematch " + v + " with " + u, graph, {
            activeNodes: [u, v],
            activeEdges: [eid],
            matchEdges: matchEdges(),
            leftSet: left,
            rightSet: right,
          }));
          return true;
        }
      }
      return false;
    }

    steps.push(graphStep("Initialize Hungarian (Kuhn) matching", graph, {
      leftSet: left,
      rightSet: right,
      matchEdges: [],
    }));

    var matched = 0;
    for (i = 0; i < left.length; i += 1) {
      var u = left[i];
      var seen = {};
      if (dfsAug(u, seen)) matched += 1;
      steps.push(graphStep("After processing left node " + u + ", matching size = " + matched, graph, {
        activeNodes: [u],
        matchEdges: matchEdges(),
        leftSet: left,
        rightSet: right,
      }));
    }

    steps.push(graphStep("Hungarian finished, maximum matching = " + matched, graph, {
      matchEdges: matchEdges(),
      leftSet: left,
      rightSet: right,
    }));
    return steps;
  }

  var algorithms = [
    { id: "bubble-sort", name: "Bubble Sort", category: "Sorting", description: "Compare adjacent elements.", generator: bubbleSortSteps },
    { id: "selection-sort", name: "Selection Sort", category: "Sorting", description: "Select minimum each round.", generator: selectionSortSteps },
    { id: "quick-sort", name: "Quick Sort", category: "Sorting", description: "Partition by pivot.", generator: quickSortSteps },
    { id: "heap-sort", name: "Heap Sort", category: "Sorting", description: "Build max heap then extract.", generator: heapSortSteps },
    { id: "linear-search", name: "Linear Search", category: "Search", description: "Scan linearly.", needsTarget: true, generator: linearSearchSteps },
    { id: "binary-search", name: "Binary Search", category: "Search", description: "Halve range on sorted data.", needsTarget: true, generator: binarySearchSteps },
    { id: "singly-linked-list", name: "Singly Linked List", category: "Data Structure", description: "Insert/delete/traverse on single list.", generator: singlyLinkedListSteps },
    { id: "doubly-linked-list", name: "Doubly Linked List", category: "Data Structure", description: "Bidirectional linked list operations.", generator: doublyLinkedListSteps },
    { id: "stack", name: "Stack (LIFO)", category: "Data Structure", description: "Push/pop/top operations.", generator: stackSteps },
    { id: "queue", name: "Queue (FIFO)", category: "Data Structure", description: "Enqueue/dequeue/front operations.", generator: queueSteps },
    { id: "union-find", name: "Union-Find", category: "Data Structure", description: "Union by size + path compression.", generator: unionFindSteps },
    { id: "heap-structure", name: "Heap (Max Heap)", category: "Data Structure", description: "Insert/extract on a binary heap.", generator: heapStructureSteps },
    { id: "trie", name: "Trie", category: "Data Structure", description: "Insert/search on prefix tree.", generator: trieSteps },
    { id: "graph-dfs", name: "DFS", category: "Graph", description: "Depth-first traversal on an undirected graph.", generator: dfsGraphSteps },
    { id: "graph-bfs", name: "BFS", category: "Graph", description: "Breadth-first traversal with queue.", generator: bfsGraphSteps },
    { id: "graph-toposort", name: "Topological Sort", category: "Graph", description: "Kahn algorithm on DAG.", generator: topoSortSteps },
    { id: "graph-floyd", name: "Floyd-Warshall", category: "Graph", description: "All-pairs shortest path via dynamic programming.", generator: floydSteps },
    { id: "graph-dijkstra", name: "Dijkstra", category: "Graph", description: "Single-source shortest path with greedy selection.", generator: dijkstraSteps },
    { id: "graph-bellman-ford", name: "Bellman-Ford", category: "Graph", description: "Shortest path with negative edges support.", generator: bellmanFordSteps },
    { id: "graph-spfa", name: "SPFA", category: "Graph", description: "Queue-optimized Bellman-Ford.", generator: spfaSteps },
    { id: "graph-prim", name: "Prim", category: "Graph", description: "Minimum spanning tree by growing a cut.", generator: primSteps },
    { id: "graph-kruskal", name: "Kruskal", category: "Graph", description: "Minimum spanning tree by edge sorting + DSU.", generator: kruskalSteps },
    { id: "graph-bipartite-coloring", name: "Bipartite Coloring", category: "Graph", description: "Two-coloring check by BFS.", generator: bipartiteColoringSteps },
    { id: "graph-hungarian", name: "Hungarian (Kuhn)", category: "Graph", description: "Maximum bipartite matching with augmenting paths.", generator: hungarianSteps },
  ];

  function getAlgorithmById(id) {
    for (var i = 0; i < algorithms.length; i += 1) {
      if (algorithms[i].id === id) return algorithms[i];
    }
    return algorithms[0];
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function hasIndex(arr, index) {
    if (!arr) return false;
    for (var i = 0; i < arr.length; i += 1) if (arr[i] === index) return true;
    return false;
  }

  function createDiv(className, text) {
    var div = document.createElement("div");
    if (className) div.className = className;
    if (typeof text === "string") div.textContent = text;
    return div;
  }

  function barColor(index, highlights) {
    if (hasIndex(highlights.found, index)) return "var(--ok)";
    if (hasIndex(highlights.swap, index)) return "var(--swap)";
    if (hasIndex(highlights.compare, index)) return "var(--compare)";
    if (hasIndex(highlights.pivot, index)) return "var(--pivot)";
    if (hasIndex(highlights.sorted, index)) return "var(--sorted)";
    if (hasIndex(highlights.active, index)) return "var(--active)";
    if (highlights.range && (index < highlights.range[0] || index > highlights.range[1])) return "var(--dim)";
    return "var(--bar)";
  }

  function renderBars(container, step) {
    if (!step || !step.array || !step.array.length) {
      container.appendChild(createDiv("ds-empty", "No data"));
      return;
    }
    var maxValue = step.array[0];
    for (var i = 1; i < step.array.length; i += 1) if (step.array[i] > maxValue) maxValue = step.array[i];

    var track = createDiv("bar-track", "");
    for (var j = 0; j < step.array.length; j += 1) {
      var bar = createDiv("bar", "");
      bar.style.height = clamp((step.array[j] / maxValue) * 100, 4, 100) + "%";
      bar.style.background = barColor(j, step.highlights || {});
      bar.title = "index " + j + ": " + step.array[j];
      track.appendChild(bar);
    }
    container.appendChild(track);
  }

  function renderList(container, step) {
    var data = step.data || {};
    var nodes = data.nodes || [];
    if (!nodes.length) {
      container.appendChild(createDiv("ds-empty", "List is empty"));
      return;
    }
    var wrap = createDiv("ds-wrap list-view", "");
    for (var i = 0; i < nodes.length; i += 1) {
      var nodeCls = "ds-node" + (data.activeIndex === i ? " ds-active" : "");
      var node = createDiv(nodeCls, "");
      node.appendChild(createDiv("ds-node-val", String(nodes[i])));
      node.appendChild(createDiv("ds-node-idx", "#" + i));
      if (data.head === i) node.appendChild(createDiv("ds-badge ds-head", "HEAD"));
      if (data.tail === i) node.appendChild(createDiv("ds-badge ds-tail", "TAIL"));
      wrap.appendChild(node);
      if (i < nodes.length - 1) wrap.appendChild(createDiv("ds-arrow", data.doubly ? "<->" : "->"));
    }
    container.appendChild(wrap);
  }

  function renderStack(container, step) {
    var data = step.data || {};
    var items = data.items || [];
    var wrap = createDiv("stack-view", "");
    if (!items.length) {
      wrap.appendChild(createDiv("ds-empty", "Stack is empty"));
      container.appendChild(wrap);
      return;
    }
    for (var i = items.length - 1; i >= 0; i -= 1) {
      var itemCls = "stack-item" + (data.activeIndex === i ? " ds-active" : "");
      var item = createDiv(itemCls, String(items[i]));
      if (i === items.length - 1) item.appendChild(createDiv("ds-badge ds-top", "TOP"));
      wrap.appendChild(item);
    }
    container.appendChild(wrap);
  }

  function renderQueue(container, step) {
    var data = step.data || {};
    var items = data.items || [];
    if (!items.length) {
      container.appendChild(createDiv("ds-empty", "Queue is empty"));
      return;
    }
    var wrap = createDiv("ds-wrap queue-view", "");
    for (var i = 0; i < items.length; i += 1) {
      var cls = "queue-item" + (data.activeIndex === i ? " ds-active" : "");
      var item = createDiv(cls, String(items[i]));
      if (i === data.front) item.appendChild(createDiv("ds-badge ds-front", "FRONT"));
      if (i === data.rear) item.appendChild(createDiv("ds-badge ds-rear", "REAR"));
      wrap.appendChild(item);
    }
    container.appendChild(wrap);
  }

  function renderUnionFind(container, step) {
    var data = step.data || {};
    var parent = data.parent || [];
    var size = data.size || [];
    var groups = data.groups || [];
    var active = data.active || [];

    var layout = createDiv("uf-layout", "");
    var grid = createDiv("uf-grid", "");
    for (var i = 0; i < parent.length; i += 1) {
      var card = createDiv("uf-node" + (hasIndex(active, i) ? " ds-active" : ""), "");
      card.appendChild(createDiv("uf-title", "node " + i));
      card.appendChild(createDiv("uf-line", "parent: " + parent[i]));
      card.appendChild(createDiv("uf-line", "size: " + size[i]));
      grid.appendChild(card);
    }
    layout.appendChild(grid);

    var groupWrap = createDiv("uf-groups", "");
    groupWrap.appendChild(createDiv("uf-group-title", "Current Sets"));
    for (var g = 0; g < groups.length; g += 1) {
      groupWrap.appendChild(createDiv("uf-group-chip", "{ " + groups[g].join(", ") + " }"));
    }
    layout.appendChild(groupWrap);
    container.appendChild(layout);
  }

  function renderHeap(container, step) {
    var data = step.data || {};
    var heap = data.heap || [];
    var active = data.active || [];
    if (!heap.length) {
      container.appendChild(createDiv("ds-empty", "Heap is empty"));
      return;
    }
    var tree = createDiv("heap-tree", "");
    var index = 0;
    var level = 0;
    while (index < heap.length) {
      var row = createDiv("heap-row", "");
      var count = Math.pow(2, level);
      for (var i = 0; i < count && index < heap.length; i += 1, index += 1) {
        var node = createDiv("heap-node" + (hasIndex(active, index) ? " ds-active" : ""), String(heap[index]));
        node.appendChild(createDiv("heap-idx", "#" + index));
        row.appendChild(node);
      }
      tree.appendChild(row);
      level += 1;
    }
    container.appendChild(tree);
  }

  function renderTrie(container, step) {
    var data = step.data || {};
    var nodes = data.nodes || [];
    var activePath = data.activePath || [];
    if (!nodes.length) {
      container.appendChild(createDiv("ds-empty", "Trie is empty"));
      return;
    }

    container.appendChild(createDiv("trie-words", "Words: " + ((data.words && data.words.length) ? data.words.join(", ") : "-")));
    if (data.query) container.appendChild(createDiv("trie-query", "Query: " + data.query + " (" + data.result + ")"));

    var depthById = { 0: 0 };
    for (var i = 1; i < nodes.length; i += 1) {
      var d = 0;
      var cur = nodes[i];
      while (cur.parent !== -1) {
        d += 1;
        cur = nodes[cur.parent];
      }
      depthById[nodes[i].id] = d;
    }

    var rows = {};
    var maxDepth = 0;
    for (var j = 0; j < nodes.length; j += 1) {
      var id = nodes[j].id;
      var depth = depthById[id] || 0;
      if (!rows[depth]) rows[depth] = [];
      rows[depth].push(nodes[j]);
      if (depth > maxDepth) maxDepth = depth;
    }

    var layout = createDiv("trie-layout", "");
    for (var level = 0; level <= maxDepth; level += 1) {
      var row = createDiv("trie-row", "");
      var levelNodes = rows[level] || [];
      for (var k = 0; k < levelNodes.length; k += 1) {
        var nodeData = levelNodes[k];
        var label = nodeData.id === 0 ? "root" : nodeData.ch;
        var node = createDiv("trie-node" + (hasIndex(activePath, nodeData.id) ? " ds-active" : ""), label);
        node.appendChild(createDiv("trie-idx", "#" + nodeData.id));
        if (nodeData.end) node.appendChild(createDiv("ds-badge ds-end", "END"));
        row.appendChild(node);
      }
      layout.appendChild(row);
    }
    container.appendChild(layout);
  }

  function graphNumberLabel(value) {
    if (value === null || typeof value === "undefined") return "-";
    if (value >= 1000000000) return "INF";
    return String(value);
  }

  function renderGraph(container, step) {
    var data = step.data || {};
    var nodes = data.nodes || [];
    var edges = data.edges || [];
    if (!nodes.length) {
      container.appendChild(createDiv("ds-empty", "Graph is empty"));
      return;
    }

    var wrap = createDiv("graph-wrap", "");
    var info = createDiv("graph-info", "");
    if (data.order && data.order.length) info.appendChild(createDiv("graph-info-line", "Order: " + data.order.join(" -> ")));
    if (data.queue && data.queue.length) info.appendChild(createDiv("graph-info-line", "Queue: [" + data.queue.join(", ") + "]"));
    if (data.dist) info.appendChild(createDiv("graph-info-line", "Dist: [" + data.dist.map(graphNumberLabel).join(", ") + "]"));
    if (data.extra) info.appendChild(createDiv("graph-info-line", data.extra));
    if (info.children.length > 0) wrap.appendChild(info);

    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "graph-svg");
    svg.setAttribute("viewBox", "0 0 100 100");

    var defs = document.createElementNS(svgNS, "defs");
    var marker = document.createElementNS(svgNS, "marker");
    marker.setAttribute("id", "graph-arrow");
    marker.setAttribute("markerWidth", "6");
    marker.setAttribute("markerHeight", "6");
    marker.setAttribute("refX", "5");
    marker.setAttribute("refY", "3");
    marker.setAttribute("orient", "auto");
    var markerPath = document.createElementNS(svgNS, "path");
    markerPath.setAttribute("d", "M0,0 L6,3 L0,6 z");
    markerPath.setAttribute("fill", "#5d6e5b");
    marker.appendChild(markerPath);
    defs.appendChild(marker);
    svg.appendChild(defs);

    for (var e = 0; e < edges.length; e += 1) {
      var edge = edges[e];
      var from = nodes[edge.u];
      var to = nodes[edge.v];
      var line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", String(from.x));
      line.setAttribute("y1", String(from.y));
      line.setAttribute("x2", String(to.x));
      line.setAttribute("y2", String(to.y));
      var edgeClass = "graph-edge";
      if (hasIndex(data.selectedEdges, edge.id)) edgeClass += " graph-edge-selected";
      if (hasIndex(data.matchEdges, edge.id)) edgeClass += " graph-edge-match";
      if (hasIndex(data.activeEdges, edge.id)) edgeClass += " graph-edge-active";
      line.setAttribute("class", edgeClass);
      if (data.directed || edge.directed) line.setAttribute("marker-end", "url(#graph-arrow)");
      svg.appendChild(line);

      if (typeof edge.w === "number") {
        var tx = (from.x + to.x) / 2;
        var ty = (from.y + to.y) / 2;
        var text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", String(tx));
        text.setAttribute("y", String(ty - 1));
        text.setAttribute("class", "graph-weight");
        text.textContent = String(edge.w);
        svg.appendChild(text);
      }
    }

    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      var g = document.createElementNS(svgNS, "g");

      var circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", String(node.x));
      circle.setAttribute("cy", String(node.y));
      circle.setAttribute("r", "4.2");
      var nodeClass = "graph-node";
      if (hasIndex(data.leftSet, node.id)) nodeClass += " graph-node-left";
      if (hasIndex(data.rightSet, node.id)) nodeClass += " graph-node-right";
      if (data.nodeColors && data.nodeColors[node.id] === 0) nodeClass += " graph-node-color-a";
      if (data.nodeColors && data.nodeColors[node.id] === 1) nodeClass += " graph-node-color-b";
      if (hasIndex(data.visitedNodes, node.id)) nodeClass += " graph-node-visited";
      if (hasIndex(data.doneNodes, node.id)) nodeClass += " graph-node-done";
      if (node.id === data.source) nodeClass += " graph-node-source";
      if (hasIndex(data.activeNodes, node.id)) nodeClass += " graph-node-active";
      circle.setAttribute("class", nodeClass);
      g.appendChild(circle);

      var label = document.createElementNS(svgNS, "text");
      label.setAttribute("x", String(node.x));
      label.setAttribute("y", String(node.y + 1.2));
      label.setAttribute("class", "graph-node-label");
      label.textContent = String(node.label);
      g.appendChild(label);

      if (data.dist && typeof data.dist[node.id] !== "undefined") {
        var dlabel = document.createElementNS(svgNS, "text");
        dlabel.setAttribute("x", String(node.x));
        dlabel.setAttribute("y", String(node.y + 7.5));
        dlabel.setAttribute("class", "graph-dist-label");
        dlabel.textContent = graphNumberLabel(data.dist[node.id]);
        g.appendChild(dlabel);
      }

      svg.appendChild(g);
    }

    wrap.appendChild(svg);
    container.appendChild(wrap);
  }

  function renderMatrix(container, step) {
    var data = step.data || {};
    var matrix = data.matrix || [];
    if (!matrix.length) {
      container.appendChild(createDiv("ds-empty", "Matrix is empty"));
      return;
    }

    var n = matrix.length;
    var wrap = createDiv("matrix-wrap", "");
    var table = createDiv("matrix-table", "");

    var headRow = createDiv("matrix-row", "");
    headRow.appendChild(createDiv("matrix-head matrix-corner", ""));
    for (var c = 0; c < n; c += 1) {
      headRow.appendChild(createDiv("matrix-head", String(c)));
    }
    table.appendChild(headRow);

    for (var i = 0; i < n; i += 1) {
      var row = createDiv("matrix-row", "");
      row.appendChild(createDiv("matrix-head", String(i)));
      for (var j = 0; j < n; j += 1) {
        var cellClass = "matrix-cell";
        if (data.pivot === i || data.pivot === j) cellClass += " matrix-pivot";
        if (data.active && data.active.i === i && data.active.j === j) cellClass += " matrix-active";
        if (data.updated && data.updated.i === i && data.updated.j === j) cellClass += " matrix-updated";
        var value = matrix[i][j];
        row.appendChild(createDiv(cellClass, value >= data.inf ? "INF" : String(value)));
      }
      table.appendChild(row);
    }

    wrap.appendChild(table);
    container.appendChild(wrap);
  }

  function renderStep(container, step) {
    container.innerHTML = "";
    if (!step) {
      container.appendChild(createDiv("ds-empty", "No step"));
      return;
    }
    var view = step.view || "bars";
    if (view === "bars") renderBars(container, step);
    else if (view === "list") renderList(container, step);
    else if (view === "stack") renderStack(container, step);
    else if (view === "queue") renderQueue(container, step);
    else if (view === "uf") renderUnionFind(container, step);
    else if (view === "heap") renderHeap(container, step);
    else if (view === "trie") renderTrie(container, step);
    else if (view === "graph") renderGraph(container, step);
    else if (view === "matrix") renderMatrix(container, step);
    else container.appendChild(createDiv("ds-empty", "Unknown view"));
  }

  var el = {
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

  var state = {
    data: generateData(28),
    steps: [],
    stepIndex: 0,
    isPlaying: false,
    speed: 1,
    timer: null,
    selectedAlgorithmId: algorithms[0] ? algorithms[0].id : "",
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
      var interval = Math.max(40, 220 / state.speed);
      state.timer = window.setInterval(function () {
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

  function currentAlgorithm() {
    return getAlgorithmById(state.selectedAlgorithmId);
  }

  function refreshAlgorithmOptions() {
    el.algorithmSelect.innerHTML = "";
    for (var i = 0; i < algorithms.length; i += 1) {
      var algo = algorithms[i];
      var opt = document.createElement("option");
      opt.value = algo.id;
      opt.textContent = algo.category + " | " + algo.name;
      el.algorithmSelect.appendChild(opt);
    }
    if (state.selectedAlgorithmId) el.algorithmSelect.value = state.selectedAlgorithmId;
  }

  function randomizeData() {
    state.data = generateData(Number(el.sizeInput.value));
    state.steps = [barStep(state.data, "Generated random data.", {})];
    state.stepIndex = 0;
    syncView();
  }

  function runAlgorithm() {
    var algo = currentAlgorithm();
    if (!algo) return;
    var input = cloneArray(state.data);
    var steps;
    if (algo.needsTarget) {
      var target = Number(el.targetInput.value);
      steps = algo.generator(input, target);
      el.algorithmMeta.textContent = algo.name + " | target: " + target + " | " + algo.description;
    } else {
      steps = algo.generator(input);
      el.algorithmMeta.textContent = algo.name + " | " + algo.description;
    }
    state.steps = steps;
    state.stepIndex = 0;
    setPlaying(false);
    syncView();
  }

  function syncView() {
    var current = state.steps[state.stepIndex] || barStep(state.data, "Not started.", {});
    renderStep(el.canvas, current);
    el.message.textContent = current.message || "";
    el.stepLabel.textContent = "Step " + state.stepIndex + " / " + Math.max(0, state.steps.length - 1);
    el.timelineInput.max = String(Math.max(0, state.steps.length - 1));
    el.timelineInput.value = String(state.stepIndex);
    el.sizeValue.textContent = String(el.sizeInput.value);
    el.speedValue.textContent = state.speed.toFixed(2) + "x";
    var algo = currentAlgorithm();
    el.targetWrap.style.display = algo && algo.needsTarget ? "flex" : "none";
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
    el.algorithmSelect.addEventListener("change", function () {
      state.selectedAlgorithmId = el.algorithmSelect.value;
      syncView();
    });

    el.sizeInput.addEventListener("input", function () {
      el.sizeValue.textContent = el.sizeInput.value;
    });

    el.speedInput.addEventListener("input", function () {
      state.speed = Number(el.speedInput.value);
      el.speedValue.textContent = state.speed.toFixed(2) + "x";
      if (state.isPlaying) setPlaying(true);
    });

    el.timelineInput.addEventListener("input", function () {
      state.stepIndex = Number(el.timelineInput.value);
      syncView();
    });

    el.randomBtn.addEventListener("click", randomizeData);
    el.runBtn.addEventListener("click", runAlgorithm);
    el.playBtn.addEventListener("click", function () { setPlaying(!state.isPlaying); });
    el.prevBtn.addEventListener("click", function () { setPlaying(false); stepBackward(); });
    el.nextBtn.addEventListener("click", function () { setPlaying(false); stepForward(); });
    el.resetBtn.addEventListener("click", resetPlayback);

    document.addEventListener("keydown", function (event) {
      if (event.code === "Space") {
        event.preventDefault();
        setPlaying(!state.isPlaying);
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        setPlaying(false);
        stepForward();
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        setPlaying(false);
        stepBackward();
      } else if (event.code === "KeyR") {
        event.preventDefault();
        randomizeData();
      } else if (event.code === "Home") {
        event.preventDefault();
        resetPlayback();
      }
    });
  }

  function init() {
    refreshAlgorithmOptions();
    if (!algorithms.length) {
      el.message.textContent = "Failed to load algorithms.";
      return;
    }
    bindEvents();
    randomizeData();
  }

  init();
})();
