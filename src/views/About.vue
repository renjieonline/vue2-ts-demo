<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Site url="https://baidu.com" v-slot="{ url }">百度的地址是{{ url }}</Site>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Site from "@/components/Site.vue";

@Component({
  components: {
    Site,
  },
})
export default class Home extends Vue {}
</script>
