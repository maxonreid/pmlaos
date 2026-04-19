'use client'

import { useState } from 'react'

type Option = { value: string; label: string }

type Props = {
  initialAmenities: string[]
  options: Option[]
  styles: {
    amenityChips: string
    amenityChip: string
    amenityChipActive: string
  }
}

export default function AmenityFilters({ initialAmenities, options, styles }: Props) {
  const [pending, setPending] = useState<string[]>(initialAmenities)

  function toggle(value: string) {
    setPending(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  return (
    <div className={styles.amenityChips}>
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={`${styles.amenityChip} ${pending.includes(value) ? styles.amenityChipActive : ''}`}
          onClick={() => toggle(value)}
        >
          {label}
        </button>
      ))}
      {pending.map(v => (
        <input key={v} type="hidden" name="amenities" value={v} />
      ))}
    </div>
  )
}
