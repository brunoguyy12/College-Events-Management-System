export const INDIA_TIMEZONE = "Asia/Kolkata";

export function formatDateForInput(date: Date): string {
  // Convert to Indian timezone and format for datetime-local input
  const indianDate = new Date(
    date.toLocaleString("en-US", { timeZone: INDIA_TIMEZONE })
  );
  const year = indianDate.getFullYear();
  const month = String(indianDate.getMonth() + 1).padStart(2, "0");
  const day = String(indianDate.getDate()).padStart(2, "0");
  const hours = String(indianDate.getHours()).padStart(2, "0");
  const minutes = String(indianDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function parseInputDate(dateString: string): Date {
  // Parse datetime-local input as Indian timezone
  const date = new Date(dateString);
  // Adjust for timezone offset to ensure it's treated as Indian time
  const offset = date.getTimezoneOffset() * 60000;
  const indianOffset = 5.5 * 60 * 60 * 1000; // +5:30 in milliseconds
  return new Date(date.getTime() + offset + indianOffset);
}

export function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: INDIA_TIMEZONE,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function isEventOngoing(startDate: Date, endDate: Date): boolean {
  const now = new Date();
  return now >= new Date(startDate) && now <= new Date(endDate);
}

export function isEventUpcoming(startDate: Date): boolean {
  const now = new Date();
  return now < new Date(startDate);
}

export function isEventPast(endDate: Date): boolean {
  const now = new Date();
  return now > new Date(endDate);
}

export function getEventStatus(
  startDate: Date,
  endDate: Date
): "upcoming" | "ongoing" | "past" {
  const now = new Date();
  if (now < new Date(startDate)) return "upcoming";
  if (now > new Date(endDate)) return "past";
  return "ongoing";
}
