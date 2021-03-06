import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import vuetify from "./plugins/vuetify";
import VueCompositionAPI from "@vue/composition-api";

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(VueCompositionAPI);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
