import Vue from "vue";
import RegForm from "./components/RegForm.vue";

Vue.config.productionTip = false;

new Vue({
  render: (h) =>
    h(RegForm, {
      props: {
        projectId: 10,
        // checkboxes: '["18?", "21?"]',
        // verifyPhone: true,
      },
    }),
}).$mount("#app");
