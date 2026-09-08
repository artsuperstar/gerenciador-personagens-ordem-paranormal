import { attributeDefinitions } from '../../system'
import type { Attributes } from '../../types'

interface AttributeScoreListProps {
  attributes: Attributes
}

export function AttributeScoreList({ attributes }: AttributeScoreListProps) {
  return (
    <section className="attribute-score-section" aria-labelledby="attribute-scores-heading">
      <h3 id="attribute-scores-heading">Atributos base</h3>
      <div className="attribute-score-list">
        {attributeDefinitions.map(({ name, label, abbreviation }) => (
          <div className="attribute-score" key={name}>
            <span>{label}</span>
            <strong>{attributes[name]}</strong>
            <small>{abbreviation}</small>
          </div>
        ))}
      </div>
    </section>
  )
}

