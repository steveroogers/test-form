import { specialCharactersAndNumbers, email as emailRegex } from "./regex";
import { required as requiredField, min, max } from "vee-validate/dist/rules";

export const required = {
  ...requiredField,
  params: [...requiredField.params, "message"],
  message: (fieldName, placeholders) => {
    return placeholders.message;
  },
};

export const minStringLength = {
  ...min,
  params: [...min.params, "message"],
  message: (fieldName, placeholders) => {
    return placeholders.message;
  },
};

export const maxStringLength = {
  ...max,
  params: [...max.params, "message"],
  message: (fieldName, placeholders) => {
    return placeholders.message;
  },
};

export const validString = {
  validate(value) {
    return !specialCharactersAndNumbers.test(value);
  },
  params: ["message"],
  message: (fieldName, placeholders) => {
    return placeholders.message;
  },
};

export const email = {
  validate(value) {
    return emailRegex.test(value);
  },
  params: ["message"],
  message: (fieldName, placeholders) => {
    return placeholders.message;
  },
};
