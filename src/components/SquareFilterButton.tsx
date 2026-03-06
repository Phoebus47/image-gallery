import { LABELS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export interface SquareFilterButtonProps {
  squareFilter: boolean;
  onSquareFilterClick: () => void;
}

export function SquareFilterButton({
  squareFilter,
  onSquareFilterClick,
}: Readonly<SquareFilterButtonProps>) {
  return (
    <button
      type="button"
      onClick={onSquareFilterClick}
      aria-pressed={squareFilter}
      aria-label={LABELS.ariaSquareFilter}
      title={LABELS.titleSquareFilter}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg cursor-pointer',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        squareFilter
          ? 'bg-accent text-white'
          : 'text-text-tertiary hover:bg-accent-subtle hover:text-accent',
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="12"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M5.5 8h5M8 5.5v5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
