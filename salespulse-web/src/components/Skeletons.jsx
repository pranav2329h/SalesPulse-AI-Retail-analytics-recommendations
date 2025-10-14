export function SkeletonCard({ lines = 6 }) {
  return (
    <div className="card pad">
      <div className="skel" style={{height:18, width:160, marginBottom:12}} />
      <div style={{display:'grid', gap:8}}>
        {Array.from({length: lines}).map((_,i)=>
          <div key={i} className="skel" style={{height:12, width: '100%'}} />
        )}
      </div>
    </div>
  )
}

export function SkeletonTable({ rows=8 }) {
  return (
    <div className="card pad">
      <div className="skel" style={{height:18, width:220, marginBottom:12}} />
      <div style={{display:'grid', gap:12}}>
        {Array.from({length: rows}).map((_,i)=>
          <div key={i} className="skel" style={{height:20, width:'100%'}} />
        )}
      </div>
    </div>
  )
}
