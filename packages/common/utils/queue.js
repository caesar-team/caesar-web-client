class Queue {
  constructor() {
    this.data = [];
  }

  getLength() {
    return this.data.length;
  }

  isEmpty() {
    return !this.data.length;
  }

  enqueue(value) {
    this.data.push(value);
  }

  dequeue() {
    return this.data.shift();
  }

  peek() {
    return this.data[0];
  }
}

export function createQueue() {
  return new Queue();
}
