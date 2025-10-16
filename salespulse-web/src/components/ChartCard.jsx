export default function ChartCard({ title, right, children }) {
  return (
    <div className="card pad interactive">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between', marginBottom:12}}>
        <h3 style={{margin:0, fontWeight:800, color:'#111'}}>{title}</h3>
        {right}
      </div>
      <div style={{height:320}}>
        {children}
      </div>
    </div>
  );
}
