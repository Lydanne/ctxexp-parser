import { Lexer } from "./Lexer";
import { Token, TokenType } from "./Token";
import { Exception, ErrorCode } from "../helper/Exception";
import { CallNode, AccessNode } from "./Node";

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
        if (ctx === undefined || typeof ctx[node.name] !== "function") {
          throw new Exception(
            node.col,
            `No method exists ${node.name}`,
            ErrorCode.CALL
          );
        }
        const res = ctx[node.name](...args);
        return res;
      }

      if (node instanceof AccessNode) {
        if (node.name === "$") {
          const res = dfs(node.prop, $);
          return res;
        }
        if (ctx === undefined) {
          throw new Exception(node.col, `ctx not undefined`, ErrorCode.READ);
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
        const ast = new AccessNode(token.text, token.col);
        ast.prop = access();
        return ast;
      }

      if (
        token.type === TokenType.ID_OBJ &&
        prevToken.type === TokenType.OPE_POI
      ) {
        return new AccessNode(token.text, token.col, access());
      }

      if (
        token.type === TokenType.ID_FN &&
        prevToken.type === TokenType.OPE_POI
      ) {
        return new CallNode(token.text, token.col, access());
      }

      if (
        token.type === TokenType.ID_OBJ &&
        prevToken.type === TokenType.OPE_CALL_OPEN
      ) {
        const args = [];
        args.push(new AccessNode(token.text, token.col, access()));
        walk();
        while ((prevToken.type as TokenType) === TokenType.OPE_ARG_SPT) {
          args.push(new AccessNode(token.text, token.col, access()));
        }
        return args;
      }

      return access();
    }
  }
}
