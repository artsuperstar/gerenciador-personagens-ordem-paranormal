import { attributeAbbreviation, formatBonus, skillDefinitions } from '../../system'
import type { SkillEntry } from '../../types'

interface SkillListProps {
  skills: SkillEntry[]
}

export function SkillList({ skills }: SkillListProps) {
  return (
    <section className="skill-section" aria-labelledby="skills-heading">
      <div className="skill-section-heading">
        <h3 id="skills-heading">Perícias</h3>
        <span>Bônus</span>
      </div>
      <div className="skill-list">
        {skills.map((skill) => {
          const definition = skillDefinitions.find(({ id }) => id === skill.id)
          return (
            <div className="skill-row" key={skill.id}>
              <div>
                <strong>{definition?.displayLabel ?? skill.name}</strong>
                {definition?.trainedOnly && <span className="skill-marker" title="Somente treinada">T</span>}
                {definition?.loadPenalty && <span className="skill-marker load" title="Sofre penalidade de carga">C</span>}
              </div>
              <small>{attributeAbbreviation(skill.attribute)}</small>
              <output aria-label={`Bônus de ${skill.name}`}>{formatBonus(skill.trainingBonus + skill.otherBonus)}</output>
            </div>
          )
        })}
      </div>
      <p className="skill-legend"><span><b>T</b> Somente treinada</span><span><b>C</b> Penalidade de carga</span></p>
    </section>
  )
}

