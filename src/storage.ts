import { createCharacter, normalizeCharacter } from './character'
import type { AgentCharacter, SavedState } from './types'

export const INDEX_STORAGE_KEY = 'arquivo-de-agentes-v1'
export const characterStorageKey = (id: string) => `${INDEX_STORAGE_KEY}:character:${id}`

interface CharacterIndex {
  characterIds: string[]
  activeCharacterId: string
}

export function createInitialState(): SavedState {
  const character = createCharacter()
  return { characters: [character], activeCharacterId: character.id }
}

export function loadState(): SavedState {
  const indexJson = localStorage.getItem(INDEX_STORAGE_KEY)
  if (!indexJson) return createInitialState()

  const index = JSON.parse(indexJson) as CharacterIndex
  if (!Array.isArray(index.characterIds)) throw new Error('Índice de fichas inválido.')
  const characters = index.characterIds.map((id) => {
    const json = localStorage.getItem(characterStorageKey(id))
    if (!json) throw new Error('Uma ficha salva está ausente.')
    const character = normalizeCharacter(JSON.parse(json) as AgentCharacter)
    if (character.id !== id) throw new Error('Uma ficha salva possui identificação inválida.')
    return character
  })
  if (!characters.length || new Set(characters.map(({ id }) => id)).size !== characters.length) {
    throw new Error('A coleção de fichas é inválida.')
  }
  const activeCharacterId = characters.some(({ id }) => id === index.activeCharacterId)
    ? index.activeCharacterId
    : characters[0].id
  return { characters, activeCharacterId }
}

export function createStateWriter() {
  const savedCharacters = new Map<string, AgentCharacter>()
  let savedIndex = ''

  return (state: SavedState): void => {
    for (const character of state.characters) {
      if (savedCharacters.get(character.id) === character) continue
      localStorage.setItem(characterStorageKey(character.id), JSON.stringify(character))
      savedCharacters.set(character.id, character)
    }

    const characterIds = state.characters.map(({ id }) => id)
    const indexJson = JSON.stringify({ characterIds, activeCharacterId: state.activeCharacterId })
    if (indexJson !== savedIndex) {
      localStorage.setItem(INDEX_STORAGE_KEY, indexJson)
      savedIndex = indexJson
    }

    const retainedIds = new Set(characterIds)
    for (const id of savedCharacters.keys()) {
      if (retainedIds.has(id)) continue
      localStorage.removeItem(characterStorageKey(id))
      savedCharacters.delete(id)
    }
  }
}

