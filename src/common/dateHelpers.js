import { helpers } from './helpers';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../services/rhsm/rhsmConstants';
import { translate } from '../components/i18n/i18n';

/**
 * @memberof Helpers
 * @module Dates
 */

/**
 * Return a date.
 *
 * @returns {string|Date}
 */
const getCurrentDate = () =>
  (helpers.TEST_MODE && new Date(Date.UTC(2019, 7, 20))) ||
  (helpers.DEV_MODE &&
    process.env.REACT_APP_DEBUG_DEFAULT_DATETIME &&
    new Date(process.env.REACT_APP_DEBUG_DEFAULT_DATETIME)) ||
  new Date(new Date().setUTCHours(10, 0, 0, 0));

/**
 * Set a date range based on a granularity type.
 *
 * @param {object} params
 * @param {Date} params.date Start date, typically the current date.
 * @param {number} params.subtract Number of granularity type to subtract from the current date.
 * @param {string} para{string} params.endOfMeasurement Granularity type.
 * @returns {{endDate: Date, startDate: Date}}
 */

const setRangedDayDateTime = ({ date, subtract }) => ({
  startDate: new Date(new Date(date.setUTCHours(0, 0, 0, 0)).setUTCDate(date.getUTCDate() - subtract)),
  endDate: new Date(date.setUTCHours(23, 59, 59, 999))
});

const setRangedWeekDateTime = ({ date, subtract }) => ({
  startDate: new Date(new Date(date.setUTCHours(0, 0, 0, 0)).setUTCDate(date.getUTCDate() - 6 - subtract * 7)),
  endDate: new Date(new Date(date.setUTCHours(23, 59, 59, 999)).setUTCDate(date.getUTCDate() - 6))
});

const setRangedMonthDateTime = ({ date, subtract }) => ({
  startDate: new Date(new Date(date.getUTCFullYear(), date.getUTCMonth() - subtract, 1).setUTCHours(0, 0, 0, 0)),
  endDate: new Date(new Date(date.getUTCFullYear(), date.getUTCMonth(), 1).setUTCHours(23, 59, 59, 999))
});

const setRangedYearDateTime = ({ date, subtract }) => ({
  startDate: new Date(new Date(date.getUTCFullYear() - subtract, date.getUTCMonth() + 1, 1).setUTCHours(0, 0, 0, 0)),
  endDate: new Date(new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0).setUTCHours(23, 59, 59, 999))
});

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const currentDateTime = setRangedDayDateTime({ date: getCurrentDate(), subtract: 1 });
const defaultDateTime = setRangedDayDateTime({ date: getCurrentDate(), subtract: 30 });
const weeklyDateTime = setRangedWeekDateTime({ date: getCurrentDate(), subtract: 12 });
const monthlyDateTime = setRangedMonthDateTime({ date: getCurrentDate(), subtract: 12 });
const quarterlyDateTime = setRangedMonthDateTime({ date: getCurrentDate(), subtract: 36 });
const rangedYearDateTime = setRangedYearDateTime({ date: getCurrentDate(), subtract: 1 });

/**
 * Return a range of time based on known granularity types.
 *
 * @param {string} granularity
 * @returns {{endDate: Date, startDate: Date}}
 */
const getRangedDateTime = granularity => {
  switch (granularity) {
    case 'CURRENT':
      return { ...currentDateTime };
    case GRANULARITY_TYPES.WEEKLY:
      return { ...weeklyDateTime };
    case GRANULARITY_TYPES.MONTHLY:
      return { ...monthlyDateTime };
    case GRANULARITY_TYPES.QUARTERLY:
      return { ...quarterlyDateTime };
    case GRANULARITY_TYPES.DAILY:
    default:
      return { ...defaultDateTime };
  }
};

/**
 * Generate a list of months for use in a select list.
 *
 * @param {string} month
 * @returns {{keyDateTimeRanges: {}, listDateTimeRanges: Array}|*|undefined}
 */
const getRangedMonthDateTime = month => {
  const currentYear = getCurrentDate().getUTCFullYear();
  const { startDate, endDate } = { ...rangedYearDateTime };
  const keyDateTimeRanges = {};
  let listDateTimeRanges = [];

  const startDateUpdated = new Date(startDate);
  const endDateUpdated = new Date(endDate);

  while (endDateUpdated > startDateUpdated || startDateUpdated.getMonth() === endDateUpdated.getMonth()) {
    const dateTime = {
      value: {
        startDate: startDateUpdated
      }
    };

    const titleYear = `${startDateUpdated.getUTCMonth}${startDateUpdated.getUTCFullYear()}`;
    const title = monthNames[startDateUpdated.getUTCMonth()];
    const titleIndex = startDateUpdated.getUTCMonth();
    const isNextYear = currentYear !== startDateUpdated.getUTCFullYear();

    dateTime.title = (isNextYear && titleYear) || title;
    dateTime._title = title.toLowerCase();
    dateTime.value.endDate = new Date(startDateUpdated.getUTCFullYear(), startDateUpdated.getUTCMonth() + 1, 0);

    startDateUpdated.setUTCMonth(startDateUpdated.getUTCMonth() + 1);

    dateTime.title = translate('curiosity-toolbar.label', { context: ['granularityRangedMonthly', dateTime.title] });
    keyDateTimeRanges[title.toLowerCase()] = { ...dateTime };
    keyDateTimeRanges[titleIndex] = { ...dateTime };
    listDateTimeRanges.push(dateTime);
  }

  listDateTimeRanges = listDateTimeRanges.reverse();
  listDateTimeRanges[0] = {
    ...listDateTimeRanges[0],
    isCurrent: true,
    _title: 'current',
    title: translate('curiosity-toolbar.label', { context: ['granularityRangedMonthly', 'current'] })
  };

  keyDateTimeRanges.current = { ...listDateTimeRanges[0] };

  if (month) {
    return keyDateTimeRanges?.[month] || undefined;
  }

  return { keyDateTimeRanges, listDateTimeRanges };
};

/**
 * Consistent timestamp day formats.
 *
 * @type {{short: string, yearShort: string, yearLong: string, long: string}}
 */
const timestampDayFormats = {
  yearLong: 'MMMM D YYYY',
  short: 'MMM D',
  yearShort: 'MMM D YYYY'
};
const timestampDayNumericFormats = ({ date }) => ({
  yearMonthDate: date.toISOString().split('T')[0]
});

/**
 * Consistent timestamp month formats.
 *
 * @type {{short: string, yearShort: string, yearLong: string, long: string}}
 */
const timestampMonthFormats = {
  long: 'MMMM',
  yearLong: 'MMMM YYYY',
  short: 'MMM',
  yearShort: 'MMM YYYY'
};

/**
 * Consistent timestamp quarter formats.
 *
 * @type {{short: string, yearShort: string, yearLong: string, long: string}}
 */
const timestampQuarterFormats = {
  ...timestampMonthFormats
};

/**
 * Consistent timestamp time formats.
 *
 * @type {{yearTimeShort: string, timeLong: string, yearTimeLong: string, timeShort: string}}
 */
const timestampTimeFormats = {
  timeLong: 'MMMM D h:mm:ss A',
  yearTimeLong: 'MMMM D YYYY h:mm:ss A',
  timeShort: 'MMM D h:mm A',
  yearTimeShort: 'MMM D YYYY h:mm A'
};

/**
 * Consistent UTC timestamp time formats.
 *
 * @type {{yearTimeShort: string, timeLong: string, yearTimeLong: string, timeShort: string}}
 */

const timestampUTCTimeFormats = ({ date }) => ({
  /* 'DD MMMM HH:mm:ss UTC' */
  timeLong: date.toUTCString().replace(/\D{5}/, '').replace(/\d{4}/, '').replace(/ {2}/, ' '),
  /* 'DD MMMM YYYY HH:mm:ss UTC' */
  yearTimeLong: date.toUTCString().replace(/\D{5}/, '').replace(/ {2}/, ' '),
  /* 'DD MMM HH:mm UTC', */
  timeShort: date
    .toUTCString()
    .replace(/\D{5}/, '')
    .replace(/\d{4}/, '')
    .replace(/ {2}/, ' ')
    .replace(/(:\d{2})(:\d{2})/, '$1'),
  /* 'DD MMM YYYY HH:mm UTC' */
  yearTimeShort: date
    .toUTCString()
    .replace(/\D{5}/, '')
    .replace(/ {2}/, ' ')
    .replace(/(:\d{2})(:\d{2})/, '$1')
});

const dateHelpers = {
  getCurrentDate,
  getRangedMonthDateTime,
  getRangedDateTime,
  setRangedDayDateTime,
  setRangedWeekDateTime,
  setRangedMonthDateTime,
  currentDateTime,
  defaultDateTime,
  monthlyDateTime,
  quarterlyDateTime,
  weeklyDateTime,
  rangedYearDateTime,
  timestampDayFormats,
  timestampMonthFormats,
  timestampQuarterFormats,
  timestampTimeFormats,
  timestampUTCTimeFormats
};

export {
  dateHelpers as default,
  getCurrentDate,
  getRangedMonthDateTime,
  getRangedDateTime,
  setRangedDayDateTime,
  setRangedMonthDateTime,
  setRangedYearDateTime,
  currentDateTime,
  dateHelpers,
  defaultDateTime,
  monthlyDateTime,
  quarterlyDateTime,
  weeklyDateTime,
  rangedYearDateTime,
  timestampDayFormats,
  timestampMonthFormats,
  timestampQuarterFormats,
  timestampTimeFormats,
  timestampUTCTimeFormats,
  timestampDayNumericFormats
};
