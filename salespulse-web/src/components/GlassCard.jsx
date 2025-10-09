import { motion } from "framer-motion";

export default function GlassCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: .985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: .35, ease: "easeOut" }}
      className={`glass-card ${className}`}
    >
      {children}
    </motion.div>
  );
}
