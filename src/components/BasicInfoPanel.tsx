import { useState } from 'react'
import type { BasicInfo } from '../types'
import { EditButton } from './EditButton'
import { EditorActions } from './EditorActions'

interface BasicInfoPanelProps { value: BasicInfo; onChange: (value: BasicInfo) => void }

const summaryFields = [
  ['playerName', 'Jogador'], ['origin', 'Origem'], ['className', 'Classe'], ['track', 'Trilha'], ['nex', 'NEX'],
] as const

export function BasicInfoPanel({ value, onChange }: BasicInfoPanelProps) {
  const [draft, setDraft] = useState<BasicInfo | null>(null)
  const valid = Boolean(draft?.name.trim()) && Number.isFinite(draft?.nex) && draft!.nex >= 0 && draft!.nex <= 100
  function field<K extends keyof BasicInfo>(key: K, next: BasicInfo[K]) { setDraft((current) => current ? { ...current, [key]: next } : null) }

  return <section id="visao-geral" className={`card identity-card${draft ? ' editing' : ''}`} aria-labelledby="basic-info-heading">
    <div className="section-heading"><h2 id="basic-info-heading">Informações básicas</h2>{!draft && <EditButton label="Editar informações básicas" onClick={() => setDraft({ ...value })} />}</div>
    {draft ? <div className="identity-editor" role="dialog" aria-label="Editar informações básicas">
      <div className="form-grid">
        <label className="field wide"><span>Nome do personagem</span><input autoFocus value={draft.name} onChange={(event) => field('name', event.target.value)} /></label>
        <label className="field"><span>Jogador</span><input value={draft.playerName} onChange={(event) => field('playerName', event.target.value)} /></label>
        <label className="field"><span>Origem</span><input value={draft.origin} onChange={(event) => field('origin', event.target.value)} /></label>
        <label className="field"><span>Classe</span><input value={draft.className} onChange={(event) => field('className', event.target.value)} /></label>
        <label className="field"><span>Trilha</span><input value={draft.track} onChange={(event) => field('track', event.target.value)} /></label>
        <label className="field"><span>NEX (%)</span><input type="number" min="0" max="100" value={draft.nex} onChange={(event) => field('nex', Number(event.target.value))} /></label>
      </div>
      <EditorActions canSave={valid} onCancel={() => setDraft(null)} onSave={() => { if (!valid) return; onChange({ ...draft, name: draft.name.trim() }); setDraft(null) }} />
    </div> : <div className="identity-summary">
      {summaryFields.map(([key, label]) => <div className="identity-value" key={key}><span>{label}</span><strong>{key === 'nex' ? `${value[key]}%` : value[key] || '—'}</strong></div>)}
    </div>}
  </section>
}
