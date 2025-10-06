export default function TextInput({ label, type='text', ...props }) {
  return (
    <label className="block">
      {label && <div className="mb-1 text-xs font-medium text-slate-300">{label}</div>}
      <input
        type={type}
        className="w-full rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2 text-slate-100
                   outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400/40 transition"
        {...props}
      />
    </label>
  )
}
