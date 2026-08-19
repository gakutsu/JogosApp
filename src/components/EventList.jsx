const TYPE_META = {
  goal: { label: 'Gol', icon: 'fa-solid fa-futbol' },
  'penalty-goal': { label: 'Gol de pênalti', icon: 'fa-solid fa-futbol' },
  'own-goal': { label: 'Gol contra', icon: 'fa-solid fa-futbol' },
  'missed-penalty': { label: 'Pênalti perdido', icon: 'fa-solid fa-xmark' },
  'yellow-card': { label: 'Cartão amarelo', icon: '' },
  'red-card': { label: 'Cartão vermelho', icon: '' },
  substitute: { label: 'Substituição', icon: 'fa-solid fa-arrow-right-arrow-left' },
}

export default function EventList({ events, onRemove }) {
  if (!events.length) {
    return (
      <div className="events-empty-state">
        <div className="events-empty-icon"><i className="fa-regular fa-futbol"></i></div>
        <strong>Nenhum evento cadastrado</strong>
        <span>Use “Novo evento” para registrar os lances da partida.</span>
      </div>
    )
  }

  return (
    <div className="events-list">
      {events.map((event) => {
        const meta = TYPE_META[event.type] ?? TYPE_META.goal
        return (
          <div
            className={`event-row ${event.side}`}
            key={event.id}
            data-goal={event.type === 'goal' || event.type === 'penalty-goal' ? 'true' : 'false'}
            data-own-goal={event.type === 'own-goal' ? 'true' : 'false'}
          >
            <div className="event-content">
              <div className="event-minute">{event.minute}'</div>
              <div className={`event-icon ${event.type}`}>
                {meta.icon && <i className={meta.icon}></i>}
              </div>
              <div className="event-text">
                <strong>{event.player}</strong>
                <span>{event.detail || meta.label}</span>
              </div>
            </div>

            <button
              className="remove-event-btn"
              type="button"
              title="Remover evento"
              aria-label={`Remover evento de ${event.player}`}
              onClick={() => onRemove(event)}
            >
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>
        )
      })}
    </div>
  )
}
