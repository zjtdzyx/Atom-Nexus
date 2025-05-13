/**
 * 统一API响应接口
 */
export interface ApiResponse<T> {
  /**
   * 请求是否成功
   */
  success: boolean;

  /**
   * 响应数据
   */
  data?: T;

  /**
   * 错误信息
   */
  error?: string;

  /**
   * 成功时的消息
   */
  message?: string;
}
