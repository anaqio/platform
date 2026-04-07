import { cn } from "@/lib/utils/cn";
import type { WaitlistStatus } from "@/types/database";

const statusConfig: Record<
  WaitlistStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-status-pending/15 text-status-pending border-status-pending/30",
  },
  invited: {
    label: "Invited",
    className: "bg-status-invited/15 text-status-invited border-status-invited/30",
  },
  active: {
    label: "Active",
    className: "bg-status-active/15 text-status-active border-status-active/30",
  },
  unsubscribed: {
    label: "Unsubscribed",
    className: "bg-status-unsubscribed/15 text-status-unsubscribed border-status-unsubscribed/30",
  },
};

export function WaitlistStatusBadge({ status }: { status: WaitlistStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
