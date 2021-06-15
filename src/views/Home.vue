<template>
  <div>
    <h1>home</h1>
    <!-- <v-tabs>
      <v-tab v-for="tab in tabList" :key="tab.id">
        <component :is="tab.name" />
      </v-tab>
    </v-tabs> -->
    <hello-world msg="hello" />
    <v-btn @click="loadPic">load</v-btn>
    <img :src="require('@/assets/ttt/' + pic + '.png')" />
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

  data() {
    return {
      url: "",
      pic: "logo",
      tabList: [
        {
          id: 1,
          name: "HelloWorld",
        },
      ],
    };
  },
  mounted() {
    // const pic = require("@/assets/logo.png");
  },
  methods: {
    loadPic() {
      this.pic = "logo1";
    },
  },
});
</script>
