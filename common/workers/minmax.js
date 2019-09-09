import { Subject, Observable } from 'threads/observable';
import { expose } from 'threads/worker';

let max = -Infinity;
let min = Infinity;

let subject = new Subject();

const minmax = {
  finish() {
    subject.complete();
    subject = new Subject();
  },
  push(value) {
    max = Math.max(max, value);
    min = Math.min(min, value);
    subject.next({ max, min });
  },
  values() {
    return Observable.from(subject);
  },
};

expose(minmax);
