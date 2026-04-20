import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-helpers";
import { TimeEntryCreateSchema, zodErrorMessage } from "@/lib/validators";
import { prismaErrorResponse } from "@/lib/prisma-errors";

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  try {
    const entries = await prisma.timeEntry.findMany({
      where: { userId: auth.user.id },
      include: { project: { include: { client: true } } },
      orderBy: { startTime: "desc" },
    });
    return NextResponse.json({ entries });
  } catch (err) {
    return prismaErrorResponse(err, "time.list") ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = TimeEntryCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: zodErrorMessage(parsed.error) }, { status: 400 });
  }

  const { projectId, description, startTime, endTime, duration, billable } = parsed.data;

  const project = await prisma.project.findFirst({
    where: { id: projectId, client: { userId: auth.user.id } },
    select: { id: true },
  });
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  try {
    const entry = await prisma.timeEntry.create({
      data: {
        userId: auth.user.id,
        projectId,
        description: description ?? null,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        duration: duration ?? null,
        billable,
      },
      include: { project: true },
    });
    return NextResponse.json({ entry });
  } catch (err) {
    return prismaErrorResponse(err, "time.create") ?? NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
