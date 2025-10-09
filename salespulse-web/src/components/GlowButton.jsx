import { motion } from "framer-motion";

export default function GlowButton({ children, className = "", ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`btn ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
