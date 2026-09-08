export const attributeNames = ['agility', 'strength', 'intellect', 'presence', 'vigor'] as const
export type AttributeName = (typeof attributeNames)[number]
export type Attributes = Record<AttributeName, number>

export interface BasicInfo {
  name: string
  playerName: string
  origin: string
  className: string
  track: string
  nex: number
}

export interface ResourceValue {
  current: number
  maximum: number
}

export interface CharacterResources {
  hitPoints: ResourceValue
  effortPoints: ResourceValue
  sanity: ResourceValue
}

export interface SkillEntry {
  id: string
  name: string
  attribute?: AttributeName
  trainingBonus: number
  otherBonus: number
}

export interface CombatData {
  defense: number
  movement: string
  protection: string
  resistances: string
}

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  category: string
  description: string
}

export interface AttackEntry {
  id: string
  name: string
  test: string
  damage: string
  critical: string
  range: string
  details: string
}

export type AbilityCategory = 'origin' | 'class' | 'track' | 'power' | 'other'

export interface AbilityEntry {
  id: string
  name: string
  category: AbilityCategory
  description: string
  maximumUses?: number
  remainingUses?: number
}

export type ParanormalElement = 'blood' | 'death' | 'knowledge' | 'energy' | 'fear'

export interface RitualEntry {
  id: string
  name: string
  circle: string
  element?: ParanormalElement
  execution: string
  range: string
  duration: string
  resistance: string
  description: string
}

export interface ConditionEntry {
  id: string
  name: string
  notes: string
}

export interface AgentCharacter {
  id: string
  basicInfo: BasicInfo
  attributes: Attributes
  skills: SkillEntry[]
  resources: CharacterResources
  combat: CombatData
  inventory: InventoryItem[]
  attacks: AttackEntry[]
  abilities: AbilityEntry[]
  rituals: RitualEntry[]
  elements: ParanormalElement[]
  affinity?: ParanormalElement
  conditions: ConditionEntry[]
  notes: string
  history: string
}

export interface SavedState {
  characters: AgentCharacter[]
  activeCharacterId: string
}

export type CharacterUpdate = Partial<AgentCharacter> | ((current: AgentCharacter) => Partial<AgentCharacter>)

