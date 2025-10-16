import { useEffect, useRef, useState } from "react";

/**
 * Wrap any block to animate it in when it enters viewport.
 * Props:
 *  - mode: "fade-up" | "zoom-in" (default: "fade-up")
 *  - delay: number ms (default 0)
 *  - duration: number ms (default 520)
 */
export default function Reveal({ children, mode = "fade-up", delay = 0, duration = 520 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${mode} ${inView ? "in" : ""}`}
      style={{ transitionDuration: `${duration}ms`, transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
