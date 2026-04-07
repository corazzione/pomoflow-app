import { t } from '../i18n'

function NumControl({ label, value, min, max, onChange, unit }) {
  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>
      <div className="setting-control">
        <button
          className="num-btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >−</button>
        <span className="num-value">{value}</span>
        <button
          className="num-btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >+</button>
        {unit && <span className="setting-unit">{unit}</span>}
      </div>
    </div>
  )
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="setting-row">
      <span className="setting-label">{label}</span>
      <button
        className={`toggle ${value ? 'on' : ''}`}
        onClick={() => onChange(!value)}
        aria-checked={value}
        role="switch"
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  )
}

const LANGS = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
  { code: 'es', label: 'ES' },
]

function LangSelector({ lang, onLangChange, labelText }) {
  return (
    <div className="setting-row">
      <span className="setting-label">{labelText}</span>
      <div className="setting-control lang-selector">
        {LANGS.map(l => (
          <button
            key={l.code}
            className={`lang-btn ${lang === l.code ? 'active' : ''}`}
            onClick={() => onLangChange(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function Settings({ settings, onUpdate, timeStr, isRunning, isDark, onThemeToggle, onClose, lang, onLangChange }) {
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <span className="settings-title">{t(lang, 'settings')}</span>
        {isRunning && (
          <span className="settings-badge">{timeStr}</span>
        )}
        <a
          href="https://buymeacoffee.com/corazzione"
          className="btn-support"
          aria-label="Buy me a coffee"
          title="Buy me a coffee"
          target="_blank"
          rel="noreferrer"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M5 8h14l-1.5 9A2 2 0 0 1 15.52 19H8.48A2 2 0 0 1 6.5 17L5 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M5 8H4a2 2 0 0 0 0 4h1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M8 8V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a
          href="mailto:markuscorazzione@gmail.com"
          className="btn-support"
          aria-label="Support via email"
          title="Contact support"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M1 5.5L8 9.5L15 5.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </a>
        <button className="btn-close-settings" onClick={onClose} aria-label="Close settings">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="settings-body">
        <NumControl
          label={t(lang, 'focusLabel')}
          value={settings.focusDuration}
          min={1} max={60}
          unit={t(lang, 'min')}
          onChange={v => onUpdate({ focusDuration: v })}
        />
        <NumControl
          label={t(lang, 'shortBreakLabel')}
          value={settings.shortBreak}
          min={1} max={30}
          unit={t(lang, 'min')}
          onChange={v => onUpdate({ shortBreak: v })}
        />
        <NumControl
          label={t(lang, 'longBreakLabel')}
          value={settings.longBreak}
          min={1} max={60}
          unit={t(lang, 'min')}
          onChange={v => onUpdate({ longBreak: v })}
        />
        <NumControl
          label={t(lang, 'longBreakAfter')}
          value={settings.longBreakAfter}
          min={2} max={10}
          onChange={v => onUpdate({ longBreakAfter: v })}
        />
        <Toggle
          label={t(lang, 'autoStart')}
          value={settings.autoStart}
          onChange={v => onUpdate({ autoStart: v })}
        />
        <Toggle
          label={t(lang, 'sound')}
          value={settings.sound}
          onChange={v => onUpdate({ sound: v })}
        />
        <Toggle
          label={t(lang, 'darkMode')}
          value={isDark}
          onChange={onThemeToggle}
        />
        <LangSelector
          lang={lang}
          onLangChange={onLangChange}
          labelText={t(lang, 'language')}
        />
      </div>
    </div>
  )
}
