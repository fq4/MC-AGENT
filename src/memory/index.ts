import { MemoryEntry } from "../types/index.js";

export class ShortTermMemory {
  private entries: MemoryEntry[] = [];

  add(entry: Omit<MemoryEntry, "id" | "type" | "createdAt">): MemoryEntry {
    const memoryEntry: MemoryEntry = {
      ...entry,
      id: `stm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: "short-term",
      createdAt: Date.now(),
    };
    this.entries.push(memoryEntry);
    return memoryEntry;
  }

  get(key: string): MemoryEntry | undefined {
    return this.entries.find((e) => e.key === key && (!e.expiresAt || e.expiresAt > Date.now()));
  }

  getAll(): MemoryEntry[] {
    const now = Date.now();
    return this.entries.filter((e) => !e.expiresAt || e.expiresAt > now);
  }

  clear(): void {
    this.entries = [];
  }
}

export class LongTermMemory {
  private entries: MemoryEntry[] = [];

  add(entry: Omit<MemoryEntry, "id" | "type" | "createdAt">): MemoryEntry {
    const memoryEntry: MemoryEntry = {
      ...entry,
      id: `ltm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: "long-term",
      createdAt: Date.now(),
    };
    this.entries.push(memoryEntry);
    return memoryEntry;
  }

  get(key: string): MemoryEntry | undefined {
    return this.entries.find((e) => e.key === key);
  }

  search(query: string): MemoryEntry[] {
    const lower = query.toLowerCase();
    return this.entries.filter(
      (e) => typeof e.value === "string" && (e.value as string).toLowerCase().includes(lower)
    );
  }

  clear(): void {
    this.entries = [];
  }
}