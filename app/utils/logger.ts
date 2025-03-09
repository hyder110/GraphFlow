/**
 * Logger utility for consistent logging across the application
 * 
 * In production, this will only log errors and warnings by default.
 * In development, it will log all levels.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  module?: string;
  data?: any;
}

class Logger {
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, options?: LogOptions): void {
    if (!this.isProduction) {
      this.log('debug', message, options);
    }
  }

  /**
   * Log an info message (only in development)
   */
  info(message: string, options?: LogOptions): void {
    if (!this.isProduction) {
      this.log('info', message, options);
    }
  }

  /**
   * Log a warning message
   */
  warn(message: string, options?: LogOptions): void {
    this.log('warn', message, options);
  }

  /**
   * Log an error message
   */
  error(message: string, options?: LogOptions): void {
    this.log('error', message, options);
  }

  /**
   * Internal method to handle logging
   */
  private log(level: LogLevel, message: string, options?: LogOptions): void {
    const timestamp = new Date().toISOString();
    const module = options?.module || 'app';
    const data = options?.data;

    const logObject = {
      timestamp,
      level,
      module,
      message,
      ...(data ? { data } : {})
    };

    switch (level) {
      case 'debug':
        console.debug(JSON.stringify(logObject));
        break;
      case 'info':
        console.info(JSON.stringify(logObject));
        break;
      case 'warn':
        console.warn(JSON.stringify(logObject));
        break;
      case 'error':
        console.error(JSON.stringify(logObject));
        break;
    }
  }
}

// Export a singleton instance
const logger = new Logger();
export default logger; 