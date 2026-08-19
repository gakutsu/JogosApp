import { useCallback, useMemo, useState } from 'react'
import EventList from './components/EventList.jsx'
import EventModal from './components/EventModal.jsx'
import TeamSelectorModal from './components/TeamSelectorModal.jsx'
import MatchTimer, { MATCH_TIMER_STORAGE_KEY } from './components/MatchTimer.jsx'
import { DEFAULT_MATCH_TEAMS, findBrazilianClub } from './data/brazilianClubs.js'

const STORAGE_KEY = 'jogosapp-brasil-events'
const MATCH_TEAMS_STORAGE_KEY = 'jogosapp-brasil-match-teams'
const MATCH_STATUS_STORAGE_KEY = 'jogosapp-brasil-match-status'

const MATCH_STATUSES = [
  'Ao vivo',
  'Pênaltis',
  'Fim de jogo',
]

function loadEvents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}


function loadMatchStatus() {
  try {
    const saved = localStorage.getItem(MATCH_STATUS_STORAGE_KEY)

    if (MATCH_STATUSES.includes(saved)) return saved

    // Migração automática das versões anteriores do projeto.
    if (saved === 'Pênaltis') return 'Pênaltis'
    if (saved === 'Fim de Jogo') return 'Fim de jogo'
    if (saved) return 'Ao vivo'

    return 'Fim de jogo'
  } catch {
    return 'Fim de jogo'
  }
}

function loadMatchTeams() {
  try {
    const saved = localStorage.getItem(MATCH_TEAMS_STORAGE_KEY)
    if (!saved) return DEFAULT_MATCH_TEAMS

    const parsed = JSON.parse(saved)
    const left = findBrazilianClub(parsed.left, DEFAULT_MATCH_TEAMS.left)
    const right = findBrazilianClub(parsed.right, DEFAULT_MATCH_TEAMS.right)

    if (left.id === right.id) return DEFAULT_MATCH_TEAMS
    return { left, right }
  } catch {
    return DEFAULT_MATCH_TEAMS
  }
}

export default function App() {
  const [events, setEvents] = useState(loadEvents)
  const [teams, setTeams] = useState(loadMatchTeams)
  const [matchStatus, setMatchStatus] = useState(loadMatchStatus)
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [teamModalMode, setTeamModalMode] = useState('edit')
  const [goalAlert, setGoalAlert] = useState(null)
  const [timerResetToken, setTimerResetToken] = useState(0)

  const updateMatchStatus = useCallback((nextStatus) => {
    setMatchStatus(nextStatus)
    localStorage.setItem(MATCH_STATUS_STORAGE_KEY, nextStatus)
  }, [])

  const score = useMemo(() => {
    let home = 0
    let away = 0

    for (const event of events) {
      if (event.type === 'goal' || event.type === 'penalty-goal') {
        if (event.side === 'left') home += 1
        if (event.side === 'right') away += 1
      }

      if (event.type === 'own-goal') {
        if (event.side === 'left') away += 1
        if (event.side === 'right') home += 1
      }
    }

    return { home, away }
  }, [events])

  const addEvent = (newEvent) => {
    const next = [...events, newEvent]
    setEvents(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setEventModalOpen(false)

    if (['goal', 'penalty-goal', 'own-goal'].includes(newEvent.type)) {
      const nextScore = next.reduce((acc, event) => {
        if (event.type === 'goal' || event.type === 'penalty-goal') {
          event.side === 'left' ? acc.home++ : acc.away++
        } else if (event.type === 'own-goal') {
          event.side === 'left' ? acc.away++ : acc.home++
        }
        return acc
      }, { home: 0, away: 0 })

      setGoalAlert({ player: newEvent.player, score: nextScore })
      window.setTimeout(() => setGoalAlert(null), 2800)
    }
  }

  const removeEvent = (eventToRemove) => {
    const confirmed = window.confirm(`Remover o evento de ${eventToRemove.player}?`)
    if (!confirmed) return

    const next = events.filter((event) => event.id !== eventToRemove.id)
    setEvents(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const persistTeams = (nextTeams) => {
    setTeams(nextTeams)
    localStorage.setItem(MATCH_TEAMS_STORAGE_KEY, JSON.stringify({
      left: nextTeams.left.id,
      right: nextTeams.right.id,
    }))
  }

  const saveTeams = (nextTeams) => {
    persistTeams(nextTeams)
    setTeamModalOpen(false)
  }

  const startNewMatch = (nextTeams) => {
    const hasCurrentMatchData = events.length > 0 || score.home > 0 || score.away > 0
    if (hasCurrentMatchData) {
      const confirmed = window.confirm('Iniciar uma nova partida? A partida atual e todos os eventos serão apagados e não ficarão salvos.')
      if (!confirmed) return
    }

    persistTeams(nextTeams)
    setEvents([])
    localStorage.removeItem(STORAGE_KEY)
    updateMatchStatus('Ao vivo')
    localStorage.removeItem(MATCH_TIMER_STORAGE_KEY)
    setTimerResetToken((value) => value + 1)
    setGoalAlert(null)
    setTeamModalOpen(false)
  }

  const openTeamSelector = (mode = 'edit') => {
    setTeamModalMode(mode)
    setTeamModalOpen(true)
  }

  const isLive = matchStatus !== 'Fim de jogo'

  return (
    <>
      <div id="app" className="desktop-app">
        <header className="desktop-header">
          <div className="desktop-header-left">
            <button className="icon-btn"><i className="fa-solid fa-arrow-left"></i></button>

            <div className="club-brand">
              <div className="club-logo">COR</div>
              <div className="club-brand-text">
                <h1 style={{ fontFamily: "'Poppins', sans-serif" }}>Corinthians</h1>
                <span style={{ fontFamily: "'Poppins', sans-serif" }}>Brasil</span>
              </div>
            </div>
          </div>

          <div className="desktop-header-right">
            <button className="icon-btn"><i className="fa-regular fa-bell"></i></button>
            <button className="icon-btn"><i className="fa-regular fa-heart"></i></button>
            <button className="icon-btn"><i className="fa-regular fa-bookmark"></i></button>
            <button className="icon-btn"><i className="fa-solid fa-share-nodes"></i></button>
          </div>
        </header>

        <main className="desktop-layout">
          <aside className="desktop-sidebar-left">
            <section className="panel panel-club">
              <div className="panel-title-row">
                <h2 style={{ fontFamily: "'Poppins', sans-serif" }}>Clube</h2>
              </div>

              <div className="club-card-large">
                <div className="club-logo large">COR</div>
                <div className="club-info-large">
                  <h3 style={{ fontFamily: "'Poppins', sans-serif" }}>Corinthians</h3>
                  <p style={{ fontFamily: "'Poppins', sans-serif" }}>Notícias, jogos, temporada e estatísticas</p>
                </div>
              </div>

              <nav className="top-tabs desktop-tabs">
                <button className="tab active">Notícias</button>
                <button className="tab">Jogos</button>
                <button className="tab">Temporada</button>
                <button className="tab">Estatísticas</button>
                <button className="tab">Oficial</button>
              </nav>
            </section>

            <section className="panel news-sidebar">
              <div className="panel-title-row">
                <h2 style={{ fontFamily: "'Poppins', sans-serif" }}>Últimas Notícias</h2>
              </div>
              <div id="newsList"></div>
            </section>
          </aside>

          <section className="desktop-main-content">
            <section className={`panel match-score-panel ${isLive ? 'is-live' : ''}`}>
              <div className="match-score-top">
                <button
                  className="team-block team-select-trigger"
                  type="button"
                  onClick={() => openTeamSelector('edit')}
                  title="Escolher clubes da partida"
                >
                  <div className="team-logo"><img src={teams.left.logo} alt={teams.left.name} /></div>
                  <div className="team-name" style={{ fontFamily: "'Poppins', sans-serif" }}>{teams.left.name}</div>
                </button>

                <div className="score-center">
                  <div className="score-value">
                    <span id="homeScore" className="score-number">{score.home}</span>
                    <span className="score-colon" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 700 }}>:</span>
                    <span id="awayScore" className="score-number">{score.away}</span>
                  </div>
                  <div className={`score-status-wrap status-${matchStatus === 'Ao vivo' ? 'live' : matchStatus === 'Pênaltis' ? 'penalties' : 'ended'}`}>
                    <select
                      className="score-status-select"
                      value={matchStatus}
                      onChange={(event) => {
                        const nextStatus = event.target.value
                        updateMatchStatus(nextStatus)
                      }}
                      aria-label="Situação da partida"
                      title="Alterar situação da partida"
                      style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
                    >
                      {MATCH_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down score-status-chevron" aria-hidden="true"></i>
                  </div>
                </div>

                <button
                  className="team-block team-select-trigger"
                  type="button"
                  onClick={() => openTeamSelector('edit')}
                  title="Escolher clubes da partida"
                >
                  <div className="team-logo"><img src={teams.right.logo} alt={teams.right.name} /></div>
                  <div className="team-name" style={{ fontFamily: "'Poppins', sans-serif" }}>{teams.right.name}</div>
                </button>
              </div>

              <nav className="match-tabs">
                <button className="tab active" data-tab="geral">Visão geral</button>
                <button className="tab" data-tab="lances">Lance a Lance</button>
                <button className="tab" data-tab="escalacao">Escalação</button>
                <button className="tab" data-tab="estatisticas">Estatísticas</button>
                <button
                  className="new-match-btn"
                  type="button"
                  onClick={() => openTeamSelector('new')}
                  title="Iniciar nova partida sem salvar a partida atual"
                >
                  <i className="fa-solid fa-rotate-right"></i>
                  Nova partida
                </button>
              </nav>
            </section>

            <section className="panel match-timer-panel" aria-label="Cronômetro da partida">
              <div className="match-timer-panel-header">
                <div className="match-timer-panel-title">
                  <i className="fa-regular fa-clock" aria-hidden="true"></i>
                  <span>Cronômetro da partida</span>
                </div>
                <span className="match-timer-panel-hint">4 min reais = 45 min de jogo</span>
              </div>

              <MatchTimer
                matchStatus={matchStatus}
                onMatchStatusChange={updateMatchStatus}
                resetToken={timerResetToken}
              />
            </section>

            <section className="panel match-section" id="tab-lances">
              <div className="panel-title-row event-panel-title-row">
                <h2>Eventos do jogo</h2>
                <button className="add-event-btn" type="button" onClick={() => setEventModalOpen(true)}>
                  <i className="fa-solid fa-plus"></i>
                  Novo evento
                </button>
              </div>

              <EventList events={events} onRemove={removeEvent} />
            </section>
          </section>

          <aside className="desktop-sidebar-right">
            <section className="panel">
              <div className="panel-title-row">
                <h2 style={{ fontFamily: "'Poppins', sans-serif" }}>Atalhos</h2>
              </div>
              <div className="shortcut-grid">
                <button className="shortcut-btn active"><i className="fa-solid fa-house"></i><span>Início</span></button>
                <button className="shortcut-btn" onClick={() => openTeamSelector('edit')} title="Escolher clubes da partida">
                  <i className="fa-regular fa-futbol"></i><span>Jogos</span>
                </button>
                <button className="shortcut-btn"><i className="fa-solid fa-tv"></i><span>TV</span></button>
              </div>
            </section>
          </aside>
        </main>
      </div>

      <div className={`goal-alert-overlay ${goalAlert ? 'show' : ''}`}>
        <div className="goal-alert">
          <div className="goal-alert-icon"><i className="fa-solid fa-futbol"></i></div>
          <div className="goal-alert-content">
            <div className="goal-alert-title" style={{ fontFamily: "'Poppins', sans-serif" }}>GOL!</div>
            <div className="goal-alert-player" style={{ fontFamily: "'Poppins', sans-serif" }}>{goalAlert?.player ?? 'Jogador'}</div>
            <div className="goal-alert-info" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {teams.left.name} {goalAlert?.score.home ?? score.home}-{goalAlert?.score.away ?? score.away} {teams.right.name}
            </div>
          </div>
        </div>
      </div>

      <div className="news-modal-overlay" aria-hidden="true">
        <div className="news-modal">
          <button className="news-close"><i className="fa-solid fa-xmark"></i></button>
          <img src="" alt="" />
          <h2></h2>
          <p></p>
        </div>
      </div>

      <EventModal
        open={eventModalOpen}
        teams={teams}
        onClose={() => setEventModalOpen(false)}
        onAdd={addEvent}
      />

      <TeamSelectorModal
        open={teamModalOpen}
        mode={teamModalMode}
        currentTeams={teams}
        onClose={() => setTeamModalOpen(false)}
        onSave={teamModalMode === 'new' ? startNewMatch : saveTeams}
      />
    </>
  )
}
