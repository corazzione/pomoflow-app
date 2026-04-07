import { useState } from 'react'
import { Widget } from './components/Widget'
import { useTimer } from './hooks/useTimer'
import { detectLang } from './i18n'
import './App.css'

export default function App() {
  const timer = useTimer()
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('pomoflow-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [lang, setLang] = useState(detectLang)

  const toggleTheme = () => {
    setIsDark(d => {
      localStorage.setItem('pomoflow-theme', !d ? 'dark' : 'light')
      return !d
    })
  }

  const changeLang = (l) => {
    localStorage.setItem('pomoflow-lang', l)
    setLang(l)
  }

  const handleClose = async () => {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window')
      await getCurrentWindow().close()
    } catch {
      // browser dev mode — no-op
    }
  }

  return (
    <Widget
      timer={timer}
      isDark={isDark}
      onThemeToggle={toggleTheme}
      onClose={handleClose}
      lang={lang}
      onLangChange={changeLang}
    />
  )
}
