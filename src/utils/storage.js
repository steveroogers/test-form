const LOCAL_STORAGE_KEYS = {
  firstName: "reg-form-firstname",
  email: "reg-form-email",
};

export function getItemFromLocalStorage(key) {
  return localStorage.getItem(key);
}

export function setItemToLocalstorage(key, value) {
  localStorage.setItem(key, value);
}

export function removeItemFromLocalStorage(key) {
  localStorage.removeItem(key);
}

export function getItemsFromLocalStorage() {
  return {
    firstName: localStorage.getItem(LOCAL_STORAGE_KEYS.firstName),
    email: localStorage.getItem(LOCAL_STORAGE_KEYS.email),
  };
}

export function setFirstNameToLocalStorage(value) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.firstName, value);
}

export function setEmailToLocalStorage(value) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.email, value);
}

export function removeItemsFromLocalStorage() {
  Object.values(LOCAL_STORAGE_KEYS).forEach((key) =>
    localStorage.removeItem(key)
  );
}
