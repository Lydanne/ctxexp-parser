// Copyright (c) 2021 WumaCoder
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

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
    TokenType["OPE_STR_OPEN"] = "ope_str_open";
    TokenType["OPE_STR_CLOSE"] = "ope_str_close";
    TokenType["ID_ARR"] = "id_arr";
    TokenType["ID_OBJ"] = "id_obj";
    TokenType["ID_FN"] = "id_fn";
    TokenType["DT_STR"] = "dt_str";
    TokenType["DT_NUM"] = "dt_num";
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

class Exception extends Error {
    message;
    col;
    code;
    constructor(col, message, code = ErrorCode.SYNTAX) {
        super();
        this.message = `CtxexpParserError(${code}): In the ${col} column, ${message}`;
        this.code = code;
        this.col = col;
    }
}
var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["SYNTAX"] = 1] = "SYNTAX";
    ErrorCode[ErrorCode["CALL"] = 2] = "CALL";
    ErrorCode[ErrorCode["READ"] = 3] = "READ";
})(ErrorCode || (ErrorCode = {}));

const isProperty = (c) => /\w/.test(c);
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
            return S1;
        }
        throw new Exception(index, `must be work, not '${c}'`);
    }
    function S1(c) {
        if (isProperty(c)) {
            tokenString += c;
            return S1;
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
        if (/[0-9]/.test(c)) {
            tokenString = c;
            return N1;
        }
        throw new Exception(index, `must be int, not '${c}'`);
    }
    function N1(c) {
        if (/[0-9]/.test(c)) {
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
            return S1;
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
        if (/[0-9]/.test(c)) {
            tokenString = c;
            return N2;
        }
        throw new Exception(index, `must be int or '$' or ')' or word or string open, not '${c}'`);
    }
    function N2(c) {
        if (/[0-9]/.test(c)) {
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
        if (/[^"]/i.test(c)) {
            tokenString = c;
            return S2;
        }
        if (c === '"') {
            emit(TokenType.DT_STR);
            tokenString = c;
            emit(TokenType.OPE_STR_CLOSE);
            return O9;
        }
    }
    function S2(c) {
        if (/[^"]/i.test(c)) {
            tokenString += c;
            return S2;
        }
        if (c === '"') {
            emit(TokenType.DT_STR);
            tokenString = c;
            emit(TokenType.OPE_STR_CLOSE);
            return O9;
        }
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
        throw new Exception(index, `must be ')' or ',', not '${c}'`);
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
        if (/[0-9]/.test(c)) {
            tokenString = c;
            return N2;
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
    constructor(name, col = 0, args = []) {
        this.name = name;
        this.args = args;
        this.col = col;
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
    constructor(ctx, exp) {
        this.tokens = new Lexer(exp).toTokens();
        this.ctx = ctx;
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
                    throw new Exception(node.col, `No method exists ${node.name}`, ErrorCode.CALL);
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
            if (node instanceof DataNode) {
                return node.value;
            }
        };
        return dfs(ast, $);
    }
    exec() {
        return this.execAst(this.toAst());
    }
    toAst() {
        const tokens = this.tokens;
        let token = null;
        let prevToken = null;
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
            if (token.type === TokenType.ID_OBJ &&
                prevToken.type === TokenType.OPE_POI) {
                return new AccessNode(token.text, token.col, access());
            }
            if (token.type === TokenType.ID_FN &&
                prevToken.type === TokenType.OPE_POI) {
                return new CallNode(token.text, token.col, access());
            }
            if (prevToken.type === TokenType.OPE_CALL_OPEN) {
                const args = [];
                if (token.type === TokenType.DT_NUM) {
                    args.push(new DataNode(Number(token.text), token.col));
                    walk();
                }
                else if (token.type === TokenType.OPE_STR_OPEN) {
                    walk();
                    args.push(new DataNode(String(token.text), token.col));
                    walk();
                    walk();
                }
                else {
                    args.push(new AccessNode(token.text, token.col, access()));
                }
                walk();
                while (prevToken?.type === TokenType.OPE_ARG_SPT) {
                    if (token.type === TokenType.DT_NUM) {
                        args.push(new DataNode(Number(token.text), token.col));
                        walk();
                    }
                    else if (token.type === TokenType.OPE_STR_OPEN) {
                        walk();
                        args.push(new DataNode(String(token.text), token.col));
                        walk();
                        walk();
                    }
                    else {
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

export { ErrorCode, Exception, CtxexpParser as default };
