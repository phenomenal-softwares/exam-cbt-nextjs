export default function StatCard({ label, count }) {
  return (
    <div className="stat-card">
      <h3>{count}</h3>
      <p>{label}</p>
    </div>
  );
}
