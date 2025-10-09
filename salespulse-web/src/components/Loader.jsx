export default function Loader({ size = 28 }) {
  return (
    <div
      className="mx-auto animate-spin rounded-full border-2 border-slate-500/50 border-t-transparent"
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}
