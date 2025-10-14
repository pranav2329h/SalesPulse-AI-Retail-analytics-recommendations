import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { SkeletonTable } from '../components/Skeletons'

export default function Products() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => (await api.get('/products?take=20')).data
  })

  if (isLoading) return <SkeletonTable rows={8} />
  if (error)     return <div className="card pad" style={{color:'var(--danger)'}}>Failed to load.</div>

  return (
    <div className="card pad">
      <h3 className="h3" style={{marginBottom:12}}>Products</h3>
      <div style={{overflowX:'auto'}}>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th style={{textAlign:'right'}}>Price</th>
              <th style={{textAlign:'right'}}>Stock</th>
            </tr>
          </thead>
          <tbody>
            {data.items?.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td style={{color:'var(--muted)'}}>{p.sku}</td>
                <td style={{color:'var(--muted)'}}>{p.category}</td>
                <td style={{textAlign:'right'}}>₹{Number(p.price).toLocaleString()}</td>
                <td style={{textAlign:'right'}}>{p.stock_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
