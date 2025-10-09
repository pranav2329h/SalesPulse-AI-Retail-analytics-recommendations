import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { SkeletonTable } from '../components/Skeletons'
import GlassCard from '../components/GlassCard'

export default function Products() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => (await api.get('/products?take=20')).data
  })

  if (isLoading) return <SkeletonTable rows={8} />
  if (error)     return <div className="glass-card p-5 text-red-400">Failed to load.</div>

  return (
    <GlassCard className="p-5">
      <h3 className="mb-4 text-base font-semibold text-slate-100">Products</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-300">
            <tr className="border-b border-white/10">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">SKU</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4 text-right">Price</th>
              <th className="py-2 pr-0 text-right">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.items?.map(p => (
              <tr key={p.id} className="hover:bg-white/5">
                <td className="py-2 pr-4">{p.name}</td>
                <td className="py-2 pr-4 text-slate-400">{p.sku}</td>
                <td className="py-2 pr-4 text-slate-400">{p.category}</td>
                <td className="py-2 pr-4 text-right">₹{Number(p.price).toLocaleString()}</td>
                <td className="py-2 pr-0 text-right">{p.stock_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
