import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import View from "@ckeditor/ckeditor5-ui/src/view";
import { throttle } from "lodash-es";

type OutlineConfig = {
  container: string;
};

type OutlineNode = {
  id: number;
  tagNum: string;
  name: string;
  children?: OutlineNode[];
};

export default class OutlineEditing extends Plugin {
  outputView: typeof View;
  config: OutlineConfig;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  constructor(editor: any) {
    super(editor);

    Object.defineProperties(this, {
      outlines: {
        get() {
          return this.getOutlines();
        },
      },
    });

    this.config = editor.config.get("outline") || {};
    this.outputView = undefined;
  }

  init(): void {
    console.log("Outlines#init() got called");
    const editor = this.editor;

    editor.model.document.on(
      "change:data",
      throttle(this.getOutlines.bind(this), 250)
    );

    // const container = document.querySelector(this.config.container) as Element;
    // container.appendChild(this.outlineContainer());
  }

  destroy(): void {
    if (this.outputView) {
      this.outputView.element.remove();
      this.outputView.destroy();
    }

    super.destroy();
  }

  private getOutlines() {
    const root = this.editor.model.document.getRoot();
    const nodes = [];
    let res: OutlineNode[] = [];
    let id = 0;
    for (const i of root.getChildren()) {
      const matched = i.name.match(/^heading(\d)$/);
      if (matched) {
        const item = {
          id: id++,
          tagNum: matched[1],
          name: i.toJSON().children[0].data,
        };
        nodes.push(item);
      }
    }

    if (nodes.length < 2) {
      return nodes;
    }

    let curr: OutlineNode | null = null;
    let prev: OutlineNode = nodes[0];
    const stack = [prev];
    res = [prev];
    for (let i = 1; i < nodes.length; i++) {
      curr = nodes[i];
      while (stack.length) {
        if (curr.tagNum > prev.tagNum) {
          if (!prev.children) prev.children = [];
          prev.children.push(curr);
          stack.push(curr);
          prev = curr;
          break;
        } else {
          stack.pop();
          prev = stack[stack.length - 1];
        }
      }
      if (prev === curr) continue;
      res.push(curr);
      stack.push(curr);
      prev = curr;
    }
    return res;
  }

  outlineContainer(): Node {
    if (!this.outputView) {
      this.outputView = new View();
      this.outputView.setTemplate({
        tag: "div",
        attributes: {
          class: ["ck", "ck-outline"],
        },
        children: "outline",
      });

      this.outputView.render();
    }
    return this.outputView.element;
  }
}
