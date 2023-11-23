<template>
  <div class="confirmation" :dir="rtl ? 'rtl' : undefined">
    <div
      class="confirmation__checkbox"
      :class="{
        'confirmation__checkbox--error': errorMessage,
      }"
      @click="$emit('change', !value)"
    >
      <input
        :id="$attrs.id"
        :checked="value"
        class="confirmation__input"
        type="checkbox"
        @change="$emit('change', $event.target.checked)"
      />
      <svg-icon
        class="confirmation__icon"
        :class="[
          {
            'confirmation__checkbox-marked': value,
            'confirmation__icon--error': errorMessage,
          },
        ]"
        type="mdi"
        :path="value ? checkboxMarkedPath : outlineCheckboxPath"
      ></svg-icon>
    </div>
    <label
      class="confirmation__label"
      :class="{
        'confirmation__label--error': errorMessage,
      }"
      :for="$attrs.id"
      >{{ label }}</label
    >
  </div>
</template>

<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiCheckboxMarked, mdiCheckboxBlankOutline } from "@mdi/js";
export default {
  name: "FormCheckbox",
  inheritAttrs: false,
  model: {
    prop: "value",
    event: "change",
  },
  components: { SvgIcon },
  props: {
    value: {
      type: Boolean,
      default: false,
      required: false,
    },
    label: {
      type: String,
      default: "",
      required: false,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    rtl: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      outlineCheckboxPath: mdiCheckboxBlankOutline,
      checkboxMarkedPath: mdiCheckboxMarked,
    };
  },
};
</script>

<style lang="scss" scoped>
.confirmation {
  display: flex;
  align-items: center;
  &__checkbox {
    position: relative;
    height: 24px;
    width: 24px;
    display: flex;
    cursor: pointer;
    margin-right: 7px;
  }
  &__checkbox:hover .confirmation__icon {
    color: var(--reg-form-checkbox-color-checked, rgba(0, 0, 0, 1));
  }
  &[dir="rtl"] .confirmation__checkbox {
    margin: 0px 0px 0px 7px;
  }
  &__checkbox::before {
    content: "";
    position: absolute;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    background-color: var(
      --reg-form-checkbox-circle-color,
      rgba(0, 0, 0, 0.12)
    );
  }
  &__checkbox--error::before {
    background-color: rgba(219, 61, 61, 0.12) !important;
  }
  &__checkbox:hover::before {
    transform: translate(-50%, -50%) scale(1);
  }
  &__input {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    user-select: none;
  }
  &__icon {
    color: var(--reg-form-checkbox-color, rgba(102, 102, 102, 1));
    pointer-events: none;
  }
  &__icon--error {
    color: rgba(219, 61, 61, 1) !important;
  }
  &__checkbox-marked {
    color: var(--reg-form-checkbox-color-checked, rgba(0, 0, 0, 1));
  }
  &__label {
    font-size: var(--reg-form-checkbox-size, 14px);
    line-height: 1.4;
    cursor: pointer;
    user-select: none;
    font-weight: var(--reg-form-checkbox-weight, 400);
    color: var(--reg-form-checkbox-label-color, rgba(0, 0, 0, 1));
  }
  &__label--error {
    color: rgba(219, 61, 61, 1) !important;
  }
}
</style>
