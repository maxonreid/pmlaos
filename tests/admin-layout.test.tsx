import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

describe('AdminLayout Component', () => {
  const defaultProps = {
    user: {
      name: 'John Doe',
      role: 'admin',
    },
    pageTitle: 'Test Page',
    pageDescription: 'Test description',
    children: <div data-testid="child-content">Child Content</div>,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.matchMedia
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

  it('should render the layout with user information', () => {
    render(<AdminLayout {...defaultProps} />)

    expect(screen.getByText('John Doe')).toBeTruthy()
    expect(screen.getByText('admin')).toBeTruthy()
  })

  it('should render page title and description', () => {
    render(<AdminLayout {...defaultProps} />)

    expect(screen.getByText('Test Page')).toBeTruthy()
    expect(screen.getByText('Test description')).toBeTruthy()
  })

  it('should render children content', () => {
    render(<AdminLayout {...defaultProps} />)

    expect(screen.getByTestId('child-content')).toBeTruthy()
  })

  it('should render all navigation links', () => {
    const { container } = render(<AdminLayout {...defaultProps} />)

    const dashboardLink = container.querySelector('a[href="/admin"]')
    const listingsLink = container.querySelector('a[href="/admin/listings"]')
    const clientsLink = container.querySelector('a[href="/admin/clients"]')
    const dealsLink = container.querySelector('a[href="/admin/deals"]')
    const usersLink = container.querySelector('a[href="/admin/users"]')

    expect(dashboardLink).toBeTruthy()
    expect(listingsLink).toBeTruthy()
    expect(clientsLink).toBeTruthy()
    expect(dealsLink).toBeTruthy()
    expect(usersLink).toBeTruthy()
  })

  it('should handle logout action', async () => {
    const { signOut } = await import('next-auth/react')
    const { useRouter } = await import('next/navigation')
    const mockPush = vi.fn()
    const mockRefresh = vi.fn()

    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    } as any)

    render(<AdminLayout {...defaultProps} />)

    const logoutButton = screen.getByLabelText('Logout')
    fireEvent.click(logoutButton)

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({ redirect: false })
      expect(mockPush).toHaveBeenCalledWith('/admin/login')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('should generate correct user initials', () => {
    render(<AdminLayout {...defaultProps} />)

    const avatar = screen.getByText('JD')
    expect(avatar).toBeTruthy()
  })

  it('should handle single name for initials', () => {
    const props = {
      ...defaultProps,
      user: { name: 'Admin', role: 'admin' },
    }

    render(<AdminLayout {...props} />)

    const avatar = screen.getByText('AD')
    expect(avatar).toBeTruthy()
  })

  it('should highlight active route', () => {
    const { usePathname } = require('next/navigation')
    vi.mocked(usePathname).mockReturnValue('/admin/clients')

    const { container } = render(<AdminLayout {...defaultProps} />)

    const clientsLink = container.querySelector('a[href="/admin/clients"]')
    expect(clientsLink?.className).toContain('active')
  })

  it('should render without page description', () => {
    const props = {
      ...defaultProps,
      pageDescription: undefined,
    }

    render(<AdminLayout {...props} />)

    expect(screen.getByText('Test Page')).toBeTruthy()
    expect(screen.queryByText('Test description')).toBeFalsy()
  })

  it('should render mobile navigation', () => {
    const { container } = render(<AdminLayout {...defaultProps} />)

    const mobileNav = container.querySelector('[aria-label="Admin mobile navigation"]')
    expect(mobileNav).toBeTruthy()
  })

  it('should render logo and admin panel text', () => {
    render(<AdminLayout {...defaultProps} />)

    expect(screen.getByText('PM Real Estate')).toBeTruthy()
    expect(screen.getByText('Admin Panel')).toBeTruthy()
  })
})
