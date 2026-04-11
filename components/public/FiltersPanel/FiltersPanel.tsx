'use client'

import { useState } from 'react'
import pageStyles from '@/app/[locale]/listings/page.module.css'

type Props = {
  initiallyOpen: boolean
  label: string
  activeCount?: number
  children: React.ReactNode
}

const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="11" y1="18" x2="13" y2="18" />
  </svg>
)

export default function FiltersPanel({ initiallyOpen, label, activeCount, children }: Props) {
  const [isOpen, setIsOpen] = useState(initiallyOpen)

  return (
    <details
      className={pageStyles.filterToggle}
      open={isOpen}
      onToggle={(event) => setIsOpen((event.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className={pageStyles.filterToggleSummary}>
        <FilterIcon />
        <span className={pageStyles.filterToggleLabel}>{label}</span>
        {activeCount != null && activeCount > 0 && (
          <span className={pageStyles.filterToggleBadge}>{activeCount}</span>
        )}
      </summary>

      {isOpen ? children : null}
    </details>
  )
}
