import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import GalleryViewer from '@/components/public/GalleryViewer/GalleryViewer'
import LocationMap from '@/components/shared/LocationMap/LocationMap'
import WhatsAppButton from '@/components/public/WhatsAppButton/WhatsAppButton'
import { getListingBySlug, getAllPublicSlugs, formatPrice } from '@/lib/listingsPublic'
import styles from './page.module.css'

export async function generateStaticParams() {
  const slugs = await getAllPublicSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations()

  const listing = await getListingBySlug(slug)
  if (!listing) notFound()

  const categoryKey = `listing.category${listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}` as
    | 'listing.categoryLand'
    | 'listing.categoryHouse'
    | 'listing.categoryApartment'
  const transactionKey = `listing.transaction${listing.transaction.charAt(0).toUpperCase() + listing.transaction.slice(1)}` as
    | 'listing.transactionSale'
    | 'listing.transactionRent'
  const categoryLabel = t(categoryKey)
  const transactionLabel = t(transactionKey)

  const statusKey = `listing.status${listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}` as
    | 'listing.statusAvailable'
    | 'listing.statusSold'
    | 'listing.statusRented'
  const statusLabel = listing.status !== 'hidden' ? t(statusKey) : null
  const primaryAreaSqm = listing.areaSqm

  const heroFacts = listing.category === 'land'
    ? [
        primaryAreaSqm ? { label: t('listing.area'), value: `${primaryAreaSqm} ${t('listing.sqm')}` } : null,
        listing.amenities.includes('road_frontage') ? { label: t('listing.highlights'), value: t('listing.amenityRoadFrontage') } : null,
        listing.amenities.includes('title_deed') ? { label: t('listing.documents'), value: t('listing.amenityTitleDeed') } : null,
      ].filter((item): item is { label: string; value: string } => item !== null)
    : [
        listing.bedrooms ? { label: t('listing.bedrooms'), value: String(listing.bedrooms) } : null,
        listing.bathrooms ? { label: t('listing.bathrooms'), value: String(listing.bathrooms) } : null,
        listing.parkingAvailable ? { label: t('listing.parking'), value: t('listing.parkingYes') } : null,
        primaryAreaSqm ? { label: t('listing.area'), value: `${primaryAreaSqm} ${t('listing.sqm')}` } : null,
      ].filter((item): item is { label: string; value: string } => item !== null)

  const keyFacts = [
    listing.category !== 'land' && listing.bedrooms
      ? { label: t('listing.bedrooms'), value: String(listing.bedrooms), icon: '🛏️' }
      : null,
    listing.category !== 'land' && listing.bathrooms
      ? { label: t('listing.bathrooms'), value: String(listing.bathrooms), icon: '🚿' }
      : null,
    listing.category !== 'land' && listing.parkingAvailable
      ? { label: t('listing.parking'), value: t('listing.parkingYes'), icon: '🚗' }
      : null,
    listing.category !== 'land' && listing.swimmingPool
      ? { label: t('listing.amenityPool'), value: t('listing.parkingYes'), icon: '🏊' }
      : null,
    listing.areaSqm
      ? { label: t('listing.area'), value: `${listing.areaSqm} ${t('listing.sqm')}`, icon: '📐' }
      : null,
    { label: t('listing.location'), value: listing.locationEn, icon: '📍' },
  ].filter((item): item is { label: string; value: string; icon: string } => item !== null)

  const amenityLabels: Record<string, { label: string; icon: string }> = {
    pool: { label: t('listing.amenityPool'), icon: '🏊' },
    gym: { label: t('listing.amenityGym'), icon: '💪' },
    garden: { label: t('listing.amenityGarden'), icon: '🌳' },
    security: { label: t('listing.amenitySecurity'), icon: '🔒' },
    balcony: { label: t('listing.amenityBalcony'), icon: '🏙️' },
    terrace: { label: t('listing.amenityTerrace'), icon: '🌅' },
    furnished: { label: t('listing.amenityFurnished'), icon: '🛋️' },
    pet_friendly: { label: t('listing.amenityPetFriendly'), icon: '🐾' },
    wifi: { label: t('listing.amenityWifi'), icon: '📶' },
    cleaning_service: { label: t('listing.amenityCleaningService'), icon: '🧹' },
    air_conditioning: { label: t('listing.amenityAirConditioning'), icon: '❄️' },
    parking: { label: t('listing.amenityParking'), icon: '🅿️' },
    garage: { label: t('listing.amenityGarage'), icon: '🚪' },
    smart_home: { label: t('listing.amenitySmartHome'), icon: '🏠' },
    river_view: { label: t('listing.amenityRiverView'), icon: '🌊' },
    office_space: { label: t('listing.amenityOfficeSpace'), icon: '💼' },
    gated_compound: { label: t('listing.amenityGatedCompound'), icon: '🚧' },
    title_deed: { label: t('listing.amenityTitleDeed'), icon: '📜' },
    road_frontage: { label: t('listing.amenityRoadFrontage'), icon: '🛣️' },
    utilities: { label: t('listing.amenityUtilities'), icon: '⚡' },
  }

  const amenityItems = listing.amenities.map((amenity) => amenityLabels[amenity]).filter(Boolean)
  
  // Add swimming pool to amenities if it's a dedicated field and not in amenities array
  if (listing.swimmingPool && !listing.amenities.includes('pool')) {
    amenityItems.unshift(amenityLabels['pool'])
  }

  return (
    <div className={styles.page}>

      {/* Back link — constrained beige strip */}
      <div className={styles.backBar}>
        <div className={styles.container}>
          <Link href={`/${locale}/listings`} className={styles.back}>
            {t('listing.backToListings')}
          </Link>
        </div>
      </div>

      {/* Gallery — full bleed, no container */}
      <GalleryViewer photos={listing.photos} alt={listing.titleEn} />

      {/* Identity strip — navy, full bleed */}
      <div className={styles.identityStrip}>
        <div className={styles.container}>
          <div className={styles.badgeRow}>
            <span className={`${styles.badge} ${styles[`badge_category_${listing.category}`]}`}>
              {categoryLabel}
            </span>
            <span className={`${styles.badge} ${styles[`badge_transaction_${listing.transaction}`]}`}>
              {transactionLabel}
            </span>
            {statusLabel && (
              <span className={`${styles.badge} ${styles[`badge_status_${listing.status}`]}`}>
                {statusLabel}
              </span>
            )}
          </div>
          <h1 className={styles.title}>{listing.titleEn}</h1>
          <div className={styles.identityMeta}>
            <span className={styles.price}>{formatPrice(listing.price, listing.priceUnit)}</span>
            <span className={styles.metaDivider} />
            <span className={styles.metaItem}>{listing.locationEn}</span>
            {primaryAreaSqm && (
              <>
                <span className={styles.metaDivider} />
                <span className={styles.metaItem}>
                  {primaryAreaSqm} {t('listing.sqm')}
                </span>
              </>
            )}
          </div>
          {heroFacts.length > 0 && (
            <div className={styles.heroFacts}>
              {heroFacts.map((fact) => (
                <div key={fact.label} className={styles.heroFactCard}>
                  <span className={styles.heroFactValue}>{fact.value}</span>
                  <span className={styles.heroFactLabel}>{fact.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Page body */}
      <div className={styles.pageBody}>
        <div className={styles.container}>
          <div className={styles.layout}>

            {/* Main content */}
            <div className={styles.main}>
              {keyFacts.length > 0 && (
                <div className={styles.factsSection}>
                  <h2 className={styles.sectionTitle}>{t('listing.keyFacts')}</h2>
                  <div className={styles.factGrid}>
                    {keyFacts.map((fact) => (
                      <div key={fact.label} className={styles.factCard}>
                        <span className={styles.factIcon}>{fact.icon}</span>
                        <div className={styles.factContent}>
                          <span className={styles.factLabel}>{fact.label}</span>
                          <span className={styles.factValue}>{fact.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {amenityItems.length > 0 && (
                <div className={styles.amenitiesSection}>
                  <h2 className={styles.sectionTitle}>{t('listing.amenities')}</h2>
                  <div className={styles.amenityList}>
                    {amenityItems.map((amenity, index) => (
                      <span key={`${amenity.label}-${index}`} className={styles.amenityChip}>
                        <span className={styles.amenityIcon}>{amenity.icon}</span>
                        <span>{amenity.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className={styles.descSection}>
                <h2 className={styles.sectionTitle}>{t('listing.description')}</h2>
                <div className={styles.descBody}>
                  <p className={styles.desc}>{listing.descriptionEn}</p>
                </div>
              </div>

              {/* Map placeholder */}
              <div className={styles.mapSection}>
                <h2 className={styles.sectionTitle}>{t('listing.mapPlaceholder')}</h2>
                {listing.lat != null && listing.lng != null ? (
                  <LocationMap
                    lat={listing.lat}
                    lng={listing.lng}
                    label={listing.titleEn}
                    note={t('listing.approxLocation')}
                    showControls
                  />
                ) : (
                  <div className={styles.mapPlaceholder}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    <span>{t('listing.approxLocation')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.sideCard}>
                <p className={styles.sidePrice}>{formatPrice(listing.price, listing.priceUnit)}</p>
                <h2 className={styles.sideTitle}>{t('listing.inquire')}</h2>
                <p className={styles.sideSubtitle}>{t('listing.sideSubtitle')}</p>
                <WhatsAppButton
                  label={t('listing.whatsapp')}
                  listingTitle={listing.titleEn}
                  className={styles.whatsappFull}
                />
                <p className={styles.sideNote}>{t('listing.sideNote')}</p>
              </div>
            </aside>

          </div>
        </div>
      </div>

    </div>
  )
}
