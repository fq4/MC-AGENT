import { z } from "zod";
import dotenv from "dotenv";
import { BotConfig } from "../types/index.js";

dotenv.config({ override: true });

const ConfigSchema = z.object({
  SERVER_HOST: z.string().min(1, "SERVER_HOST is required"),
  SERVER_PORT: z.coerce.number().int().positive("SERVER_PORT must be a positive integer"),
  USERNAME: z.string().min(1, "USERNAME is required"),
  AUTHENTICATION_TYPE: z.enum(["microsoft", "mojang", "offline"]).default("offline"),
  VIEWER_ENABLED: z.coerce.boolean().default(false),
  LOGGING_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  RECONNECT_DELAY: z.coerce.number().int().nonnegative("RECONNECT_DELAY must be non-negative").default(5000),
  MAX_RECONNECT_ATTEMPTS: z.coerce.number().int().nonnegative("MAX_RECONNECT_ATTEMPTS must be non-negative").default(10),
  DEFAULT_FOLLOW_DISTANCE: z.coerce.number().positive("DEFAULT_FOLLOW_DISTANCE must be positive").default(6),
  DEFAULT_MOVEMENT_SPEED: z.coerce.number().positive("DEFAULT_MOVEMENT_SPEED must be positive").default(1.2),
  MICROSOFT_REFRESH_TOKEN: z.string().optional(),
});

const parsed = ConfigSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

const env = parsed.data;

export const config: BotConfig = {
  serverHost: env.SERVER_HOST,
  serverPort: env.SERVER_PORT,
  username: env.USERNAME,
  authenticationType: env.AUTHENTICATION_TYPE,
  viewerEnabled: env.VIEWER_ENABLED,
  loggingLevel: env.LOGGING_LEVEL,
  reconnectDelay: env.RECONNECT_DELAY,
  maxReconnectAttempts: env.MAX_RECONNECT_ATTEMPTS,
  defaultFollowDistance: env.DEFAULT_FOLLOW_DISTANCE,
  defaultMovementSpeed: env.DEFAULT_MOVEMENT_SPEED,
  microsoftRefreshToken: env.MICROSOFT_REFRESH_TOKEN,
};