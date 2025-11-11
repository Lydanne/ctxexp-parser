export declare enum TokenType {
    OPE_POI = ".",
    OPE_ARG_SPT = ",",
    OPE_ARR_OPEN = "[",
    OPE_ARR_CLOSE = "]",
    OPE_CALL_OPEN = "(",
    OPE_CALL_CLOSE = ")",
    OPE_ARG_OPEN = "fn(",
    OPE_ARG_CLOSE = "fn)",
    OPE_STR_OPEN = "ope_str_open",
    OPE_STR_CLOSE = "ope_str_close",
    ID_ARR = "id_arr",
    ID_OBJ = "id_obj",
    DEF_VAR = "def_var",// no use
    ID_FN = "id_fn",
    DT_STR = "dt_str",
    DT_NUM = "dt_num",
    DT_FN = "dt_fn",// =>
    EOF = "eof"
}
export declare class Token {
    text: string;
    type: TokenType;
    col: number;
    constructor(text: string, col: number, type?: any);
}
//# sourceMappingURL=Token.d.ts.map