import React from "react"

function classNames(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(" ")
}

interface LoadingProps {
    variant?: "spinner" | "dots" | "pulse" | "skeleton" | "progress"
    size?: "sm" | "md" | "lg"
    className?: string
    text?: string
    progress?: number
}

export function Loading({ variant = "spinner", size = "md", className, text, progress = 0 }: LoadingProps) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
    }

    const textSizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    }

    if (variant === "spinner") {
        return (
            <div className={classNames("flex flex-col items-center gap-2", className)}>
                <div
                    className={classNames(
                        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
                        sizeClasses[size],
                    )}
                />
                {text && <p className={classNames("text-muted-foreground", textSizeClasses[size])}>{text}</p>}
            </div>
        )
    }

    if (variant === "dots") {
        return (
            <div className={classNames("flex flex-col items-center gap-2", className)}>
                <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={classNames(
                                "bg-blue-600 rounded-full animate-pulse",
                                size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4",
                            )}
                            style={{
                                animationDelay: `${i * 0.2}s`,
                                animationDuration: "1s",
                            }}
                        />
                    ))}
                </div>
                {text && <p className={classNames("text-muted-foreground", textSizeClasses[size])}>{text}</p>}
            </div>
        )
    }

    if (variant === "pulse") {
        return (
            <div className={classNames("flex flex-col items-center gap-2", className)}>
                <div className={classNames("bg-blue-600 rounded-full animate-pulse", sizeClasses[size])} />
                {text && <p className={classNames("text-muted-foreground animate-pulse", textSizeClasses[size])}>{text}</p>}
            </div>
        )
    }

    if (variant === "skeleton") {
        return (
            <div className={classNames("space-y-3", className)}>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
                {text && <p className={classNames("text-muted-foreground", textSizeClasses[size])}>{text}</p>}
            </div>
        )
    }

    if (variant === "progress") {
        return (
            <div className={classNames("w-full max-w-md", className)}>
                <div className="flex justify-between items-center mb-2">
                    {text && <p className={classNames("text-muted-foreground", textSizeClasses[size])}>{text}</p>}
                    <span className={classNames("text-muted-foreground", textSizeClasses[size])}>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                </div>
            </div>
        )
    }

    return null
}
//
// // Loading Overlay Component
// interface LoadingOverlayProps {
//     isLoading: boolean
//     children: React.ReactNode
//     loadingComponent?: React.ReactNode
//     className?: string
// }
//
// export function LoadingOverlay({ isLoading, children, loadingComponent, className }: LoadingOverlayProps) {
//     return (
//         <div className={classNames("relative", className)}>
//             {children}
//             {isLoading && (
//                 <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
//                     {loadingComponent || <Loading variant="spinner" size="lg" text="Đang tải..." />}
//                 </div>
//             )}
//         </div>
//     )
// }
