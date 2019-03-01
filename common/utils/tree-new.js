// import deepmerge from 'deepmerge';
// import isPlain from 'is-plain-object';
//
// const merge = overwrittenRules => (destination, source) =>
//   deepmerge(destination, source, overwrittenRules);

const ROOT = 'ROOT';

const CREATE_NODE = 'CREATE_NODE';
const REMOVE_NODE = 'REMOVE_NODE';
const UPDATE_NODE = 'UPDATE_NODE';
const REPLACE_NODE = 'REPLACE_NODE';
const REPLACE_AND_UPDATE_NODE = 'REPLACE_AND_UPDATE_NODE';

// const DEFAULT_OPTIONS = {
//   merge,
//   separator: '.',
// };
//
// function isObject(val) {
//   switch (typeof val) {
//     case 'null':
//       return false;
//     case 'object':
//       return true;
//     case 'function':
//       return true;
//     default: {
//       return false;
//     }
//   }
// }
//
// function result(target, path, value, mergeFn) {
//   return {
//     ...target,
//     [path]:
//       mergeFn && isPlain(target[path]) && isPlain(value)
//         ? mergeFn({}, target[path], value)
//         : value,
//   };
// }

function split(path, options) {
  const res = [];
  const keys = path.split(options.separator);

  for (let i = 0; i < keys.length; i++) {
    let prop = keys[i];

    while (prop && keys[i + 1]) {
      prop = prop.slice(0, -1) + options.separator + keys[++i];
    }

    res.push(prop);
  }

  return res;
}

// function set(target, path, value, options) {
//   if (!isObject(target)) {
//     return target;
//   }
//
//   const opts = options || {};
//   const isArray = Array.isArray(path);
//
//   if (!isArray && typeof path !== 'string') {
//     return target;
//   }
//
//   const keys = isArray ? path : split(path, opts);
//   const len = keys.length;
//   const original = target;
//
//   if (!options && keys.length === 1) {
//     result(target, keys[0], value, options.merge);
//     return target;
//   }
//
//   for (let i = 0; i < len; i++) {
//     const prop = keys[i];
//
//     if (!isObject(target[prop])) {
//       // eslint-disable-next-line
//       target[prop] = {};
//     }
//
//     if (i === len - 1) {
//       result(target, prop, value, options.merge);
//       break;
//     }
//
//     // eslint-disable-next-line
//     target = target[prop];
//   }
//
//   return original;
// }
//
// function get(target, path, options) {
//   return split(path, options).reduce(
//     (accumulator, key) =>
//       accumulator && accumulator[key] ? accumulator[key] : options.default,
//     target,
//   );
// }
//
// function remove(target, path, options) {
//   return split(path, options).reduce(
//     (accumulator, key) =>
//       accumulator && accumulator[key] ? accumulator[key] : options.default,
//     target,
//   );
// }

function buildObjectPath(path) {
  const objectPath = path
    .slice(0, -1)
    .map(({ index }) => index)
    .join('.children.');

  return `children.${objectPath}`;
}

function createTree(treeOrList) {
  function normalize() {
    return Array.isArray(treeOrList)
      ? { id: ROOT, type: ROOT, children: treeOrList }
      : treeOrList;
  }

  let tree = normalize(treeOrList);

  function getTree() {
    return tree;
  }

  function backtrace(breadcrumbs, startNodeId, endNodeId) {
    const path = [{ id: endNodeId }];

    while (path[path.length - 1].id !== startNodeId) {
      path.push(breadcrumbs[path[path.length - 1].id]);
    }

    return path.reverse();
  }

  function updateTree({ mode, node, fromNode, toNode, path }) {
    switch (mode) {
      case CREATE_NODE:
        tree = null;
        break;
      case REMOVE_NODE:
        tree = null;
        break;
      case UPDATE_NODE:
        tree = null;
        break;
      case REPLACE_NODE:
        tree = null;
        break;
      case REPLACE_AND_UPDATE_NODE:
        tree = null;
        break;
      default:
        throw Error(`updateTree: unavailable mode ${mode}`);
    }
  }

  function bfs(nodeId, withBreadcrumbs = false) {
    const queue = [tree];
    const breadcrumbs = {};

    while (queue.length > 0) {
      const currentNode = queue.shift();

      if (currentNode.id === nodeId) {
        return withBreadcrumbs
          ? { node: currentNode, breadcrumbs }
          : currentNode;
      }

      if (currentNode.children) {
        for (let i = 0, len = currentNode.children.length; i < len; i++) {
          const child = currentNode.children[i];

          queue.push(child);

          if (withBreadcrumbs) {
            breadcrumbs[child.id] = { id: currentNode.id, index: i };
          }
        }
      }
    }

    return null;
  }

  function findNode(nodeId, withBreadcrumbs) {
    const { node, breadcrumbs } = bfs(nodeId, withBreadcrumbs);
    console.log(node, breadcrumbs);
    console.log(backtrace(breadcrumbs, ROOT, node.id));
  }

  function createNode(toNodeId, node) {
    const { node: toNode, breadcrumbs } = findNode(toNodeId, true);

    if (!toNode) {
      throw new Error(`
        createNode: unavailable action, found node doesn't exist
      `);
    }

    if (!toNode.children) {
      throw new Error(`
        createNode: unavailable action, because found toNode is leaf
      `);
    }

    updateTree({
      node,
      toNode,
      mode: CREATE_NODE,
      path: buildObjectPath(backtrace(breadcrumbs)),
    });
  }

  function removeNode(nodeId) {
    const { node, breadcrumbs } = findNode(nodeId, true);

    if (!node) {
      throw new Error(`
        removeNode: unavailable action, found node doesn't exist
      `);
    }

    updateTree({
      node,
      mode: REMOVE_NODE,
      path: buildObjectPath(backtrace(breadcrumbs)),
    });
  }

  function updateNode(updatedNodeId, node) {
    const { node: toNode, breadcrumbs } = findNode(updatedNodeId, true);

    if (!toNode) {
      throw new Error(`
        updateNode: unavailable action, found node doesn't exist
      `);
    }

    updateTree({
      node,
      toNode,
      mode: UPDATE_NODE,
      path: buildObjectPath(backtrace(breadcrumbs)),
    });
  }

  function replaceNode(replacedNodeId, toNodeId) {
    const { node: toNode, breadcrumbs } = findNode(replacedNodeId, true);


  }

  function replaceAndUpdateNode() {}

  return {
    getTree,
    findNode,
    replaceNode,
    updateNode,
    createNode,
    removeNode,
  };
}

const list = [
  {
    children: [
      {
        listId: 'f780c875-bfed-4523-9743-62ca194d6858',
        secret:
          '-----BEGIN PGP MESSAGE-----\r\nVersion: OpenPGP.js v4.2.2\r\nComment: https://openpgpjs.org\r\n\r\nwUwDNUXELwcVyL4BAf9K82ZqOGXL63JFCcYPA2noR80gzohrwZeBpPLHPxgq\r\nMa1eIv7dXm3WllIVhbg1sorDZ+2xgL55nZn0nlC9b73Z0qIBrjUhIMEaDG0K\r\nOWB1p+j0upSUOyQHl/zp73MrOsnMKykb6aE8jkGbyaHFbdQpFsfAzxFeO93q\r\nf7YwcCLfnGvn/3AEe9/nIFmD4du2RPAOF5lFUZ1kpvA8MW5iQ4obMavZ3lIl\r\nLP2O6yDPDNCPgLpzQtS+lsr5O7/ZmLj0tUE68afG+HSprswyuMlu662q6bSr\r\nAklTpp75s5L1HP1lLUTJiAs=\r\n=nHLu\r\n-----END PGP MESSAGE-----',
        invited: [
          {
            id: '978a915f-d716-4db8-b81e-fbb6b3b7dc5e',
            userId: '4b722184-492d-4b36-9f82-33030e6aedd4',
            lastUpdated: '2019-02-28T15:57:39+00:00',
            access: 'write',
            email: 'spiridonov136188@gmail.com',
          },
        ],
        shared: [
          {
            left: 3,
            id: '31fb32d0-220f-4fc6-a7ef-ef7cd93e5c76',
            userId: '1a22608b-b6bd-46ce-bb0f-413bdf24be5b',
            email: 'anonymous_Im4HT3F9@caesar.team',
            status: 'ACCEPTED',
            link:
              'http://loc.caesar.team:3000/share/eyJzaGFyZUlkIjoiMzFmYjMyZDAtMjIwZi00ZmM2LWE3ZWYtZWY3Y2Q5M2U1Yzc2IiwiZW1haWwiOiJhbm9ueW1vdXNfSW00SFQzRjlAY2Flc2FyLnRlYW0iLCJwYXNzd29yZCI6Im8hPVp0JiEzIiwibWFzdGVyUGFzc3dvcmQiOiI6IXo9ezZKWCJ9',
            roles: ['ROLE_ANONYMOUS_USER', 'ROLE_USER'],
            createdAt: '2019-02-28T13:21:07+00:00',
            updatedAt: '2019-02-28T13:21:07+00:00',
            publicKey:
              '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.2.2\r\nComment: https://openpgpjs.org\r\n\r\nxk0EXHfgQgEB/3kVK5lG/s/VFxpP0CDGjcbcvrvliGpOmjhu1guXz7LLVZ26\r\n6aTm7aw0CsNLsibsyVk1bdEsW709dx//VXq1/OkAEQEAAc0gImFub255bW91\r\nc19JbTRIVDNGOUBjYWVzYXIudGVhbSLCdQQQAQgAHwUCXHfgQgYLCQcIAwIE\r\nFQgKAgMWAgECGQECGwMCHgEACgkQ5oUE6U/0GukMjQH/bH62zrMXRQp69LU/\r\n8mucxwxXmcZq16yjYsrPLQ4e50VTewT+3dUCJ9WvzPGv+cwRV37snmDdHXxj\r\n3jLOXOX4Ts5NBFx34EIBAf9gJUZGS+fvUmmRwls7O6l1E3U+60vtEqYEnYAh\r\n5zUnfqy9CQXUP8U7g79Z7UeT3VUYmIaB6PzmxgJaGvgpULF9ABEBAAHCXwQY\r\nAQgACQUCXHfgQgIbDAAKCRDmhQTpT/Qa6dqeAf0RlD5fL4VTJd1ZOPZ8BlFW\r\n0rw2Smy7Ns97WvUQsfIUMx6idFYhGU680wtLy1GFl56VZpzi/QrBYqcOorly\r\nCBDF\r\n=Jv02\r\n-----END PGP PUBLIC KEY BLOCK-----',
          },
        ],
        update: null,
        lastUpdated: '2019-02-28T15:44:11+00:00',
        type: 'credentials',
        tags: [],
        favorite: false,
        owner: {
          id: 'd834a285-b15a-437e-bb5e-34fa11634917',
          email: 'dspiridonov@4xxi.com',
          name: 'Dmitriy Spiridonov',
          avatar:
            'static/images/user/8c44b626-773a-4d8d-9776-8b255db0b578.jpeg',
          publicKey:
            '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.2.2\r\nComment: https://openpgpjs.org\r\n\r\nxk0EXHelZgECANN/mbKXqqxIXLR6AVW/iF5onn07d8C6fWjGD3fCQkJhwt5u\r\nJGGlJiy/jM0sxb8h26v9UfgxpoFZ0y6mLBLA2oUAEQEAAc0AwnUEEAEIAB8F\r\nAlx3pWYGCwkHCAMCBBUICgIDFgIBAhkBAhsDAh4BAAoJEGOsAbr6lzOlM6cC\r\nAMUeUkGyZ572F0mJmjCABENSSAlAaIThjgy6Rl1acyKydRsrRrvTvEqYDgo3\r\n8h93YB5QVBg7dzjtTvAwd2DeW8jOTQRcd6VmAQIAglkAVsjGuxX8/A5MqDuR\r\nZwiiXo4BevTKhcplym4sAvaBOlBLjEv1aQmkf6JVk5+zg1molYimxQEu9ae1\r\nPFFLRwARAQABwl8EGAEIAAkFAlx3pWYCGwwACgkQY6wBuvqXM6WD8QIApLOx\r\njPgdV57v8NU9VWAazVUG1DOgCZ+ue7hOTrpshSx2o5zptF+93j00ggM4D7lv\r\n+dNYRpFQxpcY8ONBFILpVg==\r\n=k+1f\r\n-----END PGP PUBLIC KEY BLOCK-----',
        },
        id: '14090c92-d3e4-4e1d-b3c8-f1ce555c8cfa',
      },
    ],
    label: 'inbox',
    id: 'f780c875-bfed-4523-9743-62ca194d6858',
    type: 'inbox',
  },
  {
    children: [
      {
        children: [
          {
            listId: 'f1dde02f-2ff4-4548-9e3f-25e94be9b88f',
            secret:
              '-----BEGIN PGP MESSAGE-----\r\nVersion: OpenPGP.js v4.2.2\r\nComment: https://openpgpjs.org\r\n\r\nwUwDNUXELwcVyL4BAf0aOfm51Q6TyH5K8tXQWTax5Z+pejyd6BVC7X4TojsG\r\nSjNP+zg+UR3UDMnudyGWvWfc+m6YXNB5TBmyv86x2zmA0qEBgh9HlQPJbGSz\r\nzlS06X/5AiSadp9MvJ4YNweIcugrLAKN8OlhipsLBcD9k6LS77S6KiUzIORM\r\nf31J7VPmrjEY0F6bDI0CsGuOo+h4xl1R2wxQIxcjVHZvFaHD4o73nhaTjuMf\r\nmnWVHueBEbGB6vggaHCoRnvuEJKR/o2iNDTO3rr8wZzotcazTXZs7PNGlhD3\r\n0VDaL7UkUPF1W7J00zIPZQ==\r\n=4+to\r\n-----END PGP MESSAGE-----',
            invited: [
              {
                id: '12d28438-d132-42f3-a79b-3dcacc0d5022',
                userId: '4b722184-492d-4b36-9f82-33030e6aedd4',
                lastUpdated: '2019-02-28T13:19:21+00:00',
                access: 'write',
                email: 'spiridonov136188@gmail.com',
              },
            ],
            shared: [],
            update: null,
            lastUpdated: '2019-02-28T15:40:11+00:00',
            type: 'credentials',
            tags: [],
            favorite: false,
            owner: {
              id: 'd834a285-b15a-437e-bb5e-34fa11634917',
              email: 'dspiridonov@4xxi.com',
              name: 'Dmitriy Spiridonov',
              avatar:
                'static/images/user/8c44b626-773a-4d8d-9776-8b255db0b578.jpeg',
              publicKey:
                '-----BEGIN PGP PUBLIC KEY BLOCK-----\r\nVersion: OpenPGP.js v4.2.2\r\nComment: https://openpgpjs.org\r\n\r\nxk0EXHelZgECANN/mbKXqqxIXLR6AVW/iF5onn07d8C6fWjGD3fCQkJhwt5u\r\nJGGlJiy/jM0sxb8h26v9UfgxpoFZ0y6mLBLA2oUAEQEAAc0AwnUEEAEIAB8F\r\nAlx3pWYGCwkHCAMCBBUICgIDFgIBAhkBAhsDAh4BAAoJEGOsAbr6lzOlM6cC\r\nAMUeUkGyZ572F0mJmjCABENSSAlAaIThjgy6Rl1acyKydRsrRrvTvEqYDgo3\r\n8h93YB5QVBg7dzjtTvAwd2DeW8jOTQRcd6VmAQIAglkAVsjGuxX8/A5MqDuR\r\nZwiiXo4BevTKhcplym4sAvaBOlBLjEv1aQmkf6JVk5+zg1molYimxQEu9ae1\r\nPFFLRwARAQABwl8EGAEIAAkFAlx3pWYCGwwACgkQY6wBuvqXM6WD8QIApLOx\r\njPgdV57v8NU9VWAazVUG1DOgCZ+ue7hOTrpshSx2o5zptF+93j00ggM4D7lv\r\n+dNYRpFQxpcY8ONBFILpVg==\r\n=k+1f\r\n-----END PGP PUBLIC KEY BLOCK-----',
            },
            id: '443178d2-09f2-4d86-a9c6-ea29efe6b65f',
          },
        ],
        label: 'Personal',
        id: 'f1dde02f-2ff4-4548-9e3f-25e94be9b88f',
        type: 'list',
      },
      {
        children: [],
        label: 'Services',
        id: '3050a636-2519-4a81-9388-dea2931b0dfa',
        type: 'list',
      },
      {
        children: [],
        label: 'Job',
        id: 'f89bd3f4-40e0-4a76-b94a-fcb259b43d0f',
        type: 'list',
      },
    ],
    label: 'lists',
    id: '9bcbd3a7-9300-41a3-8f10-d26eeaebf1ae',
    type: 'list',
  },
  {
    children: [],
    label: 'trash',
    id: '41b39d9e-c0f0-455b-8f47-1135ec0b17a1',
    type: 'trash',
  },
];

const tree = createTree(list);
console.log(tree.findNode('443178d2-09f2-4d86-a9c6-ea29efe6b65f', true));
