export class APIError extends Error {
  code;
  message;

  constructor(code: number | string, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

export const isAPIError = (
  data: unknown,
): data is {
  code: number | string;
  message: string;
} => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'code' in data &&
    'message' in data
  );
};
