export function createReducer(initialState, handlers) {
  return (state, action) => {
    if (!state) {
      return initialState;
    }

    if (
      Reflect.has(handlers, action.type) &&
      typeof handlers[action.type] === 'function'
    ) {
      return handlers[action.type](state, action);
    }

    return state;
  };
}
