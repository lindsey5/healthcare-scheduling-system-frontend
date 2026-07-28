import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/utils";

type AnimatedModalProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
};

export default function Modal({ open, onClose, children, className = "" }: AnimatedModalProps) {
    return (
        <AnimatePresence>
        {open && (
            <motion.div
                className="min-h-screen fixed inset-0 flex items-center justify-center bg-black/70 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className={cn(
                        'w-full max-w-md',
                        className
                    )}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
}