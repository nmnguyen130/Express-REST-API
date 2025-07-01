// Response for overall data
export interface IApiResponse<T = any> {
  status: 'success' | 'error' | 'fail';
  message?: string;
  data?: T;
  error?: {
    code?: string | number;
    message: string;
    details?: any;
  };
}

export class ApiResponse<T = any> {
  /**
   * Creates a successful API response
   * @param data The data to include in the response
   * @param message Optional success message
   */
  static success<T>(data: T, message: string = 'Operation successful'): IApiResponse<T> {
    return {
      status: 'success',
      message,
      data,
    };
  }

  /**
   * Creates an error response
   * @param message Error message
   * @param code Optional error code
   * @param details Additional error details
   */
  static error(
    message: string,
    code?: string | number,
    details?: any
  ): IApiResponse<null> {
    return {
      status: 'error',
      error: {
        code,
        message,
        details,
      },
    };
  }

  /**
   * Creates a fail response (for validation failures)
   * @param message Failure message
   * @param details Additional failure details (e.g., validation errors)
   */
  static fail(message: string, details?: any): IApiResponse<null> {
    return {
      status: 'fail',
      message,
      error: {
        message,
        details,
      },
    };
  }
}