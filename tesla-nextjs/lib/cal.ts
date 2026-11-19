/**
 * Cal.com — туршилтын жолоодлогын цаг захиалга.
 * Хөтөч (embed) болон сервер (webhook) хоёуланд нь ашиглагдах тогтмолууд.
 */

/** Embed-ийн namespace (cal.com-ын embed кодонд байгаатай ижил) */
export const CAL_NAMESPACE = "tesla-test-driving";

/** Cal.com-ын event type-ийн холбоос: {хэрэглэгч}/{event} */
export const CAL_LINK = "chimidzaya-dashpurew-dsf3hv/tesla-test-driving";

/**
 * Cal.com дээрх захиалгын асуултын identifier (Event Type → Advanced → Booking questions).
 * Энэ асуулт байхгүй байсан ч `metadata[model]` нь webhook-оор ирсээр байна.
 */
export const CAL_MODEL_FIELD = "model";

/** Туршилтын жолоодлогын төлбөр (₮) — машин сонгох цонх болон серверийн төлбөр хоёул эндээс авна */
export const TEST_DRIVE_FEE = 20_000;
/** Цаг сонгосноос хойш төлөх хугацаа (минут) */
export const HOLD_MINUTES = 30;

export type TestDriveModel = { slug: string; name: string };

/**
 * Popup-ын config:
 * - `model` — захиалгын «Машин» асуултыг урьдчилан бөглөнө (хэрэглэгч харж баталгаажуулна)
 * - `metadata[model]` — хэрэглэгч засах боломжгүй slug, webhook-ийн payload.metadata.model-оор ирнэ
 */
export function calConfig(model?: TestDriveModel): Record<string, string> {
  return {
    layout: "month_view",
    useSlotsViewOnSmallScreen: "true",
    ...(model && { [CAL_MODEL_FIELD]: model.name, "metadata[model]": model.slug }),
  };
}
