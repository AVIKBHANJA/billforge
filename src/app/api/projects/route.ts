import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { z } from "zod";
import { zodErrorMessage } from "@/lib/validators";
import { prismaErrorResponse } from "@/lib/prisma-errors";

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  try {
    const projects = await prisma.project.findMany({
      where: { client: { userId: auth.user.id } },
      include: { client: { select: { id: true, name: true, company: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ projects });
  } catch (err) {
    return prismaErrorResponse(err, "projects.list") ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

const ProjectCreateSchema = z
  .object({
    clientId: z.string().min(1),
    name: z.string().trim().min(1).max(120),
    description: z.string().trim().max(2000).optional().nullable(),
    hourlyRate: z.number().nonnegative().max(10_000_000).optional().nullable(),
  })
  .strict();

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = ProjectCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
  }

  const client = await prisma.client.findFirst({
    where: { id: parsed.data.clientId, userId: auth.user.id },
    select: { id: true },
  });
  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  try {
    const project = await prisma.project.create({ data: parsed.data });
    return NextResponse.json({ project });
  } catch (err) {
    return prismaErrorResponse(err, "project.create") ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
