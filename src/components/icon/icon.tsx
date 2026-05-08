import { motion } from "framer-motion";

export function Icon({
    src = "",
    size = "w-6 h-6",
    color = "bg-c-text",
    className = ""
}) {
    return (
        <div
            className={`${size} ${color} inline-block ${className}`}
            style={{
                WebkitMask: `url('${src}') no-repeat center / contain`,
                mask: `url('${src}') no-repeat center / contain`
            }}
        />
    );
}

export function LoadingSpinner({ size = "size-8", label }: { size?: string, label?: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className={`relative ${size}`}>
                {/* Background Ring (Static) */}
                <svg className="absolute inset-0 opacity-10" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>

                {/* Animated Spinner */}
                <motion.svg
                    className="absolute inset-0 text-c-brand"
                    viewBox="0 0 24 24"
                    fill="none"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                >
                    <motion.circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0.1, opacity: 0 }}
                        animate={{ pathLength: 0.4, opacity: 1 }}
                        // This transition creates the "breathing" line effect
                        transition={{
                            pathLength: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                            opacity: { duration: 0.2 }
                        }}
                    />
                </motion.svg>
            </div>
            {label && (
                <span className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase animate-pulse">
                    {label}
                </span>
            )}
        </div>
    );
}