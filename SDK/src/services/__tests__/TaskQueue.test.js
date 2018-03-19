import TaskQueue from '../TaskQueue';

describe('TaskQueue service', () => {
  let tq;

  beforeEach(() => {
    tq = new TaskQueue();
  });

  describe('adding tasks', () => {
    it('adds tasks to queue and maintains order', () => {
      const t1 = jest.fn();
      const t2 = jest.fn();
      const t3 = jest.fn();
      tq.addJob(t1);
      tq.addJob(t2);
      tq.addJob(t3);

      expect(tq._jobs).toEqual([
        expect.objectContaining({handler: t1}),
        expect.objectContaining({handler: t2}),
        expect.objectContaining({handler: t3}),
      ]);
    });
  });

  describe('processing queue', () => {
    let calls;
    beforeEach(() => {
      calls = [];
      const t1 = jest.fn(() => calls.push('t1'));
      const t2 = jest.fn(() => calls.push('t2'));
      const t3 = jest.fn(() => calls.push('t3'));
      tq.addJob(t1);
      tq.addJob(t2);
      tq.addJob(t3);
    });

    it("doesn't process anything if queue is stopped", () => {
      tq._process();
      expect(calls).toEqual([]);
    });

    it('process queue in FIFO order if queue is running', () => {
      tq.start();
      expect(calls).toEqual(['t1', 't2', 't3']);
    });

    it('resolves a promise with return value of handler function', async () => {
      expect.assertions(1);
      tq.start();
      const value = await tq.addJob(jest.fn().mockReturnValue(45));
      expect(value).toBe(45);
    });
  });
});
