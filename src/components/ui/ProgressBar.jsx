import './ProgressBar.css';

export default function ProgressBar({ value = 0, max = 100, color = 'var(--accent-primary)', height = 8 }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="progress-bar-wrap" style={{ height: `${height}px` }}>
      <div 
        className="progress-bar-fill" 
        style={{ width: `${percent}%`, backgroundColor: color }} 
      />
    </div>
  );
}
