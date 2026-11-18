import { validateContact } from "@/lib/contact";

/**
 * POST /api/contact — «Холбоо барих» маягтыг хүлээн авах Node.js сервер код.
 * Өгөгдлийг шалгаад серверийн лог руу бичнэ (имэйл илгээдэггүй).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Хүсэлтийн формат буруу байна." }, { status: 400 });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return Response.json(
      { ok: false, message: "Маягтын мэдээллийг шалгана уу.", errors: result.errors },
      { status: 400 },
    );
  }

  const { name, message } = result.data;
  console.log(`[contact] ${name}-аас шинэ мессеж ирлээ (${message.length} тэмдэгт).`);

  return Response.json({ ok: true, message: "Таны мессежийг хүлээн авлаа. Баярлалаа!" });
}
