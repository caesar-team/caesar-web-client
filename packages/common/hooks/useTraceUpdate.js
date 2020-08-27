/* eslint-disable no-console */
/* eslint-disable no-case-declarations */
import { useRef, useEffect } from 'react';
import deepequal from 'fast-deep-equal';

const isFunc = obj => typeof obj === 'function';

const toString = obj => {
  switch (true) {
    case isFunc(obj):
      return 'Function';
    default:
      return obj;
  }
};
const Prop = (prev, current) => ({
  prev: toString(prev),
  current: toString(current),
});

export const useTraceUpdate = props => {
  const prev = useRef(props);
  useEffect(() => {
    const changes = {};
    Object.entries(props).forEach(([key]) => {
      const prevProp = prev.current[key];
      const incomingProp = props[key];

      if (
        !isFunc(prevProp) &&
        !isFunc(incomingProp) &&
        !deepequal(prevProp, incomingProp)
      ) {
        changes[key] = new Prop(prevProp, incomingProp);
      }
    });

    if (Object.keys(changes).length > 0) console.table(changes);
    prev.current = props;
  }, [props]);
};
