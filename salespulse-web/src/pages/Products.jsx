import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'

export default function Products() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => (await api.get('/products?take=20')).data
  })

  if (isLoading) return <div className="text-slate-400">Loading…</div>

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="mb-4 text-sm font-medium text-slate-300">Products</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">SKU</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4 text-right">Price</th>
              <th className="py-2 pr-0 text-right">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.items?.map(p => (
              <tr key={p.id}>
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
    </div>
  )
}
