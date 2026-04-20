import { cn } from "@/lib/utils";

const statusMap: Record<string, string> = {
  DRAFT: "pill-draft",
  SENT: "pill-sent",
  VIEWED: "pill-viewed",
  PAID: "pill-paid",
  OVERDUE: "pill-overdue",
  CANCELLED: "pill-cancelled",
};

const labelMap: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  VIEWED: "Viewed",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const cls = statusMap[status] ?? "pill-draft";
  const label = labelMap[status] ?? status.toLowerCase();
  return <span className={cn("pill", cls, className)}>{label}</span>;
}
