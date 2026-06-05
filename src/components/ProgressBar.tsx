interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium text-sky-800">{label}</span>
          <span className="font-semibold text-teal-700">
            {current} / {total} · {percent}%
          </span>
        </div>
      )}
      <div className="h-3 overflow-hidden rounded-full bg-sky-100 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-teal-500 transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
