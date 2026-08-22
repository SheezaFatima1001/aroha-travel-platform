export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-6">
      <p className="font-body text-stone/80">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="font-body text-sm px-5 py-2.5 rounded-full border border-stone/20 text-stone hover:border-amber hover:text-amber transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
