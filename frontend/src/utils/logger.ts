/**
 * Atom Nexus 日志工具
 * 用于统一管理应用内的日志记录和输出
 */

// 日志级别
export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug',
}

// 日志配置
interface LoggerConfig {
  enableConsole: boolean; // 是否在控制台输出
  enableRemote: boolean; // 是否发送到远程服务器
  minLevel: LogLevel; // 最低记录级别
  remoteUrl?: string; // 远程服务器URL
}

// 默认配置
const defaultConfig: LoggerConfig = {
  enableConsole: process.env.NODE_ENV === 'development',
  enableRemote: process.env.NODE_ENV === 'production',
  minLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  remoteUrl: '/api/logs',
};

// 日志条目接口
export interface LogEntry {
  level: LogLevel;
  tag: string;
  message: string;
  data?: any;
  timestamp: string;
  sessionId?: string;
}

/**
 * 日志管理类
 */
class Logger {
  private config: LoggerConfig;
  private sessionId: string;
  private logQueue: LogEntry[] = [];
  private readonly MAX_QUEUE_SIZE = 50;
  private flushInterval: number | null = null;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
    this.sessionId = this.generateSessionId();

    // 在生产环境中设置定期发送日志到服务器
    if (this.config.enableRemote) {
      this.flushInterval = window.setInterval(() => this.flushLogs(), 30000);
    }

    // 页面卸载前尝试发送剩余日志
    window.addEventListener('beforeunload', () => {
      if (this.logQueue.length > 0) {
        this.flushLogs();
      }
    });
  }

  /**
   * 生成会话ID
   */
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 记录信息日志
   */
  public info(tag: string, message: string, data?: any): void {
    this.log(LogLevel.INFO, tag, message, data);
  }

  /**
   * 记录警告日志
   */
  public warn(tag: string, message: string, data?: any): void {
    this.log(LogLevel.WARN, tag, message, data);
  }

  /**
   * 记录错误日志
   */
  public error(tag: string, message: string, data?: any): void {
    this.log(LogLevel.ERROR, tag, message, data);
  }

  /**
   * 记录调试日志
   */
  public debug(tag: string, message: string, data?: any): void {
    this.log(LogLevel.DEBUG, tag, message, data);
  }

  /**
   * 通用日志记录方法
   */
  private log(level: LogLevel, tag: string, message: string, data?: any): void {
    // 检查日志级别
    if (this.shouldLog(level)) {
      const logEntry: LogEntry = {
        level,
        tag,
        message,
        data,
        timestamp: new Date().toISOString(),
        sessionId: this.sessionId,
      };

      // 控制台输出
      if (this.config.enableConsole) {
        this.consoleLog(logEntry);
      }

      // 添加到队列，准备发送到服务器
      if (this.config.enableRemote) {
        this.logQueue.push(logEntry);

        // 如果队列已满，立即发送
        if (this.logQueue.length >= this.MAX_QUEUE_SIZE) {
          this.flushLogs();
        }
      }
    }
  }

  /**
   * 判断是否应该记录此级别的日志
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const minLevelIndex = levels.indexOf(this.config.minLevel);
    const currentLevelIndex = levels.indexOf(level);

    return currentLevelIndex >= minLevelIndex;
  }

  /**
   * 在控制台输出日志
   */
  private consoleLog(entry: LogEntry): void {
    const formattedTime = new Date(entry.timestamp).toLocaleTimeString();
    const logPrefix = `[${formattedTime}] [${entry.level.toUpperCase()}] [${entry.tag}]:`;

    switch (entry.level) {
      case LogLevel.INFO:
        console.info(logPrefix, entry.message, entry.data || '');
        break;
      case LogLevel.WARN:
        console.warn(logPrefix, entry.message, entry.data || '');
        break;
      case LogLevel.ERROR:
        console.error(logPrefix, entry.message, entry.data || '');
        break;
      case LogLevel.DEBUG:
        console.debug(logPrefix, entry.message, entry.data || '');
        break;
    }
  }

  /**
   * 发送日志到远程服务器
   */
  private async flushLogs(): Promise<void> {
    if (this.logQueue.length === 0) return;

    const logsToSend = [...this.logQueue];
    this.logQueue = [];

    if (this.config.remoteUrl) {
      try {
        // 使用 Fetch API 发送日志
        await fetch(this.config.remoteUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            logs: logsToSend,
            clientInfo: {
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              sessionId: this.sessionId,
            },
          }),
          // 使用 keepalive 确保页面关闭时也能发送请求
          keepalive: true,
        });
      } catch (error) {
        // 发送失败时，将日志重新添加到队列
        if (this.config.enableConsole) {
          console.error('Failed to send logs to server:', error);
        }
        // 只保留最近的日志，避免无限增长
        this.logQueue = [...logsToSend.slice(-this.MAX_QUEUE_SIZE / 2), ...this.logQueue];
      }
    }
  }

  /**
   * 更新日志配置
   */
  public updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };

    // 更新远程日志发送间隔
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }

    if (this.config.enableRemote) {
      this.flushInterval = window.setInterval(() => this.flushLogs(), 30000);
    }
  }
}

// 创建并导出日志实例
export const logger = new Logger();
