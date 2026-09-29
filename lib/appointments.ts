export const REQUEST_TIME_SLOTS = ["9:00am", "10:00am", "11:00am", "12:00pm", "1:00pm", "2:00pm", "3:00pm", "4:00pm", "5:00pm"] as const;

export function londonDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (name: string) => parts.find((item) => item.type === name)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function latestRequestDate(now = new Date()): string {
  const date = new Date(`${londonDate(now)}T12:00:00Z`);
  date.setUTCFullYear(date.getUTCFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

export function isRequestDateValid(value: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value && value >= londonDate(now) && value <= latestRequestDate(now);
}

export function slotsForDate(value: string, now = new Date()): string[] {
  if (!value) return [...REQUEST_TIME_SLOTS];
  if (!isRequestDateValid(value, now)) return [];
  const day = new Date(`${value}T12:00:00Z`).getUTCDay();
  if (day === 0) return [];
  const slots = day === 6 ? REQUEST_TIME_SLOTS.slice(1, 7) : [...REQUEST_TIME_SLOTS];
  if (value !== londonDate(now)) return [...slots];
  const clock = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const minutes = Number(clock.find((part) => part.type === "hour")!.value) * 60 + Number(clock.find((part) => part.type === "minute")!.value);
  return slots.filter((slot) => {
    const match = /^(\d+):(\d+)(am|pm)$/.exec(slot)!;
    const hour = Number(match[1]) % 12 + (match[3] === "pm" ? 12 : 0);
    return hour * 60 + Number(match[2]) > minutes;
  });
}
