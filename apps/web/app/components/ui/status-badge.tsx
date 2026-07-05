import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-[0.04em] whitespace-nowrap",
  {
    variants: {
      variant: {
        pending:   "bg-status-pending text-status-pending-foreground",
        progress:  "bg-status-progress text-status-progress-foreground",
        done:      "bg-status-done text-status-done-foreground",
        overdue:   "bg-status-overdue text-status-overdue-foreground",
        cancelled: "bg-status-cancelled text-status-cancelled-foreground",
        admin:     "border border-role-admin-border bg-role-admin text-role-admin-foreground",
        resident:  "bg-role-resident text-role-resident-foreground",
        brand:     "bg-brand-subtle text-brand-subtle-foreground",
      },
    },
    defaultVariants: { variant: "pending" },
  }
)

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ variant, className, ...props }: StatusBadgeProps) {
  return (
    <span
      data-slot="status-badge"
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { StatusBadge, statusBadgeVariants }
export type { StatusBadgeProps }
