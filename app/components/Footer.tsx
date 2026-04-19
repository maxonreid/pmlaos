import Link from 'next/link'
import { useTranslations } from 'next-intl'
import styles from './Footer.module.css'

interface Props {
  locale: string
}

export default function Footer({ locale }: Props) {
  const t = useTranslations('footer')
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <h3 className={styles.brandName}>PM Real Estate</h3>
            <p className={styles.tagline}>{t('tagline')}</p>
            <div className={styles.socialRow}>
              <a
                href="https://www.facebook.com/PMLaos/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={`${t('followUs')} on Facebook`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                </svg>
                <span className={styles.socialLabel}>{t('followUs')}</span>
              </a>
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>{t('quickLinks')}</h4>
            <ul className={styles.links}>
              <li>
                <Link href={`/${locale}/listings`} className={styles.link}>
                  {t('listings')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className={styles.link}>
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className={styles.link}>
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>{t('contactTitle')}</h4>
            <div className={styles.contactInfo}>
              <p className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <span>{t('address')}</span>
              </p>
              <p className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <span>+856 20 99 935 869</span>
              </p>
              <p className={styles.contactItem}>
                <span className={styles.contactIcon}>✉️</span>
                <a href="mailto:contact@pmlaos.com" className={styles.emailLink}>
                  contact@PMLaos.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {currentYear} PM Real Estate. {t('copyright')}
          </p>
          <Link href={`/${locale}/admin/login`} className={styles.staffLink}>
            {t('staffLogin')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
