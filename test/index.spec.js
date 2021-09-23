describe("ctxexpParser", () => {
  it("should ", () => {
    const ctxexp = `$.foo`;
    const ctx = {
      foo: "love",
    };

    expect(new Ctxexp(ctx).parser(ctxexp)).toBe("love");
  });
});

class Ctxexp {
  constructor(ctx) {
    this.ctx = ctx;
  }

  parser(exp) {
    return exp;
  }
}
