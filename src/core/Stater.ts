import { Token, TokenType } from "./Token";

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
  emit(TokenType.EOF);

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
  }

  function O2(c: string) {
    if (/\w/.test(c)) {
      tokenString = c;
      return S1;
    }
  }

  function S1(c: string) {
    if (/[a-z]/i.test(c)) {
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
    return end;
  }

  function O3(c: string) {
    if (/[0-9]/.test(c)) {
      tokenString = c;
      return N1;
    }
    return end;
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
  }

  function O4(c: string) {
    if (c === ".") {
      tokenString = c;
      emit();
      return O2;
    }

    if (/[a-z]/i.test(c)) {
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

    return end;
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
  }

  function O8(c: string) {
    if (/[^"]/i.test(c)) {
      tokenString = c;
      return S2;
    }
  }

  function S2(c: string) {
    if (/[^"]/i.test(c)) {
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
    return end;
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
    return end;
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
