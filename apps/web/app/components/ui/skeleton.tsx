import { cn } from "~/lib/utils"

interface SkeletonProps {
  className?: string
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse rounded-md bg-foreground/10", className)} />
  )
}

export { Skeleton }
