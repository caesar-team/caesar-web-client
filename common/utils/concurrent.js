class WorkerThread {
  constructor(parentPool) {
    this.parentPool = parentPool;
    this.workerTask = {};
  }

  run(workerTask) {
    this.workerTask = workerTask;

    if (this.workerTask.script != null) {
      const worker = new Worker(workerTask.script);
      worker.addEventListener('message', this.callback, false);
      worker.postMessage(workerTask.startMessage);
    }
  }

  callback(event) {
    this.workerTask.callback(event);
    this.parentPool.freeWorkerThread(this);
  }
}

class Pool {
  constructor(size) {
    this.taskQueue = [];
    this.workerQueue = [];
    this.poolSize = size;
  }

  addWorkerTask(workerTask) {
    if (this.workerQueue.length > 0) {
      const workerThread = this.workerQueue.shift();
      workerThread.run(workerTask);
    } else {
      this.taskQueue.push(workerTask);
    }
  }

  init() {
    for (let i = 0; i < this.poolSize; i++) {
      this.workerQueue.push(new WorkerThread(this));
    }
  }

  freeWorkerThread(workerThread) {
    if (this.taskQueue.length > 0) {
      const workerTask = this.taskQueue.shift();
      workerThread.run(workerTask);
    } else {
      this.taskQueue.push(workerThread);
    }
  }
}

class WorkerTask {
  constructor(script, callback, message) {
    this.script = script;
    this.callback = callback;
    this.startMessage = message;
  }
}
