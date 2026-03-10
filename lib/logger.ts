// Human-centric design: Focus on abstraction and environment safety
type LogLevel = 'info' | 'error' | 'warn';

interface ILogger {
  log(level: LogLevel, message: string, data?: object): void;
}

// Decision: Centralized logic for different environments
class AppLogger implements ILogger {
  log(level: LogLevel, message: string, data?: object) {
    const timestamp = new Date().toISOString();
    const payload = { timestamp, level, message, ...data };

    if (process.env.NODE_ENV === 'production') {
      // Decision: In production, we might want to send this to an external service (e.g., Datadog)
      // For now, it's a placeholder to show structural intent
      console.log(JSON.stringify(payload));
    } else {
      console.info(`[${timestamp}] ${level.toUpperCase()}: ${message}`, data || '');
    }
  }
}

export const logger = new AppLogger();