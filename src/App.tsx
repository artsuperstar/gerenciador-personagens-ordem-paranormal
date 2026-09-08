import { useCallback, useEffect, useState } from 'react'
import { CharacterSheet } from './components/CharacterSheet'
import { CharacterSidebar } from './components/CharacterSidebar'
import { MobileHeader } from './components/MobileHeader'
import { useCharacters } from './hooks/useCharacters'

function App() {
  const characters = useCharacters()
  const { selectCharacter } = characters
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const handleSelect = useCallback((id: string) => {
    selectCharacter(id)
    setIsMobileSidebarOpen(false)
  }, [selectCharacter])

  useEffect(() => {
    if (!isMobileSidebarOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMobileSidebarOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isMobileSidebarOpen])

  if (!characters.activeCharacter) return null

  return <div className={`app-shell${isMobileSidebarOpen ? ' mobile-sidebar-open' : ''}`}>
    <MobileHeader isMenuOpen={isMobileSidebarOpen} onMenuOpen={() => setIsMobileSidebarOpen(true)} />
    <CharacterSidebar
      characters={characters.state.characters}
      activeCharacterId={characters.state.activeCharacterId}
      onSelect={handleSelect}
      onAdd={() => {
        characters.addCharacter()
        setIsMobileSidebarOpen(false)
      }}
      onDelete={() => {
        characters.deleteActiveCharacter()
        setIsMobileSidebarOpen(false)
      }}
      onMobileClose={() => setIsMobileSidebarOpen(false)}
    />
    <button className="sidebar-backdrop" type="button" aria-label="Fechar menu de agentes" onClick={() => setIsMobileSidebarOpen(false)} />
    <CharacterSheet key={characters.activeCharacter.id} character={characters.activeCharacter} onChange={characters.updateCharacter} />
    {characters.persistenceError && <div className="persistence-error" role="alert"><p>{characters.persistenceError}</p>{!characters.loadFailed && <button className="button" type="button" onClick={characters.retrySave}>Tentar salvar novamente</button>}</div>}
  </div>
}

export default App
