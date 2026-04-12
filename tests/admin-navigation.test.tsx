import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import AdminLayout from '@/components/admin/AdminLayout/AdminLayout'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/admin'),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
}))

// Mock next-auth
vi.mock('next-auth/react', () => ({
  signOut: vi.fn(() => Promise.resolve()),
}))

describe('Admin Navigation Tests', () => {
  const defaultProps = {
    user: { name: 'Test User', role: 'admin' },
    pageTitle: 'Test',
    children: <div>Content</div>,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('should mark Dashboard as active when on /admin', () => {
    const { usePathname } = require('next/navigation')
    vi.mocked(usePathname).mockReturnValue('/admin')

    const { container } = render(<AdminLayout {...defaultProps} />)

    const dashboardLink = container.querySelector('a[href="/admin"]')
    expect(dashboardLink?.className).toContain('active')
  })

  it('should mark Listings as active when on /admin/listings', () => {
    const { usePathname } = require('next/navigation')
    vi.mocked(usePathname).mockReturnValue('/admin/listings')

    const { container } = render(<AdminLayout {...defaultProps} />)

    const listingsLink = container.querySelector('a[href="/admin/listings"]')
    expect(listingsLink?.className).toContain('active')
  })

  it('should mark Clients as active when on /admin/clients', () => {
    const { usePathname } = require('next/navigation')
    vi.mocked(usePathname).mockReturnValue('/admin/clients')

    const { container } = render(<AdminLayout {...defaultProps} />)

    const clientsLink = container.querySelector('a[href="/admin/clients"]')
    expect(clientsLink?.className).toContain('active')
  })

  it('should mark Deals as active when on /admin/deals', () => {
    const { usePathname } = require('next/navigation')
    vi.mocked(usePathname).mockReturnValue('/admin/deals')

    const { container } = render(<AdminLayout {...defaultProps} />)

    const dealsLink = container.querySelector('a[href="/admin/deals"]')
    expect(dealsLink?.className).toContain('active')
  })

  it('should mark Users as active when on /admin/users', () => {
    const { usePathname } = require('next/navigation')
    vi.mocked(usePathname).mockReturnValue('/admin/users')

    const { container } = render(<AdminLayout {...defaultProps} />)

    const usersLink = container.querySelector('a[href="/admin/users"]')
    expect(usersLink?.className).toContain('active')
  })

  it('should mark Listings as active on sub-routes', () => {
    const { usePathname } = require('next/navigation')
    vi.mocked(usePathname).mockReturnValue('/admin/listings/edit/123')

    const { container } = render(<AdminLayout {...defaultProps} />)

    const listingsLink = container.querySelector('a[href="/admin/listings"]')
    expect(listingsLink?.className).toContain('active')
  })

  it('should not mark Dashboard as active on other routes', () => {
    const { usePathname } = require('next/navigation')
    vi.mocked(usePathname).mockReturnValue('/admin/listings')

    const { container } = render(<AdminLayout {...defaultProps} />)

    const dashboardLink = container.querySelector('a[href="/admin"]')
    expect(dashboardLink?.className).not.toContain('active')
  })

  it('should have correct href attributes for all navigation items', () => {
    const { container } = render(<AdminLayout {...defaultProps} />)

    const expectedLinks = [
      '/admin',
      '/admin/listings',
      '/admin/clients',
      '/admin/deals',
      '/admin/users',
    ]

    expectedLinks.forEach(href => {
      const link = container.querySelector(`a[href="${href}"]`)
      expect(link).toBeTruthy()
    })
  })

  it('should render navigation icons for all items', () => {
    const { container } = render(<AdminLayout {...defaultProps} />)

    const icons = container.querySelectorAll('svg')
    expect(icons.length).toBeGreaterThan(0)
  })

  it('should have accessible navigation labels', () => {
    const { container } = render(<AdminLayout {...defaultProps} />)

    const mobileNav = container.querySelector('[aria-label="Admin mobile navigation"]')
    expect(mobileNav).toBeTruthy()
  })
})
