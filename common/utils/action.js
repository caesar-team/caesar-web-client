function isObject(target) {
  return Object.prototype.toString.call(target) === '[object Object]';
}

function parseObject(group) {
  return Object.keys(group).map(key => ({ name: key, fn: group[key] }));
}

function combineGroups(result, group) {
  if (!isObject(group)) {
    throw new Error(`Group of actions must be plain object!`);
  }

  return result.concat(parseObject(group));
}

function formatActions({ constants, actions }, action) {
  if (Reflect.has(constants, action.name)) {
    throw new Error(`Action ${action.name} already exist!`);
  }

  return {
    constants: Object.assign(constants, { [action.name]: action.name }),
    actions: Object.assign(actions, {
      [action.name]: (...args) => action.fn(action.name, ...args),
    }),
  };
}

export function createConstantsAndActions(prefix, ...groups) {
  return groups.reduce(combineGroups, []).reduce(formatActions, {
    constants: {},
    actions: {},
  });
}
