export type SuccessfulResponse<T> = { error: false } & T;

export type ErrorResponse = { error: true };

export type LoadingResponse = { loading: true };

export type Response<T> = ErrorResponse | SuccessfulResponse<T>;

export type ResponseWithLoading<T> = LoadingResponse | ({ loading: false } & Response<T>);
