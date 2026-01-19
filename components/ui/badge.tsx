import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "premium" | "protection" | "success"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-slate-100 text-slate-900",
      premium: "bg-amber-100 text-amber-800 border border-amber-300",
      protection: "bg-blue-100 text-blue-800 border border-blue-300",
  success: "bg-brand-100 text-brand-800 border border-brand-300"
    }
    
    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
