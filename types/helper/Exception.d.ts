export declare class Exception extends Error {
    message: string;
    col: number;
    code: number;
    constructor(col: number, message: string, code?: ErrorCode);
}
export declare enum ErrorCode {
    SYNTAX = 1,
    CALL = 2,
    READ = 3
}
//# sourceMappingURL=Exception.d.ts.map