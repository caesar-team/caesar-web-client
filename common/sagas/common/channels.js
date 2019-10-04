import { eventChannel } from 'redux-saga';

export function createPoolChannel(pool) {
  const subscribe = emitter => {
    pool.events().subscribe(emitter);

    return () => {
      pool.completed();
      pool.terminate();
    };
  };

  return eventChannel(subscribe);
}
