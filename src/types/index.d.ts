export type NavBarItemType = {
  title: string;
  path: string;
  enabled: boolean;
  target?: string;
  icon?: string;
};

export interface BaseResponse<T> {
  result: T;
  status_code: number;
  message?: string;
  success?: boolean;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
}

export type ActionResponse<T> = SuccessResponse<T> | ErrorResponse;
