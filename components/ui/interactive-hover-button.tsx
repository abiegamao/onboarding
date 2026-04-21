import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export function InteractiveHoverButton({
    children,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                "group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-card p-2 px-6 text-center font-semibold transition-all duration-300",
                className
            )}
            {...props}
        >
            <div className="flex items-center justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:scale-[100.8]"></div>
                <span className="inline-block transition-all duration-300 group-hover:translate-x-4 group-hover:opacity-0">
                    {children}
                </span>
            </div>
            <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:opacity-100">
                <span className="translate-x-0 transition-all duration-300 group-hover:translate-x-0">
                    {children}
                </span>
                <ArrowRight className="h-4 w-4" />
            </div>
        </button>
    )
}
