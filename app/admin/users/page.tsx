import AdminLayout from '@/components/admin/AdminLayout/AdminLayout'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import styles from '../admin.module.css'

export default async function AdminUsersPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/admin/login')
  }

  const user = {
    name: session.user.name || 'Admin',
    role: (session.user as { role?: string }).role || 'admin',
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <AdminLayout
      user={user}
      pageTitle="Users"
      pageDescription="System users."
    >
      <div className={styles.stack}>
        <section className={styles.recordList}>
          {users.map((systemUser) => (
            <article key={systemUser.id} className={styles.recordCard}>
              <div className={styles.recordTop}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {systemUser.image && (
                    <img 
                      src={systemUser.image} 
                      alt={systemUser.name}
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <div>
                    <h2 className={styles.recordTitle}>{systemUser.name}</h2>
                    <p className={styles.recordSubtle}>{systemUser.email}</p>
                  </div>
                </div>
                <span className={`${styles.pill} ${styles.active}`}>active</span>
              </div>
              <p className={styles.recordMeta}>{systemUser.role}</p>
            </article>
          ))}
        </section>
      </div>
    </AdminLayout>
  )
}
