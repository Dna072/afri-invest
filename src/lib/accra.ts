/** Accra is GMT year-round. GSE hours are modelled, not a live feed. */
export type AccraClock = {
  weekday: string;
  hour: number;
  minute: number;
  time: string;
  isWeekday: boolean;
  insideHours: boolean;
  label: string;
};

export function getAccraClock(date = new Date()): AccraClock {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Accra",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>;

  const hour = Number(parts.hour);
  const minute = Number(parts.minute);
  const weekday = parts.weekday ?? "";
  const isWeekday = !["Sat", "Sun"].includes(weekday);
  const minutes = hour * 60 + minute;
  const insideHours = isWeekday && minutes >= 9 * 60 + 30 && minutes < 15 * 60;

  return {
    weekday,
    hour,
    minute,
    time: `${parts.hour}:${parts.minute}`,
    isWeekday,
    insideHours,
    label: insideHours ? "Inside Accra hours" : "Outside Accra hours",
  };
}
