import { v4 as uuid } from "uuid";

export interface NodeProps {
  [propName: string]: any;
}

export interface Node {
  cid?: string;
  title: string;
  name: string;
  path: string;
  props: NodeProps;
  children: Node[];
}

export default class ComponetTree {
  treeData: Node = {
    cid: "0",
    title: "",
    name: "root",
    path: "/",
    props: {},
    children: [],
  };

  constructor(data?: Node) {
    if (data) {
      this.treeData = data;
    }
  }

  setData(data: Node): void {
    this.treeData = data;
  }

  findComponent(cid: string): Node | null {
    let item: Node | null = null;
    function traverse(data: Node, id: string) {
      if (data.cid === id) {
        item = data;
      } else {
        data.children.forEach((node) => traverse(node, id));
      }
    }

    traverse(this.treeData, cid);
    return item;
  }

  addComponent(cid: string, item: Node): void {
    const parent: Node | null = this.findComponent(cid);
    if (!parent) return;
    parent.children.push({ ...item, cid: uuid() });
  }

  removeComponent(cid: string): Node | null {
    const stack = [];
    let item: Node | null = null;
    const parent: Node = this.treeData;
    for (let i = 0; i < parent.children.length; i++) {
      let currentParent = parent;
      const child = parent.children[i];
      stack.push(child);
      while (stack.length > 0) {
        const node: Node = stack.shift() as Node;
        if (node.cid === cid) {
          currentParent.children = currentParent.children.filter(
            (n) => n !== node
          );
          item = node;
          break;
        } else {
          currentParent = node;
          node.children.forEach((n) => {
            stack.unshift(n);
          });
        }
      }
      if (item) {
        break;
      }
    }
    return item;
  }

  updateProps(cid: string, props: NodeProps): void {
    const parent: Node | null = this.findComponent(cid);
    if (!parent) return;
    parent.props = { ...parent.props, ...props };
  }

  updateChildren(cid: string, children: Node[]): void {
    const parent: Node | null = this.findComponent(cid);
    if (!parent) return;
    parent.children = children;
  }
}
