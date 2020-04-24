import {
  TASK_QUEUE_DRAINED_EVENT_TYPE,
  POOL_QUEUE_FINISHED_EVENT_TYPE,
} from './constants';

export function normalizeEvent(availableCoresCount) {
  let busyTaskCounter = availableCoresCount;

  return function resolver(event) {
    switch (event.type) {
      case TASK_QUEUE_DRAINED_EVENT_TYPE: {
        busyTaskCounter--;

        if (!busyTaskCounter) {
          return { type: POOL_QUEUE_FINISHED_EVENT_TYPE };
        }

        return event;
      }
      default:
        return event;
    }
  };
}
