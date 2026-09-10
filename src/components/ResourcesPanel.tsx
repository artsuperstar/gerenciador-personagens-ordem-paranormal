import { useState } from 'react'
import type { CharacterResources } from '../types'
import { EditButton } from './EditButton'
import { EditorActions } from './EditorActions'

interface ResourcesPanelProps {
  value: CharacterResources
  onChange: (value: CharacterResources) => void
}

type ResourceKey = keyof CharacterResources
type MaximumDraft = Record<ResourceKey, number>

const resources = [
  ['hitPoints', 'PV', 'Pontos de Vida'],
  ['effortPoints', 'PE', 'Pontos de Esforço'],
  ['sanity', 'SAN', 'Sanidade'],
] as const

function createMaximumDraft(value: CharacterResources): MaximumDraft {
  return {
    hitPoints: value.hitPoints.maximum,
    effortPoints: value.effortPoints.maximum,
    sanity: value.sanity.maximum,
  }
}

export function ResourcesPanel({ value, onChange }: ResourcesPanelProps) {
  const [maximumDraft, setMaximumDraft] = useState<MaximumDraft | null>(null)

  function updateCurrent(key: ResourceKey, current: number) {
    onChange({
      ...value,
      [key]: { ...value[key], current: Math.max(0, current) },
    })
  }

  function updateMaximum(key: ResourceKey, maximum: number) {
    setMaximumDraft((current) => current ? { ...current, [key]: Math.max(0, maximum) } : current)
  }

  function saveMaximums() {
    const draft = maximumDraft
    if (!draft) return

    function resourceWithMaximum(key: ResourceKey, draftMaximum: number) {
      const maximum = Math.trunc(draftMaximum)
      return {
        current: Math.min(value[key].current, maximum),
        maximum,
      }
    }

    onChange({
      hitPoints: resourceWithMaximum('hitPoints', draft.hitPoints),
      effortPoints: resourceWithMaximum('effortPoints', draft.effortPoints),
      sanity: resourceWithMaximum('sanity', draft.sanity),
    })
    setMaximumDraft(null)
  }

  const canSave = maximumDraft !== null
    && Object.values(maximumDraft).every((maximum) => Number.isInteger(maximum) && maximum >= 0)

  return <section id="recursos" className="card resources-card" aria-labelledby="resources-heading">
    <div className="section-heading">
      <div>
        <p className="section-kicker">Estado do agente</p>
        <h2 id="resources-heading">Recursos</h2>
      </div>
      <div className="resource-heading-actions">
        <span className="live-indicator"><span aria-hidden="true" />Atualização direta</span>
        {maximumDraft
          ? <EditorActions canSave={canSave} onCancel={() => setMaximumDraft(null)} onSave={saveMaximums} />
          : <EditButton label="Editar valores máximos dos recursos" onClick={() => setMaximumDraft(createMaximumDraft(value))} />}
      </div>
    </div>
    <div className="resource-grid">
      {resources.map(([key, abbreviation, label]) => <div className="resource-card" key={key}>
        <div className="resource-identity">
          <strong>{abbreviation}</strong>
          <span>{label}</span>
        </div>
        <label className="field">
          <span>Atual</span>
          <input
            aria-label={`${label} atuais`}
            type="number"
            min="0"
            step="1"
            value={value[key].current}
            onChange={(event) => updateCurrent(key, Number(event.target.value))}
          />
        </label>
        <span className="resource-divider">/</span>
        {maximumDraft
          ? <label className="field">
              <span>Máximo</span>
              <input
                aria-label={`${label} máximos`}
                type="number"
                min="0"
                step="1"
                value={maximumDraft[key]}
                onChange={(event) => updateMaximum(key, Number(event.target.value))}
              />
            </label>
          : <div className="resource-maximum" aria-label={`${label} máximos: ${value[key].maximum}`}>
              <span>Máximo</span>
              <strong>{value[key].maximum}</strong>
            </div>}
      </div>)}
    </div>
  </section>
}
