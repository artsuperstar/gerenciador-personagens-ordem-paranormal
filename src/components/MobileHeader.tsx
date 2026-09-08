interface MobileHeaderProps {
  isMenuOpen: boolean
  onMenuOpen: () => void
}

export function MobileHeader({ isMenuOpen, onMenuOpen }: MobileHeaderProps) {
  return (
    <header className="mobile-header">
      <button
        className="menu-button"
        type="button"
        aria-label="Abrir menu de agentes"
        aria-controls="character-sidebar"
        aria-expanded={isMenuOpen}
        onClick={onMenuOpen}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <div className="mobile-brand">
        <span className="brand-mark" aria-hidden="true">A</span>
        <div>
          <span>Fichas locais</span>
          <strong>Arquivo de Agentes</strong>
        </div>
      </div>
    </header>
  )
}

