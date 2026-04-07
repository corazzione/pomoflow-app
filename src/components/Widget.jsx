import { RadialTimer } from './RadialTimer'
import { Settings } from './Settings'
import { t } from '../i18n'

// Icons
const IconExpand = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M2 5V2H5M9 2H12V5M12 9V12H9M5 12H2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconCompress = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <path d="M5 2V5H2M12 5H9V2M9 12V9H12M2 9H5V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconDots = () => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="2.5" r="1.1" fill="currentColor"/>
    <circle cx="7" cy="7" r="1.1" fill="currentColor"/>
    <circle cx="7" cy="11.5" r="1.1" fill="currentColor"/>
  </svg>
)
const IconPause = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
    <rect x="1.5" y="1" width="3.5" height="10" rx="1" fill="currentColor"/>
    <rect x="7" y="1" width="3.5" height="10" rx="1" fill="currentColor"/>
  </svg>
)
const IconPlay = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
    <path d="M3 2L12 7L3 12V2Z" fill="white"/>
  </svg>
)
const IconClose = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// Flame icon for app icon
const FlameIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
    <path d="M28 46C19 46 13 39.5 13 31C13 24 18 19 22 15.5C22 21.5 24.5 24 28 24C24.5 19.5 27 12 32 8C32 15 37 19 39.5 24C42 28 43 32 43 35C43 41.5 36.5 46 28 46Z" fill="white" fillOpacity="0.96"/>
    <path d="M28 41C23.5 41 20.5 38 20.5 34C20.5 30.5 23 28 25.5 26.5C25.5 29.5 27 31 28 31C26.5 29 27 26 29.5 24.5C29.5 27.5 32 29.5 33 32C34.5 35 33 41 28 41Z" fill="#FF7535" fillOpacity="0.65"/>
  </svg>
)

function ModeLabel({ mode, MODES, lang }) {
  if (mode === MODES.FOCUS) return t(lang, 'focus')
  if (mode === MODES.SHORT) return t(lang, 'shortBreak')
  return t(lang, 'longBreak')
}

function DotIndicator({ mode, MODES, isRunning }) {
  const color = !isRunning ? 'var(--dot-idle)' :
    mode === MODES.FOCUS ? '#FF6B2B' : '#4A9DFF'
  const glow = isRunning ? (mode === MODES.FOCUS
    ? '0 0 6px rgba(255,107,43,0.8)'
    : '0 0 6px rgba(74,157,255,0.8)') : 'none'
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8, height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: glow,
        flexShrink: 0,
        transition: 'background 0.3s, box-shadow 0.3s',
      }}
    />
  )
}

export function Widget({ timer, isDark, onThemeToggle, onClose, lang, onLangChange }) {
  const {
    mode, MODES, isRunning, isMini, setIsMini,
    isSettingsOpen, setIsSettingsOpen,
    sessionCount, settings, updateSettings,
    timeStr, elapsedPct,
    start, pause, done,
  } = timer

  const titleBar = (
    <div className="title-bar" data-tauri-drag-region>
      <div className="app-icon">
        <FlameIcon size={17} />
      </div>
      <span className="app-title">Pomoflow</span>
      <button className="btn-icon btn-close-widget" onClick={onClose} aria-label="Close">
        <IconClose />
      </button>
    </div>
  )

  // ── MINI MODE ──────────────────────────────────────────
  if (isMini) {
    return (
      <div className={`widget widget-mini ${isDark ? 'dark' : 'light'}`}>
        {titleBar}
        <div className="mini-body" data-tauri-drag-region>
          <button
            className="btn-icon"
            onClick={() => setIsMini(false)}
            aria-label="Expand"
          >
            <IconExpand />
          </button>

          <DotIndicator mode={mode} MODES={MODES} isRunning={isRunning} />

          <span className="mini-time">{timeStr}</span>

          {isRunning ? (
            <button className="btn-pause-mini" onClick={pause} aria-label="Pause">
              <IconPause />
            </button>
          ) : (
            <button className="btn-play-mini" onClick={start} aria-label="Play">
              <IconPlay />
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── SETTINGS VIEW ──────────────────────────────────────
  if (isSettingsOpen) {
    return (
      <div className={`widget widget-full ${isDark ? 'dark' : 'light'}`}>
        {titleBar}
        <Settings
          settings={settings}
          onUpdate={updateSettings}
          timeStr={timeStr}
          isRunning={isRunning}
          isDark={isDark}
          onThemeToggle={onThemeToggle}
          onClose={() => setIsSettingsOpen(false)}
          lang={lang}
          onLangChange={onLangChange}
        />
      </div>
    )
  }

  // ── FULL MODE ──────────────────────────────────────────
  return (
    <div className={`widget widget-full ${isDark ? 'dark' : 'light'}`}>
      {titleBar}
      <div className="widget-body" data-tauri-drag-region>
        <div className="top-row" data-tauri-drag-region>
          <button className="btn-icon" onClick={() => setIsMini(true)} aria-label="Minimize">
            <IconCompress />
          </button>
          <div className="session-info">
            <DotIndicator mode={mode} MODES={MODES} isRunning={isRunning} />
            <span className="session-count">{sessionCount}</span>
          </div>
          <button className="btn-icon" onClick={() => setIsSettingsOpen(true)} aria-label="Settings">
            <IconDots />
          </button>
        </div>

        <div style={{ position: 'relative', width: 168, height: 168 }} data-tauri-drag-region>
          <RadialTimer
            elapsedPct={elapsedPct}
            isRunning={isRunning}
            isDark={isDark}
            mode={mode === MODES.FOCUS ? 'focus' : 'break'}
          />
          <div className="timer-center-text">
            <span className="timer-label">
              <ModeLabel mode={mode} MODES={MODES} lang={lang} />
            </span>
            <span className="timer-time">{timeStr}</span>
          </div>
        </div>

        <div className="btn-row">
          {!isRunning ? (
            <button className="btn-primary btn-start" onClick={start}>{t(lang, 'start')}</button>
          ) : (
            <>
              <button className="btn-secondary btn-pause" onClick={pause}>
                <IconPause />
                {t(lang, 'pause')}
              </button>
              <button className="btn-primary btn-done" onClick={done}>{t(lang, 'done')}</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
