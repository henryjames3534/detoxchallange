import { NextResponse } from "next/server";
import { requireDoctor } from "@/lib/portal-auth";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const doctor = await requireDoctor();
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: { patient: true },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  return NextResponse.json({
    invoice: {
      ...invoice,
      items: invoice.itemsJson ? JSON.parse(invoice.itemsJson) : [],
    },
    doctor,
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const doctor = await requireDoctor();
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json()) as { status?: string };

  const invoice = await prisma.invoice.update({
    where: { id },
    data: { status: body.status ?? "pending" },
  });

  return NextResponse.json({ invoice });
}
