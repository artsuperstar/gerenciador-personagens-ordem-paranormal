interface EditButtonProps { label: string; onClick: () => void }

export function EditButton({ label, onClick }: EditButtonProps) {
  return <button className="edit-button" type="button" aria-label={label} title={label} onClick={onClick}>Editar</button>
}

