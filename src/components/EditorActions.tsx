interface EditorActionsProps { canSave: boolean; onCancel: () => void; onSave: () => void }

export function EditorActions({ canSave, onCancel, onSave }: EditorActionsProps) {
  return <div className="editor-actions"><button className="button" type="button" onClick={onCancel}>Cancelar</button><button className="button primary" type="button" disabled={!canSave} onClick={onSave}>Salvar</button></div>
}

