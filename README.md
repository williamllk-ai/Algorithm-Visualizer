# Algorithm Visualizer

A browser-based algorithm and data-structure visualizer focused on step-by-step playback and interactive controls.

This project is designed as a portfolio-ready demo: easy to run locally, easy to understand, and easy to extend.

## What It Supports

### Algorithms
- Bubble Sort
- Selection Sort
- Quick Sort
- Heap Sort
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

## UI Controls (English Labels)

### Control Panel
- `Algorithm`
- `Data Size`
- `Speed`
- `Target` (used by search algorithms)
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
- `Home`: reset playback position

## Quick Start

### Option 1: Open directly
Open `index.html` in a browser.

### Option 2: Run a local static server (recommended)
```bash
cd algo-visualizer
python -m http.server 5500
```
Then open: `http://localhost:5500`

## Project Structure

```text
algo-visualizer/
  index.html                 # Single-page UI
  src/
    app.js                   # Main runtime (algorithms + data structures + rendering + controls)
    styles/
      main.css               # UI styles and visualization styles
```

## Notes for Contributors

- The current runtime entry is `src/app.js`.
- Add new visualizations by:
  1. Adding a step generator function.
  2. Registering it in the `algorithms` list.
  3. Rendering a new `view` type in the renderer section.

## Why This Repository Is Useful on GitHub

- Demonstrates algorithm understanding and data-structure operations visually.
- Includes interaction design (playback, timeline, shortcuts), not just static code.
- Easy for reviewers/interviewers to run in under one minute.

## License

MIT
