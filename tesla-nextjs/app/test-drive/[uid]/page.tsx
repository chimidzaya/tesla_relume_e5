import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AutoRefresh } from "@/components/order/AutoRefresh";
import { OrderResult, Receipt, StatusIcon } from "@/components/order/OrderResult";
import { OrderSteps } from "@/components/order/OrderSteps";
import { HoldCountdown } from "@/components/testdrive/HoldCountdown";
import { TestDriveButton } from "@/components/testdrive/TestDriveButton";
import { TestDrivePayForm } from "@/components/testdrive/TestDrivePayForm";
import { Button } from "@/components/ui/Button";
import { formatDateTimeMN, formatMNT } from "@/lib/format";
import { HOLD_MINUTES, loadTestDrive, TEST_DRIVE_FEE } from "@/lib/test-drive";

export const metadata: Metadata = { title: "Туршилтын жолоодлого", robots: { index: false } };

const STEPS = ["Машин", "Цаг", "Төлбөр", "Баталгаажих"] as const;
const UID = /^[A-Za-z0-9_-]{6,64}$/;

/**
 * Алхам 3–4 — туршилтын жолоодлогын төлбөр ба баталгаажилт.
 * Төлөвийг URL-аас биш, webhook-уудын бичсэн database-ээс (эсвэл Cal API-аас) уншина.
 */
export default async function TestDrivePage({ params, searchParams }: PageProps<"/test-drive/[uid]">) {
  const { uid } = await params;
  const { paid, cancelled, error } = await searchParams;
  const drive = UID.test(uid) ? await loadTestDrive(uid) : null;

  if (!drive) {
    return (
      <OrderResult
        icon={<StatusIcon status="pending" />}
        eyebrow="Туршилтын жолоодлого"
        title="Захиалгыг хайж байна"
        actions={<Button href="/">Нүүр хуудас</Button>}
      >
        <AutoRefresh max={5} message="Cal.com-оос захиалгын мэдээллийг хүлээж байна…" />
        <p>Хэдэн секундийн дараа ч гарахгүй бол холбоос буруу эсвэл захиалга устсан байна.</p>
      </OrderResult>
    );
  }

  const amount = formatMNT(TEST_DRIVE_FEE);
  const receipt = (status: ReactNode) => (
    <Receipt
      rows={[
        { label: "Машин", value: drive.model_name ? `Tesla ${drive.model_name}` : "—" },
        { label: "Цаг", value: formatDateTimeMN(drive.start_time) },
        ...(drive.name ? [{ label: "Захиалагч", value: drive.name }] : []),
        { label: "Төлбөр", value: <span className="font-semibold tabular-nums">{amount}</span> },
        { label: "Төлөв", value: status },
      ]}
    />
  );
  const again = drive.model_slug ? (
    <TestDriveButton model={drive.model_slug} variant="outline-light">
      Дахин цаг сонгох
    </TestDriveButton>
  ) : (
    <TestDriveButton variant="outline-light">Дахин цаг сонгох</TestDriveButton>
  );
  const home = (
    <Button href="/" variant="glass">
      Нүүр хуудас
    </Button>
  );

  switch (drive.status) {
    case "pending_payment":
      // Byl-ээс буцаж ирсэн — webhook ирэхийг хүлээнэ
      if (paid) {
        return (
          <OrderResult
            steps={<OrderSteps steps={STEPS} current={3} />}
            icon={<StatusIcon status="pending" />}
            eyebrow="Төлбөр шалгагдаж байна"
            title="Төлбөрийг баталгаажуулж байна"
            actions={home}
          >
            <AutoRefresh />
            {receipt(<Badge tone="pending">Шалгаж байна</Badge>)}
            <p>Ихэвчлэн хэдхэн секунд болдог. Төлбөр орсон бол цаг тань автоматаар баталгаажна.</p>
          </OrderResult>
        );
      }
      return (
        <OrderResult
          steps={<OrderSteps steps={STEPS} current={2} />}
          icon={<StatusIcon status="pending" />}
          eyebrow="Алхам 3 · Төлбөр"
          title={`${amount} төлж цагаа баталгаажуулна`}
          actions={<TestDrivePayForm uid={drive.booking_uid} amountLabel={amount} />}
        >
          {(cancelled || error) && (
            <p role="alert" className="rounded-xl bg-[#b3412b]/20 px-4 py-3 font-sans text-sm text-on-dark">
              {error
                ? "Төлбөрийн хуудас нээгдсэнгүй. Мөнгө хасагдаагүй — дахин оролдоно уу."
                : "Төлбөр хийгдсэнгүй. Цаг тань хадгалагдсан хэвээр — доорх товчоор дахин төлж болно."}
            </p>
          )}
          {receipt(<Badge tone="pending">Төлбөр хүлээж буй</Badge>)}
          {drive.expires_at && <HoldCountdown expiresAt={drive.expires_at} />}
          <p>
            Цаг тань {HOLD_MINUTES} минут таньд зориулж хадгалагдана. Төлмөгц Cal.com баталгаажсан имэйл, хуанлийн урилгыг
            илгээнэ.
          </p>
        </OrderResult>
      );

    case "confirmed":
      return (
        <OrderResult
          steps={<OrderSteps steps={STEPS} current={3} state="done" />}
          icon={<StatusIcon status="paid" />}
          eyebrow="Баталгаажлаа"
          title={drive.model_name ? `${drive.model_name}-ийн туршилтын жолоодлого баталгаажлаа` : "Туршилтын жолоодлого баталгаажлаа"}
          actions={
            <>
              {drive.model_slug && (
                <Button href={`/models/${drive.model_slug}`} variant="outline-light">
                  {drive.model_name}-ийг үзэх
                </Button>
              )}
              {home}
            </>
          }
        >
          {receipt(<Badge tone="paid">{drive.paid_at ? "Төлөгдсөн" : "Баталгаажсан"}</Badge>)}
          <p>
            Баталгаажсан имэйл, хуанлийн урилга таны имэйл рүү очлоо. Жолооны үнэмлэхээ авч, цагаасаа 10 минутын өмнө
            ирээрэй. Цагаа өөрчлөх, цуцлах бол имэйл дэх холбоосыг ашиглана уу.
          </p>
        </OrderResult>
      );

    case "expired":
      return (
        <Stopped
          title="Төлбөрийн хугацаа дууслаа"
          receipt={receipt(<Badge tone="stopped">Цуцлагдсан</Badge>)}
          actions={<>{again}{home}</>}
        >
          {HOLD_MINUTES} минутын дотор төлбөр ороогүй тул цаг тань бусдад нээгдлээ. Мөнгө хасагдаагүй — шинээр цаг сонгож
          болно.
        </Stopped>
      );

    case "refund_needed":
      return (
        <Stopped
          title="Төлбөр орсон ч цаг цуцлагдсан байсан"
          receipt={receipt(<Badge tone="stopped">Буцаалт хийгдэнэ</Badge>)}
          actions={<>{again}{home}</>}
        >
          Таны төлбөр хугацаа дууссаны дараа орсон тул цагийг баталгаажуулж чадсангүй. {amount}-ийг 1–3 ажлын өдөрт буцаана.
          Шинээр цаг сонгож болно.
        </Stopped>
      );

    case "rescheduled":
      return (
        <Stopped
          title="Цаг өөрчлөгдсөн"
          receipt={receipt(<Badge tone="pending">Шинэ цаг руу шилжсэн</Badge>)}
          actions={home}
        >
          Энэ захиалгын цагийг өөрчилсөн байна. Шинэ цагийн мэдээлэл таны имэйлд ирсэн.
        </Stopped>
      );

    case "cancelled":
      return (
        <Stopped
          title="Захиалга цуцлагдсан"
          receipt={receipt(<Badge tone="stopped">Цуцлагдсан</Badge>)}
          actions={<>{again}{home}</>}
        >
          {drive.paid_at
            ? `Төлсөн ${amount}-ийн буцаалтын талаар манай ажилтан холбогдоно.`
            : "Энэ цагийг цуцалсан байна. Хүсвэл шинээр цаг сонгоорой."}
        </Stopped>
      );
  }
}

function Stopped({
  title,
  receipt,
  actions,
  children,
}: {
  title: string;
  receipt: ReactNode;
  actions: ReactNode;
  children: ReactNode;
}) {
  return (
    <OrderResult
      steps={<OrderSteps steps={STEPS} current={2} state="stopped" />}
      icon={<StatusIcon status="stopped" />}
      eyebrow="Туршилтын жолоодлого"
      title={title}
      actions={actions}
    >
      {receipt}
      <p>{children}</p>
    </OrderResult>
  );
}

function Badge({ tone, children }: { tone: "paid" | "pending" | "stopped"; children: ReactNode }) {
  const styles = {
    paid: "bg-[#3f8a4a] text-white",
    pending: "bg-taupe text-ink",
    stopped: "bg-[#b3412b] text-white",
  }[tone];
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles}`}>{children}</span>;
}
