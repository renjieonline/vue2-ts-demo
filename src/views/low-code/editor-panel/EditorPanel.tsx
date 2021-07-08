import { VNode, CreateElement } from "vue";
import "./editor-panel.scss";
import ComponentTree from "../ComponnetTree";
import { Component, Vue } from "vue-property-decorator";
import { cloneDeep } from "lodash-es";

@Component
export default class EditorPanel extends Vue {
  name = "text";
  componnetTree = new ComponentTree();

  renderTree(h: CreateElement): VNode {
    console.log("render......", this.componnetTree.treeData);
    const nodeList = cloneDeep(this.componnetTree.treeData.children);
    return h(
      "div",
      {},
      nodeList.map((c) => h('div', { props: c.props, attrs: {...c.props, cid: c.cid }}))
    );
  }

  handleDragEnter(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    console.log("drag enter");
    console.log(e);
  }

  handleDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    console.log("drag over");
    console.log(e);

    if (e.currentTarget === e.target) {
      (e.target as Element).classList.add("active");
    }
  }

  handleDragLeave(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    console.log("drag leave");
    console.log(e);
  }

  handleDrop(e: DragEvent): void {
    e.preventDefault();
    (e.target as Element).classList.remove("active");
    const node = JSON.parse(e.dataTransfer?.getData("componentProperty") || "");

    this.componnetTree.addComponent("0", node);
  }

  showPropertyPanel(): void {
    console.log("show property panel");
  }

  protected render(h: CreateElement): VNode {
    return (
      <div
        class="editor-panel"
        dropEffect="copy"
        on-dragenter={this.handleDragEnter}
        on-dragover={this.handleDragOver}
        on-dragleave={this.handleDragLeave}
        on-drop={this.handleDrop}
        on-click={this.showPropertyPanel}
      >
        <span>EditorPanel</span>
        {this.renderTree(h)}
      </div>
    );
  }
}
