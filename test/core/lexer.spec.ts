import { Lexer } from "../../src/core/Lexer";

describe("ctxexpParser", () => {
  it("should parser return tokens", () => {
    const exp = `$.foo[0].fn[0]("hells",$.a[0],1,222,$.b,$.fn(),"fff")`;

    const lexer = new Lexer(exp);

    expect(lexer.toTokens()).toEqual([
      { text: "$", type: "id_obj", col: 0 },
      { text: ".", type: ".", col: 1 },
      { text: "foo", type: "id_obj", col: 2 },
      { text: "[", type: "[", col: 5 },
      { text: "0", type: "id_arr", col: 7 },
      { text: "]", type: "]", col: 7 },
      { text: ".", type: ".", col: 8 },
      { text: "fn", type: "id_obj", col: 9 },
      { text: "[", type: "[", col: 11 },
      { text: "0", type: "id_arr", col: 13 },
      { text: "]", type: "]", col: 13 },
      { text: "(", type: "(", col: 14 },
      { text: '"', type: "ope_str_open", col: 15 },
      { text: "hells", type: "dt_str", col: 16 },
      { text: '"', type: "ope_str_close", col: 21 },
      { text: ",", type: ",", col: 22 },
      { text: "$", type: "id_obj", col: 23 },
      { text: ".", type: ".", col: 24 },
      { text: "a", type: "id_obj", col: 26 },
      { text: "[", type: "[", col: 26 },
      { text: "0", type: "id_arr", col: 28 },
      { text: "]", type: "]", col: 28 },
      { text: ",", type: ",", col: 29 },
      { text: "1", type: "dt_num", col: 31 },
      { text: ",", type: ",", col: 31 },
      { text: "222", type: "dt_num", col: 32 },
      { text: ",", type: ",", col: 35 },
      { text: "$", type: "id_obj", col: 36 },
      { text: ".", type: ".", col: 37 },
      { text: "b", type: "id_obj", col: 39 },
      { text: ",", type: ",", col: 39 },
      { text: "$", type: "id_obj", col: 40 },
      { text: ".", type: ".", col: 41 },
      { text: "fn", type: "id_fn", col: 42 },
      { text: "(", type: "(", col: 44 },
      { text: ")", type: ")", col: 45 },
      { text: ",", type: ",", col: 46 },
      { text: '"', type: "ope_str_open", col: 47 },
      { text: "fff", type: "dt_str", col: 48 },
      { text: '"', type: "ope_str_close", col: 51 },
      { text: ")", type: ")", col: 52 },
    ]);
  });

  it("should return 3", () => {
    const exp = "  $.test";
    const lexer = new Lexer(exp);
    expect(lexer.toTokens()).toHaveLength(3);
  });

  it("should throw CtxexpParserError(1): In the 1 column, must be '.', not 'x'", () => {
    const exp = "$x.test";
    const lexer = new Lexer(exp);
    expect(() => lexer.toTokens()).toThrowError(
      "CtxexpParserError(1): In the 1 column, must be '.', not 'x'"
    );
  });

  it("should throw error CtxexpParserError(1): In the 4 column, must be '.' or '(' or '[', not ' '", () => {
    const exp = "$.fn ()";
    const lexer = new Lexer(exp);
    expect(() => lexer.toTokens()).toThrowError(
      "CtxexpParserError(1): In the 4 column, must be '.' or '(' or '[', not ' '"
    );
  });

  it("should throw error", () => {
    expect(() => new Lexer(`$.a[x]`).toTokens()).toThrowError();
    expect(() => new Lexer(`$.a [0]`).toTokens()).toThrowError();
    expect(() => new Lexer(`$.a(x)`).toTokens()).toThrowError();
    expect(() => new Lexer(`$.a($.a, $.a)`).toTokens()).toThrowError();
    expect(() => new Lexer(`$.a().a`).toTokens()).toThrowError(); // TODO: 后期要支持
  });
});
