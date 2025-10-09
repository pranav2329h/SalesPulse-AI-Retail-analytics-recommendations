import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ show = false, title = "SalesPulse AI" }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-[radial-gradient(1000px_600px_at_20%_10%,rgba(59,130,246,.15),transparent_60%),radial-gradient(1000px_600px_at_100%_10%,rgba(139,92,246,.12),transparent_60%),linear-gradient(180deg,#0b1020,#111827)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex flex-col items-center gap-4">
            {/* Logo orb */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="grid h-16 w-16 place-items-center rounded-2xl"
              style={{
                background:
                  "conic-gradient(from 180deg at 50% 50%, #60a5fa, #8b5cf6, #60a5fa)",
                filter: "drop-shadow(0 0 24px rgba(99,102,241,.45))",
              }}
            >
              <div className="h-10 w-10 rounded-xl bg-black/30 backdrop-blur" />
            </motion.div>

            <div className="text-center">
              <div className="text-lg font-semibold text-white">{title}</div>
              <div className="mt-1 text-xs text-slate-400">Warming up the dashboard…</div>
            </div>

            {/* Spinner */}
            <div
              className="mt-1 h-6 w-6 animate-spin rounded-full border-2 border-slate-400/50 border-t-transparent"
              aria-label="Loading"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
