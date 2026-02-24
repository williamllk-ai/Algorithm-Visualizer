const algorithms = [...(window.SortingAlgorithms || []), ...(window.SearchAlgorithms || [])];

function getAlgorithmById(id) {
  return algorithms.find((item) => item.id === id) ?? algorithms[0];
}

window.AlgorithmsRegistry = {
  algorithms,
  getAlgorithmById,
};
