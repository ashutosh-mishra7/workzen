import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading,
}) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="
            relative w-full max-w-md
            rounded-xl border
            bg-[#111827]
            border-[#374151]
            shadow-2xl
            px-6 py-6
          "
        >
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1F2937] border border-[#374151]">
              <AlertTriangle size={18} className="text-red-500" />
            </div>

            <div className="flex-1">
              <h3 className="text-base font-semibold text-[#F9FAFB] mb-1">
                {title}
              </h3>
              <p className="text-sm text-[#9CA3AF] leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="
                px-4 py-2.5
                text-sm font-medium
                rounded-lg
                border border-[#374151]
                text-[#9CA3AF]
                bg-transparent
                hover:bg-[#1F2937]
                hover:text-[#F9FAFB]
                transition-colors duration-150
              "
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              disabled={loading}
              className="
                px-4 py-2.5
                text-sm font-semibold
                rounded-lg
                bg-red-500
                text-white
                hover:bg-red-600
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors duration-150
              "
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default ConfirmModal;