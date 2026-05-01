import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function NotFoundPage() {
  const locale = await getLocale()
  const t = await getTranslations('notFound')

  return (
    <div className="nf-container">
      <div className="nf-code">404</div>
      <h1 className="nf-title">{t('title')}</h1>
      <p className="nf-desc">{t('description')}</p>
      <div className="nf-actions">
        <Link href={`/${locale}/`} className="nf-primary">
          {t('home')}
        </Link>
        <Link href={`/${locale}/listings`} className="nf-secondary">
          {t('listings')}
        </Link>
      </div>
    </div>
  )
}
