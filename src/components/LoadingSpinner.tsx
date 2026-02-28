interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'fullscreen';
}

export default function LoadingSpinner({ size = 'md' }: Readonly<LoadingSpinnerProps>) {
  if (size === 'fullscreen') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const sizeClasses = size === 'sm' ? 'w-4 h-4 border-2' : 'w-8 h-8 border-4';

  return (
    <div
      className={`${sizeClasses} border-indigo-200 border-t-indigo-600 rounded-full animate-spin`}
    />
  );
}
