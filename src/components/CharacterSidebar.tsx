import { useState } from 'react'
import type { AgentCharacter } from '../types'

interface CharacterSidebarProps {
  characters: AgentCharacter[]
  activeCharacterId: string
  onSelect: (id: string) => void
  onAdd: () => void
  onDelete: () => void
  onMobileClose: () => void
}

export function CharacterSidebar({ characters, activeCharacterId, onSelect, onAdd, onDelete, onMobileClose }: CharacterSidebarProps) {
  const [confirming, setConfirming] = useState(false)
  const active = characters.find(({ id }) => id === activeCharacterId)

  return <aside className="sidebar" id="character-sidebar">
    <button className="mobile-sidebar-close" type="button" aria-label="Fechar menu de agentes" onClick={onMobileClose}>&times;</button>
    <div className="brand"><span className="brand-mark" aria-hidden="true">A</span><div><p className="eyebrow">Fichas locais</p><p className="brand-name">Arquivo de Agentes</p></div></div>
    <div className="sidebar-section">
      <div className="sidebar-heading"><span>Seus agentes</span><span className="character-count">{characters.length}</span></div>
      <nav className="character-list" aria-label="Agentes">
        {characters.map((character) => {
          const { name, className, nex } = character.basicInfo
          return <button key={character.id} className={`character-option${character.id === activeCharacterId ? ' active' : ''}`} aria-current={character.id === activeCharacterId ? 'page' : undefined} onClick={() => { setConfirming(false); onSelect(character.id) }}>
            <span className="character-initial">{(name || '?').charAt(0).toUpperCase()}</span>
            <span className="character-summary"><strong>{name || 'Agente sem nome'}</strong><small>NEX {nex}%{className ? ` · ${className}` : ''}</small></span>
          </button>
        })}
      </nav>
    </div>
    <div className="sidebar-actions">
      <button className="button primary" type="button" onClick={() => { setConfirming(false); onAdd() }}>+ Novo agente</button>
      <button className="button danger" type="button" disabled={characters.length <= 1} onClick={() => setConfirming(true)}>Excluir selecionado</button>
      {confirming && <div className="delete-confirmation" role="group" aria-label="Confirmar exclusão do agente"><p>Excluir {active?.basicInfo.name || 'este agente'}?</p><button className="button" type="button" onClick={() => setConfirming(false)}>Cancelar</button><button className="button danger" type="button" onClick={() => { setConfirming(false); onDelete() }}>Excluir agente</button></div>}
    </div>
    <p className="save-status">Salvo automaticamente neste dispositivo.</p>
  </aside>
}
