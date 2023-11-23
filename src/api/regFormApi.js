import psl from "psl";
import { WORKER_SUB_DOMAIN } from "@/options/workerSubDomain";

const LEAD_URL = "/api/v1/subscription";
const VERIFY_URL = "/api/v1/subscription/send-sms";
const PARSED_DOMAIN = psl.parse(window.location.hostname).domain;
const WORKER_URL = `https://${WORKER_SUB_DOMAIN}.${PARSED_DOMAIN}`;

export const regFormApi = {
  sendVerificationCode: async function (phoneNumber) {
    try {
      return await fetch(`${VERIFY_URL}?phoneNumber=${phoneNumber}`);
    } catch (error) {
      return error;
    }
  },
  sendRegistrationWorker: async function (body) {
    try {
      return await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      return error;
    }
  },
  sendRegistration: async function (body) {
    try {
      return await fetch(LEAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      return error;
    }
  },
};
