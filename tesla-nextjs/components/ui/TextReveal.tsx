import { Fragment, type CSSProperties } from "react";

/**
 * Гарчгийг үг үгээр доороос «маскаас» гаргана (тренд editorial эффект).
 * - Үг бүр overflow-hidden хайрцагт → доороос гулсаж гарч ирэхэд доод хэсэг нь нуугдана
 * - Хоцрогдол: үг бүрийн --i × step (CSS хувьсагч, Tailwind arbitrary property)
 * - Дэлгэц уншигч бүтэн өгүүлбэрийг нэг удаа уншина (sr-only), хөдөлгөөнт үгсийг алгасна
 * - motion-safe: — «хөдөлгөөн багасгах» үед шууд харагдана. JavaScript шаардлагагүй (server component)
 */
export function TextReveal({
  text,
  delay = 0,
  step = 70,
  onReveal = false,
}: {
  text: string;
  delay?: number;
  step?: number;
  /** true бол <Reveal> дотор: хэсэг дэлгэцэнд орж иртэл (data-visible) зогсоод хүлээнэ */
  onReveal?: boolean;
}) {
  const words = text.split(" ");
  const wait = onReveal
    ? // motion-safe: — animate-word-up (shorthand) мөн motion-safe дотор тул түүний ард бичигдэж дарагдахгүй
      "motion-safe:in-[.js]:[animation-play-state:paused] motion-safe:in-[.js]:in-data-visible:[animation-play-state:running]"
    : "";

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={i}>
            <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <span
                className={`inline-block motion-safe:animate-word-up motion-safe:[animation-delay:calc(var(--d)+var(--i)*var(--s))] ${wait}`}
                style={{ "--i": i, "--d": `${delay}ms`, "--s": `${step}ms` } as CSSProperties}
              >
                {word}
              </span>
            </span>
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </>
  );
}
