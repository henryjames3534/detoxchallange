import { NextResponse } from "next/server";
import { requireDoctor } from "@/lib/portal-auth";
import { prisma } from "@/lib/db";
import { generateInvoiceNumber } from "@/lib/portal-service";

export async function GET() {
  const doctor = await requireDoctor();
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    orderBy: { issuedAt: "desc" },
    include: {
      patient: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });

  return NextResponse.json({ invoices });
}

export async function POST(request: Request) {
  const doctor = await requireDoctor();
  if (!doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    patientId?: string;
    amount?: number;
    description?: string;
    dueAt?: string;
    items?: { label: string; amount: number }[];
  };

  if (!body.patientId || body.amount == null || !body.description) {
    return NextResponse.json(
      { error: "patientId, amount, and description are required" },
      { status: 400 },
    );
  }

  const invoice = await prisma.invoice.create({
    data: {
      patientId: body.patientId,
      invoiceNumber: await generateInvoiceNumber(),
      amount: body.amount,
      description: body.description,
      dueAt: body.dueAt ? new Date(body.dueAt) : null,
      itemsJson: body.items ? JSON.stringify(body.items) : null,
    },
    include: {
      patient: true,
    },
  });

  return NextResponse.json({ invoice });
}
