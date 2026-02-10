'use client'

interface SortFilterProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
  fileCount: number;
}

const sortOptions = [
  { value: 'A-Z', label: '🔤 A-Z' },
  { value: 'Z-A', label: '🔤 Z-A' },
  { value: 'Newest', label: '🕐 Newest' },
  { value: 'Oldest', label: '🕐 Oldest' },
  { value: 'Size', label: '📊 Size' },
]

export default function SortFilter({ currentSort, onSortChange, fileCount }: SortFilterProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <p className="text-sm text-text-secondary">
        <span className="text-text-primary font-semibold">{fileCount}</span> file{fileCount !== 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-2">
        <label className="text-xs text-text-muted">Sort:</label>
        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-surface-light border border-border-dark rounded-md px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:border-accent cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}