import { Behavior } from "../types/index.js";
import {
  autoEatBehavior,
  followPlayerBehavior,
  idleBehavior,
  exploreBehavior,
  gatherResourcesBehavior,
} from "./behaviors.js";

export class BehaviorManager {
  private behaviors: Map<string, Behavior> = new Map();

  register(behavior: Behavior): void {
    this.behaviors.set(behavior.metadata.name, behavior);
  }

  async start(name: string, bot: import("../types/index.js").Bot): Promise<void> {
    const behavior = this.behaviors.get(name);
    if (!behavior || !behavior.isEnabled) {return;}

    try {
      await behavior.start(bot);
    } catch (error) {
      console.error(`Behavior ${name} failed to start:`, error);
    }
  }

  async stop(name: string, bot: import("../types/index.js").Bot): Promise<void> {
    const behavior = this.behaviors.get(name);
    if (!behavior) {return;}

    try {
      await behavior.stop(bot);
    } catch (error) {
      console.error(`Behavior ${name} failed to stop:`, error);
    }
  }

  getBehavior(name: string): Behavior | undefined {
    return this.behaviors.get(name);
  }

  getAllBehaviors(): Behavior[] {
    return Array.from(this.behaviors.values());
  }
}

export const behaviorManager = new BehaviorManager();

export function registerBehaviors(): void {
  const behaviors: Behavior[] = [
    autoEatBehavior,
    followPlayerBehavior,
    idleBehavior,
    exploreBehavior,
    gatherResourcesBehavior,
  ];

  for (const behavior of behaviors) {
    behaviorManager.register(behavior);
  }
}