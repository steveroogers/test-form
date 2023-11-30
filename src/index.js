import RegForm from "./components/RegForm.vue";

const regForm = {
  install: function (Vue) {
    Vue.component("reg-form", RegForm);
  },
};

export default regForm;
