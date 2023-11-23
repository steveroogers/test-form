<template>
  <div class="wf" :class="[{ 'iti-mobile': isMobile }]">
    <h3 v-if="title" class="wf__title">
      <span class="wf__title-content">{{ title }}</span>
    </h3>
    <h4 v-if="subtitle" class="wf__subtitle">
      <span class="wf__subtitle-content">{{ subtitle }}</span>
    </h4>
    <ValidationObserver v-slot="{ failed, handleSubmit }">
      <form @submit.prevent>
        <div
          class="wf__inputs"
          :class="[
            { 'wf__inputs-code': isCodeSent },
            { 'wf__inputs-margin': !checkboxes },
          ]"
        >
          <div class="wf-fields">
            <ValidationProvider
              tag="div"
              class="wf-fields__item"
              name="firstName"
              :rules="{
                required: {
                  message: language.translate.firstName.required,
                },
                minStringLength: {
                  length: 2,
                  message: language.translate.firstName.minLength,
                },
                maxStringLength: {
                  length: 30,
                  message: language.translate.firstName.maxLength,
                },
                validString: language.translate.firstName.valid,
              }"
              v-slot="{ errors }"
            >
              <FormField
                v-model="firstName"
                :placeholder="
                  namePlaceholder || language.translate.firstName.placeholder
                "
                :errorMessage="errors[0]"
                regTestId="firstName"
                :rtl="language.rtl"
                :label="inputLabel"
              ></FormField>
            </ValidationProvider>
            <ValidationProvider
              v-if="!firstStep"
              tag="div"
              name="lastName"
              class="wf-fields__item"
              :rules="{
                required: {
                  message: language.translate.lastName.required,
                },
                minStringLength: {
                  length: 2,
                  message: language.translate.lastName.minLength,
                },
                maxStringLength: {
                  length: 30,
                  message: language.translate.lastName.maxLength,
                },
                validString: language.translate.lastName.valid,
              }"
              v-slot="{ errors }"
            >
              <FormField
                v-model="lastName"
                :placeholder="
                  lastNamePlaceholder || language.translate.lastName.placeholder
                "
                :errorMessage="errors[0]"
                regTestId="lastName"
                :rtl="language.rtl"
                :label="inputLabel"
              ></FormField>
            </ValidationProvider>
            <ValidationProvider
              tag="div"
              name="email"
              class="wf-fields__item"
              :rules="{
                required: {
                  message: language.translate.email.required,
                },
                email: language.translate.email.valid,
              }"
              v-slot="{ errors }"
            >
              <FormField
                v-model="email"
                :placeholder="
                  emailPlaceholder || language.translate.email.placeholder
                "
                :errorMessage="errors[0]"
                regTestId="email"
                type="email"
                :rtl="language.rtl"
                :label="inputLabel"
              ></FormField>
            </ValidationProvider>
            <ValidationProvider
              v-if="!firstStep"
              tag="div"
              name="phone"
              class="wf-fields__item"
              v-slot="{ errors }"
              :rules="{
                required: {
                  message: language.translate.phone.required,
                },
                validNumber: {
                  validate: validateNumber,
                  message: language.translate.phone.valid,
                },
                validCountry: {
                  validate: validateCountryOfNumber,
                  message: language.translate.phone.banned,
                },
              }"
            >
              <FormField
                v-model="leadPhone"
                class="phone"
                ref="phone"
                type="tel"
                regTestId="phone"
                :placeholder="language.translate.phone.placeholder"
                :errorMessage="errors[0]"
                :rtl="language.rtl"
                @countrychange="leadPhone = iti.getNumber()"
                @keydown.native="checkButtonKey"
                :label="inputLabel"
              ></FormField>
            </ValidationProvider>
          </div>
          <div
            v-if="verifyPhone && isCodeSent"
            class="code"
            :dir="language.rtl ? 'rtl' : undefined"
          >
            <ValidationProvider
              tag="div"
              name="verificationCode"
              v-slot="{ errors }"
              :rules="{
                required: {
                  message: language.translate.verificationCode.required,
                },
              }"
            >
              <FormField
                v-model="verificationCode"
                class="code__input"
                :placeholder="language.translate.verificationCode.placeholder"
                small
                hide-details
                regTestId="verificationCode"
                :errorMessage="errors[0]"
                :rtl="language.rtl"
                :label="inputLabel"
              ></FormField>
            </ValidationProvider>
            <button
              class="code__btn"
              :dir="language.rtl ? 'rtl' : undefined"
              data-reg-test="verificationCodeBtn"
              @click="sendVerificationCode"
            >
              {{ language.translate.button.sendAgain }}
            </button>
          </div>
        </div>
        <div class="wf__confirmation" v-if="parseCheckboxes.length">
          <ValidationProvider
            tag="div"
            class="wf__checkbox-wrapper"
            v-for="(checkbox, index) in parseCheckboxes"
            :key="'checkbox' + index"
            :name="'checkbox' + index"
            :rules="{
              required: {
                allowFalse: false,
                message: language.translate.checkbox.required,
              },
            }"
            v-slot="{ errors }"
          >
            <FormCheckbox
              class="wf__checkbox"
              :id="'checkbox-' + index"
              v-model="selectedСheckboxes[index]"
              :label="checkbox"
              :errorMessage="errors[0]"
              :rtl="language.rtl"
            ></FormCheckbox>
          </ValidationProvider>
        </div>

        <button
          class="wf-btn"
          :class="{
            'wf-btn--disabled': failed || isRequestSent,
          }"
          :data-reg-test="
            isShowVerificationBtn ? 'repeatVerificationCodeBtn' : 'registerBtn'
          "
          :disabled="failed || isRequestSent"
          @click="handleSubmit(submitEvent)"
          :dir="language.rtl ? 'rtl' : undefined"
        >
          {{
            isShowVerificationBtn
              ? language.translate.button.verifyPhone
              : submitButtonText || language.translate.button.text
          }}
        </button>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import FormField from "./FormField.vue";
import FormCheckbox from "./FormCheckbox.vue";
import { ValidationObserver, ValidationProvider, extend } from "vee-validate";
import intlTelInput from "intl-tel-input";
import utils from "intl-tel-input/build/js/utils";
import {
  getCookie,
  getTranslate,
  getSearchParams,
  excludeCountries,
  parseArray,
  getErrorMessageForAttribute,
  redirectStepTwo,
  getGeoValue,
} from "../helpers/helpers";
import { isMobile } from "../utils/regex";
import {
  sendTargetLead,
  sendDataToKeitaro,
  LEAD_STATUSES,
} from "../helpers/metric";
import {
  initOverlay,
  initModalWindow,
  messageTemplate,
} from "../helpers/modal";
import { GEO_INFO } from "../options/geoInfo";
import {
  setFirstNameToLocalStorage,
  setEmailToLocalStorage,
  removeItemsFromLocalStorage,
  getItemsFromLocalStorage,
} from "../utils/storage";
import {
  required,
  minStringLength,
  maxStringLength,
  validString,
  email,
} from "../utils/rules";
import { regFormApi } from "../api/regFormApi";

extend("required", required);
extend("minStringLength", minStringLength);
extend("maxStringLength", maxStringLength);
extend("validString", validString);
extend("email", email);

export default {
  name: "RegForm",
  components: {
    FormField,
    FormCheckbox,
    ValidationProvider,
    ValidationObserver,
  },
  props: {
    projectId: {
      type: Number,
      required: true,
    },
    lang: {
      type: String,
      default: "en",
    },
    submitButtonText: {
      type: String,
      default: "",
      required: false,
    },
    namePlaceholder: {
      type: String,
      default: "",
      required: false,
    },
    lastNamePlaceholder: {
      type: String,
      default: "",
      required: false,
    },
    emailPlaceholder: {
      type: String,
      default: "",
      required: false,
    },
    excludedCountries: {
      type: String,
      required: false,
    },
    includedCountries: {
      type: String,
      required: false,
    },
    checkboxes: {
      type: [Array, String],
      required: false,
      default: () => [],
    },
    firstStep: {
      type: Boolean,
      default: false,
    },
    secondStep: {
      type: Boolean,
      default: false,
    },
    secondStepPath: {
      type: String,
      default: "step2",
      required: false,
    },
    verifyPhone: {
      type: Boolean,
      default: false,
      required: false,
    },
    title: {
      type: String,
      default: "",
      required: false,
    },
    subtitle: {
      type: String,
      default: "",
      required: false,
    },
    inputLabel: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      isMobile: false,
      geoInfo: GEO_INFO,
      iti: null,
      isPhoneFocus: false,
      valid: false,
      firstName: "",
      lastName: "",
      email: "",
      leadPhone: null,
      isCodeSent: false,
      verificationCode: "",
      isRequestSent: false,
      selectedСheckboxes: [],
    };
  },
  computed: {
    countryByIp() {
      return getGeoValue(this.geoInfo, "cf-ipcountry", "country").toLowerCase();
    },
    language() {
      return getTranslate(this.lang, this.countryByIp);
    },
    excludedCountriesResult() {
      return excludeCountries(this.excludedCountries, this.includedCountries);
    },
    parseCheckboxes() {
      console.log(this.checkboxes);
      if (Array.isArray(this.checkboxes)) return this.checkboxes;

      return parseArray(
        this.checkboxes,
        getErrorMessageForAttribute("checkboxes")
      );
    },
    isShowVerificationBtn() {
      return !this.firstStep && this.verifyPhone && !this.isCodeSent;
    },
    submitEvent() {
      return this.isShowVerificationBtn
        ? this.sendVerificationCode
        : this.submit;
    },
  },
  watch: {
    secondStep: {
      handler(secondStep) {
        if (secondStep) {
          let { firstName, email } = getItemsFromLocalStorage();

          if (firstName) this.firstName = firstName;
          if (email) this.email = email;
        }
      },
      immediate: true,
    },
    leadPhone() {
      if (this.verifyPhone) this.isCodeSent = false;
    },
    iti() {
      this.leadPhone = this.iti.getNumber();

      extend("validNumber", {
        validate: (value, { validate }) => {
          return validate();
        },
        params: ["validate", "message"],
        message: (fieldName, placeholders) => {
          return placeholders.message;
        },
      });

      extend("validCountry", {
        validate: (value, { validate }) => {
          return validate();
        },
        params: ["validate", "message"],
        message: (fieldName, placeholders) => {
          return placeholders.message;
        },
      });
    },
  },
  created() {
    if (window._geo_info) this.geoInfo = window._geo_info;

    this.isMobile = isMobile.test(navigator.userAgent);

    if (!getCookie("tr_uuid")) {
      document.cookie =
        "tr_uuid=" +
        this.uuidv4() +
        ";path=/;domain=" +
        window.location.hostname +
        ";expires:2592000;Max-Age=2592000;";
    }
  },
  mounted() {
    if (!this.firstStep) {
      this.iti = intlTelInput(this.$refs.phone.$refs.input, {
        preferredCountries: [],
        initialCountry: this.excludedCountriesResult.includes(this.countryByIp)
          ? ""
          : this.countryByIp,
        dropdownContainer: this.isMobile ? this.$el : null,
        excludeCountries: this.excludedCountriesResult,
        nationalMode: false,
        autoHideDialCode: false,
        autoPlaceholder: "aggressive",
        customPlaceholder: function (selectedCountryPlaceholder) {
          return "e.g. " + selectedCountryPlaceholder;
        },
        customContainer: "phone__input-container",
        utilsScript: utils,
      });
    }
  },
  methods: {
    async sendVerificationCode() {
      this.valid = false;
      this.isRequestSent = true;
      try {
        let response = await regFormApi.sendVerificationCode(
          this.iti.getNumber().slice(1)
        );

        if (response.ok) {
          let data = await response.json();

          if (data.operation_status === "succeed") {
            this.isCodeSent = data.data;
          }
        } else {
          if (response.status === 406) {
            // wrong number provided
            this.showErrorModal(this.language.translate.errors.phoneNumber);
          } else if (response.status === 429) {
            // too many requests
            this.showErrorModal(this.language.translate.errors.limit);
          } else {
            // status code 404 | 500
            this.showErrorModal(this.language.translate.errors.server);
          }
        }
      } catch (error) {
        this.showErrorModal(this.language.translate.errors.server);
      } finally {
        this.isRequestSent = false;
        this.valid = true;
      }
    },
    async sendRegistrationWorker() {
      let body = this.getBodyForRegistrationRequest();

      sendTargetLead(LEAD_STATUSES.leadSend, { email: body.email });

      try {
        let response = await regFormApi.sendRegistrationWorker(body);
        if (response.ok) {
          let data = await response.json();

          if (data.operation_status === "succeed") {
            sendTargetLead(LEAD_STATUSES.lead);
            sendDataToKeitaro();

            window.location.href = data.url;
          }
        } else {
          if (response.status === 406) {
            // code is not valid
            this.showErrorModal(
              this.language.translate.errors.confirmationСode
            );
          } else {
            // status code 404 | 500
            sendTargetLead(LEAD_STATUSES.leadSendError, {
              error: `${response.status}`,
            });

            this.showErrorModal(this.language.translate.errors.server);
          }
        }
      } catch (error) {
        sendTargetLead(LEAD_STATUSES.leadSendError, { error: error });

        this.showErrorModal(this.language.translate.errors.server);
      }
    },
    async sendRegistration() {
      this.valid = false;
      this.isRequestSent = true;

      let body = this.getBodyForRegistrationRequest();

      sendTargetLead(LEAD_STATUSES.leadSend, { email: body.email });

      try {
        let response = await regFormApi.sendRegistration(body);
        if (response.ok) {
          let data = await response.json();

          if (data.operation_status === "succeed") {
            sendTargetLead(LEAD_STATUSES.lead);
            sendDataToKeitaro();

            window.location.href = data.url;
          }
        } else {
          if (response.status === 406) {
            // code is not valid
            this.showErrorModal(
              this.language.translate.errors.confirmationСode
            );
          } else {
            // status code 404 | 500
            sendTargetLead(LEAD_STATUSES.leadSendError, {
              error: `${response.status}`,
            });

            this.sendRegistrationWorker();
          }
        }
      } catch (error) {
        sendTargetLead(LEAD_STATUSES.leadSendError, { error: error });

        this.sendRegistrationWorker();
      } finally {
        this.valid = true;
        this.isRequestSent = false;
      }
    },
    submit() {
      if (this.firstStep) {
        this.setItemsToLocalstorage();
        redirectStepTwo(this.secondStepPath);
      } else if (this.secondStep) {
        removeItemsFromLocalStorage();
        this.sendRegistration();
      } else {
        this.sendRegistration();
      }
    },
    setItemsToLocalstorage() {
      setFirstNameToLocalStorage(this.firstName);
      setEmailToLocalStorage(this.email);
    },
    checkButtonKey(e) {
      let key = e.key;
      if (this.iti.getNumber().length === 0) {
        if (key !== "+") e.preventDefault();
      } else if (
        !(
          (key >= "0" && key <= "9") ||
          key == "ArrowLeft" ||
          key == "ArrowRight" ||
          key == "Delete" ||
          key == "Backspace"
        )
      ) {
        e.preventDefault();
      }
    },
    showErrorModal(message) {
      initOverlay();
      initModalWindow(messageTemplate(message), "#db3d3d", "#eaeaea");
    },
    getBodyForRegistrationRequest() {
      let countryData = this.iti.getSelectedCountryData();
      let searchParams = getSearchParams();
      let uuid = getCookie("tr_uuid");

      let body = {
        projectId: this.projectId,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        leadPhone: this.iti.getNumber().slice(1),
        city: getGeoValue(this.geoInfo, "cf-ipcity", "city"),
        region: getGeoValue(this.geoInfo, "cf-region", "region"),
        regionIso: getGeoValue(this.geoInfo, "cf-region-code", "region_iso"),
        countryCode: countryData.iso2,
        quizData: sessionStorage.getItem("quiz-data")?.length
          ? sessionStorage.getItem("quiz-data")
          : null,
        countryByIp: this.countryByIp,
      };

      // nginx creates tr_uuid in cookie
      if (uuid) {
        body.anchor = "uuid:" + uuid;
      }

      // adds search params to the body of the request
      Object.assign(body, searchParams);

      // if prop verifyPhone is passed, add code to request body
      if (this.verifyPhone) body.verificationCode = this.verificationCode;

      return body;
    },
    uuidv4() {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
          c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
      );
    },
    validateNumber() {
      if (!this.iti) return false;

      return this.iti.isValidNumber();
    },
    validateCountryOfNumber() {
      if (!this.iti) return false;

      return "iso2" in this.iti.getSelectedCountryData();
    },
  },
};
</script>
<style lang="scss">
@import "~intl-tel-input/build/css/intlTelInput.css";

*,
*::before,
*::after {
  box-sizing: border-box;
}

input,
button,
textarea,
select {
  font: inherit;
}

.wf {
  background-color: var(
    --reg-form-background-background-color,
    rgba(255, 255, 255, 1)
  );
  padding: var(--reg-form-background-padding, 32px);
  box-shadow: 0px 0px var(--reg-form-background-shadow-blur, 25px) 0px
    var(--reg-form-background-shadow-color, rgba(0, 0, 0, 0.1));
  border-style: solid;
  border-width: var(--reg-form-background-border-width, 0px);
  border-color: var(--reg-form-background-border-color, rgba(255, 255, 255, 1));
  border-radius: var(--reg-form-background-border-radius, 16px);
  font-family: var(--reg-form-general-font-family, "Inter"), sans-serif;
  color: rgba(255, 255, 255, 1);
  &__inputs-margin {
    margin-bottom: 10px;
  }
  &__inputs-code {
    margin-bottom: 20px;
  }
  &__title {
    display: flex;
    justify-content: center;
    margin-top: 0px;
    margin-bottom: var(--reg-form-title-margin-bottom, 12px);
    font-size: var(--reg-form-title-size, 22px);
    font-weight: var(--reg-form-title-weight, 700);
    line-height: 1.4;
    color: var(--reg-form-title-color, rgba(13, 25, 133, 1));
  }
  &__title-content {
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: var(--reg-form-title-width, 100%);
    display: block;
    text-align: center;
  }
  &__subtitle {
    display: flex;
    justify-content: center;
    margin-top: 0px;
    margin-bottom: var(--reg-form-subtitle-margin-bottom, 24px);
    font-size: var(--reg-form-subtitle-size, 18px);
    font-weight: var(--reg-form-subtitle-weight, 500);
    line-height: 1.2;
    color: var(--reg-form-subtitle-color, rgba(0, 0, 0, 1));
  }
  &__subtitle-content {
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: var(--reg-form-subtitle-width, 100%);
    display: block;
    text-align: center;
  }
  &__confirmation {
    margin-bottom: 20px;
  }
  &__checkbox-wrapper {
    padding: 6px 0px;
  }
  &__checkbox-wrapper:first-child {
    padding-top: 0;
  }
  &__checkbox-wrapper:last-child {
    padding-bottom: 0;
  }
  &__checkbox {
    padding: 0px 15px;
  }
}

.wf-fields {
  --reg-form-field-column-gap: 16px;
  --reg-form-field-row-gap: 4px;
  --reg-form-field-column: 1;
  display: flex;
  flex-direction: row;
  row-gap: var(--reg-form-field-row-gap, 4px);
  column-gap: var(--reg-form-field-column-gap, 16px);
  flex-wrap: wrap;
  &__item {
    width: calc(
      (100% / var(--reg-form-field-column, 1)) -
        (
          (var(--reg-form-field-column, 1) - 1) *
            var(--reg-form-field-column-gap, 16px)
        ) / var(--reg-form-field-column, 1)
    );
    flex-grow: 1;
  }
}

@media (max-width: 600px) {
  .wf-fields__item {
    width: 100%;
  }
}

.phone {
  .phone__input-container {
    width: 100%;
    display: flex;
  }
  &.wf-input .wf-input__control {
    padding-left: 0;
    align-items: stretch;
  }
  input {
    padding-left: 56px !important;
  }
  .iti__selected-flag {
    padding-left: 15px;
  }
  .wf-input__control-label .iti__selected-flag {
    padding-top: 14px;
  }
  .iti__country-list {
    line-height: 1.25;
  }
}

.iti__country-name {
  color: var(--reg-form-country-list-text-color, rgba(0, 0, 0, 1));
}

.code {
  display: flex;
  align-items: center;
  margin-top: 4px;
  &__input {
    max-width: 150px;
  }
  &__btn {
    height: 40px;
    margin: 0px 0px 0px 8px;
    padding: 0px 12px;
    border-style: none;
    background: transparent;
    font-size: 12px;
    text-transform: uppercase;
    text-decoration: underline;
    transition: color 0.15s ease;
    cursor: pointer;
    color: var(--reg-form-verify-button-text-color, rgba(0, 0, 0, 0.6));
  }
  &__btn:hover {
    color: var(--reg-form-verify-button-text-color-hover, rgba(0, 0, 0, 1));
  }
  &__btn[dir="rtl"] {
    margin: 0px 8px 0px 0px;
  }
}

.wf-btn {
  width: 100%;
  height: var(--reg-form-button-height, 60px);
  background-color: var(--reg-form-button-color, rgba(13, 25, 133, 1));
  padding: 0 20px;
  box-shadow: 0px 0px var(--reg-form-button-shadow-blur, 25px) 0px
    var(--reg-form-button-shadow-color, rgba(0, 0, 0, 0.1));
  font-size: var(--reg-form-button-size, 20px);
  font-weight: var(--reg-form-button-weight, 700);
  color: var(--reg-form-button-text-color, rgba(255, 255, 255, 1));
  border-width: var(--reg-form-button-border-width, 0px);
  border-style: solid;
  border-color: var(--reg-form-button-border-color, transparent);
  border-radius: var(--reg-form-button-border-radius, 100px);
  cursor: pointer;
  &--disabled {
    pointer-events: none;
    background: rgba(149, 149, 149, 1) !important;
    color: rgba(214, 214, 214, 1) !important;
  }
  &:hover {
    background-color: var(--reg-form-button-color-hover, rgba(37, 48, 145, 1));
  }
  &:active {
    background-color: var(--reg-form-button-color-active, rgba(13, 25, 133, 1));
  }
}
</style>
