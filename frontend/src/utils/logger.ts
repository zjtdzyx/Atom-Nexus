/**
 * 全局日志工具
 * 用于记录前端操作日志、API调用日志和页面加载日志
 */

// 日志级别类型
type LogLevel = 'info' | 'warn' | 'error';

// 日志条目接口
interface LogEntry {
  level: LogLevel;
  tag: string;
  message: string;
  data?: any;
  timestamp: string;
}

/**
 * 日志管理器
 */
class Logger {
  private logs: LogEntry[] = [];
  private maxLogSize = 1000; // 内存中保留的最大日志条数
  private apiEndpoint: string | null = null; // 生产环境日志服务器地址

  /**
   * 输出信息级别日志
   * @param tag 日志标签（模块名/组件名）
   * @param message 日志信息
   * @param data 可选的附加数据
   */
  public info(tag: string, message: string, data?: any): void {
    this.log('info', tag, message, data);
  }

  /**
   * 输出警告级别日志
   * @param tag 日志标签（模块名/组件名）
   * @param message 日志信息
   * @param data 可选的附加数据
   */
  public warn(tag: string, message: string, data?: any): void {
    this.log('warn', tag, message, data);
  }

  /**
   * 输出错误级别日志
   * @param tag 日志标签（模块名/组件名）
   * @param message 日志信息
   * @param data 可选的附加数据
   */
  public error(tag: string, message: string, data?: any): void {
    this.log('error', tag, message, data);
  }

  /**
   * 内部日志记录方法
   */
  private log(level: LogLevel, tag: string, message: string, data?: any): void {
    const logEntry: LogEntry = {
      level,
      tag,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    // 添加到内存日志数组
    this.logs.push(logEntry);

    // 如果超过最大日志条数，删除最早的日志
    if (this.logs.length > this.maxLogSize) {
      this.logs.shift();
    }

    // 开发环境下输出到控制台
    if (process.env.NODE_ENV === 'development') {
      this.printToConsole(logEntry);
    }

    // 生产环境下可以发送到日志服务器
    if (process.env.NODE_ENV === 'production' && this.apiEndpoint) {
      this.sendToServer(logEntry);
    }
  }

  /**
   * 设置日志服务器地址
   * @param endpoint 日志服务器API地址
   */
  public setApiEndpoint(endpoint: string): void {
    this.apiEndpoint = endpoint;
  }

  /**
   * 清空日志
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * 获取所有日志
   */
  public getAllLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * 获取指定级别的日志
   * @param level 日志级别
   */
  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * 获取指定标签的日志
   * @param tag 日志标签
   */
  public getLogsByTag(tag: string): LogEntry[] {
    return this.logs.filter(log => log.tag === tag);
  }

  /**
   * 将日志打印到控制台
   */
  private printToConsole(logEntry: LogEntry): void {
    const { level, tag, message, data, timestamp } = logEntry;
    const time = new Date(timestamp).toLocaleTimeString();
    
    const styles = {
      info: 'color: #3498db; font-weight: bold;',
      warn: 'color: #f39c12; font-weight: bold;',
      error: 'color: #e74c3c; font-weight: bold;',
    };
    
    console.group(`%c${level.toUpperCase()} [${tag}] - ${time}`, styles[level]);
    console.log(message);
    if (data !== undefined) {
      console.log('数据:', data);
    }
    console.groupEnd();
  }

  /**
   * 将日志发送到服务器（生产环境）
   */
  private sendToServer(logEntry: LogEntry): void {
    if (!this.apiEndpoint) return;
    
    // 使用 navigator.sendBeacon 进行非阻塞日志上报
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(logEntry)], { type: 'application/json' });
      navigator.sendBeacon(this.apiEndpoint, blob);
    } else {
      // 回退方案：使用 fetch API
      fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
        // 使用 keepalive 确保页面卸载时请求仍能完成
        keepalive: true,
      }).catch(err => {
        console.error('日志上传失败:', err);
      });
    }
  }
}

// 创建全局日志实例
export const logger = new Logger();

// 导出类型定义
export type { LogLevel, LogEntry }; 