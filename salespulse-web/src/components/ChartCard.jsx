export default function ChartCard({ title, children, right }) {
  return (
    <div className="card pad">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <h3 className="h3" style={{margin:0, fontWeight:700}}>{title}</h3>
        {right}
      </div>
      <div className="chart-body">
        {children}
      </div>
    </div>
  )
}
