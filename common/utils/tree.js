import deepmerge from 'deepmerge';
import TreeModel from './treeModel';

const overwriteMerge = (destinationArray, sourceArray) => sourceArray;

export const createTree = root => {
  const tree = new TreeModel();

  return tree.parse(root);
};

export const removeNode = (root, removedNodeId) => {
  const removedNode = root.first(node => node.model.id === removedNodeId);

  if (removedNode) {
    removedNode.drop();
  }

  return root;
};

export const addNode = (root, toNodeId, data) => {
  const tree = new TreeModel();
  const toNode = root.first(node => node.model.id === toNodeId);

  if (toNode) {
    toNode.addChild(tree.parse(data));
  }

  return root;
};

export const updateNode = (root, updatedNodeId, data) => {
  const tree = new TreeModel();

  const updatedNode = root.first(node => node.model.id === updatedNodeId);
  const { parent } = updatedNode;

  parent.addChild(
    tree.parse(
      deepmerge(updatedNode.model, data, { arrayMerge: overwriteMerge }),
    ),
  );

  updatedNode.drop();

  return root;
};

export const replaceNode = (root, replacedNodeId, toNodeId) => {
  const replacedNode = root.first(node => node.model.id === replacedNodeId);
  const toNode = root.first(node => node.model.id === toNodeId);

  if (!replacedNode || !toNode) {
    return root;
  }

  // clone class instance
  const updatedNode = Object.assign(
    Object.create(Object.getPrototypeOf(replacedNode)),
    replacedNode,
  );

  toNode.addChild(updatedNode);
  replacedNode.drop();

  return root;
};

export const findNode = (root, fnOrNodeId) =>
  root.first(node =>
    typeof fnOrNodeId === 'function'
      ? fnOrNodeId(node)
      : node.model.id === fnOrNodeId,
  );
