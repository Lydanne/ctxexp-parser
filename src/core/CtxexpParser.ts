import { Lexer } from "./Lexer";
import { Token, TokenType } from "./Token";
import { Exception, ErrorCode } from "../helper/Exception";
import { CallNode, AccessNode, DataNode, Node } from "./Node";

export class CtxexpParser {
  tokens: Token[];
  ctx;
  constructor(ctx, exp) {
    this.tokens = new Lexer(exp).toTokens();
    this.ctx = ctx as any;
  }

  execAst(ast, $ = this.ctx, defArgs = {}) {
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
        // if (ctx === undefined) {
        //   throw new Exception(node.col, `ctx not undefined`, ErrorCode.READ);
        // }
        const res = deepExecAst(
          node.prop,
          defArgs?.[node.name] ?? ctx?.[node.name]
        );
        return res;
      }

      if (node instanceof DataNode) {
        return node.value;
      }
    };

    return deepExecAst(ast, $);
  }
  exec() {
    return this.execAst(this.toAst(), this.ctx);
  }

  toAst() {
    const that = this;
    const tokens = this.tokens;

    let token: Token = null;
    let prevToken: Token = null;
    let stackDeep: number = 0;

    walk();
    let ast = buildAst();

    return ast;

    function walk() {
      prevToken = token;
      token = tokens.shift();

      if (token?.text === "(" || token?.text === ")") {
        stackDeep += token.text === "(" ? 1 : -1;
      }
    }

    function buildAst() {
      if (token?.type === TokenType.ID_OBJ) {
        const ast = new AccessNode(token.text, token.col);
        let next: any = ast;

        walk();
        while (
          (token?.type as TokenType) === TokenType.OPE_POI ||
          (token?.type as TokenType) === TokenType.OPE_ARR_OPEN ||
          (token?.type as TokenType) === TokenType.OPE_ARG_CLOSE
        ) {
          walk();
          if ((token?.type as TokenType) === TokenType.ID_FN) {
            next = next.prop = buildAst();
          } else {
            next = next.prop = new AccessNode(token.text, token.col);
            walk();
          }
        }

        return ast;
      }

      if (token?.type === TokenType.ID_FN) {
        // method handler
        const ast: any = new CallNode(token.text, token.col);
        walk();
        if ((token?.type as TokenType) !== TokenType.OPE_CALL_OPEN) {
          throw new Exception(
            token.col,
            `method ${prevToken.text} syntax error`,
            ErrorCode.SYNTAX
          );
        }
        walk(); // skip '('
        while (
          token &&
          (token.type as TokenType) !== TokenType.OPE_CALL_CLOSE
        ) {
          if ((token?.type as TokenType) === TokenType.OPE_ARG_SPT) {
            walk();
          }

          /*TODO: 待优化可读性
          if (
            tokenType === TokenType.ID_FN ||
            tokenType === TokenType.OPE_STR_OPEN
          ) {
            const subAst = buildAst();
            ast.args.push(subAst);
          } else {
            const subAst = buildAst();
            ast.args.push(subAst);
            walk();
          } */

          const subAst = buildAst();
          ast.args.push(subAst);
          if ((token?.type as TokenType) === TokenType.OPE_CALL_CLOSE) {
            break;
          }
          walk();
        }
        walk(); // skip ')'
        if ((token?.type as TokenType) === TokenType.OPE_POI) {
          walk(); // skip '.'
          ast.prop = buildAst();
        } else if ((token?.type as TokenType) === TokenType.OPE_CALL_OPEN) {
          ast.prop = buildAst();
        }

        return ast;
      }

      if (token?.type === TokenType.OPE_CALL_OPEN) {
        tokens.unshift(token);
        tokens.unshift(new Token("__DEFAULT__", token.col, TokenType.ID_FN));
        walk();
        return buildAst();
      }

      if (token?.type === TokenType.OPE_STR_OPEN) {
        walk();
        const ast =
          (token?.type as TokenType) === TokenType.OPE_ARR_CLOSE
            ? new DataNode("", token.col)
            : new DataNode(token.text, token.col);
        walk();
        return ast;
      }

      if (token?.type === TokenType.DT_NUM) {
        return new DataNode(Number(token.text), token.col);
      }

      if (token?.type === TokenType.OPE_ARG_OPEN) {
        const defArgTokens = [];
        const col = token.col;
        walk();
        while ((token?.type as TokenType) !== TokenType.OPE_ARG_CLOSE) {
          if ((token?.type as TokenType) === TokenType.OPE_ARG_SPT) {
            walk();
          }
          defArgTokens.push(token);
          walk();
        }
        walk(); // skip 'fn)'
        walk(); // skip '=>'
        const subAst = buildAst();
        return new DataNode(
          (...args) =>
            that.execAst(subAst, that.ctx, argsMapObj(args, defArgTokens)),
          col
        );
      }

      return null;
    }

    function argsMapObj(args: any[], defTokens: Token[]) {
      const obj = {};
      for (let i = 0; i < defTokens.length; i++) {
        const token = defTokens[i];
        obj[token.text] = args[i];
      }
      return obj;
    }
  }
}
