const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

export type DateInput = Date | string;

/**
 * Parses supported date input and rejects invalid values.
 */
export function parseDateInput(value: DateInput): Date {
  const parsedDate = value instanceof Date ? new Date(value.getTime()) : new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date value: ${String(value)}`);
  }

  return parsedDate;
}

/**
 * Normalizes a date to UTC midnight for stable day-based comparisons.
 */
export function toUtcDayStart(value: DateInput): Date {
  const date = parseDateInput(value);

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

/**
 * Returns the whole-day distance between two dates using UTC day boundaries.
 */
export function differenceInUtcDays(startDate: DateInput, endDate: DateInput): number {
  const startDay = toUtcDayStart(startDate).getTime();
  const endDay = toUtcDayStart(endDate).getTime();

  return Math.floor((endDay - startDay) / MILLISECONDS_PER_DAY);
}
