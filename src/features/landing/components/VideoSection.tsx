import { useTranslation } from 'react-i18next'
import { SectionHeading } from '@/features/landing/components/SectionHeading'
import { FRAME, SECTION } from '@/features/landing/components/styles'

const VIDEO_ID = 'bJ1hm9Ao3-M'
// youtube-nocookie: YouTube's privacy-enhanced mode, no cookies until the video is played. rel=0: related videos from this channel only
const EMBED_URL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0`
const WATCH_URL = `https://www.youtube.com/watch?v=${VIDEO_ID}`

// Video demo of the app
export function VideoSection() {
  const { t } = useTranslation()

  return (
    <section id="video" aria-labelledby="landing-video" className={SECTION}>
      <div className="flex flex-col gap-5">
        <SectionHeading id="landing-video" eyebrow={t('landing.video.eyebrow')} title={t('landing.video.title')} />
        <p className="max-w-prose text-body text-muted">{t('landing.video.text')}</p>
      </div>
      <figure className={`mx-auto flex w-full max-w-4xl flex-col ${FRAME}`}>
        {/* No autoplay; loaded only when the reader gets close (lazy). YouTube needs the referrer to play embeds */}
        <iframe
          src={EMBED_URL}
          title={t('landing.video.frameTitle')}
          loading="lazy"
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="aspect-video w-full"
        />
        <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-surface px-4 py-3 text-caption text-muted">
          <span>{t('landing.video.language')}</span>
          <a href={WATCH_URL} className="text-foreground underline underline-offset-2 hover:text-accent">
            {t('landing.video.watch')}
          </a>
        </figcaption>
      </figure>
    </section>
  )
}
