import { Lexer } from "./Lexer";
import { Token, TokenType } from "./Token";

export class CtxexpParser {
  tokens: Token[];
  ctx;
  constructor(ctx, exp) {
    this.tokens = new Lexer(exp).toTokens();
    this.ctx = ctx as any;
  }

  execAst(ast) {
    const $ = this.ctx;
    const dfs = (node, ctx) => {
      if (!node || Object.keys(node).length === 0) {
        return ctx;
      }
      if (node instanceof CallNode) {
        const args = [];
        for (let i = 0; i < node.args.length; i++) {
          const argNode = node.args[i];
          const res = dfs(argNode, $);
          args.push(res);
        }
        const res = ctx[node.name](...args);
        return res;
      }

      if (node instanceof AccessNode) {
        if (node.name === "$") {
          const res = dfs(node.prop, $);
          return res;
        }
        const res = dfs(node.prop, ctx[node.name]);
        return res;
      }
    };

    return dfs(ast, $);
  }
  exec() {
    return this.execAst(this.toAst());
  }

  toAst() {
    const tokens = this.tokens;

    let token: Token = null;
    let prevToken: Token = null;
    let ast = access();
    let stack = [];

    console.log(JSON.stringify(ast, null));

    return ast;

    function walk() {
      prevToken = token;
      token = tokens.shift();
    }

    function access() {
      walk();
      if (!token) {
        return null;
      }
      if (token.type === TokenType.OPE_ARG_SPT) {
        return null;
      }
      if (token.type === TokenType.ID_OBJ && prevToken === null) {
        const ast = new AccessNode(token.text);
        ast.prop = access();
        return ast;
      }

      if (
        token.type === TokenType.ID_OBJ &&
        prevToken.type === TokenType.OPE_POI
      ) {
        return new AccessNode(token.text, access());
      }

      if (
        token.type === TokenType.ID_FN &&
        prevToken.type === TokenType.OPE_POI
      ) {
        return new CallNode(token.text, access());
      }

      if (
        token.type === TokenType.ID_OBJ &&
        prevToken.type === TokenType.OPE_CALL_OPEN
      ) {
        const args = [];
        args.push(new AccessNode(token.text, access()));
        walk();
        while ((prevToken.type as TokenType) === TokenType.OPE_ARG_SPT) {
          args.push(new AccessNode(token.text, access()));
        }
        return args;
      }

      return access();
    }
  }
}
export class AccessNode {
  name: string;
  prop: AccessNode | CallNode;
  constructor(name, prop = null) {
    this.name = name;
    this.prop = prop;
  }
}
type Arg = AccessNode | NumNode | StrNode;
export class CallNode {
  name: string;
  args: Arg[];
  constructor(name, args) {
    this.name = name;
    this.args = args;
  }
}
class NumNode {
  value: number;
  constructor(value) {
    this.value = value;
  }
}
class StrNode {
  value: string;
  constructor(value) {
    this.value = value;
  }
}
const args = [
  (obj) => ({
    type: "exp_fn",
    text: "call",
    args: [{ type: "var", text: "obj" }],
    return: {
      type: "var",
      text: "obj",
      next: {},
    },
  }),
];
function expFn(cb) {
  return cb();
}
