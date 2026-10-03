// Date -> 'YYYY-MM-DD' using LOCAL time
export function dateToString(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getTodayString() {
  return dateToString(new Date());
}

// 'YYYY-MM-DD' -> Date (or null if invalid)
export function stringToDate(str) {
  if (!isValidDate(str)) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// '2026-10-03' -> '3 Oct 2026' (friendlier to read; storage format stays YYYY-MM-DD)
export function formatDisplayDate(str) {
  const date = stringToDate(str);
  if (!date) return str;
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

// Checks the format AND that the date really exists (rejects 2026-13-45)
export function isValidDate(str) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const [y, m, d] = str.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

// A task is "today's task" if today falls between its start and due date (inclusive)
export function isTodayTask(task) {
  const today = getTodayString();
  return task.startDate <= today && today <= task.dueDate;
}

// Overdue = not completed AND the due date is before today.
// (A task due today is NOT overdue yet.) YYYY-MM-DD strings compare correctly.
export function isOverdue(task) {
  return task.status !== 'Completed' && task.dueDate < getTodayString();
}