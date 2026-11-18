export type ContactInput = { name: string; email: string; message: string };

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactValidation =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** «Холбоо барих» маягтын өгөгдлийг шалгана. Серверт (API) болон хөтөчид хоёуланд нь ашиглаж болно. */
export function validateContact(input: unknown): ContactValidation {
  const source = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const data: ContactInput = {
    name: asTrimmedString(source.name),
    email: asTrimmedString(source.email),
    message: asTrimmedString(source.message),
  };

  const errors: ContactErrors = {};
  if (data.name.length < 2 || data.name.length > 80) {
    errors.name = "Нэрээ 2–80 тэмдэгтээр оруулна уу.";
  }
  if (!EMAIL_PATTERN.test(data.email) || data.email.length > 120) {
    errors.email = "Зөв имэйл хаяг оруулна уу.";
  }
  if (data.message.length < 10 || data.message.length > 2000) {
    errors.message = "Мессеж 10–2000 тэмдэгт байх ёстой.";
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, data };
}
