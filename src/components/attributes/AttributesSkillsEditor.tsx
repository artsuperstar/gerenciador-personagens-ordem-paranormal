import { useState } from 'react'
import { attributeDefinitions, attributeAbbreviation, skillDefinitions } from '../../system'
import type { Attributes, SkillEntry } from '../../types'
import { EditorActions } from '../EditorActions'

interface AttributesSkillsEditorProps {
  attributes: Attributes
  skills: SkillEntry[]
  onCancel: () => void
  onSave: (attributes: Attributes, skills: SkillEntry[]) => void
}

export function AttributesSkillsEditor({ attributes, skills, onCancel, onSave }: AttributesSkillsEditorProps) {
  const [draftAttributes, setDraftAttributes] = useState({ ...attributes })
  const [draftSkills, setDraftSkills] = useState(skills.map((skill) => ({ ...skill })))
  const canSave = attributeDefinitions.every(({ name }) => Number.isInteger(draftAttributes[name]) && draftAttributes[name] >= 0)
    && draftSkills.every(({ trainingBonus, otherBonus }) => Number.isFinite(trainingBonus) && Number.isFinite(otherBonus))

  function updateSkill(id: string, field: 'trainingBonus' | 'otherBonus', value: number) {
    setDraftSkills((current) => current.map((skill) => skill.id === id ? { ...skill, [field]: value } : skill))
  }

  return (
    <div className="attributes-skills-editor" role="dialog" aria-label="Editar atributos e perícias">
      <div className="ability-editor-heading">
        <div><p className="section-kicker">Configuração da ficha</p><h2 id="attributes-skills-heading">Editar atributos e perícias</h2><p>Informe os valores base e mantenha Treino e Outros separados.</p></div>
        <EditorActions canSave={canSave} onCancel={onCancel} onSave={() => onSave(draftAttributes, draftSkills)} />
      </div>

      <section className="attribute-editor-section" aria-labelledby="edit-attributes-heading">
        <h3 id="edit-attributes-heading">Atributos base</h3>
        <div className="attribute-editor-grid">
          {attributeDefinitions.map(({ name, label, abbreviation }) => (
            <label className="field attribute-editor-field" key={name}>
              <span>{label} <small>{abbreviation}</small></span>
              <input type="number" min="0" step="1" value={draftAttributes[name]} onChange={(event) => setDraftAttributes((current) => ({ ...current, [name]: Number(event.target.value) }))} />
            </label>
          ))}
        </div>
      </section>

      <section className="skill-editor-section" aria-labelledby="edit-skills-heading">
        <div className="skill-editor-heading"><h3 id="edit-skills-heading">Perícias</h3><span>Treino</span><span>Outros</span></div>
        <div className="skill-editor-list">
          {draftSkills.map((skill) => {
            const definition = skillDefinitions.find(({ id }) => id === skill.id)
            return (
              <div className="skill-editor-row" key={skill.id}>
                <span>{definition?.displayLabel ?? skill.name} <small>{attributeAbbreviation(skill.attribute)}</small></span>
                <input aria-label={`Treino de ${skill.name}`} type="number" value={skill.trainingBonus} onChange={(event) => updateSkill(skill.id, 'trainingBonus', Number(event.target.value))} />
                <input aria-label={`Outros bônus de ${skill.name}`} type="number" value={skill.otherBonus} onChange={(event) => updateSkill(skill.id, 'otherBonus', Number(event.target.value))} />
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
