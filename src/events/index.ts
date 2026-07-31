import { EventMap, EventName, EventHandler, EventSubscription } from "../types/index.js";

export class EventManager {
  private listeners: Map<EventName, Set<EventHandler<any>>> = new Map();

  on<T extends EventName>(event: T, handler: EventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler as EventHandler<any>);

    return () => {
      this.listeners.get(event)?.delete(handler as EventHandler<any>);
      if (this.listeners.get(event)?.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  once<T extends EventName>(event: T, handler: EventHandler<T>): () => void {
    const wrappedHandler: EventHandler<T> = (data) => {
      this.off(event, wrappedHandler);
      handler(data);
    };
    return this.on(event, wrappedHandler);
  }

  off<T extends EventName>(event: T, handler: EventHandler<T>): void {
    this.listeners.get(event)?.delete(handler as EventHandler<any>);
    if (this.listeners.get(event)?.size === 0) {
      this.listeners.delete(event);
    }
  }

  emit<T extends EventName>(event: T, data: EventMap[T]): void {
    const handlers = this.listeners.get(event);
    if (!handlers) {return;}
    for (const handler of handlers) {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    }
  }

  removeAllListeners(event?: EventName): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  getSubscriptions(): EventSubscription[] {
    const subscriptions: EventSubscription[] = [];
    for (const [event, handlers] of this.listeners) {
      for (const handler of handlers) {
        subscriptions.push({ event, handler });
      }
    }
    return subscriptions;
  }
}

export const eventManager = new EventManager();