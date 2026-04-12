import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from '@/components/admin/StatCard/StatCard'

describe('StatCard Component', () => {
  const defaultIcon = (
    <svg data-testid="test-icon">
      <circle cx="12" cy="12" r="10" />
    </svg>
  )

  it('should render basic stat card with label and value', () => {
    render(
      <StatCard
        label="Total Listings"
        value={42}
        icon={defaultIcon}
      />
    )

    expect(screen.getByText('Total Listings')).toBeTruthy()
    expect(screen.getByText('42')).toBeTruthy()
    expect(screen.getByTestId('test-icon')).toBeTruthy()
  })

  it('should render string value', () => {
    render(
      <StatCard
        label="Status"
        value="Active"
        icon={defaultIcon}
      />
    )

    expect(screen.getByText('Status')).toBeTruthy()
    expect(screen.getByText('Active')).toBeTruthy()
  })

  it('should render with primary variant by default', () => {
    const { container } = render(
      <StatCard
        label="Test"
        value={100}
        icon={defaultIcon}
      />
    )

    const iconWrapper = container.querySelector('[class*="iconWrapper"]')
    expect(iconWrapper?.className).toContain('primary')
  })

  it('should render with accent variant', () => {
    const { container } = render(
      <StatCard
        label="Test"
        value={100}
        icon={defaultIcon}
        variant="accent"
      />
    )

    const iconWrapper = container.querySelector('[class*="iconWrapper"]')
    expect(iconWrapper?.className).toContain('accent')
  })

  it('should render with success variant', () => {
    const { container } = render(
      <StatCard
        label="Test"
        value={100}
        icon={defaultIcon}
        variant="success"
      />
    )

    const iconWrapper = container.querySelector('[class*="iconWrapper"]')
    expect(iconWrapper?.className).toContain('success')
  })

  it('should render with danger variant', () => {
    const { container } = render(
      <StatCard
        label="Test"
        value={100}
        icon={defaultIcon}
        variant="danger"
      />
    )

    const iconWrapper = container.querySelector('[class*="iconWrapper"]')
    expect(iconWrapper?.className).toContain('danger')
  })

  it('should render without change indicator', () => {
    render(
      <StatCard
        label="Test"
        value={100}
        icon={defaultIcon}
      />
    )

    const changeElement = screen.queryByText(/↑|↓/)
    expect(changeElement).toBeFalsy()
  })

  it('should render positive change indicator', () => {
    render(
      <StatCard
        label="Test"
        value={100}
        icon={defaultIcon}
        change={{ value: '+12%', type: 'positive' }}
      />
    )

    expect(screen.getByText('↑')).toBeTruthy()
    expect(screen.getByText('+12%')).toBeTruthy()
  })

  it('should render negative change indicator', () => {
    render(
      <StatCard
        label="Test"
        value={100}
        icon={defaultIcon}
        change={{ value: '-5%', type: 'negative' }}
      />
    )

    expect(screen.getByText('↓')).toBeTruthy()
    expect(screen.getByText('-5%')).toBeTruthy()
  })

  it('should render neutral change without arrow', () => {
    const { container } = render(
      <StatCard
        label="Test"
        value={100}
        icon={defaultIcon}
        change={{ value: '0%', type: 'neutral' }}
      />
    )

    expect(screen.getByText('0%')).toBeTruthy()
    expect(screen.queryByText('↑')).toBeFalsy()
    expect(screen.queryByText('↓')).toBeFalsy()

    const changeElement = container.querySelector('[class*="neutral"]')
    expect(changeElement).toBeTruthy()
  })

  it('should apply correct CSS class for positive change', () => {
    const { container } = render(
      <StatCard
        label="Test"
        value={100}
        icon={defaultIcon}
        change={{ value: '+15%', type: 'positive' }}
      />
    )

    const changeElement = container.querySelector('[class*="positive"]')
    expect(changeElement).toBeTruthy()
  })

  it('should apply correct CSS class for negative change', () => {
    const { container } = render(
      <StatCard
        label="Test"
        value={100}
        icon={defaultIcon}
        change={{ value: '-8%', type: 'negative' }}
      />
    )

    const changeElement = container.querySelector('[class*="negative"]')
    expect(changeElement).toBeTruthy()
  })
})
