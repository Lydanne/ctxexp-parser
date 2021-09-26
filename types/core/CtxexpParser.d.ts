import { Token } from "./Token";
export declare class CtxexpParser {
    tokens: Token[];
    ctx: any;
    constructor(ctx: any, exp: any);
    execAst(ast: any): any;
    exec(): any;
    toAst(): any;
}
//# sourceMappingURL=CtxexpParser.d.ts.map