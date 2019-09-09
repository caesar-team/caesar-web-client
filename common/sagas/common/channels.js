import { Thread } from 'threads';
import { eventChannel } from 'redux-saga';

export function createTaskChannel(task) {
  const subscribe = emitter => {
    task.events().subscribe(emitter);

    return () => Thread.terminate(task);
  };

  return eventChannel(subscribe);
}

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
