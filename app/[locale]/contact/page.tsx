import { getTranslations, setRequestLocale } from 'next-intl/server'
import WhatsAppButton from '@/components/public/WhatsAppButton/WhatsAppButton'
import LocationMap from '@/components/public/LocationMap/LocationMap'
import styles from './page.module.css'

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>{t('contact.title')}</h1>
          <p className={styles.heroSubtitle}>{t('contact.intro')}</p>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.container}>
          <div className={styles.layout}>
            <div className={styles.infoBlock}>
              <h2 className={styles.infoTitle}>{t('contact.officeTitle')}</h2>
              <p className={styles.address}>
                {t('contact.officeAddress').split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            </div>

            <div className={styles.infoBlock}>
              <h2 className={styles.infoTitle}>{t('contact.whatsappLabel')}</h2>
              <WhatsAppButton label={t('listing.whatsapp')} />
            </div>

            <div className={styles.infoBlock}>
              <h2 className={styles.infoTitle}>{t('contact.emailLabel')}</h2>
              <a href="mailto:contact@pmlaos.com" className={styles.emailLink}>
                contact@PMLaos.com
              </a>
            </div>

            <div className={styles.infoBlock}>
              <h2 className={styles.infoTitle}>{t('contact.facebookLabel')}</h2>
              <a
                href="https://www.facebook.com/PMLaos/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.facebookLink}
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
                PMLaos
              </a>
            </div>
          </div>

          <div className={styles.mapSection}>
            <h2 className={styles.mapTitle}>{t('contact.mapTitle')}</h2>
            <LocationMap latitude={17.9757} longitude={102.6331} />
          </div>
        </div>
      </div>
    </div>
  )
}
