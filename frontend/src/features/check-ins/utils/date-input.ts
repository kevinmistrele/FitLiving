// Converts between a Firestore-backed Date and the yyyy-mm-dd string a native
// <input type="date"> reads/writes, using local date parts (not toISOString/new Date(string),
// which shift by timezone offset around UTC midnight).
export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function fromDateInputValue(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day);
}
