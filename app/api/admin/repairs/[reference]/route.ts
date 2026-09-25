import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { FEATURES } from "@/lib/constants";
import { areRepairWritesEnabled } from "@/lib/deployment";
import { REPAIR_STATUSES } from "@/lib/repairTracking";
import { updateRepairStatus, RepairStoreError } from "@/lib/server/repairStore";
import { RequestBodyError } from "@/lib/server/requestSecurity";
import { readStaffJsonBody, requireStaffSession, StaffAuthorizationError } from "@/lib/server/staffAuth";

const statusUpdateSchema = z.object({
  status: z.enum(REPAIR_STATUSES),
  customerNote: z.string().trim().max(1000).refine((value) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value)).default(""),
  expectedUpdatedAt: z.string().datetime({ offset: true }),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ reference: string }> }) {
  if (!FEATURES.trackingEnabled) {
    return NextResponse.json({ error: "Repair tracking is unavailable." }, { status: 503 });
  }
  if (!areRepairWritesEnabled()) {
    return NextResponse.json({ error: "Repair changes are disabled in this deployment." }, { status: 503 });
  }
  try {
    const staff = await requireStaffSession();
    const result = statusUpdateSchema.safeParse(await readStaffJsonBody(request));
    if (!result.success) {
      return NextResponse.json({ error: "Check the status and customer update.", fields: result.error.flatten().fieldErrors }, { status: 400 });
    }
    const { reference } = await context.params;
    const repair = await updateRepairStatus(reference, result.data.status, result.data.customerNote, staff.email, result.data.expectedUpdatedAt);
    return NextResponse.json({ ok: true, repair }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof StaffAuthorizationError || error instanceof RequestBodyError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (error instanceof RepairStoreError) {
      if (error.code === "not-found") return NextResponse.json({ error: "Repair not found." }, { status: 404 });
      if (error.code === "stale-update") return NextResponse.json({ error: "This repair has changed. Refresh it before saving your update." }, { status: 409 });
      if (error.code === "history-limit") return NextResponse.json({ error: "This repair has reached its update limit. Contact the site administrator." }, { status: 409 });
      if (error.code === "invalid-input") return NextResponse.json({ error: "Check the status and customer update." }, { status: 400 });
    }
    console.error("Staff repair update failed", { type: "storage" });
    return NextResponse.json({ error: "The update could not be saved. Refresh the repair before retrying." }, { status: 503 });
  }
}
