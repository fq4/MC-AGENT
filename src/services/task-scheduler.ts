import { ScheduledTask } from "../types/index.js";

export class TaskScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();

  schedule(name: string, interval: number, execute: () => Promise<void> | void): () => void {
    const id = `${name}-${Date.now()}`;
    const task: ScheduledTask = {
      id,
      name,
      interval,
      execute,
      cancel: () => {
        this.tasks.delete(id);
      },
    };
    this.tasks.set(id, task);
    return task.cancel;
  }

  cancelAll(): void {
    for (const task of this.tasks.values()) {
      task.cancel();
    }
    this.tasks.clear();
  }
}