<template>
  <div class="site">
    <a :href="url"><slot :url="url"></slot></a>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop() private url!: string;
}
</script>
