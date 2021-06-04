<template>
  <div>
    <h1>home</h1>
    <v-tabs>
      <v-tab v-for="tab in tabList" :key="tab.id">
        <component :is="tab.name" />
      </v-tab>
    </v-tabs>
    <!-- <hello-world msg="hello" /> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "../components/HelloWorld.vue";

export default Vue.extend({
  name: "Home",

  components: {
    HelloWorld,
  },

  data: function () {
    return {
      tabList: [
        {
          id: 1,
          name: "HelloWorld",
        },
      ],
    };
  },
});
</script>
