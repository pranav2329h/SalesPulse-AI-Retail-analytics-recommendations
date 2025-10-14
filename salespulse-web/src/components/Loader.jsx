export default function Loader({ size=24 }) {
  return <div className="spinner" style={{ width:size, height:size }} aria-label="Loading"/>;
}
