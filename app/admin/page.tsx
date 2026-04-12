import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import AdminLayout from '@/components/admin/AdminLayout/AdminLayout'
import StatCard from '@/components/admin/StatCard/StatCard'
import styles from './admin.module.css'

export default async function AdminDashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/admin/login')
  }

  const user = {
    name: session.user.name || 'Admin',
    role: (session.user as { role?: string }).role || 'admin',
  }

  return (
    <AdminLayout
      user={user}
      pageTitle="Dashboard"
      pageDescription="Quick access to all management tools."
    >
      <div className={styles.stack}>
        <section className={styles.quickLinksGrid}>
          <Link href="/admin/listings" className={styles.quickLink}>
            <span className={styles.quickIcon}>🏠</span>
            <div className={styles.quickContent}>
              <span className={styles.quickTitle}>Listings</span>
              <span className={styles.quickMeta}>Manage properties</span>
            </div>
            <span className={styles.quickArrow}>→</span>
          </Link>

          <Link href="/admin/clients" className={styles.quickLink}>
            <span className={styles.quickIcon}>👥</span>
            <div className={styles.quickContent}>
              <span className={styles.quickTitle}>Clients</span>
              <span className={styles.quickMeta}>Manage leads & contacts</span>
            </div>
            <span className={styles.quickArrow}>→</span>
          </Link>

          <Link href="/admin/deals" className={styles.quickLink}>
            <span className={styles.quickIcon}>💰</span>
            <div className={styles.quickContent}>
              <span className={styles.quickTitle}>Deals</span>
              <span className={styles.quickMeta}>Track commissions</span>
            </div>
            <span className={styles.quickArrow}>→</span>
          </Link>

          <Link href="/admin/areas" className={styles.quickLink}>
            <span className={styles.quickIcon}>📍</span>
            <div className={styles.quickContent}>
              <span className={styles.quickTitle}>Areas</span>
              <span className={styles.quickMeta}>Manage locations</span>
            </div>
            <span className={styles.quickArrow}>→</span>
          </Link>

          <Link href="/admin/users" className={styles.quickLink}>
            <span className={styles.quickIcon}>👤</span>
            <div className={styles.quickContent}>
              <span className={styles.quickTitle}>Users</span>
              <span className={styles.quickMeta}>Manage team members</span>
            </div>
            <span className={styles.quickArrow}>→</span>
          </Link>
        </section>

      </div>
    </AdminLayout>
  )
}
