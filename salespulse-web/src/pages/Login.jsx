import { motion } from "framer-motion";
import GlowButton from "../components/GlowButton";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign in</h2>

        <form className="space-y-4">
          <input className="input" type="email" placeholder="Email" />
          <input className="input" type="password" placeholder="Password" />
          <div className="text-center">
            <GlowButton type="submit">Login</GlowButton>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
