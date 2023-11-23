<template>
  <div class="wf-input">
    <div
      class="wf-input__control"
      :class="[
        {
          'wf-input__control--focused': isFocus,
          'wf-input__control--error': errorMessage,
          'wf-input__control--hide-details': hideDetails,
          'wf-input__control--small': small,
          'wf-input__control-label': isLabel,
        },
      ]"
      @click="focusField"
    >
      <div
        v-if="isLabel"
        class="wf-input__label"
        :class="{
          'wf-input__label--error': errorMessage,
        }"
      >
        {{ placeholder }}
      </div>
      <input
        ref="input"
        :value="value"
        :type="type"
        :placeholder="placeholder"
        :data-reg-test="regTestId"
        :dir="inputRtl"
        @blur="isFocus = false"
        @input="$emit('input', $event.target.value)"
        @countrychange="$emit('countrychange', $event)"
      />
    </div>
    <div v-if="!hideDetails" class="wf-input__details">
      <div class="wf-input__message" :dir="rtl ? 'rtl' : undefined">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FormField",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    value: {
      type: String,
      default: "",
      required: false,
    },
    placeholder: {
      type: String,
      default: "",
      required: false,
    },
    type: {
      type: String,
      default: "text",
    },
    regTestId: {
      type: String,
      default: "",
    },
    errorMessage: {
      type: String,
      default: "",
    },
    hideDetails: {
      type: Boolean,
      default: false,
      required: false,
    },
    small: {
      type: Boolean,
      default: false,
      required: false,
    },
    rtl: {
      type: Boolean,
      default: false,
      required: false,
    },
    label: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      isFocus: false,
    };
  },
  computed: {
    inputRtl() {
      if (!this.rtl) return undefined;
      if (this.type === "email") return this.value ? "ltr" : "rtl";
      if (this.type === "tel") return "ltr";

      return "rtl";
    },
    isLabel() {
      return this.label && this.value;
    },
  },
  methods: {
    focusField() {
      this.$refs.input.focus();
      this.isFocus = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.wf-input {
  &__control {
    position: relative;
    background-color: var(--reg-form-field-background-color, transparent);
    display: flex;
    align-items: center;
    min-height: var(--reg-form-field-height, 50px);
    margin-bottom: 2px;
    padding: 0px 15px;
    border-style: solid;
    border-width: var(--reg-form-field-border-width, 1px);
    border-color: var(--reg-form-field-border-color, rgba(0, 0, 0, 0.2));
    border-radius: var(--reg-form-field-border-radius, 4px);
    transition: border 0.15s ease;
  }
  &__control:not(.wf-input__control--focused):hover {
    border-color: var(--reg-form-field-border-color-hover, rgba(0, 0, 0, 0.4));
  }
  &__control--hide-details {
    margin-bottom: 0;
  }
  &__control--small {
    min-height: 40px;
  }
  &__control input {
    background: transparent;
    width: 100%;
    border: none;
    outline: none;
    padding: 8px 0;
    font-size: 16px;
    line-height: 1.25;
    color: var(--reg-form-field-color, rgba(0, 0, 0, 1));
    &::placeholder {
      color: var(--reg-form-field-placeholder-color, rgba(0, 0, 0, 0.6));
    }
  }
  &__control-label input {
    padding: 22px 0px 6px;
  }
  &__control--focused {
    border-color: var(--reg-form-field-border-color-focus, rgba(0, 0, 0, 0.4));
    caret-color: var(--reg-form-field-border-color-focus, rgba(0, 0, 0, 0.4));
  }
  &__control--error {
    border-color: rgba(219, 61, 61, 1) !important;
    caret-color: rgba(219, 61, 61, 1) !important;
  }
  &__details {
    min-height: 16px;
    margin-bottom: 2px;
    padding: 0 16px;
    color: rgba(219, 61, 61, 1);
  }
  &__message {
    font-size: 12px;
    line-height: 1.25;
    color: currentColor;
  }
  &__label {
    position: absolute;
    top: 6px;
    left: 14px;
    font-size: 12px;
    line-height: 1.2;
    color: var(--reg-form-field-color, rgba(0, 0, 0, 1));
  }
  &__label--error {
    color: rgba(219, 61, 61, 1);
  }
}
</style>
