import { CtxexpParser } from "../src/core/CtxexpParser";

describe("CtxexpParser", () => {
  it("should return lovelove", () => {
    const exp = `$.foo.fn($.foo.boo,$.foo.boo)`;

    const ctx = {
      foo: {
        boo: "love",
        fn(str: string, str1: string) {
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
        fn(str: string, str1: string) {
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

    expect(() => new CtxexpParser(ctx, exp).exec()).toThrow();
  });

  it("should input fun base params", () => {
    const exp = `$.fn(1,"2")`;
    const ctx = {
      fn(int: number, str: string) {
        return int + str;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("12");
  });

  it("should return array value", () => {
    const _exp = `$.arr.0`;
    const exp = `$.arr[0]`;
    const exp1 = `$.arr[1].a`;
    const exp2 = `$.arr[2][0]`;
    const exp3 = `$.arr[3][0].a`;
    const exp4 = `$.arr[4][0][0]`;
    const exp5 = `$.arr[5]()`;
    const ctx = {
      arr: [1, { a: 1 }, [1], [{ a: 1 }], [[1]], () => 1],
    };

    expect(new CtxexpParser(ctx, _exp).exec()).toBe(1);
    expect(new CtxexpParser(ctx, exp).exec()).toBe(1);
    expect(new CtxexpParser(ctx, exp1).exec()).toBe(1);
    expect(new CtxexpParser(ctx, exp2).exec()).toBe(1);
    expect(new CtxexpParser(ctx, exp3).exec()).toBe(1);
    expect(new CtxexpParser(ctx, exp4).exec()).toBe(1);
    expect(new CtxexpParser(ctx, exp5).exec()).toBe(1);
  });

  it("should input fun multi param 1", () => {
    const exp = `$.fn($.a,$.a,$.a)`;
    const ctx = {
      a: 1,
      fn(n1: any, n2: any, n3: any) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe(3);
  });

  it("should input fun multi param 2", () => {
    const exp = `$.fn($.a,"1",$.a)`;
    const ctx = {
      a: 1,
      fn(n1: any, n2: any, n3: any) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("111");
  });

  it("should input fun multi param 3", () => {
    const exp = `$.fn("1","1",$.a)`;
    const ctx = {
      a: 1,
      fn(n1: any, n2: any, n3: any) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("111");
  });

  it("should input fun multi param 4", () => {
    const exp = `$.fn(1,"1",$.a)`;
    const ctx = {
      a: 1,
      fn(n1: any, n2: any, n3: any) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("111");
  });

  it("should input fun multi param 5", () => {
    const exp = `$.fn(1,1,$.a)`;
    const ctx = {
      a: 1,
      fn(n1: any, n2: any, n3: any) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe(3);
  });

  it("should input fun multi param 6", () => {
    const exp = `$.fn(1,1,1)`;
    const ctx = {
      a: 1,
      fn(n1: any, n2: any, n3: any) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe(3);
  });

  it("should input fun multi param 7", () => {
    const exp = `$.fn("1","1","1")`;
    const ctx = {
      a: 1,
      fn(n1: any, n2: any, n3: any) {
        return n1 + n2 + n3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("111");
  });

  it("should input fun multi param 8", () => {
    const exp = `$.fn("1","1")`;
    const ctx = {
      a: 1,
      fn(n1: any, n2: any, n3: any) {
        return n1 + n2;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("11");
  });

  it("should input fun multi param 9", () => {
    const exp = `$.fn("1",1)`;
    const ctx = {
      a: 1,
      fn(n1: any, n2: any, n3: any) {
        return n1 + n2;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("11");
  });

  it("should input any char", () => {
    const exp = '$.fn("1\\"1")';
    const ctx = {
      fn(n1: any) {
        return n1;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe('1"1');
  });

  it("should passing in a JSON", () => {
    const exp = '$.fn($.JSON.parse("{\\"test\\":2}"))';
    const ctx = {
      JSON,
      fn(obj: any) {
        return obj.test;
      },
    };

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
      fn(n1: any) {
        return {
          fn(n2: any) {
            return n1 + n2;
          },
        };
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe(3);
  });

  it("Solve a chain-access problem caused by passing an empty parameter.", () => {
    const exp = "$.fn().foo";
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

  it("Solve a problem caused by passing an empty parameter.", () => {
    const exp = "$.fn()";
    const exp2 = "$.fn().fn()";
    const ctx = {
      JSON,
      fn() {
        return {
          foo: 521,
          fn() {
            return this.foo;
          },
        };
      },
    };

    expect(new CtxexpParser(ctx, exp).exec().foo).toEqual(521);

    expect(new CtxexpParser(ctx, exp2).exec()).toBe(521);
  });

  it("Method returns a call to a function", () => {
    const exp = "$.fn()()";
    const ctx = {
      JSON,
      fn() {
        return () => {
          return 521;
        };
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe(521);
  });

  it("Method returns a call to a function 2", () => {
    const exp = "$.fn()()()";
    const ctx = {
      JSON,
      fn() {
        return () => {
          return () => 521;
        };
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe(521);
  });

  it("support number type", () => {
    const exp = "$.fn(1,-1,1.1)";
    const exp1 = "$.fn(-1,+1,1.1)";
    const ctx = {
      JSON,
      fn(n1: any, n2: any, n3: any) {
        return [n1, n2, n3];
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toEqual([1, -1, 1.1]);
    expect(new CtxexpParser(ctx, exp1).exec()).toEqual([-1, 1, 1.1]);
  });

  it("Passed function expression.", () => {
    const exp = `$.when(1,()=>$.True(),()=>$.False())`;
    const exp1 = `$.when(0,()=>$.True(),()=>$.False())`;

    const ctx = {
      True: () => true,
      False: () => false,
      when(bool: any, trueCb: any, falseCb: any) {
        if (bool) {
          return trueCb();
        } else {
          return falseCb();
        }
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe(true);
    // expect(new CtxexpParser(ctx, exp1).exec()).toBe(false);
  });

  it("Passed function expression 2.", () => {
    const exp = `$.fn((s1,s2)=>$.concat(s1,s2,s2))`;

    const ctx = {
      fn(cb: any) {
        return cb("hello", "Ctxexp");
      },
      concat(s1: any, s2: any, s3: any) {
        return s1 + s2 + s3;
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("helloCtxexpCtxexp");
  });

  it("Passed function expression 3.", () => {
    const exp = `$.For(0,10,1).each((i)=>i).join(",")`;

    const ctx = {
      For(init: any, last: any, step: any) {
        return {
          each(cb: any) {
            const res = [];
            for (let i = init; i < last; i += step) {
              res.push(cb(i));
            }
            return res;
          },
        };
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("0,1,2,3,4,5,6,7,8,9");
  });

  it("Passed function expression 4.", () => {
    const exp = `$.runs((i)=>$.Type(i)).join("")`;

    const ctx = {
      a: {
        runs() {
          return ["A"];
        },
      },
      runs(...cbs: any[]) {
        return cbs.map((cb, index) => cb(index));
      },
      Type(i: any) {
        return ["A", "D", "C"][i];
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toBe("A");
  });

  it("read array in call fn", () => {
    const exp = "$.fn($.arr[0],$.arr[0])";

    const ctx = {
      arr: [1],
      fn(n1: any, n2: any) {
        return [n1, n2];
      },
    };

    expect(new CtxexpParser(ctx, exp).exec()).toEqual([1, 1]);
  });
});
