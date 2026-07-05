import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "~/lib/utils"

const avatarVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold uppercase",
  {
    variants: {
      size: {
        sm: "size-6 text-[0.5rem]",
        md: "size-8 text-[0.625rem]",
        lg: "size-10 text-xs",
      },
      userRole: {
        none:     "",
        admin:    "outline-2 outline-offset-1 outline-role-admin-border",
        resident: "outline-2 outline-offset-1 outline-role-resident-ring",
      },
    },
    defaultVariants: { size: "md", userRole: "none" },
  }
)

interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  initials: string
  src?: string
}

function Avatar({ initials, src, size, userRole, className, ...props }: AvatarProps) {
  const hasSrc = !!src

  if (hasSrc) {
    return (
      <span
        data-slot="avatar"
        className={cn(avatarVariants({ size, userRole }), "overflow-hidden", className)}
        {...props}
      >
        <img src={src} alt={initials} className="h-full w-full object-cover" />
      </span>
    )
  }

  return (
    <span
      data-slot="avatar"
      className={cn(avatarVariants({ size, userRole }), className)}
      {...props}
    >
      {initials}
    </span>
  )
}

export { Avatar, avatarVariants }
export type { AvatarProps }
