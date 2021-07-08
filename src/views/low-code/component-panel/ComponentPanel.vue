<template>
  <div class="component-panel">
    <div class="action">action</div>
    <div class="panel">
      <div
        class="component-item"
        v-for="(item, index) in componentData"
        :key="index"
        draggable="true"
        @dragstart="handleDragStart($event, item)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive } from "@vue/composition-api";

export default defineComponent({
  setup() {
    const componentData = reactive([
      {
        name: "button",
        title: "按钮",
        path: "./base-components/button",
        props: {},
        children: "按钮",
      },
      {
        name: "input",
        title: "输入",
        path: "./base-components/button",
        props: {
          type: "text",
          value: "输入",
        },
        children: [],
      },
    ]);

    const handleDragStart = (e, item) => {
      console.log(e, item);
      e.dataTransfer.effectAllowed = "copy";
      if (e.currentTarget === e.target) {
        e.dataTransfer.setData("componentProperty", JSON.stringify(item));
      }
    };

    return { componentData, handleDragStart };
  },
});
</script>
<style lang="scss" scoped>
.component-panel {
  height: 100%;
  border: 1px solid #000;
  .panel {
    padding: 0 20px;
    .component-item {
      height: 30px;
      border: 1px solid #000;
    }
  }
}
</style>
