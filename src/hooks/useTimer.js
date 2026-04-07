import { useState, useEffect, useRef, useCallback } from 'react'

const MODES = { FOCUS: 'focus', SHORT: 'short', LONG: 'long' }

const DEFAULT_SETTINGS = {
  focusDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakAfter: 4,
  autoStart: false,
  sound: true,
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('pomoflow-settings')
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

function loadSessions() {
  try {
    const saved = JSON.parse(localStorage.getItem('pomoflow-sessions') || '{}')
    const today = new Date().toDateString()
    return saved.date === today ? saved.count : 0
  } catch {
    return 0
  }
}

function saveSessions(count) {
  localStorage.setItem('pomoflow-sessions', JSON.stringify({
    date: new Date().toDateString(),
    count,
  }))
}

function getDuration(mode, settings) {
  if (mode === MODES.FOCUS) return settings.focusDuration * 60
  if (mode === MODES.SHORT) return settings.shortBreak * 60
  return settings.longBreak * 60
}

function playDing(enabled) {
  if (!enabled) return
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3)
    gain.gain.setValueAtTime(0.4, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.8)
  } catch {}
}

export function useTimer() {
  const [settings, setSettings] = useState(loadSettings)
  const [mode, setMode] = useState(MODES.FOCUS)
  const [isRunning, setIsRunning] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isMini, setIsMini] = useState(false)
  const [sessionCount, setSessionCount] = useState(loadSessions)
  const [focusSessionsDone, setFocusSessionsDone] = useState(0)

  const totalSeconds = getDuration(mode, settings)
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)

  const intervalRef = useRef(null)
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  // Reset timer when mode or settings change (only when not running)
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(getDuration(mode, settings))
    }
  }, [mode, settings.focusDuration, settings.shortBreak, settings.longBreak])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            handleSessionComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  function handleSessionComplete() {
    playDing(settingsRef.current.sound)
    setIsRunning(false)

    if (mode === MODES.FOCUS) {
      const newCount = sessionCount + 1
      setSessionCount(newCount)
      saveSessions(newCount)
      const newDone = focusSessionsDone + 1

      if (newDone >= settingsRef.current.longBreakAfter) {
        setFocusSessionsDone(0)
        setMode(MODES.LONG)
        if (settingsRef.current.autoStart) {
          setTimeout(() => {
            setSecondsLeft(getDuration(MODES.LONG, settingsRef.current))
            setIsRunning(true)
          }, 100)
        } else {
          setSecondsLeft(getDuration(MODES.LONG, settingsRef.current))
        }
      } else {
        setFocusSessionsDone(newDone)
        setMode(MODES.SHORT)
        if (settingsRef.current.autoStart) {
          setTimeout(() => {
            setSecondsLeft(getDuration(MODES.SHORT, settingsRef.current))
            setIsRunning(true)
          }, 100)
        } else {
          setSecondsLeft(getDuration(MODES.SHORT, settingsRef.current))
        }
      }
    } else {
      setMode(MODES.FOCUS)
      if (settingsRef.current.autoStart) {
        setTimeout(() => {
          setSecondsLeft(getDuration(MODES.FOCUS, settingsRef.current))
          setIsRunning(true)
        }, 100)
      } else {
        setSecondsLeft(getDuration(MODES.FOCUS, settingsRef.current))
      }
    }
  }

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])

  const done = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    if (mode === MODES.FOCUS) {
      const newCount = sessionCount + 1
      setSessionCount(newCount)
      saveSessions(newCount)
      const newDone = focusSessionsDone + 1
      if (newDone >= settings.longBreakAfter) {
        setFocusSessionsDone(0)
        setMode(MODES.LONG)
        setSecondsLeft(getDuration(MODES.LONG, settings))
      } else {
        setFocusSessionsDone(newDone)
        setMode(MODES.SHORT)
        setSecondsLeft(getDuration(MODES.SHORT, settings))
      }
    } else {
      setMode(MODES.FOCUS)
      setSecondsLeft(getDuration(MODES.FOCUS, settings))
    }
  }, [mode, sessionCount, focusSessionsDone, settings])

  const updateSettings = useCallback((newSettings) => {
    const merged = { ...settings, ...newSettings }
    setSettings(merged)
    localStorage.setItem('pomoflow-settings', JSON.stringify(merged))
    if (!isRunning) {
      setSecondsLeft(getDuration(mode, merged))
    }
  }, [settings, isRunning, mode])

  const elapsed = totalSeconds - secondsLeft
  const elapsedPct = totalSeconds > 0 ? elapsed / totalSeconds : 0

  const minutes = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  return {
    mode,
    MODES,
    isRunning,
    isMini,
    setIsMini,
    isSettingsOpen,
    setIsSettingsOpen,
    sessionCount,
    settings,
    updateSettings,
    timeStr,
    elapsedPct,
    secondsLeft,
    totalSeconds,
    start,
    pause,
    done,
  }
}
