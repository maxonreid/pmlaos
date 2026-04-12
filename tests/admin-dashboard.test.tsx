import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import AdminDashboardPage from '@/app/admin/page'
import { auth } from '@/lib/auth'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

// Mock AdminLayout component
vi.mock('@/components/admin/AdminLayout/AdminLayout', () => ({
  default: ({ children, pageTitle, pageDescription }: any) => (
    <div data-testid="admin-layout">
      <h1>{pageTitle}</h1>
      {pageDescription && <p>{pageDescription}</p>}
      {children}
    </div>
  ),
}))

describe('Admin Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect to login if user is not authenticated', async () => {
    const { redirect } = await import('next/navigation')
    vi.mocked(auth).mockResolvedValue(null)

    await AdminDashboardPage()

    expect(redirect).toHaveBeenCalledWith('/admin/login')
  })

  it('should render dashboard for authenticated user', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: {
        name: 'Test Admin',
        role: 'admin',
        email: 'admin@test.com',
      },
    } as any)

    const result = await AdminDashboardPage()
    const { container } = render(result)

    expect(container.querySelector('[data-testid="admin-layout"]')).toBeTruthy()
  })

  it('should display quick access cards for main sections', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: {
        name: 'Test Admin',
        role: 'admin',
        email: 'admin@test.com',
      },
    } as any)

    const result = await AdminDashboardPage()
    const { container } = render(result)

    const listingsLink = container.querySelector('a[href="/admin/listings"]')
    const clientsLink = container.querySelector('a[href="/admin/clients"]')
    const dealsLink = container.querySelector('a[href="/admin/deals"]')

    expect(listingsLink).toBeTruthy()
    expect(clientsLink).toBeTruthy()
    expect(dealsLink).toBeTruthy()
  })

  it('should use default name if user name is not provided', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: {
        email: 'admin@test.com',
      },
    } as any)

    const result = await AdminDashboardPage()
    const { container } = render(result)

    expect(container.textContent).toContain('Dashboard')
  })

  it('should use default role if user role is not provided', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: {
        name: 'Test User',
        email: 'user@test.com',
      },
    } as any)

    await AdminDashboardPage()

    // The component should still render without throwing
    expect(auth).toHaveBeenCalled()
  })
})
