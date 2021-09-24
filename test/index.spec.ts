describe("ctxexpParser", () => {
  it("should parser return love", () => {
    const exp = `$.foo.boo`;
    const exp1 = `$.foo.call($.boo).a`;
    const exp2 = `$.foo.call($.fetch())`;
    const ctx = {
      foo: {
        boo: "love",
      },
    };
    const lexer = new CtxexpLexer(exp);

    expect(lexer.toTokens()).toEqual([
      {
        type: "CTX",
        value: "$",
        col: 0,
      },
      {
        type: "OPE",
        value: ".",
        col: 1,
      },
      {
        type: "KEY",
        value: "foo",
        col: 2,
      },
      {
        type: "ATTR",
        value: ".",
        col: 5,
      },
      {
        type: "KEY",
        value: "boo",
        col: 6,
      },
    ]);
    // expect(ctxexp.parser(exp)).toBe("love");
  });
});

enum TokenType {}

class CtxexpLexer {
  exp: string;
  constructor(exp) {
    this.exp = exp;
  }

  toTokens() {}
}
