import type { AgentCharacter, Attributes, BasicInfo, CharacterResources } from './types'
import { createDefaultSkills, skillDefinitions } from './system'

const defaultAttributes: Attributes = {
  agility: 0,
  strength: 0,
  intellect: 0,
  presence: 0,
  vigor: 0,
}

const defaultResources: CharacterResources = {
  hitPoints: { current: 0, maximum: 0 },
  effortPoints: { current: 0, maximum: 0 },
  sanity: { current: 0, maximum: 0 },
}

function defaultCharacterData(name: string): Omit<AgentCharacter, 'id'> {
  return {
    basicInfo: { name, playerName: '', origin: '', className: '', track: '', nex: 0 },
    attributes: { ...defaultAttributes },
    skills: createDefaultSkills(),
    resources: structuredClone(defaultResources),
    combat: { defense: 0, movement: '', protection: '', resistances: '' },
    inventory: [],
    attacks: [],
    abilities: [],
    rituals: [],
    elements: [],
    conditions: [],
    notes: '',
    history: '',
  }
}

export function createCharacter(name = 'Novo agente'): AgentCharacter {
  return { id: crypto.randomUUID(), ...defaultCharacterData(name) }
}

function finiteNumber(value: unknown, fallback: number): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : fallback
}

function normalizeResource(value: unknown) {
  const stored = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const maximum = Math.max(0, finiteNumber(stored.maximum, 0))
  return {
    current: Math.min(maximum, Math.max(0, finiteNumber(stored.current, maximum))),
    maximum,
  }
}

function normalizeSkills(value: unknown) {
  const storedSkills = Array.isArray(value) ? value : []
  const defaults = createDefaultSkills()
  const knownIds = new Set(skillDefinitions.map(({ id }) => id))
  const standardSkills = defaults.map((skill) => {
    const stored = storedSkills.find((candidate) => candidate && typeof candidate === 'object' && candidate.id === skill.id)
    if (!stored || typeof stored !== 'object') return skill
    return {
      ...skill,
      trainingBonus: finiteNumber(stored.trainingBonus, 0),
      otherBonus: finiteNumber(stored.otherBonus, 0),
    }
  })
  const customSkills = storedSkills.flatMap((candidate) => {
    if (!candidate || typeof candidate !== 'object' || knownIds.has(candidate.id)) return []
    const name = typeof candidate.name === 'string' ? candidate.name.trim() : ''
    if (!name || typeof candidate.id !== 'string' || !candidate.id) return []
    return [{
      id: candidate.id,
      name,
      attribute: candidate.attribute,
      trainingBonus: finiteNumber(candidate.trainingBonus, 0),
      otherBonus: finiteNumber(candidate.otherBonus, 0),
    }]
  })
  return [...standardSkills, ...customSkills]
}

export function normalizeCharacter(stored: AgentCharacter): AgentCharacter {
  if (!stored || typeof stored !== 'object') throw new Error('Ficha inválida.')
  const storedValue = stored as AgentCharacter
  const storedInfo = storedValue.basicInfo ?? {} as BasicInfo
  const defaults = defaultCharacterData(
    typeof storedInfo.name === 'string' && storedInfo.name.trim() ? storedInfo.name : 'Agente sem nome',
  )

  return {
    ...defaults,
    ...storedValue,
    id: storedValue.id,
    basicInfo: {
      ...defaults.basicInfo,
      ...storedInfo,
      nex: Math.max(0, Math.min(100, finiteNumber(storedInfo.nex, 0))),
    },
    attributes: { ...defaults.attributes, ...storedValue.attributes },
    resources: {
      hitPoints: normalizeResource(storedValue.resources?.hitPoints),
      effortPoints: normalizeResource(storedValue.resources?.effortPoints),
      sanity: normalizeResource(storedValue.resources?.sanity),
    },
    combat: { ...defaults.combat, ...storedValue.combat },
    skills: normalizeSkills(storedValue.skills),
    inventory: Array.isArray(storedValue.inventory) ? storedValue.inventory : [],
    attacks: Array.isArray(storedValue.attacks) ? storedValue.attacks : [],
    abilities: Array.isArray(storedValue.abilities) ? storedValue.abilities : [],
    rituals: Array.isArray(storedValue.rituals) ? storedValue.rituals : [],
    elements: Array.isArray(storedValue.elements) ? storedValue.elements : [],
    conditions: Array.isArray(storedValue.conditions) ? storedValue.conditions : [],
  }
}
