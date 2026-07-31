import { Goal, GoalResult } from "../types/index.js";

export class GoalManager {
  private goals: Map<string, Goal> = new Map();

  register(goal: Goal): void {
    this.goals.set(goal.id, goal);
  }

  async execute(goalId: string, bot: import("../bot/index.js").Bot): Promise<GoalResult | null> {
    const goal = this.goals.get(goalId);
    if (!goal) {return null;}

    try {
      return await goal.execute(bot);
    } catch (error) {
      return {
        success: false,
        reason: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  getGoal(id: string): Goal | undefined {
    return this.goals.get(id);
  }

  getAllGoals(): Goal[] {
    return Array.from(this.goals.values());
  }
}