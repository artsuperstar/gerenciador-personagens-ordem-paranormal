import type { AttributeName, SkillEntry } from './types'

export const attributeDefinitions = [
  { name: 'agility', label: 'Agilidade', abbreviation: 'AGI' },
  { name: 'strength', label: 'Força', abbreviation: 'FOR' },
  { name: 'intellect', label: 'Intelecto', abbreviation: 'INT' },
  { name: 'presence', label: 'Presença', abbreviation: 'PRE' },
  { name: 'vigor', label: 'Vigor', abbreviation: 'VIG' },
] as const satisfies ReadonlyArray<{ name: AttributeName; label: string; abbreviation: string }>

interface SkillDefinition {
  id: string
  label: string
  displayLabel?: string
  attribute: AttributeName
  trainedOnly?: boolean
  loadPenalty?: boolean
}

export const skillDefinitions: readonly SkillDefinition[] = [
  { id: 'acrobatics', label: 'Acrobacia', attribute: 'agility', loadPenalty: true },
  { id: 'animal-handling', label: 'Adestramento', attribute: 'presence', trainedOnly: true },
  { id: 'arts', label: 'Artes', attribute: 'presence', trainedOnly: true },
  { id: 'athletics', label: 'Atletismo', attribute: 'strength' },
  { id: 'current-events', label: 'Atualidades', attribute: 'intellect' },
  { id: 'science', label: 'Ciências', attribute: 'intellect', trainedOnly: true },
  { id: 'crime', label: 'Crime', attribute: 'agility', trainedOnly: true, loadPenalty: true },
  { id: 'diplomacy', label: 'Diplomacia', attribute: 'presence' },
  { id: 'deception', label: 'Enganação', attribute: 'presence' },
  { id: 'fortitude', label: 'Fortitude', attribute: 'vigor' },
  { id: 'stealth', label: 'Furtividade', attribute: 'agility', loadPenalty: true },
  { id: 'initiative', label: 'Iniciativa', attribute: 'agility' },
  { id: 'intimidation', label: 'Intimidação', attribute: 'presence' },
  { id: 'insight', label: 'Intuição', attribute: 'presence' },
  { id: 'investigation', label: 'Investigação', attribute: 'intellect' },
  { id: 'fighting', label: 'Luta', attribute: 'strength' },
  { id: 'medicine', label: 'Medicina', attribute: 'intellect' },
  { id: 'occultism', label: 'Ocultismo', attribute: 'intellect', trainedOnly: true },
  { id: 'perception', label: 'Percepção', attribute: 'presence' },
  { id: 'piloting', label: 'Pilotagem', attribute: 'agility', trainedOnly: true },
  { id: 'aim', label: 'Pontaria', attribute: 'agility' },
  { id: 'profession-one', label: 'Profissão 1', displayLabel: 'Profissão', attribute: 'intellect', trainedOnly: true },
  { id: 'profession-two', label: 'Profissão 2', displayLabel: 'Profissão', attribute: 'intellect', trainedOnly: true },
  { id: 'reflexes', label: 'Reflexos', attribute: 'agility' },
  { id: 'religion', label: 'Religião', attribute: 'presence', trainedOnly: true },
  { id: 'survival', label: 'Sobrevivência', attribute: 'intellect' },
  { id: 'tactics', label: 'Tática', attribute: 'intellect', trainedOnly: true },
  { id: 'technology', label: 'Tecnologia', attribute: 'intellect', trainedOnly: true },
  { id: 'will', label: 'Vontade', attribute: 'presence' },
]

export function createDefaultSkills(): SkillEntry[] {
  return skillDefinitions.map(({ id, label, attribute }) => ({
    id,
    name: label,
    attribute,
    trainingBonus: 0,
    otherBonus: 0,
  }))
}

export function attributeAbbreviation(attribute?: AttributeName): string {
  return attributeDefinitions.find(({ name }) => name === attribute)?.abbreviation ?? '—'
}

export function formatBonus(value: number): string {
  return value >= 0 ? `+${value}` : String(value)
}
