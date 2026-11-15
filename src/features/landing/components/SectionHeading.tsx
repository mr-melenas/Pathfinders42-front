type SectionHeadingProps = {
  id: string // the section's aria-labelledby points here
  eyebrow: string
  title: string
}

// Small orange label above each section title, as in the landing proposal
export function SectionHeading({ id, eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="flex max-w-3xl flex-col gap-3">
      <p className="font-mono text-data font-semibold tracking-widest text-accent uppercase">{eyebrow}</p>
      <h2 id={id} className="font-display text-section font-extrabold tracking-display text-balance">
        {title}
      </h2>
    </div>
  )
}
