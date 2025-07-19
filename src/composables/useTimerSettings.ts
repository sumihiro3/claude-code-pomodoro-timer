import { ref, computed } from 'vue'
import type { PomodoroSettings } from '~/types'
import { DefaultPomodoroSettings, validatePomodoroSettings, isValidPomodoroSettings } from '~/types'

const STORAGE_KEY = 'pomodoro-settings'

interface StorageError {
  type: 'storage_unavailable' | 'quota_exceeded' | 'invalid_data' | 'parse_error';
  message: string;
  originalError?: Error;
}

export function useTimerSettings() {
  const settings = ref<PomodoroSettings>(new DefaultPomodoroSettings())
  const storageError = ref<StorageError | null>(null)

  const isStorageAvailable = (): boolean => {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, 'test')
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  const loadSettings = () => {
    if (!import.meta.client) return

    storageError.value = null

    if (!isStorageAvailable()) {
      storageError.value = {
        type: 'storage_unavailable',
        message: 'localStorage is not available'
      }
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        
        // Validate parsed data using Zod
        if (isValidPomodoroSettings(parsed)) {
          settings.value = parsed
        } else {
          // Attempt to merge with defaults for partial data
          const validatedSettings = validatePomodoroSettings({
            ...new DefaultPomodoroSettings(),
            ...parsed
          })
          settings.value = validatedSettings
          // Re-save the corrected settings
          saveSettings()
        }
      }
    } catch (error) {
      const err = error as Error
      if (err instanceof SyntaxError) {
        storageError.value = {
          type: 'parse_error',
          message: 'Failed to parse stored settings',
          originalError: err
        }
      } else {
        storageError.value = {
          type: 'invalid_data',
          message: 'Stored settings data is invalid',
          originalError: err
        }
      }
      console.error('Failed to load settings from localStorage:', error)
      // Fall back to defaults
      settings.value = new DefaultPomodoroSettings()
    }
  }

  const saveSettings = (): boolean => {
    if (!import.meta.client) return false

    storageError.value = null

    if (!isStorageAvailable()) {
      storageError.value = {
        type: 'storage_unavailable',
        message: 'localStorage is not available'
      }
      return false
    }

    try {
      // Validate settings before saving
      const validatedSettings = validatePomodoroSettings(settings.value)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedSettings))
      return true
    } catch (error) {
      const err = error as Error
      if (err.name === 'QuotaExceededError') {
        storageError.value = {
          type: 'quota_exceeded',
          message: 'Storage quota exceeded',
          originalError: err
        }
      } else {
        storageError.value = {
          type: 'invalid_data',
          message: 'Failed to save settings',
          originalError: err
        }
      }
      console.error('Failed to save settings to localStorage:', error)
      return false
    }
  }

  const updateSettings = (newSettings: Partial<PomodoroSettings>): boolean => {
    try {
      const mergedSettings = { ...settings.value, ...newSettings }
      // Validate before updating
      const validatedSettings = validatePomodoroSettings(mergedSettings)
      settings.value = validatedSettings
      return saveSettings()
    } catch (error) {
      console.error('Failed to update settings:', error)
      return false
    }
  }

  const resetSettings = (): boolean => {
    settings.value = new DefaultPomodoroSettings()
    return saveSettings()
  }

  const clearStorageError = () => {
    storageError.value = null
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
    storageError,
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
    saveSettings,
    clearStorageError,
    isStorageAvailable
  }
}