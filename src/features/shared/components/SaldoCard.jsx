export default function SaldoCard({ titulo, valor, color }) {
  return (
    <div className={`rounded-2xl p-6 shadow-md text-white ${color}`}>
      <p className="text-sm font-medium opacity-80">{titulo}</p>
      <p className="text-3xl font-bold mt-2">{valor}</p>
    </div>
  )
}
