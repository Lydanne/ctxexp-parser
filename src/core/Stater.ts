import { Token, TokenType } from "./Token";
import { Exception } from "../helper/Exception";

const isProperty = (c) => /\w/.test(c);

export function createStater(exp) {
  let tokenString = "";
  let index = 0;
  const tokens = [];

  let statusr = start;
  for (let i = 0; i < exp.length; i++) {
    const c = exp[i];
    index = i;
    statusr = statusr(c);
  }
  index++;
  emit();

  return tokens;

  function start(c: string) {
    if (c === "$") {
      tokenString = c;
      emit();
      return O1;
    }
    return start;
  }

  function O1(c: string) {
    if (c === ".") {
      tokenString = c;
      emit();
      return O2;
    }

    throw new Exception(index, `must be '.', not '${c}'`);
  }

  function O2(c: string) {
    if (isProperty(c)) {
      tokenString = c;
      return S1;
    }

    throw new Exception(index, `must be work, not '${c}'`);
  }

  function S1(c: string) {
    if (isProperty(c)) {
      tokenString += c;
      return S1;
    }
    if (c === ".") {
      emit();
      tokenString = c;
      emit();
      return O2;
    }
    if (c === "(") {
      emit(TokenType.ID_FN);
      tokenString = c;
      emit();
      return O5;
    }
    if (c === ")") {
      emit();
      tokenString = c;
      emit();
      return O6;
    }
    if (c === ",") {
      emit();
      tokenString = c;
      emit();
      return O7;
    }
    if (c === "[") {
      emit();
      tokenString = c;
      emit();
      return O3;
    }
    throw new Exception(index, `must be '.' or '(' or '[', not '${c}'`);
  }

  function O3(c: string) {
    if (/[0-9]/.test(c)) {
      tokenString = c;
      return N1;
    }

    throw new Exception(index, `must be int, not '${c}'`);
  }

  function N1(c: string) {
    if (/[0-9]/.test(c)) {
      tokenString = c;
      return N1;
    }
    if (c === "]") {
      emit(TokenType.ID_ARR);
      tokenString = c;
      emit();
      return O4;
    }

    throw new Exception(index, `must be int or ']', not '${c}'`);
  }

  function O4(c: string) {
    if (c === ".") {
      tokenString = c;
      emit();
      return O2;
    }

    if (isProperty(c)) {
      tokenString = c;
      return S1;
    }

    if (c === ",") {
      tokenString = c;
      emit();
      return O7;
    }

    if (c === "(") {
      tokenString = c;
      emit();
      return O5;
    }

    throw new Exception(
      index,
      `must be int or '.' or word or ',' or '(', not '${c}'`
    );
  }

  function O5(c: string) {
    if (c === "$") {
      tokenString = c;
      emit();
      return O1;
    }
    if (c === ")") {
      tokenString = c;
      emit();
      return O6;
    }
    if (c === '"') {
      tokenString = c;
      emit(TokenType.OPE_STR_OPEN);
      return O8;
    }

    if (/[0-9]/.test(c)) {
      tokenString = c;
      return N2;
    }

    throw new Exception(
      index,
      `must be int or '$' or ')' or word or string open, not '${c}'`
    );
  }

  function N2(c: string) {
    if (/[0-9]/.test(c)) {
      tokenString += c;
      return N2;
    }
    if (c === ")") {
      emit(TokenType.DT_NUM);
      tokenString = c;
      emit();
      return O6;
    }

    if (c === ",") {
      emit(TokenType.DT_NUM);
      tokenString = c;
      emit();
      return O7;
    }

    throw new Exception(index, `must be int or ',' or ')', not '${c}'`);
  }

  function O8(c: string) {
    if (c !== '"') {
      tokenString = c;
      return S2;
    }

    if (c === '"') {
      emit(TokenType.DT_STR);
      tokenString = c;
      emit(TokenType.OPE_STR_CLOSE);
      return O9;
    }
  }

  function S2(c: string) {
    if (c === "\\") {
      // 特殊字符优先处理
      return S3;
    }

    if (c !== '"') {
      tokenString += c;
      return S2;
    }

    if (c === '"') {
      emit(TokenType.DT_STR);
      tokenString = c;
      emit(TokenType.OPE_STR_CLOSE);
      return O9;
    }
  }

  function S3(c: string) {
    tokenString += c;
    return S2;
  }

  function O9(c: string) {
    if (c === ")") {
      tokenString = c;
      emit();
      return O6;
    }

    if (c === ",") {
      tokenString = c;
      emit();
      return O7;
    }

    throw new Exception(index, `must be ')' or ',', not '${c}'`);
  }

  function O6(c: string) {
    if (c === ")") {
      tokenString = c;
      emit();
      return O6;
    }
    if (c === ",") {
      tokenString = c;
      emit();
      return O7;
    }

    if(c === '.'){
      tokenString = c;
      emit();
      return O2;
    }

    throw new Exception(index, `must be ')' or ',', not '${c}'`);
  }

  function O7(c: string) {
    if (c === "$") {
      tokenString = c;
      emit();
      return O1;
    }
    if (c === '"') {
      tokenString = c;
      emit(TokenType.OPE_STR_OPEN);
      return O8;
    }

    if (/[0-9]/.test(c)) {
      tokenString = c;
      return N2;
    }

    throw new Exception(index, `must be '$' or '"' or int, not '${c}'`);
  }

  function end(c: string) {
    return end;
  }

  function emit(type?: TokenType) {
    if (tokenString) {
      tokens.push(
        new Token(
          tokenString,
          tokenString.length > 1 ? index - tokenString.length : index,
          type
        )
      );
    }
    tokenString = "";
  }
}
