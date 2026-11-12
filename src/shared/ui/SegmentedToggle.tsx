export type ToggleOption<T extends string> = {
  value: T
  label: string
}

type SegmentedToggleProps<T extends string> = {
  label: string // accessible name of the group, from i18n (e.g. "Idioma")
  options: readonly ToggleOption<T>[]
  value: T
  onChange: (value: T) => void
}

// Group of buttons where exactly one is selected (body: Luna/Marte, language: ES/EN).
// aria-pressed tells screen readers which one is on, and the styles read that same attribute.
export function SegmentedToggle<T extends string>({ label, options, value, onChange }: SegmentedToggleProps<T>) {
  return (
    <div role="group" aria-label={label} className="inline-flex w-fit rounded-chip border border-muted text-caption">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className="px-2.5 py-1.25 text-muted first:rounded-l-chip last:rounded-r-chip aria-pressed:bg-surface-2 aria-pressed:font-semibold aria-pressed:text-foreground"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
