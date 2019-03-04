import { cloneElement, isValidElement } from 'react';

function isFunction(fn) {
  return Object.prototype.toString.call(fn) === '[object Function]';
}

function callFnOrComponent(fnOrComponent, props, index) {
  if (!isValidElement(fnOrComponent) && !isFunction(fnOrComponent)) return null;

  const Component = isFunction(fnOrComponent)
    ? fnOrComponent(props, index)
    : cloneElement(fnOrComponent, {
        key: index,
        ...fnOrComponent.props,
        ...props,
      });

  return isValidElement(Component) ? Component : null;
}

function defaultKeyGenerator(index) {
  return {
    leftKey: 2 * index,
    rightKey: 2 * index + 1,
  };
}

export function joinChildren(
  children,
  renderA,
  renderB,
  keyGenerator = defaultKeyGenerator,
) {
  return children.reduce((prev, curr, index) => {
    const { leftKey, rightKey } = keyGenerator(index);

    if (index === children.length - 1) {
      return prev.concat(callFnOrComponent(renderA, curr, leftKey));
    }

    return prev.concat([
      callFnOrComponent(renderA, curr, leftKey),
      callFnOrComponent(renderB, curr, rightKey),
    ]);
  }, []);
}
