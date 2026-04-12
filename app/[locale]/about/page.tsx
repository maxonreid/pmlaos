import { getTranslations, setRequestLocale } from 'next-intl/server'
import Image from 'next/image'
import styles from './page.module.css'

const team = [
  {
    name: 'Ping Silavong',
    role: 'Real Estate Agent',
    photo: '/img/team/ping-silavong.jpg',
    bio: 'Ping is a local real estate agent based in Vientiane, specializing in helping clients find houses, apartments, and land for sale or rent. She works closely with each client to understand their needs and provide honest guidance throughout the process. Her focus is on building trust and making every transaction simple and smooth.',
  },
  {
    name: 'Maximiliano Brito Torres',
    role: 'Technology & Web Development',
    photo: '/img/team/maximiliano-brito-torres.jpg',
    bio: 'Maximiliano is responsible for the technology behind the platform, ensuring a modern and efficient property search experience. He develops and manages the website, helping clients easily browse listings, access information, and connect quickly and easily. His goal is to bring a more transparent and professional approach to real estate.',
  },
]

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>{t('title')}</h1>
          <p className={styles.heroSubtitle}>{t('subtitle')}</p>
        </div>
      </section>

      {/* Intro */}
      <section className={styles.section}>
        <div className={`${styles.container} ${styles.introWrap}`}>
          <p className={styles.intro}>{t('introP1')}</p>
          <p className={styles.intro}>{t('introP2')}</p>
        </div>
      </section>

      {/* Why choose us */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>{t('whyTitle')}</h2>
          <div className={styles.whyGrid}>
            {([
              { icon: '📍', title: t('why1Title'), desc: t('why1Desc') },
              { icon: '🤝', title: t('why2Title'), desc: t('why2Desc') },
              { icon: '🌐', title: t('why3Title'), desc: t('why3Desc') },
            ] as const).map(({ icon, title, desc }) => (
              <div key={title} className={styles.whyCard}>
                <span className={styles.whyIcon}>{icon}</span>
                <h3 className={styles.whyTitle}>{title}</h3>
                <p className={styles.whyDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Meet the Team</h2>
          <div className={styles.teamGrid}>
            {team.map(({ name, role, photo, bio }) => (
              <div key={name} className={styles.teamCard}>
                <div className={styles.teamPhoto}>
                  <Image src={photo} alt={name} fill style={{ objectFit: 'cover' }} />
                </div>
                <h3 className={styles.teamName}>{name}</h3>
                <p className={styles.teamRole}>{role}</p>
                <p className={styles.teamBio}>{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
