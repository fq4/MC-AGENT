export class DecisionMaker {
  async decide(options: string[]): Promise<string> {
    return options[0] ?? "";
  }
}