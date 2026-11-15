import { useTranslation } from 'react-i18next'
import { AiSection } from '@/features/landing/components/AiSection'
import { ChallengeSection } from '@/features/landing/components/ChallengeSection'
import { CtaSection } from '@/features/landing/components/CtaSection'
import { DataSection } from '@/features/landing/components/DataSection'
import { HeroSection } from '@/features/landing/components/HeroSection'
import { HowItWorksSection } from '@/features/landing/components/HowItWorksSection'
import { LimitsSection } from '@/features/landing/components/LimitsSection'
import { MarsSection } from '@/features/landing/components/MarsSection'
import { UsesSection } from '@/features/landing/components/UsesSection'
import { VideoSection } from '@/features/landing/components/VideoSection'

// Home page ("/"): presents the project and leads to the explorer. It has its own header, outside the app layout
export function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <main className="flex flex-1 flex-col">
        <VideoSection />
        <ChallengeSection />
        <HowItWorksSection />
        <UsesSection />
        <MarsSection />
        <AiSection />
        <LimitsSection />
        <DataSection />
        <CtaSection />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-content flex-col gap-1 px-4 py-6 text-caption text-muted">
          <span>{t('landing.footer.challenge')}</span>
          <span>{t('landing.footer.images')}</span>
        </div>
      </footer>
    </div>
  )
}
