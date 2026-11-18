import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Byl (byl.mn) төлбөрийн API — зөвхөн сервер дээр ашиглана.
 * Орчны хувьсагч: BYL_PROJECT_ID, BYL_TOKEN, BYL_WEBHOOK_SECRET (NEXT_PUBLIC_ угтваргүй — хөтөч рүү очихгүй).
 */

const API = "https://byl.mn/api/v1";

export class BylError extends Error {}

function config() {
  const projectId = process.env.BYL_PROJECT_ID;
  const token = process.env.BYL_TOKEN;
  if (!projectId || !token) throw new BylError("BYL_PROJECT_ID эсвэл BYL_TOKEN тохируулагдаагүй байна.");
  return { projectId, token };
}

type CheckoutInput = {
  /** Төгрөгөөр */
  amount: number;
  productName: string;
  productRef: string;
  /** Манай orders.id — webhook-оор буцаж ирнэ */
  orderId: string;
  successUrl: string;
  cancelUrl: string;
};

/** POST /projects/:id/checkouts — төлбөрийн хуудас үүсгээд { id, url } буцаана. */
export async function createCheckout(input: CheckoutInput): Promise<{ id: number; url: string }> {
  const { projectId, token } = config();

  const response = await fetch(`${API}/projects/${projectId}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      client_reference_id: input.orderId,
      phone_number_collection: true,
      email_collection: true,
      items: [
        {
          price_data: {
            unit_amount: input.amount,
            product_data: { name: input.productName, client_reference_id: input.productRef },
          },
          quantity: 1,
        },
      ],
    }),
    cache: "no-store",
  });

  const body = (await response.json().catch(() => null)) as { data?: { id: number; url: string }; message?: string } | null;
  if (!response.ok || !body?.data?.url) {
    throw new BylError(`Byl checkout үүсгэж чадсангүй (${response.status}): ${body?.message ?? "хариу алга"}`);
  }
  return body.data;
}

/** Webhook-ийн Byl-Signature толгойг шалгана: HMAC-SHA256(secret, түүхий бие) hex. */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.BYL_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"));
  const received = Buffer.from(signature.trim());
  return expected.length === received.length && timingSafeEqual(expected, received);
}

/** checkout.completed event-ийн бидэнд хэрэгтэй хэсэг */
export type BylWebhookEvent = {
  id: number;
  type: string;
  data?: {
    object?: {
      id: number;
      status: string;
      client_reference_id: string | null;
      amount_total: string | number;
      customer_email: string | null;
      phone_number?: string | null;
    };
  };
};
