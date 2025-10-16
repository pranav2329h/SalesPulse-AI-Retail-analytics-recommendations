import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export default function Products() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => (await api.get("/products")).data,
  });

  return (
    <div className="card pad">
      <h3 className="h2">Products</h3>
      <p className="muted">Product analytics and inventory.</p>

      {isLoading && <div className="muted">Loading…</div>}
      {error && <div style={{ color: "#b91c1c" }}>Failed to load products.</div>}
      {Array.isArray(data) && data.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table className="table">
            <thead>
              <tr>
                <th>SKU</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id}>
                  <td>{p.sku}</td>
                  <td>{p.name}</td>
                  <td>{p.category || "-"}</td>
                  <td>₹{Number(p.price).toLocaleString()}</td>
                  <td>{p.stock_qty ?? p.stockQty ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {Array.isArray(data) && data.length === 0 && <div className="muted">No products.</div>}
    </div>
  );
}
