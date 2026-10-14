interface ProgressBarProps {
  percent: number;
}

export function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div className="progress-bar-outer">
      <div className="progress-bar-inner" style={{ width: `${percent}%` }} />
    </div>
  );
}
