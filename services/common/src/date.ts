import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dayjs/locale/en-gb";

dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export { dayjs };

export const now = () => new Date().toISOString();

// Mon 17th 24
export const dateToLocalYMD = (value: null | string | Date, placeholder = "-") => (value ? dayjs(value).format("ll") : placeholder);
// Mon 17th 24, 5:30pm
export const dateToLocalYMDHM = (value: null | string | Date, placeholder = "-") => (value ? dayjs(new Date(value)).format("lll") : placeholder);
// YYYY-MM-DD
export const dateToYMD = (value: null | string | Date, placeholder = "-") => (value ? dayjs(new Date(value)).format("YYYY-MM-DD") : placeholder);
// YYYY-MM-DD HH
export const dateToYMDH = (value: null | string | Date, placeholder = "-") => (value ? dayjs(value).format("YYYY-MM-DD HH") : placeholder);
// YYYY-MM-DD HH:MM
export const dateToYMDHM = (value: null | string | Date, placeholder = "-") => (value ? dayjs(value).format("YYYY-MM-DD HH:mm") : placeholder);
// YYYY-MM-DD HH:MM:SS
export const dateToYMDHMS = (value: null | string | Date, placeholder = "-") => (value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : placeholder);
// HH:MM
export const dateToHM = (value: null | string | Date, placeholder = "-") => (value ? dayjs(value).format("HH:mm") : placeholder);

export const getLocalTimezone = () => dayjs.tz.guess();

// convert seconds amount to "1d 2h 50min 30sec" string
export const secondsToTimeSpan = (seconds: number): string => {
  let amount = seconds;

  const d = Math.floor(amount / (24 * 60 * 60));
  amount -= d * (24 * 60 * 60);
  const h = Math.floor(amount / (60 * 60));
  amount -= h * (60 * 60);
  const m = Math.floor(amount / 60);
  amount -= m * 60;
  const s = Math.floor(amount);

  const dDisplay = d > 0 ? `${d}d` : "";
  const hDisplay = h > 0 ? `${h}h` : "";
  const mDisplay = m > 0 ? `${m}min` : "";
  const sDisplay = s > 0 ? `${s}sec` : "";

  const time_span = `${dDisplay} ${hDisplay} ${mDisplay} ${sDisplay}`.trim().replaceAll(/\s+/g, " ");
  return time_span;
};

/**
 * Formats a date to a human-readable format
 * @param date: The date to be formatted
 * @param pastHoursConsideredRecent: The amount of hours in the past that we consider the date to be recent
 * @returns the formatted date and a boolean indicating if the date is recent
 */
export const formatDateFrom = (date: string | Date, pastHoursConsideredRecent = 24) => {
  const absoluteDate = dateToYMDHMS(new Date(date));
  const fromNow = dayjs(new Date(date)).fromNow();
  const isRecent = Number(new Date()) - Number(new Date(date)) < 3600 * pastHoursConsideredRecent * 1000;

  const formattedDate = isRecent ? fromNow : absoluteDate;

  return {
    isRecent,
    formattedDate,
  };
};
