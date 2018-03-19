// @flow

export type Task<T> = {
  handler: () => T,
  resolve: T => void,
  reject: Error => void,
};

export class TaskQueue {
  _jobs: Array<Task<any>> = [];
  _running: boolean = false;

  addJob<E>(handler: () => E): Promise<E> {
    return new Promise((resolve: E => void, reject) => {
      this._jobs.push({handler, resolve, reject});
      this._process();
    });
  }

  start = () => {
    this._running = true;
    this._process();
  };

  stop = () => {
    this._running = false;
  };

  _process = () => {
    while (this._running && this._jobs.length) {
      const task = this._jobs.shift();
      try {
        const result = task.handler();
        task.resolve(result);
      } catch (e) {
        task.reject(e);
      }
    }
  };
}

export default TaskQueue;
