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

  it("should input fun base params", () => {
    const exp = `$.fn(1,"2")`;
    const ctx = {
      fn(int, str) {
        return int + str;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("12");
  });

  it("should input fun multi param 1", () => {
    const exp = `$.fn($.a,$.a,$.a)`;
    const ctx = {
      a: 1,
      fn(n1, n2, n3) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe(3);
  });

  it("should input fun multi param 2", () => {
    const exp = `$.fn($.a,"1",$.a)`;
    const ctx = {
      a: 1,
      fn(n1, n2, n3) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("111");
  });

  it("should input fun multi param 3", () => {
    const exp = `$.fn("1","1",$.a)`;
    const ctx = {
      a: 1,
      fn(n1, n2, n3) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("111");
  });

  it("should input fun multi param 4", () => {
    const exp = `$.fn(1,"1",$.a)`;
    const ctx = {
      a: 1,
      fn(n1, n2, n3) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("111");
  });

  it("should input fun multi param 5", () => {
    const exp = `$.fn(1,1,$.a)`;
    const ctx = {
      a: 1,
      fn(n1, n2, n3) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe(3);
  });

  it("should input fun multi param 6", () => {
    const exp = `$.fn(1,1,1)`;
    const ctx = {
      a: 1,
      fn(n1, n2, n3) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe(3);
  });

  it("should input fun multi param 7", () => {
    const exp = `$.fn("1","1","1")`;
    const ctx = {
      a: 1,
      fn(n1, n2, n3) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("111");
  });

  it("should input fun multi param 8", () => {
    const exp = `$.fn("1","1")`;
    const ctx = {
      a: 1,
      fn(n1, n2, n3) {
        return n1 + n2;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("11");
  });

  it("should input fun multi param 9", () => {
    const exp = `$.fn("1",1)`;
    const ctx = {
      a: 1,
      fn(n1, n2, n3) {
        return n1 + n2;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("11");
  });

  it("should input any char", () => {
    const exp = '$.fn("1\\"1")';
    const ctx = {
      fn(n1) {
        return n1;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe('1"1');
  });

  it("should passing in a JSON", () => {
    const exp = "$.fn($.JSON.parse(\"{\\\"test\\\":2}\"))"; // 刻意模拟表达式在JSON的情况下
    const ctx = {
      JSON,
      fn(obj) {
        return obj.test;
      },
    };
    console.log(exp);

    expect(new CtxexpParser(ctx, exp).exec()).toBe(2);
  });


  it("should access the method return value object", () => {
    const exp = "$.fn(1).foo";
    const ctx = {
      JSON,
      fn() {
        return {
          foo: 521,
        };
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe(521);
  });

  it("should access the method return value object", () => {
    const exp = "$.fn(1).fn(2)";
    const ctx = {
      JSON,
      fn(n1) {
        return {
          fn(n2){
            return n1+n2;
          }
        };
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe(3);
  });
});
