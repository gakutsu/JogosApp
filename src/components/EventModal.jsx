import { useEffect, useState } from 'react'
import { AVAILABLE_PLAYERS } from '../data/players.js'

const EVENT_TYPES = [
  { value: 'goal', label: 'Gol' },
  { value: 'penalty-goal', label: 'Gol de pênalti' },
  { value: 'own-goal', label: 'Gol contra' },
  { value: 'missed-penalty', label: 'Pênalti perdido' },
  { value: 'yellow-card', label: 'Cartão amarelo' },
  { value: 'red-card', label: 'Cartão vermelho' },
  { value: 'substitute', label: 'Substituição' },
]

export default function EventModal({ open, teams, onClose, onAdd }) {
  const [form, setForm] = useState({
    minute: '',
    side: 'left',
    type: 'goal',
    player: '',
    detail: '',
  })

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }))

  const submit = (event) => {
    event.preventDefault()
    if (!form.minute.trim() || !form.player.trim()) return

    onAdd({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...form,
      minute: form.minute.trim().replace(/'$/, ''),
      player: form.player.trim(),
      detail: form.detail.trim(),
      createdAt: new Date().toISOString(),
    })

    setForm({ minute: '', side: 'left', type: 'goal', player: '', detail: '' })
  }

  return (
    <div className="event-modal-overlay show" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="event-modal" role="dialog" aria-modal="true" aria-labelledby="event-modal-title">
        <div className="event-modal-header">
          <div>
            <span className="event-modal-kicker">Partida atual</span>
            <h2 id="event-modal-title">Cadastrar novo evento</h2>
          </div>
          <button className="event-modal-close" type="button" onClick={onClose} aria-label="Fechar">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form className="event-form" onSubmit={submit}>
          <div className="event-form-grid compact-grid">
            <label className="event-form-field minute-field">
              <span>Minuto *</span>
              <div className="minute-input-wrap">
                <input
                  autoFocus
                  value={form.minute}
                  onChange={(e) => update('minute', e.target.value)}
                  placeholder="Ex.: 45+2"
                  maxLength={6}
                  required
                />
                <strong>'</strong>
              </div>
            </label>

            <label className="event-form-field">
              <span>Equipe *</span>
              <select value={form.side} onChange={(e) => update('side', e.target.value)}>
                <option value="left">{teams.left.name}</option>
                <option value="right">{teams.right.name}</option>
              </select>
            </label>
          </div>

          <label className="event-form-field">
            <span>Tipo de evento *</span>
            <select value={form.type} onChange={(e) => update('type', e.target.value)}>
              {EVENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </label>

          <label className="event-form-field">
            <span>Jogador *</span>
            <input
              value={form.player}
              onChange={(e) => update('player', e.target.value)}
              placeholder="Nome do jogador"
              list="available-players"
              required
            />
            <datalist id="available-players">
              {AVAILABLE_PLAYERS.map((player) => (
                <option key={player.id} value={player.name} />
              ))}
            </datalist>
          </label>

          <label className="event-form-field">
            <span>Observação</span>
            <input
              value={form.detail}
              onChange={(e) => update('detail', e.target.value)}
              placeholder="Ex.: assistência, substituído por..."
            />
          </label>

          <div className="event-form-actions">
            <button className="event-secondary-btn" type="button" onClick={onClose}>Cancelar</button>
            <button className="event-primary-btn" type="submit">
              <i className="fa-solid fa-plus"></i>
              Cadastrar evento
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
