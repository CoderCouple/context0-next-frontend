export const LogLevels = ["info", "warn", "debug", "error"] as const;
export type LogLevel = (typeof LogLevels)[number];

export type LogFunction = (message: string) => void;
export type Log = { message: string; level: LogLevel; timestamp: Date };

export type LogCollector = {
  getAll(): Log[];
} & {
  [K in LogLevel]: LogFunction;
};

export function createLogCollector(): LogCollector {
  const logs: Log[] = [];

  const log =
    (level: LogLevel): LogFunction =>
    (message: string) => {
      logs.push({ message, level, timestamp: new Date() });
    };

  const collector: Partial<Record<LogLevel, LogFunction>> = {};
  for (const level of LogLevels) {
    collector[level] = log(level);
  }

  return {
    getAll: () => logs,
    ...collector,
  } as LogCollector;
}
