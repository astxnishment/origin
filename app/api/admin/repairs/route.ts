import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { FEATURES } from "@/lib/constants";
import { areRepairWritesEnabled } from "@/lib/deployment";
import { createRepair, RepairStoreError } from "@/lib/server/repairStore";
import { RequestBodyError } from "@/lib/server/requestSecurity";
import { readStaffJsonBody, requireStaffSession, StaffAuthorizationError } from "@/lib/server/staffAuth";

const line = (max: number) => z.string().trim().min(1).max(max).refine((value) => !/[\r\n\u0000-\u001F]/.test(value));
const multiline = (max: number) => z.string().trim().max(max).refine((value) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value)).default("");
const manualRepairSchema = z.object({
  customerEmail: z.string().trim().max(254).email().transform((value) => value.toLowerCase()),
  customerName: line(100),
  customerPhone: z.string().trim().max(25).regex(/^(?:\+?[0-9][0-9\s().-]{5,23}[0-9])?$/).default(""),
  deviceLabel: line(180),
  repairLabel: line(180),
  serviceMethod: z.enum(["drop-off", "mail-in"]),
  issue: multiline(2000),
  returnAddress: multiline(500),
  requestKey: z.string().uuid(),
}).superRefine((input, context) => {
  if (input.serviceMethod === "mail-in" && !input.returnAddress) {
    context.addIssue({ code: "custom", path: ["returnAddress"], message: "Enter the return address for a mail-in repair." });
  }
});

export async function POST(request: NextRequest) {
  if (!FEATURES.trackingEnabled) {
    return NextResponse.json({ error: "Repair tracking is unavailable." }, { status: 503 });
  }
  if (!areRepairWritesEnabled()) {
    return NextResponse.json({ error: "Repair changes are disabled in this deployment." }, { status: 503 });
  }
  try {
    await requireStaffSession();
    const result = manualRepairSchema.safeParse(await readStaffJsonBody(request));
    if (!result.success) {
      return NextResponse.json({ error: "Check the repair details.", fields: result.error.flatten().fieldErrors }, { status: 400 });
    }
    const { requestKey, ...input } = result.data;
    const saved = await createRepair({
      ...input,
      returnAddress: input.serviceMethod === "mail-in" ? input.returnAddress : "",
      priceLabel: "Assessment required",
      partLabel: "To be confirmed after assessment",
      warranty: "Confirmed with the repair quote",
    }, `staff_${requestKey}`);
    return NextResponse.json({ ok: true, ...saved }, { status: saved.created ? 201 : 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof StaffAuthorizationError || error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof RepairStoreError) {
      if (error.code === "idempotency-conflict") return NextResponse.json({ error: "This request key belongs to different repair details. Refresh before creating another repair." }, { status: 409 });
      if (error.code === "invalid-input") return NextResponse.json({ error: "Check the repair details." }, { status: 400 });
    }
    console.error("Staff repair creation failed", { type: "storage" });
    return NextResponse.json({ error: "The repair could not be saved. Your changes have not been confirmed; please retry." }, { status: 503 });
  }
}
