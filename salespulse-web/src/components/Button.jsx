export default function Button({ as:Comp='button', className='', children, ...props }) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium " +
               "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md " +
               "hover:brightness-110 active:brightness-95 transition-transform duration-150 active:scale-95";
  return <Comp className={`${base} ${className}`} {...props}>{children}</Comp>
}
