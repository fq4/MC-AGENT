import winston from "winston";
import path from "path";
import fs from "fs";
import { BotConfig } from "../types/index.js";

const LOGS_DIR = path.resolve(process.cwd(), "logs");

if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return `${timestamp} [${level.toUpperCase()}] ${message}\n${stack}`;
    }
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
  })
);

export const createLogger = (config: BotConfig): winston.Logger => {
  const transports: winston.transport[] = [
    new winston.transports.Console({
      level: config.loggingLevel,
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
  ];

  transports.push(
    new winston.transports.File({
      filename: path.join(LOGS_DIR, "error.log"),
      level: "error",
      format: logFormat,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(LOGS_DIR, "combined.log"),
      format: logFormat,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    })
  );

  return winston.createLogger({ transports });
};

export type Logger = winston.Logger;