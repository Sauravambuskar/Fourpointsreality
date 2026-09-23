export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <span className={`arrow-icon ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M4 12 12 4M6 4h6v6" />
      </svg>
    </span>
  );
}
