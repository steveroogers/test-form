const tough = require("tough-cookie");

const cookieJar = new tough.CookieJar(undefined, {
  allowSpecialUseDomain: true,
  rejectPublicSuffixes: false,
});
global.cookieJar = cookieJar;
