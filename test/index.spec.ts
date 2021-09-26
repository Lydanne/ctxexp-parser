import { CtxexpParser, AccessNode, CallNode } from "../src/core/CtxexpParser";

describe("ctxexpParser", () => {
  it("should return lovelove", () => {
    const exp = `$.foo.fn($.foo.boo,$.foo.boo)`;
    const exp1 = `$.foo.boo`;
    const ctx = {
      foo: {
        boo: "love",
        fn(str, str1) {
          return str + str1;
        },
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("lovelove");
  });

  it("should return ast", () => {
    const exp = `$.foo.fn($.foo.boo,$.aoo)`;
    const ctx = {
      foo: {
        boo: "love",
        fn(str) {
          return str;
        },
      },
    };

    expect(new CtxexpParser(ctx, exp).toAst()).toEqual({
      name: "$",
      prop: {
        name: "foo",
        prop: {
          name: "fn",
          args: [
            {
              name: "$",
              prop: { name: "foo", prop: { name: "boo", prop: null } },
            },
            { name: "$", prop: { name: "aoo", prop: null } },
          ],
        },
      },
    });
  });

  it("should nested recursion return ast", () => {
    const exp = `$.foo.fn($.foo.boo,$.fn($.foo.boo,$.foo.boo))`;
    const ctx = {
      foo: {
        boo: "love",
        fn(str) {
          return str;
        },
      },
    };

    expect(new CtxexpParser(ctx, exp).toAst()).toEqual({
      name: "$",
      prop: {
        name: "foo",
        prop: {
          name: "fn",
          args: [
            {
              name: "$",
              prop: { name: "foo", prop: { name: "boo", prop: null } },
            },
            {
              name: "$",
              prop: {
                name: "fn",
                args: [
                  {
                    name: "$",
                    prop: { name: "foo", prop: { name: "boo", prop: null } },
                  },
                  {
                    name: "$",
                    prop: { name: "foo", prop: { name: "boo", prop: null } },
                  },
                ],
              },
            },
          ],
        },
      },
    });
  });

  it("should return result", () => {
    const exp1 = `$.foo.fn($.foo.boo,$.foo.boo)`; // NO USER
    const ast = new AccessNode(
      "$",
      new AccessNode(
        "foo",
        new CallNode("fn", [
          new AccessNode("$", new AccessNode("foo", new AccessNode("boo"))),
          new AccessNode("$", new AccessNode("foo", new AccessNode("boo"))),
        ])
      )
    );
    const ctx = {
      foo: {
        boo: "love",
        fn(str, str1) {
          return str + str1;
        },
      },
    };

    expect(new CtxexpParser(ctx, exp1).execAst(ast)).toBe("lovelove");
  });

  it("should nested recursion return result", () => {
    const exp1 = `$.foo.fn($.foo.fn($.foo.boo))`; // NO USER
    const ast = new AccessNode(
      "$",
      new AccessNode(
        "foo",
        new CallNode("fn", [
          new AccessNode("$", new AccessNode("foo", new AccessNode("boo"))),
        ])
      )
    );
    const ctx = {
      foo: {
        boo: "love",
        fn(str) {
          return str;
        },
      },
    };

    expect(new CtxexpParser(ctx, exp1).execAst(ast)).toBe("love");
  });

  it("should combination of nested return lovelovelove", () => {
    const exp = `$.foo.fn($.foo.boo,$.foo.fn($.foo.boo,$.foo.boo))`;
    const ctx = {
      foo: {
        boo: "love",
        fn(str, str1) {
          return str + str1;
        },
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("lovelovelove");
  });
});
