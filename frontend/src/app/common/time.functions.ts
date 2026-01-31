/**
 * The datetime-local input only has minute precision, so the round-trip
 * (backend UTC ISO → local datetime → UTC ISO) loses seconds and milliseconds.
 * To avoid false positives when comparing the submitted value against the
 * original, we truncate the original to minute precision as well.
 */
export function truncateIsoStringToMinutes(isoString: string): string {
  const date = new Date(isoString);
  date.setSeconds(0, 0);
  return date.toISOString();
}

/**
 * Converts a `datetime-local` value ("YYYY-MM-DDThh:mm") into a UTC ISO-8601
 * string for the backend. Values from a `datetime-local` input represent a
 * local date and time without any timezone offset. When this format is passed
 * to `new Date()`, the JavaScript runtime interprets it as local time; calling
 * `toISOString()` then converts that local instant into its equivalent UTC
 * timestamp, which is what the backend expects.
 */
export function toUtcIsoString(timePickerValue: string): string {
  return new Date(timePickerValue).toISOString();
}

/**
 * Formats a Date object into the "YYYY-MM-DDThh:mm" string required by an
 * HTML `datetime-local` input. The `datetime-local` control does not accept
 * ISO-8601 strings (which include seconds, milliseconds, and a "Z" suffix)
 * nor raw Date objects — it requires this exact format. We use local Date
 * accessors (getFullYear, getMonth, etc.) rather than `toISOString()` so
 * that the displayed value reflects the user's local timezone.
 */
export function toDateTimePickerValueFormat(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
