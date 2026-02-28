# Algorithm Visualizer

A browser-based visualizer for classic algorithms and data structures, with frame-by-frame playback controls.

The project now includes **sorting**, **search**, **data structure operations**, and a complete **graph algorithms** module.

## Supported Visualizations

### Sorting
- Bubble Sort
- Selection Sort
- Quick Sort
- Heap Sort

### Search
- Linear Search
- Binary Search

### Data Structures
- Singly Linked List
- Doubly Linked List
- Stack (LIFO)
- Queue (FIFO)
- Union-Find (Disjoint Set Union)
- Max Heap (structure operations)
- Trie (prefix tree)

### Graph Algorithms
- DFS
- BFS
- Topological Sort
- Floyd-Warshall
- Dijkstra
- Bellman-Ford
- SPFA
- Prim
- Kruskal
- Bipartite Coloring (2-coloring)
- Hungarian (Kuhn) for bipartite matching

## UI Controls (Matches the Current Page)

### Control Panel
- `Algorithm`
- `Data Size`
- `Speed`
- `Target` (for search algorithms)
- `Timeline`

### Buttons
- `Random (R)`
- `Run`
- `Play / Pause (Space)`
- `Prev (Left)`
- `Next (Right)`
- `Reset (Home)`

### Keyboard Shortcuts
- `Space`: play / pause
- `ArrowLeft`: previous step
- `ArrowRight`: next step
- `R`: randomize input data
- `Home`: reset playback

## Quick Start

### Option 1: Open directly
Open `index.html` in a browser.

### Option 2: Run a local static server (recommended)
```bash
cd algo-visualizer
python -m http.server 5500
```
Open: `http://localhost:5500`

## Project Structure

```text
algo-visualizer/
  index.html                 # Single-page UI
  src/
    app.js                   # Runtime entry (algorithms + data + renderers + controls)
    styles/
      main.css               # UI and visualization styles
```

## Architecture Notes

- All algorithm step generation is in `src/app.js`.
- Playback (`Play/Pause`, `Prev/Next`, timeline, speed) is shared by all modules.
- Visualizations currently use multiple view types:
  - `bars` for array-based algorithms
  - `list`, `stack`, `queue`, `uf`, `heap`, `trie` for data structures
  - `graph` and `matrix` for graph-related algorithms

## How to Add a New Visualization

1. Add a step generator function in `src/app.js`.
2. Register it in the `algorithms` array.
3. Return one of the existing view types (`bars`, `graph`, `matrix`, etc.), or add a new renderer branch in `renderStep`.

## Why This Repo Works Well on GitHub

- Demonstrates algorithm knowledge with concrete visual output.
- Shows engineering beyond static code examples (state stepping, controls, reusable renderer flow).
- Easy for reviewers to run locally in under one minute.

## License

MIT
