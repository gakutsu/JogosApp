import { useEffect, useRef, useState } from 'react'

export const MATCH_TIMER_STORAGE_KEY = 'jogosapp-brasil-match-timer'

const REAL_SECONDS_PER_HALF = 4 * 60
const MATCH_SECONDS_PER_HALF = 45 * 60
const TIMER_RATE = MATCH_SECONDS_PER_HALF / REAL_SECONDS_PER_HALF
const MAX_ADDED_MINUTES = 15

const DEFAULT_TIMER = {
  period: 'first',
  matchSeconds: 0,
  running: false,
  firstAdded: 0,
  secondAdded: 0,
  savedAt: Date.now(),
}

function getLimit(period, firstAdded, secondAdded) {
  if (period === 'first' || period === 'halftime') return (45 + firstAdded) * 60
  return (90 + secondAdded) * 60
}

function loadTimer() {
  try {
    const raw = localStorage.getItem(MATCH_TIMER_STORAGE_KEY)
    if (!raw) return DEFAULT_TIMER

    const saved = { ...DEFAULT_TIMER, ...JSON.parse(raw) }
    const firstAdded = Math.max(0, Math.min(MAX_ADDED_MINUTES, Number(saved.firstAdded) || 0))
    const secondAdded = Math.max(0, Math.min(MAX_ADDED_MINUTES, Number(saved.secondAdded) || 0))
    let period = ['first', 'halftime', 'second', 'ended'].includes(saved.period) ? saved.period : 'first'
    let matchSeconds = Math.max(0, Number(saved.matchSeconds) || 0)
    let running = Boolean(saved.running)

    if (running && saved.savedAt) {
      const elapsedRealSeconds = Math.max(0, (Date.now() - Number(saved.savedAt)) / 1000)
      matchSeconds += elapsedRealSeconds * TIMER_RATE
    }

    if (period === 'first') {
      const limit = getLimit('first', firstAdded, secondAdded)
      if (matchSeconds >= limit) {
        matchSeconds = limit
        period = 'halftime'
        running = false
      }
    } else if (period === 'second') {
      matchSeconds = Math.max(45 * 60, matchSeconds)
      const limit = getLimit('second', firstAdded, secondAdded)
      if (matchSeconds >= limit) {
        matchSeconds = limit
        period = 'ended'
        running = false
      }
    } else if (period === 'halftime') {
      matchSeconds = Math.min(matchSeconds, getLimit('first', firstAdded, secondAdded))
      running = false
    } else if (period === 'ended') {
      matchSeconds = Math.min(Math.max(matchSeconds, 90 * 60), getLimit('second', firstAdded, secondAdded))
      running = false
    }

    return { period, matchSeconds, running, firstAdded, secondAdded, savedAt: Date.now() }
  } catch {
    return DEFAULT_TIMER
  }
}

function formatClock(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function periodLabel(period) {
  if (period === 'first') return '1º TEMPO'
  if (period === 'halftime') return 'INTERVALO'
  if (period === 'second') return '2º TEMPO'
  return 'ENCERRADO'
}

export default function MatchTimer({ matchStatus, onMatchStatusChange, resetToken = 0 }) {
  const initial = useRef(loadTimer()).current
  const [period, setPeriod] = useState(initial.period)
  const [matchSeconds, setMatchSeconds] = useState(initial.matchSeconds)
  const [running, setRunning] = useState(initial.running)
  const [firstAdded, setFirstAdded] = useState(initial.firstAdded)
  const [secondAdded, setSecondAdded] = useState(initial.secondAdded)
  const previousResetToken = useRef(resetToken)
  const lastTick = useRef(performance.now())
  const lastPersist = useRef(0)

  const currentAdded = period === 'second' || period === 'ended' ? secondAdded : firstAdded
  const additionsDisabled = period === 'halftime' || period === 'ended'

  useEffect(() => {
    if (previousResetToken.current === resetToken) return
    previousResetToken.current = resetToken

    localStorage.removeItem(MATCH_TIMER_STORAGE_KEY)
    setPeriod('first')
    setMatchSeconds(0)
    setRunning(false)
    setFirstAdded(0)
    setSecondAdded(0)
    lastTick.current = performance.now()
  }, [resetToken])

  useEffect(() => {
    if (matchStatus === 'Pênaltis' || matchStatus === 'Fim de jogo') {
      setRunning(false)
    }
  }, [matchStatus])

  useEffect(() => {
    const now = Date.now()
    if (running && now - lastPersist.current < 500) return
    lastPersist.current = now

    localStorage.setItem(MATCH_TIMER_STORAGE_KEY, JSON.stringify({
      period,
      matchSeconds,
      running,
      firstAdded,
      secondAdded,
      savedAt: now,
    }))
  }, [period, matchSeconds, running, firstAdded, secondAdded])

  useEffect(() => {
    if (!running || (period !== 'first' && period !== 'second')) return undefined

    lastTick.current = performance.now()
    const interval = window.setInterval(() => {
      const now = performance.now()
      const elapsedRealSeconds = (now - lastTick.current) / 1000
      lastTick.current = now

      setMatchSeconds((current) => {
        const limit = getLimit(period, firstAdded, secondAdded)
        const next = current + elapsedRealSeconds * TIMER_RATE

        if (next < limit) return next

        window.setTimeout(() => {
          setRunning(false)
          if (period === 'first') {
            setPeriod('halftime')
          } else {
            setPeriod('ended')
            onMatchStatusChange('Fim de jogo')
          }
        }, 0)

        return limit
      })
    }, 80)

    return () => window.clearInterval(interval)
  }, [running, period, firstAdded, secondAdded, onMatchStatusChange])

  const toggleRunning = () => {
    if (period === 'ended' || period === 'halftime') return
    if (!running) {
      onMatchStatusChange('Ao vivo')
      lastTick.current = performance.now()
    }
    setRunning((value) => !value)
  }

  const startSecondHalf = () => {
    setPeriod('second')
    setMatchSeconds(45 * 60)
    setRunning(true)
    lastTick.current = performance.now()
    onMatchStatusChange('Ao vivo')
  }

  const finishCurrentPeriod = () => {
    if (period === 'first') {
      setMatchSeconds(getLimit('first', firstAdded, secondAdded))
      setRunning(false)
      setPeriod('halftime')
      return
    }

    if (period === 'second') {
      setMatchSeconds(getLimit('second', firstAdded, secondAdded))
      setRunning(false)
      setPeriod('ended')
      onMatchStatusChange('Fim de jogo')
    }
  }

  const updateAddedTime = (value) => {
    const minutes = Number(value)
    if (period === 'second') setSecondAdded(minutes)
    else if (period === 'first') setFirstAdded(minutes)
  }

  return (
    <div className={`match-timer ${running ? 'running' : ''}`}>
      <div className="match-timer-heading">
        <span className="match-timer-phase">{periodLabel(period)}</span>
        {running && <span className="match-timer-live-dot" aria-hidden="true"></span>}
      </div>

      <div className="match-timer-clock" aria-label={`Cronômetro ${formatClock(matchSeconds)}`}>
        {formatClock(matchSeconds)}
      </div>

      <div className="match-timer-controls">
        {(period === 'first' || period === 'second') && (
          <button
            className={`timer-control-btn ${running ? 'pause' : 'play'}`}
            type="button"
            onClick={toggleRunning}
            title={running ? 'Pausar cronômetro' : 'Iniciar cronômetro'}
          >
            <i className={`fa-solid ${running ? 'fa-pause' : 'fa-play'}`}></i>
            <span>{running ? 'Pausar' : 'Iniciar'}</span>
          </button>
        )}

        {period === 'halftime' && (
          <button className="timer-control-btn primary" type="button" onClick={startSecondHalf}>
            <i className="fa-solid fa-play"></i>
            <span>Iniciar 2º tempo</span>
          </button>
        )}

        <label className={`timer-added-control ${additionsDisabled ? 'disabled' : ''}`}>
          <span>Acréscimos</span>
          <select
            value={currentAdded}
            onChange={(event) => updateAddedTime(event.target.value)}
            disabled={additionsDisabled}
            aria-label="Minutos de acréscimos"
          >
            {Array.from({ length: MAX_ADDED_MINUTES + 1 }, (_, minute) => (
              <option key={minute} value={minute}>{minute === 0 ? 'Sem' : `+${minute} min`}</option>
            ))}
          </select>
        </label>

        {(period === 'first' || period === 'second') && (
          <button className="timer-end-btn" type="button" onClick={finishCurrentPeriod}>
            {period === 'first' ? 'Encerrar 1ºT' : 'Encerrar jogo'}
          </button>
        )}
      </div>

      <div className="match-timer-scale">4 min reais = 45 min de jogo</div>
    </div>
  )
}
