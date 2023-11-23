import Vue from "vue";
import RegForm from "./components/RegForm.vue";

const regForm = {
  install: function (Vue, options) {
    Vue.component("reg-form", RegForm);
  },
};

export default regForm;
