import { CtxexpParser } from "../src/core/CtxexpParser";
import { AccessNode, CallNode } from "../src/core/Node";

describe("ctxexpParser", () => {
  it("should return lovelove", () => {
    const exp = `$.foo.fn($.foo.boo,$.foo.boo)`;

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
      col: 0,
      name: "$",
      prop: {
        col: 2,
        name: "foo",
        prop: {
          col: 6,
          name: "fn",
          args: [
            {
              col: 9,
              name: "$",
              prop: {
                col: 11,
                name: "foo",
                prop: {
                  col: 15,
                  name: "boo",
                  prop: null,
                },
              },
            },
            {
              col: 19,
              name: "$",
              prop: {
                col: 21,
                name: "fn",
                args: [
                  {
                    col: 24,
                    name: "$",
                    prop: {
                      col: 26,
                      name: "foo",
                      prop: {
                        col: 30,
                        name: "boo",
                        prop: null,
                      },
                    },
                  },
                  {
                    col: 34,
                    name: "$",
                    prop: {
                      col: 36,
                      name: "foo",
                      prop: {
                        col: 40,
                        name: "boo",
                        prop: null,
                      },
                    },
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
      0,
      new AccessNode(
        "foo",
        0,
        new CallNode("fn", 0, [
          new AccessNode(
            "$",
            0,
            new AccessNode("foo", 0, new AccessNode("boo"))
          ),
          new AccessNode(
            "$",
            0,
            new AccessNode("foo", 0, new AccessNode("boo"))
          ),
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

  it("should throw error", () => {
    const exp = `$.foo.fn($.foo.boo,$.foo.fn($.foo.boo,$.foo.boo))`;
    const ctx = {
      foo: {
        boo: "love",
      },
    };

    expect(() => new CtxexpParser(ctx, exp).exec()).toThrowError();
  });
});
