export class AccessNode {
  col: number;
  name: string;
  prop: AccessNode | CallNode;
  constructor(name, col = 0, prop = null) {
    this.name = name;
    this.prop = prop;
    this.col = col;
  }
}
type Arg = AccessNode | DataNode<any>;
export class CallNode {
  col: number;
  name: string;
  args: Arg[];
  constructor(name, col = 0, args = []) {
    this.name = name;
    this.args = args;
    this.col = col;
  }
}
export class DataNode<T> {
  col: number;
  value: T;
  constructor(value: T, col = 0) {
    this.value = value;
    this.col = col;
  }
}
