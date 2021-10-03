import { Lexer } from "./Lexer";
import { Token, TokenType } from "./Token";
import { Exception, ErrorCode } from "../helper/Exception";
import { CallNode, AccessNode, DataNode } from "./Node";

export class CtxexpParser {
  tokens: Token[];
  ctx;
  constructor(ctx, exp) {
    this.tokens = new Lexer(exp).toTokens();
    this.ctx = ctx as any;
  }

  execAst(ast) {
    const $ = this.ctx;
    const deepExecAst = (node, ctx) => {
      if (!node || Object.keys(node).length === 0) {
        return ctx;
      }
      if (node instanceof CallNode) {
        const args = [];
        for (let i = 0; i < node.args.length; i++) {
          const argNode = node.args[i];
          const res = deepExecAst(argNode, $);
          args.push(res);
        }

        let res = null;
        if (node.name === "__DEFAULT__") {
          if (typeof ctx !== "function") {
            throw new Exception(node.col, `It's not a method`, ErrorCode.CALL);
          }
          res = ctx(...args);
        } else {
          if (ctx === undefined || typeof ctx[node.name] !== "function") {
            throw new Exception(
              node.col,
              `No method exists ${node.name}`,
              ErrorCode.CALL
            );
          }
          res = ctx[node.name](...args);
        }
        return deepExecAst(node.prop, res);
      }

      if (node instanceof AccessNode) {
        if (node.name === "$") {
          const res = deepExecAst(node.prop, $);
          return res;
        }
        if (ctx === undefined) {
          throw new Exception(node.col, `ctx not undefined`, ErrorCode.READ);
        }
        const res = deepExecAst(node.prop, ctx[node.name]);
        return res;
      }

      if (node instanceof DataNode) {
        return node.value;
      }
    };

    return deepExecAst(ast, $);
  }
  exec() {
    return this.execAst(this.toAst());
  }

  toAst() {
    const that = this;
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
        return new AccessNode(token.text, token.col, access());
      }

      if (
        token.type === TokenType.ID_OBJ &&
        prevToken.type === TokenType.OPE_POI
      ) {
        return new AccessNode(token.text, token.col, access());
      }

      if (token.type === TokenType.ID_ARR) {
        return new AccessNode(token.text, token.col, access());
      }

      if (
        token.type === TokenType.ID_FN &&
        prevToken.type === TokenType.OPE_POI
      ) {
        return new CallNode(token.text, token.col, access(), access());
      }

      if (
        token.type === TokenType.OPE_CALL_OPEN &&
        prevToken.type === TokenType.OPE_CALL_CLOSE
      ) {
        return new CallNode("__DEFAULT__", token.col, access(), access());
      }

      if (
        token.type === TokenType.OPE_CALL_OPEN &&
        prevToken.type === TokenType.OPE_ARR_CLOSE
      ) {
        return new CallNode("__DEFAULT__", token.col, access(), access());
      }

      if (prevToken.type === TokenType.OPE_CALL_OPEN) {
        const args = [];
        if (token.type === TokenType.OPE_CALL_CLOSE) {
          return args;
        }
        if (token.type === TokenType.DT_NUM) {
          args.push(new DataNode(Number(token.text), token.col));
          walk();
        } else if (token.type === TokenType.OPE_STR_OPEN) {
          walk();
          args.push(new DataNode(String(token.text), token.col));
          walk();
          walk();
        } else if (token.type === TokenType.OPE_ARG_OPEN) {
          walk();
          walk();
          const subAst = access();
          args.push(new DataNode(() => that.execAst(subAst), token?.col));
        } else {
          args.push(new AccessNode(token.text, token.col, access()));
        }
        walk();
        while ((prevToken?.type as TokenType) === TokenType.OPE_ARG_SPT) {
          if (token.type === TokenType.DT_NUM) {
            args.push(new DataNode(Number(token.text), token.col));
            walk();
          } else if (token.type === TokenType.OPE_STR_OPEN) {
            walk();
            args.push(new DataNode(String(token.text), token.col));
            walk();
            walk();
          } else if (token.type === TokenType.OPE_ARG_OPEN) {
            walk();
            walk();
            const subAst = access();
            args.push(new DataNode(() => that.execAst(subAst), token?.col));
          } else {
            args.push(new AccessNode(token.text, token.col, access()));
          }
          walk();
        }
        return args;
      }

      return access();
    }
  }
}
