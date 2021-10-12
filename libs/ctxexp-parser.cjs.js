// Copyright (c) 2021 WumaCoder
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class Exception extends Error {
    message;
    col;
    code;
    static exp;
    constructor(col, message, code = exports.ErrorCode.SYNTAX) {
        super();
        this.col = col;
        this.code = code;
        this.message = `\n${this.toCodeLocTip()}\nCtxexpParserError(${code}): ${message}\n`;
    }
    toCodeLocTip() {
        return `    ${Exception.exp}\n    ${' '.repeat(this.col)}^`;
    }
}
exports.ErrorCode = void 0;
(function (ErrorCode) {
    ErrorCode[ErrorCode["SYNTAX"] = 1] = "SYNTAX";
    ErrorCode[ErrorCode["CALL"] = 2] = "CALL";
    ErrorCode[ErrorCode["READ"] = 3] = "READ";
})(exports.ErrorCode || (exports.ErrorCode = {}));

function mapperEnum(enumParams) {
    for (const key in enumParams) {
        Object.defineProperty(enumParams, enumParams[key], {
            value: key,
            enumerable: false,
        });
    }
}

var TokenType;
(function (TokenType) {
    TokenType["OPE_POI"] = ".";
    TokenType["OPE_ARG_SPT"] = ",";
    TokenType["OPE_ARR_OPEN"] = "[";
    TokenType["OPE_ARR_CLOSE"] = "]";
    TokenType["OPE_CALL_OPEN"] = "(";
    TokenType["OPE_CALL_CLOSE"] = ")";
    TokenType["OPE_ARG_OPEN"] = "fn(";
    TokenType["OPE_ARG_CLOSE"] = "fn)";
    TokenType["OPE_STR_OPEN"] = "ope_str_open";
    TokenType["OPE_STR_CLOSE"] = "ope_str_close";
    TokenType["ID_ARR"] = "id_arr";
    TokenType["ID_OBJ"] = "id_obj";
    TokenType["DEF_VAR"] = "def_var";
    TokenType["ID_FN"] = "id_fn";
    TokenType["DT_STR"] = "dt_str";
    TokenType["DT_NUM"] = "dt_num";
    TokenType["DT_FN"] = "dt_fn";
    TokenType["EOF"] = "eof";
})(TokenType || (TokenType = {}));
mapperEnum(TokenType);
class Token {
    text;
    type;
    col;
    constructor(text, col, type = TokenType[TokenType[text]] ?? TokenType.ID_OBJ) {
        this.type = type;
        this.text = text;
        this.col = col;
    }
}

const isProperty = (c) => /\w/.test(c);
const isNumberData = (c) => /[\d\-\.\+]/.test(c);
function createStater(exp) {
    let tokenString = "";
    let index = 0;
    const tokens = [];
    let statusr = start;
    for (let i = 0; i < exp.length; i++) {
        const c = exp[i];
        index = i;
        statusr = statusr(c);
    }
    index++;
    emit();
    return tokens;
    function start(c) {
        if (c === "$") {
            tokenString = c;
            emit();
            return O1;
        }
        return start;
    }
    function O1(c) {
        if (c === ".") {
            tokenString = c;
            emit();
            return O2;
        }
        throw new Exception(index, `must be '.', not '${c}'`);
    }
    function O2(c) {
        if (isProperty(c)) {
            tokenString = c;
            return K1;
        }
        throw new Exception(index, `must be work, not '${c}'`);
    }
    function K1(c) {
        if (isProperty(c)) {
            tokenString += c;
            return K1;
        }
        if (c === ".") {
            emit();
            tokenString = c;
            emit();
            return O2;
        }
        if (c === "(") {
            emit(TokenType.ID_FN);
            tokenString = c;
            emit();
            return O5;
        }
        if (c === ")") {
            emit();
            tokenString = c;
            emit();
            return O6;
        }
        if (c === ",") {
            emit();
            tokenString = c;
            emit();
            return O7;
        }
        if (c === "[") {
            emit();
            tokenString = c;
            emit();
            return O3;
        }
        throw new Exception(index, `must be '.' or '(' or '[', not '${c}'`);
    }
    function O3(c) {
        if (isNumberData(c)) {
            tokenString = c;
            return N1;
        }
        throw new Exception(index, `must be int, not '${c}'`);
    }
    function N1(c) {
        if (isNumberData(c)) {
            tokenString = c;
            return N1;
        }
        if (c === "]") {
            emit(TokenType.ID_ARR);
            tokenString = c;
            emit();
            return O4;
        }
        throw new Exception(index, `must be int or ']', not '${c}'`);
    }
    function O4(c) {
        if (c === ".") {
            tokenString = c;
            emit();
            return O2;
        }
        if (isProperty(c)) {
            tokenString = c;
            return K1;
        }
        if (c === ",") {
            tokenString = c;
            emit();
            return O7;
        }
        if (c === "(") {
            tokenString = c;
            emit();
            return O5;
        }
        if (c === "[") {
            tokenString = c;
            emit();
            return O3;
        }
        throw new Exception(index, `must be int or '.' or word or ',' or '(', not '${c}'`);
    }
    function O5(c) {
        if (c === "$") {
            tokenString = c;
            emit();
            return O1;
        }
        if (c === ")") {
            tokenString = c;
            emit();
            return O6;
        }
        if (c === '"') {
            tokenString = c;
            emit(TokenType.OPE_STR_OPEN);
            return O8;
        }
        if (isNumberData(c)) {
            tokenString = c;
            return N2;
        }
        if (c === "(") {
            tokenString = c;
            emit(TokenType.OPE_ARG_OPEN);
            return F1;
        }
        if (isProperty(c)) {
            tokenString = c;
            return K1;
        }
        throw new Exception(index, `must be int or '$' or ')' or callback or word or string open, not '${c}'`);
    }
    function F1(c) {
        if (isProperty(c)) {
            tokenString = c;
            return K2;
        }
        if (c === ")") {
            tokenString = c;
            emit(TokenType.OPE_ARG_CLOSE);
            return F2;
        }
    }
    function K2(c) {
        if (isProperty(c)) {
            tokenString += c;
            return K2;
        }
        if (c === ")") {
            emit();
            tokenString = c;
            emit(TokenType.OPE_ARG_CLOSE);
            return F2;
        }
        if (c === ",") {
            emit();
            tokenString = c;
            emit();
            return O10;
        }
    }
    function O10(c) {
        if (isProperty(c)) {
            tokenString += c;
            return K2;
        }
    }
    function F2(c) {
        if (c === "=") {
            tokenString += c;
            return F3;
        }
    }
    function F3(c) {
        if (c === ">") {
            tokenString += c;
            emit(TokenType.DT_FN);
            return F3;
        }
        if (c === "$") {
            tokenString = c;
            emit();
            return O1;
        }
        if (isProperty(c)) {
            tokenString = c;
            emit();
            return K3;
        }
        if (c === '"') {
            tokenString = c;
            emit(TokenType.OPE_STR_OPEN);
            return O8;
        }
        if (isNumberData(c)) {
            tokenString = c;
            return N2;
        }
    }
    function K3(c) {
        if (isProperty(c)) {
            tokenString += c;
            emit();
            return K3;
        }
        if (c === ")") {
            tokenString = c;
            emit();
            return O6;
        }
        if (c === ",") {
            tokenString = c;
            emit();
            return O7;
        }
        if (c === "(") {
            tokenString = c;
            emit();
            return O5;
        }
        if (c === ".") {
            tokenString = c;
            emit();
            return O2;
        }
    }
    function N2(c) {
        if (isNumberData(c)) {
            tokenString += c;
            return N2;
        }
        if (c === ")") {
            emit(TokenType.DT_NUM);
            tokenString = c;
            emit();
            return O6;
        }
        if (c === ",") {
            emit(TokenType.DT_NUM);
            tokenString = c;
            emit();
            return O7;
        }
        throw new Exception(index, `must be int or ',' or ')', not '${c}'`);
    }
    function O8(c) {
        if (c !== '"') {
            tokenString = c;
            return S1;
        }
        if (c === '"') {
            emit(TokenType.DT_STR);
            tokenString = c;
            emit(TokenType.OPE_STR_CLOSE);
            return O9;
        }
    }
    function S1(c) {
        if (c === "\\") {
            // 特殊字符优先处理
            return S2;
        }
        if (c !== '"') {
            tokenString += c;
            return S1;
        }
        if (c === '"') {
            emit(TokenType.DT_STR);
            tokenString = c;
            emit(TokenType.OPE_STR_CLOSE);
            return O9;
        }
    }
    function S2(c) {
        tokenString += c;
        return S1;
    }
    function O9(c) {
        if (c === ")") {
            tokenString = c;
            emit();
            return O6;
        }
        if (c === ",") {
            tokenString = c;
            emit();
            return O7;
        }
        throw new Exception(index, `must be ')' or ',', not '${c}'`);
    }
    function O6(c) {
        if (c === ")") {
            tokenString = c;
            emit();
            return O6;
        }
        if (c === ",") {
            tokenString = c;
            emit();
            return O7;
        }
        if (c === ".") {
            tokenString = c;
            emit();
            return O2;
        }
        if (c === "(") {
            tokenString = c;
            emit();
            return O5;
        }
        throw new Exception(index, `must be ')' or ',' or '.', not '${c}'`);
    }
    function O7(c) {
        if (c === "$") {
            tokenString = c;
            emit();
            return O1;
        }
        if (c === '"') {
            tokenString = c;
            emit(TokenType.OPE_STR_OPEN);
            return O8;
        }
        if (isNumberData(c)) {
            tokenString = c;
            return N2;
        }
        if (c === "(") {
            tokenString = c;
            emit(TokenType.OPE_ARG_OPEN);
            return F1;
        }
        if (isProperty(c)) {
            tokenString = c;
            return K1;
        }
        throw new Exception(index, `must be '$' or '"' or int, not '${c}'`);
    }
    function emit(type) {
        if (tokenString) {
            tokens.push(new Token(tokenString, tokenString.length > 1 ? index - tokenString.length : index, type));
        }
        tokenString = "";
    }
}

class Lexer {
    exp;
    constructor(exp) {
        Exception.exp = exp;
        this.exp = exp;
    }
    toTokens() {
        return createStater(this.exp);
    }
}

class AccessNode {
    col;
    name;
    prop;
    constructor(name, col = 0, prop = null) {
        this.name = name;
        this.prop = prop;
        this.col = col;
    }
}
class CallNode {
    col;
    name;
    args;
    prop;
    constructor(name, col = 0, args = [], prop = null) {
        this.name = name;
        this.args = args;
        this.col = col;
        this.prop = prop;
    }
}
class DataNode {
    col;
    value;
    constructor(value, col = 0) {
        this.value = value;
        this.col = col;
    }
}

class CtxexpParser {
    tokens;
    ctx;
    exp;
    constructor(ctx, exp) {
        this.ctx = ctx;
        this.exp = exp;
    }
    toTokens(exp = this.exp) {
        return (this.tokens = new Lexer(exp).toTokens());
    }
    toAst(tokens = this.tokens) {
        const that = this;
        let token = null;
        let prevToken = null;
        walk();
        let ast = buildAst();
        return ast;
        function walk() {
            prevToken = token;
            token = tokens.shift();
        }
        function buildAst() {
            if (token?.type === TokenType.ID_OBJ) {
                const ast = new AccessNode(token.text, token.col);
                let next = ast;
                walk();
                while (token?.type === TokenType.OPE_POI ||
                    token?.type === TokenType.OPE_ARR_OPEN ||
                    token?.type === TokenType.OPE_ARR_CLOSE) {
                    walk();
                    if (prevToken?.type === TokenType.OPE_ARR_CLOSE &&
                        (token?.type === TokenType.OPE_POI ||
                            token?.type === TokenType.OPE_ARR_OPEN)) {
                        // array exceptional case
                        walk();
                    }
                    if (token?.type === TokenType.ID_OBJ ||
                        token?.type === TokenType.ID_ARR) {
                        next = next.prop = new AccessNode(token.text, token.col);
                        walk();
                    }
                    else {
                        next = next.prop = buildAst();
                    }
                }
                return ast;
            }
            if (token?.type === TokenType.ID_FN) {
                // method handler
                const ast = new CallNode(token.text, token.col);
                walk();
                if (token?.type !== TokenType.OPE_CALL_OPEN) {
                    throw new Exception(token.col, `method ${prevToken.text} syntax error`, exports.ErrorCode.SYNTAX);
                }
                walk(); // skip '('
                while (token &&
                    token.type !== TokenType.OPE_CALL_CLOSE) {
                    if (token?.type === TokenType.OPE_ARG_SPT) {
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
                    if (token?.type === TokenType.OPE_CALL_CLOSE) {
                        break;
                    }
                    walk();
                }
                walk(); // skip ')'
                if (token?.type === TokenType.OPE_POI) {
                    walk(); // skip '.'
                    ast.prop = buildAst();
                }
                else if (token?.type === TokenType.OPE_CALL_OPEN) {
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
                const ast = token?.type === TokenType.OPE_ARR_CLOSE
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
                while (token?.type !== TokenType.OPE_ARG_CLOSE) {
                    if (token?.type === TokenType.OPE_ARG_SPT) {
                        walk();
                    }
                    defArgTokens.push(token);
                    walk();
                }
                walk(); // skip 'fn)'
                walk(); // skip '=>'
                const subAst = buildAst();
                return new DataNode((...args) => that.execAst(subAst, that.ctx, argsMapObj(args, defArgTokens)), col);
            }
            return null;
        }
        function argsMapObj(args, defTokens) {
            const obj = {};
            for (let i = 0; i < defTokens.length; i++) {
                const token = defTokens[i];
                obj[token.text] = args[i];
            }
            return obj;
        }
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
                        throw new Exception(node.col, `It's not a method`, exports.ErrorCode.CALL);
                    }
                    res = ctx(...args);
                }
                else {
                    if (ctx === undefined || typeof ctx[node.name] !== "function") {
                        throw new Exception(node.col, `No method exists ${node.name}`, exports.ErrorCode.CALL);
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
                const res = deepExecAst(node.prop, defArgs?.[node.name] ?? ctx?.[node.name]);
                return res;
            }
            if (node instanceof DataNode) {
                return node.value;
            }
        };
        return deepExecAst(ast, $);
    }
    exec(exp = this.exp) {
        this.toTokens(exp);
        return this.execAst(this.toAst(), this.ctx);
    }
}

exports.CtxexpParser = CtxexpParser;
exports.Exception = Exception;
exports["default"] = CtxexpParser;
