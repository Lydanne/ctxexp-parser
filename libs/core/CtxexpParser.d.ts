import { Token } from "./Token";
export declare class CtxexpParser {
    tokens: Token[];
    ctx: any;
    exp: string;
    constructor(ctx: any, exp: string);
    toTokens(exp?: string): Token[];
    toAst(tokens?: Token[]): any;
    execAst(ast: Token, $?: any, defArgs?: {}): any;
    exec(exp?: string): any;
}
export default CtxexpParser;
//# sourceMappingURL=CtxexpParser.d.ts.map