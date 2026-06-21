export default function EmptyState({ icon = '🔍', message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="text-sm text-center">{message}</p>
    </div>
  )
}
