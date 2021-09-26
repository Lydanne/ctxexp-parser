export declare class AccessNode {
    col: number;
    name: string;
    prop: AccessNode | CallNode;
    constructor(name: any, col?: number, prop?: any);
}
declare type Arg = AccessNode | DataNode<any>;
export declare class CallNode {
    col: number;
    name: string;
    args: Arg[];
    constructor(name: any, col?: number, args?: any[]);
}
export declare class DataNode<T> {
    col: number;
    value: T;
    constructor(value: T, col?: number);
}
export {};
//# sourceMappingURL=Node.d.ts.map