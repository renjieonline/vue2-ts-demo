<template>
  <div class="low-code">
    <div class="left"><ComponentPanel /></div>
    <div class="center"><EditorPanel /></div>
    <div class="right">right</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ComponentPanel from "./component-panel";
import EditorPanel from "./editor-panel";

@Component({
  name: "LowCode",
  components: {
    ComponentPanel,
    EditorPanel,
  },
})
export default class LowCode extends Vue {}
</script>
<style lang="scss" scoped>
.low-code {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  height: 100%;
  .left {
    flex: 0 0 300px;
  }
  .center {
    flex: 1;
  }
  .right {
    flex: 0 0 300px;
  }
}
</style>
