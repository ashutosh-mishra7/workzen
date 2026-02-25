import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`
              relative w-full ${sizeClasses[size]}
              bg-[#111827]
              border border-[#374151]
              rounded-xl
              shadow-2xl
              overflow-hidden
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#374151]">
              <h2 className="text-base font-semibold text-[#F9FAFB]">
                {title}
              </h2>

              <button
                onClick={onClose}
                className="
                  flex items-center justify-center
                  w-8 h-8
                  rounded-lg
                  text-[#9CA3AF]
                  hover:bg-[#1F2937]
                  hover:text-[#F9FAFB]
                  transition-colors duration-150
                "
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 text-[#D1D5DB]">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;