export class Exception extends Error {
  message: string;
  col: number;
  code: number;
  static exp: string;
  constructor(
    col: number,
    message: string,
    code: ErrorCode = ErrorCode.SYNTAX,
  ) {
    super();
    this.col = col;
    this.code = code;
    this.message = `\n${this.toCodeLocTip()}\nCtxexpParserError(${code}): ${message}\n`;
  }

  toCodeLocTip(){
    return `    ${Exception.exp}\n    ${' '.repeat(this.col)}^`
  }
}

export enum ErrorCode {
  SYNTAX = 1,
  CALL = 2,
  READ = 3,
}
