import { useEffect, useMemo, useState } from 'react'
import { BRAZILIAN_CLUBS } from '../data/brazilianClubs.js'

function TeamPicker({ label, value, blockedId, onChange }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const teams = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR')
    if (!term) return BRAZILIAN_CLUBS
    return BRAZILIAN_CLUBS.filter((team) => team.name.toLocaleLowerCase('pt-BR').includes(term))
  }, [search])

  useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  return (
    <div className="team-picker">
      <span className="team-picker-label">{label}</span>

      <button
        className={`team-picker-current ${open ? 'open' : ''}`}
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className="team-picker-current-main">
          <img src={value.logo} alt="" />
          <strong>{value.name}</strong>
        </span>
        <i className={`fa-solid fa-chevron-${open ? 'up' : 'down'}`}></i>
      </button>

      {open && (
        <div className="team-picker-dropdown">
          <div className="team-picker-search-wrap">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar clube"
            />
          </div>

          <div className="team-picker-options">
            {teams.map((team) => {
              const disabled = team.id === blockedId
              const selected = team.id === value.id

              return (
                <button
                  key={team.id}
                  className={`team-picker-option ${selected ? 'selected' : ''}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(team)
                    setOpen(false)
                  }}
                >
                  <img src={team.logo} alt="" />
                  <span>{team.name}</span>
                  {selected && <i className="fa-solid fa-check"></i>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TeamSelectorModal({ open, mode = 'edit', currentTeams, onClose, onSave }) {
  const [draft, setDraft] = useState(currentTeams)

  useEffect(() => {
    if (open) setDraft(currentTeams)
  }, [open, currentTeams])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="event-modal-overlay show" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="event-modal team-selector-modal" role="dialog" aria-modal="true" aria-labelledby="team-selector-title">
        <div className="event-modal-header">
          <div>
            <span className="event-modal-kicker">{mode === 'new' ? 'Nova partida' : 'Partida atual'}</span>
            <h2 id="team-selector-title">{mode === 'new' ? 'Iniciar nova partida' : 'Escolher clubes'}</h2>
          </div>
          <button className="event-modal-close" type="button" onClick={onClose} aria-label="Fechar">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="team-selector-body">
          <p className={`team-selector-helper ${mode === 'new' ? 'new-match-warning' : ''}`}>
            {mode === 'new' ? (
              <>Escolha os clubes da nova partida. Ao iniciar, <strong>a partida atual e os eventos serão apagados sem criar histórico</strong>.</>
            ) : (
              <>Os escudos e os nomes abaixo usam os arquivos existentes em <strong>public/img/logos</strong>, importados do CorinthiansApp.</>
            )}
          </p>

          <div className="team-selector-grid">
            <TeamPicker
              label="Clube da esquerda"
              value={draft.left}
              blockedId={draft.right.id}
              onChange={(team) => setDraft((current) => ({ ...current, left: team }))}
            />
            <TeamPicker
              label="Clube da direita"
              value={draft.right}
              blockedId={draft.left.id}
              onChange={(team) => setDraft((current) => ({ ...current, right: team }))}
            />
          </div>

          <div className="team-selector-preview" aria-label="Prévia do confronto">
            <div className="team-selector-preview-side">
              <img src={draft.left.logo} alt={draft.left.name} />
              <strong>{draft.left.name}</strong>
            </div>
            <span>×</span>
            <div className="team-selector-preview-side">
              <img src={draft.right.logo} alt={draft.right.name} />
              <strong>{draft.right.name}</strong>
            </div>
          </div>

          <div className="event-form-actions">
            <button className="event-secondary-btn" type="button" onClick={onClose}>Cancelar</button>
            <button className="event-primary-btn" type="button" onClick={() => onSave(draft)}>
              <i className={`fa-solid ${mode === 'new' ? 'fa-play' : 'fa-check'}`}></i>
              {mode === 'new' ? 'Iniciar partida' : 'Salvar confronto'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
