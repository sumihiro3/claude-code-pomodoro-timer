import { ref, computed } from 'vue'
import type { PomodoroSettings } from '~/types'
import { DefaultPomodoroSettings } from '~/types'

const STORAGE_KEY = 'pomodoro-settings'

export function useTimerSettings() {
  const settings = ref<PomodoroSettings>(new DefaultPomodoroSettings())

  const loadSettings = () => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          settings.value = { ...new DefaultPomodoroSettings(), ...parsed }
        }
      } catch (error) {
        console.error('Failed to load settings from localStorage:', error)
      }
    }
  }

  const saveSettings = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
      } catch (error) {
        console.error('Failed to save settings to localStorage:', error)
      }
    }
  }

  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    saveSettings()
  }

  const resetSettings = () => {
    settings.value = new DefaultPomodoroSettings()
    saveSettings()
  }

  const workDuration = computed(() => settings.value.workDuration)
  const shortBreakDuration = computed(() => settings.value.shortBreakDuration)
  const longBreakDuration = computed(() => settings.value.longBreakDuration)
  const sessionsBeforeLongBreak = computed(() => settings.value.sessionsBeforeLongBreak)
  const autoStartNextSession = computed(() => settings.value.autoStartNextSession)
  const notifications = computed(() => settings.value.notifications)
  const theme = computed(() => settings.value.theme)
  const language = computed(() => settings.value.language)

  loadSettings()

  return {
    settings,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsBeforeLongBreak,
    autoStartNextSession,
    notifications,
    theme,
    language,
    updateSettings,
    resetSettings,
    loadSettings,
    saveSettings
  }
}