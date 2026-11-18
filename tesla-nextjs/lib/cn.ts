/** Нөхцөлт CSS классуудыг нэгтгэнэ: cn("a", false && "b", "c") → "a c" */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
