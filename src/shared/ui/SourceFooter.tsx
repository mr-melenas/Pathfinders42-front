import { useTranslation } from 'react-i18next'
import { LinkButton } from '@/shared/ui/LinkButton'

type SourceFooterProps = {
  capa: string // the layer, as the API names it ("anortosita")
  fuente?: string | null // the layer's dataset: the API does not send it yet (sistema-visual §8, item 5)
  n_parejas?: number | null // "n_parejas": how many Earth pairs the layer has for this site
  onShowAll?: () => void // "ver todas": only shown when there is something to do
}

// Where the card's numbers come from: layer · source · number of pairs (rule 5.5)
export function SourceFooter({ capa, fuente, n_parejas, onShowAll }: SourceFooterProps) {
  const { t } = useTranslation()
  const hasSource = typeof fuente === 'string' && fuente !== ''

  return (
    <footer className="flex flex-wrap gap-x-2.5 gap-y-1 border-t border-dashed border-border pt-2 text-data text-muted">
      <span>
        {t('source.layer')} <span className="font-mono text-unit">{capa}</span>
      </span>
      <span>
        {t('source.source')} {hasSource ? fuente : t('state.pending')}
      </span>
      {typeof n_parejas === 'number' && (
        <span>
          {t('source.pairs', { count: n_parejas })}
          {onShowAll && (
            <>
              {' · '}
              <LinkButton onClick={onShowAll}>{t('source.showAll')}</LinkButton>
            </>
          )}
        </span>
      )}
    </footer>
  )
}
