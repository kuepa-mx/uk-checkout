type LogLevel = "Error" | "Info" | "Log";

interface LoggerOptions {
  sessionId?: string;
  leadId?: string;
}

class Logger {
  private sessionId?: string;
  private leadId?: string;

  constructor(options: LoggerOptions = {}) {
    this.sessionId = options.sessionId;
    this.leadId = options.leadId;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const sessionTag = this.sessionId
      ? `[${this.sessionId.slice(0, 8)}]`
      : "[N/A]";
    const leadTag = this.leadId ? `[${this.leadId.slice(0, 8)}]` : "[N/A]";
    const timestamp = new Date().toISOString();
    return `${timestamp} ${sessionTag} ${leadTag} ${level} - ${message}`;
  }

  error(message: string, ...args: unknown[]): void {
    console.error(this.formatMessage("Error", message), ...args);
  }

  info(message: string, ...args: unknown[]): void {
    console.info(this.formatMessage("Info", message), ...args);
  }

  log(message: string, ...args: unknown[]): void {
    console.log(this.formatMessage("Log", message), ...args);
  }

  // Helper method to create a new logger instance with updated context
  withContext(options: Partial<LoggerOptions>): Logger {
    return new Logger({
      sessionId: options.sessionId ?? this.sessionId,
      leadId: options.leadId ?? this.leadId,
    });
  }
}

// Factory function to create a logger instance
export function createLogger(options: LoggerOptions = {}): Logger {
  return new Logger(options);
}

// Default logger instance
export const logger = createLogger();
