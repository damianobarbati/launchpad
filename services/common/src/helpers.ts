import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export type request_input = any; // [any, any, any?];

export const GET = async ([url, params, transformRequest, transformResponse]: request_input) => {
  const { data } = await axios.get(url, {
    params: transformRequest ? transformRequest(params) : params,
  });
  const result = transformResponse ? transformResponse(data) : data;
  return result;
};

export const POST = async ([url, params, transformRequest, transformResponse]: request_input) => {
  const { data } = await axios.post(url, transformRequest ? transformRequest(params) : params);
  const result = transformResponse ? transformResponse(data) : data;
  return result;
};

export const DELETE = async ([url, params, transform]: request_input) => {
  const { data } = await axios.delete(url, {
    params,
  });
  const result = transform ? transform(data) : data;
  return result;
};

export const MPOST = async (url, { arg }, config?: AxiosRequestConfig) => {
  let params;

  if (Array.isArray(arg)) {
    const [values, transform] = arg;
    params = transform(values);
  } else {
    params = arg;
  }

  const { data } = await axios.post(url, params, config);
  return data;
};

export const MultipartMPOST = async (url, { arg }, config?: AxiosRequestConfig) => {
  return MPOST(url, { arg }, { headers: { "Content-Type": "multipart/form-data" }, ...config });
};

export const MPUT = async (url, { arg }) => {
  let params;

  if (Array.isArray(arg)) {
    const [values, transform] = arg;
    params = transform(values);
  } else {
    params = arg;
  }

  const { data } = await axios.put(url, params);
  return data;
};

// this helper removes null and '' values from an object, and it's useful when dealing with inputs which typically can only hold strings
export const emptyToUndefined = (obj: Record<string, any>) => {
  const result = { ...obj };
  for (const [key, value] of Object.entries(result)) {
    if (value === "" || value === null) delete result[key];
  }
  return result;
};

export const valueToDate = (value): string => {
  if ([undefined, null].includes(value)) return "N/A";
  const date = new Date(String(value)).toLocaleDateString(undefined, { dateStyle: "short" });
  return date;
};

export const valueToDatetime = (value): string => {
  if ([null, undefined].includes(value)) return "N/A";
  const date = new Date(String(value)).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
  return date;
};

export const valueToAmount = (value, currency = "EUR"): string => {
  if ([null, undefined].includes(value)) return "N/A";

  const amount = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));

  return amount;
};

export const valueToNumber = (value, suffix = "") => {
  if ([null, undefined].includes(value)) return "N/A";

  let amount = new Intl.NumberFormat("it-IT", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value));

  amount += suffix;

  return amount;
};

export const valueToYESNO = (value) => {
  if ([null, undefined].includes(value)) return "N/A";
  const yesno = Boolean(value) === true ? "YES" : "NO";
  return yesno;
};

export const openGoogleMaps = (q: string) => (event) => {
  event.stopPropagation();
  window.open(`https://maps.google.com/?q=${encodeURIComponent(q)}`);
};

export const openURL = (url) => (event) => {
  event.stopPropagation();
  window.open(url);
};

type obj_from_qs = Record<string, string | string[] | boolean>;

export const stringValuesToBoolean = (obj: Record<string, any>) => {
  const result = { ...obj };
  for (const [key, value] of Object.entries(result)) {
    if (value === "true") result[key] = true;
    else if (value === "false") result[key] = false;
  }
  return result;
};

export const fromQuerystring = (qs: URLSearchParams, arrayKeys?: string[], excludeKeys?: string[], convertBooleanValues = false): obj_from_qs => {
  const result: obj_from_qs = Object.fromEntries(qs);
  if (convertBooleanValues) stringValuesToBoolean(result);
  if (arrayKeys) for (const key of arrayKeys) result[key] = qs.getAll(key);
  if (excludeKeys) for (const key of excludeKeys) delete result[key];
  return result;
};

export const toQuerystring = (obj: obj_from_qs): string => {
  const urlSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(obj)) {
    if (!value && value !== false) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        urlSearchParams.append(key, String(v));
      }
    } else urlSearchParams.set(key, String(value));
  }

  const result = urlSearchParams.toString();
  return result;
};

export const truncate = (text: string, length: number, suffix = "...") => (text.length > length ? text.substring(0, length) + suffix : text);

export const isResponseError = (error: any) => error && axios.isAxiosError(error) && error.response?.status === 400;

export const getResponseError = (error: any, defaultMessage = "") => (isResponseError(error) ? error.response.data : defaultMessage);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Point = [number, number];

export const computeDistance = (point1: Point, point2: Point): number => {
  const [lon1, lat1] = point1.map(Number);
  const [lon2, lat2] = point2.map(Number);
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const deltaLon = lon2 - lon1;
  const deltaLambda = (deltaLon * Math.PI) / 180;
  const d = Math.acos(Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda)) * R;
  return d;
};

export const isValidEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

export const isUUID = (value: string) => value.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
