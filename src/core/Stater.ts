import { Token, TokenType } from "./Token";
import { Exception } from "../helper/Exception";

const isProperty = (c) => /\w/.test(c);

const isNumberData = (c) => /[\d\-\.\+]/.test(c);

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
      return K1;
    }

    throw new Exception(index, `must be work, not '${c}'`);
  }

  function K1(c: string) {
    if (isProperty(c)) {
      tokenString += c;
      return K1;
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
    if (isNumberData(c)) {
      tokenString = c;
      return N1;
    }

    throw new Exception(index, `must be int, not '${c}'`);
  }

  function N1(c: string) {
    if (isNumberData(c)) {
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
      return K1;
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

    if (c === "[") {
      tokenString = c;
      emit();
      return O3;
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

    if (isNumberData(c)) {
      tokenString = c;
      return N2;
    }

    if (c === "(") {
      tokenString = c;
      emit(TokenType.OPE_ARG_OPEN);
      return F1;
    }

    if (isProperty(c)) {
      tokenString = c;
      return K1;
    }

    throw new Exception(
      index,
      `must be int or '$' or ')' or callback or word or string open, not '${c}'`
    );
  }

  function F1(c: string) {
    if (isProperty(c)) {
      tokenString = c;
      return K2;
    }

    if (c === ")") {
      tokenString = c;
      emit(TokenType.OPE_ARG_CLOSE);
      return F2;
    }
  }

  function K2(c: string) {
    if (isProperty(c)) {
      tokenString += c;
      return K2;
    }

    if (c === ")") {
      emit();
      tokenString = c;
      emit(TokenType.OPE_ARG_CLOSE);
      return F2;
    }

    if (c === ",") {
      emit();
      tokenString = c;
      emit();
      return O10;
    }
  }

  function O10(c: string) {
    if (isProperty(c)) {
      tokenString += c;
      return K2;
    }
  }

  function F2(c: string) {
    if (c === "=") {
      tokenString += c;
      return F3;
    }
  }

  function F3(c: string) {
    if (c === ">") {
      tokenString += c;
      emit(TokenType.DT_FN);
      return F3;
    }

    if (c === "$") {
      tokenString = c;
      emit();
      return O1;
    }

    if (isProperty(c)) {
      tokenString = c;
      emit();
      return K3;
    }

    if (c === '"') {
      tokenString = c;
      emit(TokenType.OPE_STR_OPEN);
      return O8;
    }

    if (isNumberData(c)) {
      tokenString = c;
      return N2;
    }
  }

  function K3(c: string) {
    if (isProperty(c)) {
      tokenString += c;
      emit();
      return K3;
    }

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

    if (c === "(") {
      tokenString = c;
      emit();
      return O5;
    }

    if (c === ".") {
      tokenString = c;
      emit();
      return O2;
    }
  }

  function N2(c: string) {
    if (isNumberData(c)) {
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
      return S1;
    }

    if (c === '"') {
      emit(TokenType.DT_STR);
      tokenString = c;
      emit(TokenType.OPE_STR_CLOSE);
      return O9;
    }
  }

  function S1(c: string) {
    if (c === "\\") {
      // 特殊字符优先处理
      return S2;
    }

    if (c !== '"') {
      tokenString += c;
      return S1;
    }

    if (c === '"') {
      emit(TokenType.DT_STR);
      tokenString = c;
      emit(TokenType.OPE_STR_CLOSE);
      return O9;
    }
  }

  function S2(c: string) {
    tokenString += c;
    return S1;
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

    if (c === ".") {
      tokenString = c;
      emit();
      return O2;
    }

    if (c === "(") {
      tokenString = c;
      emit();
      return O5;
    }

    throw new Exception(index, `must be ')' or ',' or '.', not '${c}'`);
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

    if (isNumberData(c)) {
      tokenString = c;
      return N2;
    }

    if (c === "(") {
      tokenString = c;
      emit(TokenType.OPE_ARG_OPEN);
      return F1;
    }

    if (isProperty(c)) {
      tokenString = c;
      return K1;
    }

    throw new Exception(index, `must be '$' or '"' or int, not '${c}'`);
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
