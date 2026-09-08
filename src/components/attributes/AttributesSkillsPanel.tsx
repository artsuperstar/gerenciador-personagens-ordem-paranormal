import { useState } from 'react'
import type { Attributes, SkillEntry } from '../../types'
import { EditButton } from '../EditButton'
import { AttributeScoreList } from './AttributeScoreList'
import { AttributesSkillsEditor } from './AttributesSkillsEditor'
import { SkillList } from './SkillList'

interface AttributesSkillsPanelProps {
  attributes: Attributes
  skills: SkillEntry[]
  onChange: (attributes: Attributes, skills: SkillEntry[]) => void
}

export function AttributesSkillsPanel({ attributes, skills, onChange }: AttributesSkillsPanelProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <section id="atributos-pericias" className={`card abilities-card${isEditing ? ' editing' : ''}`} aria-label="Atributos e perícias">
      {isEditing ? (
        <AttributesSkillsEditor
          attributes={attributes}
          skills={skills}
          onCancel={() => setIsEditing(false)}
          onSave={(nextAttributes, nextSkills) => {
            onChange(nextAttributes, nextSkills)
            setIsEditing(false)
          }}
        />
      ) : (
        <>
          <div className="section-heading">
            <div><p className="section-kicker">Capacidades do agente</p><h2 id="attributes-skills-heading">Atributos &amp; Perícias</h2></div>
            <EditButton label="Editar atributos e perícias" onClick={() => setIsEditing(true)} />
          </div>
          <div className="attributes-skills-layout">
            <AttributeScoreList attributes={attributes} />
            <SkillList skills={skills} />
          </div>
        </>
      )}
    </section>
  )
}
