// Converts between a Firestore-backed Date and the yyyy-mm-dd string a native
// <input type="date"> reads/writes, using local date parts (not toISOString/new Date(string),
// which shift by timezone offset around UTC midnight). The 'en-CA' locale is the standard
// trick for getting a locale-formatted yyyy-mm-dd string in one call.
export function toDateInputValue(date: Date): string {
  return date.toLocaleDateString('en-CA');
}

export function fromDateInputValue(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);

  return new Date(year, month - 1, day);
}
