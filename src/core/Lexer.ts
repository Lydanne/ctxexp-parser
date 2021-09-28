import { Exception } from "../helper/Exception";
import { createStater } from "./Stater";

export class Lexer {
  exp: string;
  constructor(exp) {
    Exception.exp = exp;
    this.exp = exp;
  }

  toTokens() {
    return createStater(this.exp);
  }
}
