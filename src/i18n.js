export const translations = {
  en: {
    focus:          'Focus',
    shortBreak:     'Short Break',
    longBreak:      'Long Break',
    start:          'Start',
    pause:          'Pause',
    done:           'Done',
    settings:       'Settings',
    focusLabel:     'Focus',
    shortBreakLabel:'Short break',
    longBreakLabel: 'Long break',
    longBreakAfter: 'Long break after',
    autoStart:      'Auto-start',
    sound:          'Sound',
    darkMode:       'Dark mode',
    language:       'Language',
    min:            'min',
  },
  pt: {
    focus:          'Foco',
    shortBreak:     'Pausa Curta',
    longBreak:      'Pausa Longa',
    start:          'Iniciar',
    pause:          'Pausar',
    done:           'Concluir',
    settings:       'Configurações',
    focusLabel:     'Foco',
    shortBreakLabel:'Pausa curta',
    longBreakLabel: 'Pausa longa',
    longBreakAfter: 'Pausa longa após',
    autoStart:      'Início automático',
    sound:          'Som',
    darkMode:       'Modo escuro',
    language:       'Idioma',
    min:            'min',
  },
  es: {
    focus:          'Foco',
    shortBreak:     'Descanso Corto',
    longBreak:      'Descanso Largo',
    start:          'Iniciar',
    pause:          'Pausar',
    done:           'Listo',
    settings:       'Ajustes',
    focusLabel:     'Foco',
    shortBreakLabel:'Descanso corto',
    longBreakLabel: 'Descanso largo',
    longBreakAfter: 'Descanso largo tras',
    autoStart:      'Inicio automático',
    sound:          'Sonido',
    darkMode:       'Modo oscuro',
    language:       'Idioma',
    min:            'min',
  },
}

export function detectLang() {
  const saved = localStorage.getItem('pomoflow-lang')
  if (saved && translations[saved]) return saved
  const nav = (navigator.language || 'en').toLowerCase()
  if (nav.startsWith('pt')) return 'pt'
  if (nav.startsWith('es')) return 'es'
  return 'en'
}

export function t(lang, key) {
  return (translations[lang] || translations.en)[key] || key
}
