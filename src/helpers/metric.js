import { getUrlParameterValue, createHiddenIframe } from "./helpers";
import { isUrl } from "../utils/regex";

export const LEAD_STATUSES = {
  leadSend: "LEAD_SEND",
  lead: "LEAD",
  leadSendError: "LEAD_SEND_ERROR",
};

export function sendDataToKeitaro() {
  const clickId = getUrlParameterValue("clickId");

  if (clickId) {
    let referrer = getUrlParameterValue("dname");
    if (!validateURL(referrer)) {
      referrer = "https://" + referrer;
    }
    const thankYou = getUrlParameterValue("thanks");
    const pix = getUrlParameterValue("pix");
    const iframeUrl = referrer + "/lander/" + thankYou + "?pix=" + pix;
    createHiddenIframe(iframeUrl);
  }
}

export function sendTargetLead(target, params = {}) {
  if (window.ga)
    window.ga("send", {
      hitType: "event",
      eventCategory: target,
      eventAction: "lead-form-info",
      fieldsObject: params,
    });

  if (window.yaCounter) window.yaCounter.reachGoal(target, params);

  if (window.gtag && window.gtagConversion && target === "LEAD_SEND")
    sendGoogleConversions(window.gtagConversion);

  if (window.fbq && target === "LEAD_SEND")
    window.fbq("track", "CompleteRegistration");
}

function validateURL(URL) {
  return isUrl.test(URL);
}

function sendGoogleConversions(conversions) {
  for (let i = 0; i < conversions.length; i++) {
    window.gtag("event", "conversion", { send_to: conversions[i] });
  }
}
