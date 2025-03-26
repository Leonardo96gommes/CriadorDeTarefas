"use client"

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm mb-4">
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-xs underline mt-2">
          Tentar novamente
        </button>
      )}
    </div>
  )
}

