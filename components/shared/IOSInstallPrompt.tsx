'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import styles from './IOSInstallPrompt.module.css'

export default function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const t = useTranslations('pwa')

  useEffect(() => {
    // Check if running on iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS/.test(navigator.userAgent)
    
    // Check if user has previously dismissed the prompt
    const dismissed = localStorage.getItem('ios-install-dismissed')
    
    // Show prompt only on iOS Safari, not in standalone mode, and not previously dismissed
    if (isIOS && isSafari && !isInStandaloneMode && !dismissed) {
      // Delay showing the prompt slightly for better UX
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setShowPrompt(false)
    setIsDismissed(true)
    localStorage.setItem('ios-install-dismissed', 'true')
  }

  const handleNeverShow = () => {
    setShowPrompt(false)
    setIsDismissed(true)
    localStorage.setItem('ios-install-dismissed', 'permanent')
  }

  if (!showPrompt || isDismissed) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={handleDismiss} className={styles.closeButton} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.header}>
          <div className={styles.icon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
          <h2 className={styles.title}>{t('iosInstallTitle')}</h2>
          <p className={styles.description}>{t('iosInstallDescription')}</p>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <p className={styles.stepText}>
                {t('iosInstallStep1')}
              </p>
              <div className={styles.shareIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </div>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <p className={styles.stepText}>
                {t('iosInstallStep2')}
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <p className={styles.stepText}>
                {t('iosInstallStep3')}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={handleDismiss} className={styles.gotItButton}>
            {t('iosInstallGotIt')}
          </button>
          <button onClick={handleNeverShow} className={styles.neverShowButton}>
            {t('iosInstallNeverShow')}
          </button>
        </div>
      </div>
    </div>
  )
}
