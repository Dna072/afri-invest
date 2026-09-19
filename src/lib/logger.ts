type LogLevel = "debug" | "info" | "warn" | "error";

function emit(level: LogLevel, message: string, fields?: Record<string, unknown>) {
  const entry = {
    level,
    message,
    ts: new Date().toISOString(),
    service: "africa-invest",
    ...fields,
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (message: string, fields?: Record<string, unknown>) => emit("debug", message, fields),
  info: (message: string, fields?: Record<string, unknown>) => emit("info", message, fields),
  warn: (message: string, fields?: Record<string, unknown>) => emit("warn", message, fields),
  error: (message: string, fields?: Record<string, unknown>) => emit("error", message, fields),
};
