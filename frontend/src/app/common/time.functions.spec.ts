import {toDateTimePickerValueFormat, toUtcIsoString, truncateIsoStringToMinutes} from './time.functions';

// truncateIsoStringToMinutes is timezone-independent: it parses a UTC ISO string,
// zeros seconds/ms, and outputs a UTC ISO string. No special handling needed.
describe('truncateIsoStringToMinutes', () => {
  it('should zero out seconds and milliseconds from an ISO string', () => {
    expect(truncateIsoStringToMinutes('2025-06-15T14:30:45.123Z')).toBe('2025-06-15T14:30:00.000Z');
  });
});

// toUtcIsoString converts a datetime-local value (interpreted as local time) to UTC.
// The UTC output depends on the runner's timezone, so we cannot hardcode an expected
// ISO string. Instead we verify the round-trip: parsing the output back should yield
// a Date whose local time components match the original input.
describe('toUtcIsoString', () => {
  it('should convert a datetime-local value to a UTC ISO string', () => {
    const result = toUtcIsoString('2025-06-15T14:30');
    const parsed = new Date(result);

    expect(parsed.getFullYear()).toBe(2025);
    expect(parsed.getMonth()).toBe(5);
    expect(parsed.getDate()).toBe(15);
    expect(parsed.getHours()).toBe(14);
    expect(parsed.getMinutes()).toBe(30);
    expect(parsed.getSeconds()).toBe(0);
  });
});

// toDateTimePickerValueFormat reads local time components from a Date. Constructing
// the Date with local components (new Date(y, m, d, h, min)) guarantees the expected
// values are correct regardless of the runner's timezone.
describe('toDateTimePickerValueFormat', () => {
  it('should format a Date into "YYYY-MM-DDThh:mm" using local time', () => {
    const date = new Date(2025, 11, 15, 14, 30, 42);

    expect(toDateTimePickerValueFormat(date)).toBe('2025-12-15T14:30');
  });

  it('should pad single-digit month, day, hours, and minutes with leading zeros', () => {
    const date = new Date(2025, 0, 5, 3, 7, 42);

    expect(toDateTimePickerValueFormat(date)).toBe('2025-01-05T03:07');
  });
});
