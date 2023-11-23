import { mount } from "@vue/test-utils";
import RegForm from "../RegForm";
import {
  setFirstNameToLocalStorage,
  setEmailToLocalStorage,
} from "../../utils/storage";
import { regFormApi } from "../../api/regFormApi";
import FormField from "../FormField.vue";
import flushPromises from "flush-promises";

jest.mock("../../utils/storage.js", () => {
  const originalModule = jest.requireActual("../../utils/storage.js");

  return {
    __esModule: true,
    ...originalModule,
    setFirstNameToLocalStorage: jest.fn(),
    setEmailToLocalStorage: jest.fn(),
  };
});

jest.mock("../../api/regFormApi.js", () => {
  return {
    __esModule: true,
    regFormApi: {
      sendVerificationCode: jest.fn(() => Promise.reject(new Error("error"))),
      sendRegistrationWorker: jest.fn(() => Promise.resolve()),
      sendRegistration: jest.fn(() => Promise.resolve()),
    },
  };
});

describe("RegForm", () => {
  let wrapper;

  const PLACEHOLDER = "placeholder";
  const YOUR_NAME = "Your Name";
  const YOUR_SURNAME = "Your Surname";
  const YOUR_EMAIL = "Your E-mail";
  const YOUR_PHONE = "Your Phone";
  const INVALID_NAME = "Name is not valid";
  const INVALID_SURNAME = "Surname is not valid";
  const INVALID_EMAIL = "Please enter a valid E-mail address";
  const INVALID_VALUE = "123";
  const BTN_TEXT = "Test button";
  const PLACEHOLDER_TEXT_NAME = "Name placeholder";
  const PLACEHOLDER_TEXT_LAST_NAME = "Last name placeholder";
  const PLACEHOLDER_TEXT_EMAIL = "Email placeholder";
  const CHECKBOX_TEXT = "Are you over 18 years old?";
  const NAME = "Ivan";
  const SURNAME = "Ivanov";
  const EMAIL = "test@mail.com";
  const PHONE_NUMBER = "+390852234";
  const PROJECT_ID = 10;

  const createComponent = ({ props } = {}) => {
    wrapper = mount(RegForm, {
      propsData: {
        projectId: PROJECT_ID,
        ...props,
      },
    });
  };

  afterEach(() => {
    wrapper.destroy();
  });

  const findComponentByPropValue = (component, prop, value) =>
    wrapper
      .findAllComponents(component)
      .wrappers.find((w) => w.props()[prop] === value);

  it.each`
    field        | placeholder     | errorMessage
    ${"name"}    | ${YOUR_NAME}    | ${INVALID_NAME}
    ${"surname"} | ${YOUR_SURNAME} | ${INVALID_SURNAME}
    ${"email"}   | ${YOUR_EMAIL}   | ${INVALID_EMAIL}
  `(
    "the wrapper should show an error message if the $field is incorrect",
    async ({ placeholder, errorMessage }) => {
      createComponent();
      const textField = findComponentByPropValue(
        FormField,
        PLACEHOLDER,
        placeholder
      );

      await textField.find("input").setValue(INVALID_VALUE);
      await flushPromises();

      expect(textField.text()).toContain(errorMessage);
    }
  );

  it("the wrapper should have pl language because prop lang is passed with value 'pl'", async () => {
    createComponent({
      props: {
        lang: "pl",
      },
    });

    await flushPromises();

    await wrapper.find("button").trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("Imie jest wymagane.");
    expect(wrapper.text()).toContain("Nazwisko jest wymagane.");
    expect(wrapper.text()).toContain("Email jest wymagany.");
    expect(wrapper.text()).toContain("Sprawdź proszę numer telefonu.");
    expect(wrapper.text()).toContain("Otwórz bezpłatnie");
  });

  it("the wrapper should have dark theme if theme prop is passed with value 'dark'", async () => {
    createComponent({
      props: {
        theme: "dark",
      },
    });

    expect(wrapper.html()).toContain("theme--dark");
  });

  it(`the wrapper should contain '${BTN_TEXT}' if submitButtonText prop is passed`, () => {
    createComponent({
      props: {
        submitButtonText: BTN_TEXT,
      },
    });

    expect(wrapper.html()).toContain(BTN_TEXT);
  });

  it.each`
    propName                 | value
    ${"namePlaceholder"}     | ${PLACEHOLDER_TEXT_NAME}
    ${"lastNamePlaceholder"} | ${PLACEHOLDER_TEXT_LAST_NAME}
    ${"emailPlaceholder"}    | ${PLACEHOLDER_TEXT_EMAIL}
  `(
    "the wrapper should show text '$expectedValue' if '$propName' prop is passed with value '$value'",
    ({ propName, value }) => {
      createComponent({
        props: {
          [propName]: value,
        },
      });

      expect(wrapper.html()).toContain(value);
    }
  );

  it("the form component should exclude country", async () => {
    createComponent({
      props: {
        excludedCountries: "['AF']",
      },
    });

    expect(wrapper.text()).not.toContain("Afghanistan");
  });

  it(`The text should contain checkbox label '${CHECKBOX_TEXT}' if checkboxes prop is passed`, () => {
    createComponent({
      props: {
        checkboxes: `['${CHECKBOX_TEXT}']`,
      },
    });

    expect(wrapper.text()).toContain(CHECKBOX_TEXT);
  });

  it("the component should call localStorage functions after click to submit button if firstStep prop is passed", async () => {
    createComponent({
      props: {
        firstStep: true,
      },
    });

    expect(wrapper.findAllComponents(FormField).length).toBe(2);

    await findComponentByPropValue(FormField, PLACEHOLDER, YOUR_NAME)
      .find("input")
      .setValue(NAME);

    await findComponentByPropValue(FormField, PLACEHOLDER, YOUR_EMAIL)
      .find("input")
      .setValue(EMAIL);

    await wrapper.find("button").trigger("click");
    await flushPromises();

    expect(setFirstNameToLocalStorage).toHaveBeenCalledTimes(1);
    expect(setEmailToLocalStorage).toHaveBeenCalledTimes(1);
  });

  it("the component should get items from localStorage after creating if secondStep prop is passed", () => {
    localStorage.setItem("reg-form-firstname", NAME);
    localStorage.setItem("reg-form-email", EMAIL);

    createComponent({
      props: {
        secondStep: true,
      },
    });

    expect(
      findComponentByPropValue(FormField, PLACEHOLDER, YOUR_NAME).find("input")
        .element.value
    ).toContain(NAME);
    expect(
      findComponentByPropValue(FormField, PLACEHOLDER, YOUR_EMAIL).find("input")
        .element.value
    ).toContain(EMAIL);
  });

  it("the component should call 'sendVerificationCode' action after click to submit button if verifyPhone prop is passed", async () => {
    createComponent({
      props: {
        verifyPhone: true,
      },
    });
    const spyShowErrorModal = jest.spyOn(wrapper.vm, "showErrorModal");

    await findComponentByPropValue(FormField, PLACEHOLDER, YOUR_NAME)
      .find("input")
      .setValue(NAME);

    await findComponentByPropValue(FormField, PLACEHOLDER, YOUR_SURNAME)
      .find("input")
      .setValue(SURNAME);

    await findComponentByPropValue(FormField, PLACEHOLDER, YOUR_EMAIL)
      .find("input")
      .setValue(EMAIL);

    await findComponentByPropValue(FormField, PLACEHOLDER, YOUR_PHONE)
      .find("input")
      .setValue(PHONE_NUMBER);

    await wrapper.find("button").trigger("click");
    await flushPromises();

    expect(regFormApi.sendVerificationCode).toHaveBeenCalledTimes(1);
    expect(spyShowErrorModal).toHaveBeenCalledTimes(1);
  });

  it("the component should call 'sendRegistration' and 'sendRegistrationWorker' actions after click to submit button if lead is not registered", async () => {
    createComponent();

    await findComponentByPropValue(FormField, PLACEHOLDER, YOUR_NAME)
      .find("input")
      .setValue(NAME);

    await findComponentByPropValue(FormField, PLACEHOLDER, YOUR_SURNAME)
      .find("input")
      .setValue(SURNAME);

    await findComponentByPropValue(FormField, PLACEHOLDER, YOUR_EMAIL)
      .find("input")
      .setValue(EMAIL);

    await findComponentByPropValue(FormField, PLACEHOLDER, YOUR_PHONE)
      .find("input")
      .setValue(PHONE_NUMBER);

    await wrapper.find("button").trigger("click");
    await flushPromises();

    expect(regFormApi.sendRegistration).toHaveBeenCalledTimes(1);
    expect(
      Object.values(regFormApi.sendRegistration.mock.calls[0][0])
    ).toContain(EMAIL, NAME, SURNAME, PHONE_NUMBER, PROJECT_ID);
    expect(regFormApi.sendRegistrationWorker).toHaveBeenCalledTimes(1);
  });
});
