import { useCallback, useEffect, useState } from 'react'
import { createCharacter } from '../character'
import { createInitialState, createStateWriter, loadState } from '../storage'
import type { CharacterUpdate } from '../types'

export function useCharacters() {
  const [initial] = useState(() => {
    try {
      return { state: loadState(), loadFailed: false }
    } catch {
      return { state: createInitialState(), loadFailed: true }
    }
  })
  const [state, setState] = useState(initial.state)
  const [writeState] = useState(createStateWriter)
  const [saveError, setSaveError] = useState<string | null>(null)
  const activeCharacter = state.characters.find(({ id }) => id === state.activeCharacterId) ?? state.characters[0]

  const retrySave = useCallback(() => {
    if (initial.loadFailed) return
    try {
      writeState(state)
      setSaveError(null)
    } catch {
      setSaveError('Não foi possível salvar neste dispositivo. Mantenha esta aba aberta e libere espaço no navegador antes de tentar novamente.')
    }
  }, [initial.loadFailed, state, writeState])
  useEffect(() => {
    const timeoutId = window.setTimeout(retrySave, 0)
    return () => window.clearTimeout(timeoutId)
  }, [retrySave])

  const selectCharacter = useCallback((activeCharacterId: string) => setState((current) => (
    current.characters.some(({ id }) => id === activeCharacterId) ? { ...current, activeCharacterId } : current
  )), [])

  const updateCharacter = useCallback((update: CharacterUpdate) => setState((current) => {
    const index = current.characters.findIndex(({ id }) => id === current.activeCharacterId)
    const character = current.characters[index]
    if (!character) return current
    const changes = typeof update === 'function' ? update(character) : update
    const characters = [...current.characters]
    characters[index] = { ...character, ...changes }
    return { ...current, characters }
  }), [])

  const addCharacter = useCallback(() => {
    const character = createCharacter()
    setState((current) => ({ characters: [...current.characters, character], activeCharacterId: character.id }))
  }, [])

  const deleteActiveCharacter = useCallback(() => setState((current) => {
    if (current.characters.length <= 1) return current
    const characters = current.characters.filter(({ id }) => id !== current.activeCharacterId)
    return { characters, activeCharacterId: characters[0].id }
  }), [])

  const persistenceError = initial.loadFailed
    ? 'Não foi possível carregar as fichas salvas. O salvamento foi pausado para proteger os dados existentes.'
    : saveError

  return { state, activeCharacter, selectCharacter, updateCharacter, addCharacter, deleteActiveCharacter, persistenceError, retrySave, loadFailed: initial.loadFailed }
}
