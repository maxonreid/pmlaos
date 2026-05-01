import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="nf-container">
      <div className="nf-code">404</div>
      <h1 className="nf-title">Page Not Found</h1>
      <p className="nf-desc">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <div className="nf-actions">
        <Link href="/en/" className="nf-primary">
          Back to Home
        </Link>
        <Link href="/en/listings" className="nf-secondary">
          Browse Listings
        </Link>
      </div>
    </div>
  )
}
