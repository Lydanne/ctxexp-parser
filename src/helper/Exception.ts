export class Exception extends Error {
  message: string;
  col: number;
  code: number;
  constructor(
    col: number,
    message: string,
    code: ErrorCode = ErrorCode.SYNTAX
  ) {
    super();
    this.message = `CtxexpParserError(${code}): In the ${col} column, ${message}`;
    this.code = code;
    this.col = col;
  }
}

export enum ErrorCode {
  SYNTAX = 1,
  CALL = 2,
  READ = 3,
}
