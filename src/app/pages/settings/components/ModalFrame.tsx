import { motion, AnimatePresence } from "framer-motion";

const proEase = [0.4, 0, 0.2, 1];

export function ModalFrame({ isOpen, onClose, title, subtitle, children }: any) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        transition={{ duration: 0.25, ease: proEase }}
                        className="relative w-full max-w-xl bg-c-secondary border border-white/5 rounded-[32px] overflow-hidden shadow-2xl"
                    >
                        <div className="p-8 pb-0">
                            <h2 className="text-xl font-black uppercase tracking-tighter text-c-text">{title}</h2>
                            {subtitle && <p className="text-[11px] font-bold text-c-text/30 uppercase tracking-widest mt-1">{subtitle}</p>}
                        </div>
                        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}