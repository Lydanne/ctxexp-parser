export declare class AccessNode {
    col: number;
    name: string;
    prop: AccessNode | CallNode;
    constructor(name: any, col?: number, prop?: any);
}
type Arg = AccessNode | DataNode<any>;
export declare class CallNode {
    col: number;
    name: string;
    args: Arg[];
    prop: Node;
    constructor(name: any, col?: number, args?: any[], prop?: any);
}
export declare class DataNode<T> {
    col: number;
    value: T;
    constructor(value: T, col?: number);
}
export type Node = AccessNode | CallNode | DataNode<any>;
export {};
//# sourceMappingURL=Node.d.ts.map