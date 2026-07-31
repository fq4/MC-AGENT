import { ToolExecutionResult } from "../types/index.js";

export class ToolExecutor {
  async execute(_tool: string, _params: Record<string, unknown>): Promise<ToolExecutionResult> {
    return { success: false, output: "", error: "Not implemented" };
  }
}