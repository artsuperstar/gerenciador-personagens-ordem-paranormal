import type { CharacterResources, ResourceValue } from '../types'

interface ResourcesPanelProps { value: CharacterResources; onChange: (value: CharacterResources) => void }
const resources = [['hitPoints', 'PV', 'Pontos de Vida'], ['effortPoints', 'PE', 'Pontos de Esforço'], ['sanity', 'SAN', 'Sanidade']] as const

export function ResourcesPanel({ value, onChange }: ResourcesPanelProps) {
  function update(key: keyof CharacterResources, changes: Partial<ResourceValue>) {
    const next = { ...value[key], ...changes }
    onChange({ ...value, [key]: { current: Math.max(0, next.current), maximum: Math.max(0, next.maximum) } })
  }
  return <section id="recursos" className="card resources-card" aria-labelledby="resources-heading"><div className="section-heading"><div><p className="section-kicker">Estado do agente</p><h2 id="resources-heading">Recursos</h2></div><span className="live-indicator"><span aria-hidden="true" />Atualização direta</span></div><div className="resource-grid">
    {resources.map(([key, abbreviation, label]) => <div className="resource-card" key={key}><div><strong>{abbreviation}</strong><span>{label}</span></div><label className="field"><span>Atual</span><input aria-label={`${label} atuais`} type="number" min="0" value={value[key].current} onChange={(event) => update(key, { current: Number(event.target.value) })} /></label><span className="resource-divider">/</span><label className="field"><span>Máximo</span><input aria-label={`${label} máximos`} type="number" min="0" value={value[key].maximum} onChange={(event) => update(key, { maximum: Number(event.target.value) })} /></label></div>)}
  </div></section>
}
