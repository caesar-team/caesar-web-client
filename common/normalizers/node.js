import { normalize, schema } from 'normalizr';

const node = new schema.Entity('nodesById');

node.define({ children: new schema.Array(node) });

const treeSchema = new schema.Array(node);

export const normalizeNodes = nodes => {
  return normalize(nodes, treeSchema);
};
