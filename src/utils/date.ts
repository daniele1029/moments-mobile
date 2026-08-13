export function toInputDate(
  value: string | null
) {
  if (!value) return null;

  return new Date(value)
    .toISOString()
    .split("T")[0];
}

export function fromInputDate(
  value: string | null
) {
  if (!value) return null;

  return new Date(value)
    .toISOString();
}
