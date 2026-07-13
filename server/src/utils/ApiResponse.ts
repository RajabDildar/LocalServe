interface ApiResponseOptions {
  statusCode: number;
  message?: string;
  data?: any;
}

export class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;

  constructor({
    statusCode,
    message = "Success",
    data = null,
  }: ApiResponseOptions) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; // Convention: 2xx, 3xx are success
  }
}
