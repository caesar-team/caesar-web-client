const ROOT = 'ROOT';

function createTree(tree) {
  function normalize() {
    return Array.isArray(tree)
      ? { id: ROOT, type: ROOT, children: tree }
      : tree;
  }

  function getTree() {
    return tree;
  }

  function getNormalizedTree() {
    return normalize(tree);
  }

  function replaceNode(fromNodeId, toNodeId, node) {}

  function updateNode(nodeId, node) {}

  functio createNode(listId, node) {}

  function removeNode(nodeId) {}

  return {
    getTree,
    getNormalizedTree,
  };
}
