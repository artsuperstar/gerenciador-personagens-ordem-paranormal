import type { AgentCharacter, CharacterUpdate } from '../types'
import { BasicInfoPanel } from './BasicInfoPanel'
import { ResourcesPanel } from './ResourcesPanel'
import { AttributesSkillsPanel } from './attributes/AttributesSkillsPanel'

interface CharacterSheetProps {
  character: AgentCharacter
  onChange: (update: CharacterUpdate) => void
}

export function CharacterSheet({ character, onChange }: CharacterSheetProps) {
  return (
    <div className="sheet-area">
      <header className="sheet-header">
        <div className="header-copy">
          <p className="eyebrow">Dossiê ativo <span aria-hidden="true">/</span> Acesso local</p>
          <h1>{character.basicInfo.name || 'Agente sem nome'}</h1>
          <div className="agent-metadata">
            <span className="nex-chip"><strong>{character.basicInfo.nex}%</strong> NEX</span>
            {character.basicInfo.className && <span>{character.basicInfo.className}</span>}
            {character.basicInfo.origin && <span>{character.basicInfo.origin}</span>}
          </div>
        </div>
        <span className="header-index" aria-hidden="true">ARQ—LOCAL</span>
        <p className="license-notice">
          Este é um conteúdo não oficial, publicado sob a Licença da Comunidade de Ordem Paranormal. Contém material gerado por inteligência artificial.
        </p>
      </header>

      <nav className="sheet-navigation" aria-label="Seções da ficha">
        <a href="#visao-geral"><span>01</span>Visão geral</a>
        <a href="#atributos-pericias"><span>02</span>Atributos</a>
        <a href="#recursos"><span>03</span>Recursos</a>
        <a href="#anotacoes"><span>04</span>Anotações</a>
      </nav>

      <main>
        <BasicInfoPanel value={character.basicInfo} onChange={(basicInfo) => onChange({ basicInfo })} />
        <div className="dashboard-grid">
          <AttributesSkillsPanel attributes={character.attributes} skills={character.skills} onChange={(attributes, skills) => onChange({ attributes, skills })} />
          <ResourcesPanel value={character.resources} onChange={(resources) => onChange({ resources })} />
          <section className="card roadmap-card" aria-labelledby="roadmap-heading">
            <p className="section-kicker">Estrutura preparada</p>
            <h2 id="roadmap-heading">Próximos registros</h2>
            <p>O dossiê já pode receber novos módulos sem depender de mecânicas de outro sistema.</p>
            <div className="module-tags">
              {['Combate', 'Inventário', 'Ataques', 'Habilidades', 'Rituais', 'Condições'].map((section) => <span key={section}>{section}</span>)}
            </div>
          </section>
          <section id="anotacoes" className="card notes-card">
            <div className="section-heading">
              <div><p className="section-kicker">Registro de campo</p><h2>Anotações</h2></div>
              <span className="section-code">TXT—01</span>
            </div>
            <textarea aria-label="Anotações" placeholder="Pistas, contatos, missões e observações…" value={character.notes} onChange={(event) => onChange({ notes: event.target.value })} />
          </section>
        </div>
      </main>
    </div>
  )
}
