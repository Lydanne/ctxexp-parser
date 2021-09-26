import { createStater } from "./Stater";

export class Lexer {
  exp: string;
  constructor(exp) {
    this.exp = exp;
  }

  toTokens() {
    return createStater(this.exp);
  }
}
