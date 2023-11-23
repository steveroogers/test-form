import { multiLang } from "../translations/multiLang";
import { EXCLUDED_COUNTRIES } from "../options/excludedCountries";
import { RTL_COUNTRIES } from "../options/rtlCountries";
import { GEO_INFO } from "../options/geoInfo";
const DEFAULT_LANG = "en";

export function getUrlParameterValue(parameter) {
  const urlString = window.location.href;
  const url = new URL(urlString);

  return url.searchParams.get(parameter);
}

export function createHiddenIframe(url) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
}

export function getErrorMessageForAttribute(attribute) {
  return `Use array for attribute ${attribute}`;
}

export function getTranslate(language, ipLanguage) {
  language = language.toLowerCase();
  ipLanguage = ipLanguage.toLowerCase();

  if (multiLang[language])
    return {
      translate: multiLang[language],
      rtl: isRtlDirection(language),
    };

  if (multiLang[ipLanguage])
    return {
      translate: multiLang[ipLanguage],
      rtl: isRtlDirection(ipLanguage),
    };

  return {
    translate: multiLang[DEFAULT_LANG],
    rtl: isRtlDirection(DEFAULT_LANG),
  };
}

export function getCookie(name) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function getSearchParams() {
  let searchParamsObj = {};
  let paramsString = window.location.search;
  if (!paramsString) paramsString = getCookie("tr_params");

  let searchParams = new URLSearchParams(paramsString);

  for (let [name, value] of searchParams) {
    searchParamsObj[name] = value;
  }

  return searchParamsObj;
}

export function excludeCountries(excludedList, includedList) {
  const excludedArray = parseArray(
    excludedList,
    getErrorMessageForAttribute("excludedCountries")
  );
  const includedArray = parseArray(
    includedList,
    getErrorMessageForAttribute("includedCountries")
  );
  const includedCountries = includedArray.map((country) =>
    country.toLowerCase()
  );
  const excludedCountries = excludedArray
    .map((country) => country.toLowerCase())
    .concat(EXCLUDED_COUNTRIES);

  return excludedCountries.filter(
    (country) => !includedCountries.includes(country)
  );
}

export function parseArray(value, errorMessage, defaultValue = []) {
  if (!value) return defaultValue;

  const replacedValue = value.replace(/'/g, '"');

  try {
    const arr = JSON.parse(replacedValue);

    if (Array.isArray(arr)) {
      return arr;
    } else {
      throw new Error(errorMessage);
    }
  } catch (error) {
    throw new Error(errorMessage);
  }
}

export function redirectStepTwo(secondStepPath) {
  const locationUrl = new URL(window.location.href);
  locationUrl.pathname = `/${secondStepPath}/`;
  window.location = locationUrl.toString();
}

export function isRtlDirection(isoCodeCountry) {
  return RTL_COUNTRIES.some((codeCountry) => codeCountry === isoCodeCountry);
}

export function getGeoValue(geoInfo, cfPropertyName, propertyName) {
  const UNKNOWN_GEO_VALUE = "UNKNOWN";

  const cloudflareGeoValue = geoInfo[cfPropertyName];
  const geo2IpValue = geoInfo[propertyName];

  if (cloudflareGeoValue && cloudflareGeoValue !== UNKNOWN_GEO_VALUE) {
    return cloudflareGeoValue;
  } else {
    return geo2IpValue === UNKNOWN_GEO_VALUE
      ? GEO_INFO[propertyName]
      : geo2IpValue;
  }
}
