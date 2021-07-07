import { VNode, CreateElement } from "vue";
import * as tsx from "vue-tsx-support";

export const EditorPanel = tsx.componentFactory.create({
  data() {
    return {
      name: "text",
    };
  },
  render(h: CreateElement): VNode {
    return (
      <div>
        <span>EditorPanel</span>
        {this.renderTree(h)}
      </div>
    );
  },

  methods: {
    renderTree(h: CreateElement): VNode {
      return h("div", {}, this.name);
    },
  },
});
