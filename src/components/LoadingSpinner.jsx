export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mb-3" />
      <p className="text-sm">{text}</p>
    </div>
  )
}
