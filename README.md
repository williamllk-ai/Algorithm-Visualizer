# Algorithm Visualizer

一个可直接在浏览器打开的算法可视化小项目，支持逐步播放、单步调试、进度拖拽和快捷键操作。

## Features

- 多算法可视化（当前 8 个）  
  `Bubble` `Selection` `Insertion` `Shell` `Quick` `Heap` `Linear Search` `Binary Search`
- 播放控制  
  `播放/暂停` `上一步` `下一步` `重置` `进度条拖拽` `速度调节`
- 数据控制  
  `数据规模` `随机数据` `目标值输入（查找算法）`
- 键盘快捷键  
  `Space` `←` `→` `R` `Home`
- 架构可扩展  
  算法通过 `registry` 注册，可逐步新增更多算法。

## Quick Start

1. 进入目录：`algo-visualizer`
2. 直接双击 `index.html` 或用本地静态服务器打开

如果你安装了 Node.js，也可以用：

```bash
npx serve .
```

## Project Structure

```text
algo-visualizer/
  index.html
  src/
    main.js                  # 交互状态与控制逻辑
    algorithms/
      registry.js            # 算法注册表
      sorting.js             # 排序算法步骤生成
      search.js              # 查找算法步骤生成
    ui/
      renderer.js            # 柱状图渲染与高亮映射
    styles/
      main.css               # 样式与响应式布局
```

## How To Add A New Algorithm

1. 在 `src/algorithms/` 新建模块，输出算法对象：

```js
{
  id: "unique-id",
  name: "My Algorithm",
  category: "分类",
  description: "一句话描述",
  needsTarget: false, // 若需要目标值则设为 true
  generator: (input, target) => steps
}
```

2. `generator` 返回 `steps` 数组，每个 step 结构：

```js
{
  array: [ ... ],
  message: "当前说明",
  highlights: {
    compare: [],
    swap: [],
    sorted: [],
    pivot: [],
    active: [],
    range: [left, right],
    found: []
  }
}
```

3. 在 `src/algorithms/registry.js` 注册该算法即可在 UI 下拉框出现。

## Incremental Roadmap

可按阶段逐步扩展：

1. 阶段一（当前完成）：排序 + 查找 + 播放控制
2. 阶段二：栈/队列/单调栈/并查集可视化
3. 阶段三：图算法（BFS/DFS/Dijkstra）与网格动画
4. 阶段四：题目模式（输入样例、自动回放、导出 GIF）

## License

MIT
