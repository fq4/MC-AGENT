import { Behavior } from "../types/index.js";
import { createLogger } from "../logger/index.js";

const logger = createLogger({
  serverHost: "localhost",
  serverPort: 25565,
  username: "mc-agent",
  authenticationType: "offline",
  viewerEnabled: false,
  loggingLevel: "info",
  reconnectDelay: 5000,
  maxReconnectAttempts: 10,
  defaultFollowDistance: 6,
  defaultMovementSpeed: 1.2,
});

export const autoEatBehavior: Behavior = {
  metadata: {
    name: "auto-eat",
    description: "Automatically eat when hungry",
  },
  isEnabled: true,
  start: async () => {
    logger.info("Auto-eat behavior started");
  },
  stop: async () => {
    logger.info("Auto-eat behavior stopped");
  },
  toggle: (enabled: boolean) => {
    autoEatBehavior.isEnabled = enabled;
  },
};

export const followPlayerBehavior: Behavior = {
  metadata: {
    name: "follow-player",
    description: "Follow a player",
  },
  isEnabled: true,
  start: async () => {
    logger.info("Follow-player behavior started");
  },
  stop: async () => {
    logger.info("Follow-player behavior stopped");
  },
  toggle: (enabled: boolean) => {
    followPlayerBehavior.isEnabled = enabled;
  },
};

export const idleBehavior: Behavior = {
  metadata: {
    name: "idle",
    description: "Idle behavior",
  },
  isEnabled: true,
  start: async () => {
    logger.info("Idle behavior started");
  },
  stop: async () => {
    logger.info("Idle behavior stopped");
  },
  toggle: (enabled: boolean) => {
    idleBehavior.isEnabled = enabled;
  },
};

export const exploreBehavior: Behavior = {
  metadata: {
    name: "explore",
    description: "Explore the world",
  },
  isEnabled: true,
  start: async () => {
    logger.info("Explore behavior started");
  },
  stop: async () => {
    logger.info("Explore behavior stopped");
  },
  toggle: (enabled: boolean) => {
    exploreBehavior.isEnabled = enabled;
  },
};

export const gatherResourcesBehavior: Behavior = {
  metadata: {
    name: "gather-resources",
    description: "Gather resources",
  },
  isEnabled: true,
  start: async () => {
    logger.info("Gather-resources behavior started");
  },
  stop: async () => {
    logger.info("Gather-resources behavior stopped");
  },
  toggle: (enabled: boolean) => {
    gatherResourcesBehavior.isEnabled = enabled;
  },
};