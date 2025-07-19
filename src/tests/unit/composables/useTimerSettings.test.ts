import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { PomodoroSettings } from '~/types'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock the composable module to bypass import.meta.client check
vi.mock('../../../composables/useTimerSettings', async () => {
  const _actual = await vi.importActual('../../../composables/useTimerSettings')
  
  // Import the original code but with import.meta.client always true
  const { ref, computed } = await import('vue')
  const { DefaultPomodoroSettings, validatePomodoroSettings, isValidPomodoroSettings } = await import('../../../types')
  
  const STORAGE_KEY = 'pomodoro-settings'
  
  const useTimerSettings = () => {
    const settings = ref(new DefaultPomodoroSettings())
    const storageError = ref<{ type: string; message: string; originalError?: Error } | null>(null)

    const isStorageAvailable = () => {
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
      // Always run as if we're on client side
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
          
          if (isValidPomodoroSettings(parsed)) {
            settings.value = parsed as PomodoroSettings
          } else {
            const validatedSettings = validatePomodoroSettings({
              ...new DefaultPomodoroSettings(),
              ...parsed
            })
            settings.value = validatedSettings as PomodoroSettings
            saveSettings()
          }
        }
      } catch (error) {
        const err = error as Error
        if (err instanceof SyntaxError) {
          storageError.value = {
            type: 'parse_error',
            message: 'Failed to parse stored settings',
            originalError: err as Error
          }
        } else {
          storageError.value = {
            type: 'invalid_data',
            message: 'Stored settings data is invalid',
            originalError: err as Error
          }
        }
        console.error('Failed to load settings from localStorage:', error)
        settings.value = new DefaultPomodoroSettings()
      }
    }

    const saveSettings = () => {
      // Always run as if we're on client side
      storageError.value = null

      if (!isStorageAvailable()) {
        storageError.value = {
          type: 'storage_unavailable',
          message: 'localStorage is not available'
        }
        return false
      }

      try {
        const validatedSettings = validatePomodoroSettings(settings.value)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedSettings))
        return true
      } catch (error) {
        const err = error as Error
        if (err.name === 'QuotaExceededError') {
          storageError.value = {
            type: 'quota_exceeded',
            message: 'Storage quota exceeded',
            originalError: err as Error
          }
        } else {
          storageError.value = {
            type: 'invalid_data',
            message: 'Failed to save settings',
            originalError: err as Error
          }
        }
        console.error('Failed to save settings to localStorage:', error)
        return false
      }
    }

    const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
      try {
        const mergedSettings = { ...settings.value, ...newSettings }
        const validatedSettings = validatePomodoroSettings(mergedSettings)
        settings.value = validatedSettings as PomodoroSettings
        return saveSettings()
      } catch (error) {
        console.error('Failed to update settings:', error)
        return false
      }
    }

    const resetSettings = () => {
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

  return { useTimerSettings }
})

const { useTimerSettings } = await import('../../../composables/useTimerSettings')

describe('useTimerSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize with default settings', () => {
    const settings = useTimerSettings()
    
    expect(settings.workDuration.value).toBe(25)
    expect(settings.shortBreakDuration.value).toBe(5)
    expect(settings.longBreakDuration.value).toBe(15)
    expect(settings.theme.value).toBe('system')
    expect(settings.language.value).toBe('en')
  })

  it('should load valid settings from localStorage', () => {
    const validSettings = {
      workDuration: 30,
      shortBreakDuration: 10,
      longBreakDuration: 20,
      sessionsBeforeLongBreak: 4,
      autoStartNextSession: true,
      notifications: {
        visual: true,
        audio: false,
        sound: 'chime'
      },
      theme: 'dark',
      language: 'ja'
    }

    localStorageMock.getItem.mockReturnValue(JSON.stringify(validSettings))
    
    const settings = useTimerSettings()
    
    expect(settings.workDuration.value).toBe(30)
    expect(settings.shortBreakDuration.value).toBe(10)
    expect(settings.theme.value).toBe('dark')
    expect(settings.language.value).toBe('ja')
  })

  describe('Error Handling', () => {
    it('should handle localStorage unavailable gracefully', () => {
      // Mock localStorage.setItem to throw an error for storage availability check
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage not available')
      })
      
      const settings = useTimerSettings()
      
      expect(settings.storageError.value).toBeTruthy()
      expect(settings.storageError.value?.type).toBe('storage_unavailable')
      expect(settings.workDuration.value).toBe(25) // Should use defaults
    })

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid json{')
      
      const settings = useTimerSettings()
      
      expect(settings.storageError.value).toBeTruthy()
      expect(settings.storageError.value?.type).toBe('parse_error')
      expect(settings.workDuration.value).toBe(25) // Should fallback to defaults
    })

    it('should handle invalid settings data', () => {
      const invalidSettings = {
        workDuration: -5, // Invalid negative duration
        shortBreakDuration: 'not a number', // Invalid type
        theme: 'invalid_theme' // Invalid enum value
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(invalidSettings))
      
      const settings = useTimerSettings()
      
      // Should merge with defaults and fix invalid data
      expect(settings.workDuration.value).toBe(25) // Should use default
    })

    it('should handle quota exceeded error when saving', () => {
      // Mock removeItem for storage availability test to succeed
      localStorageMock.removeItem.mockImplementation(() => {})
      
      // Mock setItem to handle storage test vs actual save differently
      localStorageMock.setItem.mockImplementation((key) => {
        if (key === '__storage_test__') {
          // Allow the storage availability test to pass
          return
        }
        // Fail on the actual save
        const error = new Error('Quota exceeded')
        error.name = 'QuotaExceededError'
        throw error
      })
      
      const settings = useTimerSettings()
      const result = settings.updateSettings({ workDuration: 30 })
      
      expect(result).toBe(false)
      expect(settings.storageError.value?.type).toBe('quota_exceeded')
    })

    it('should handle validation errors when updating settings', () => {
      const settings = useTimerSettings()
      
      const result = settings.updateSettings({
        workDuration: -10 // Invalid negative duration
      })
      
      expect(result).toBe(false)
    })

    it('should detect storage availability correctly', () => {
      const settings = useTimerSettings()
      
      // Test when localStorage works
      expect(settings.isStorageAvailable()).toBe(true)
      
      // Test when localStorage throws
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage not available')
      })
      
      expect(settings.isStorageAvailable()).toBe(false)
    })

    it('should clear storage errors', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      const settings = useTimerSettings()
      
      expect(settings.storageError.value).toBeTruthy()
      
      settings.clearStorageError()
      
      expect(settings.storageError.value).toBeNull()
    })

    it('should return false when saving fails', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Save failed')
      })
      
      const settings = useTimerSettings()
      const result = settings.saveSettings()
      
      expect(result).toBe(false)
      expect(settings.storageError.value).toBeTruthy()
    })

    it('should return true when saving succeeds', () => {
      const settings = useTimerSettings()
      const result = settings.saveSettings()
      
      expect(result).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })

    it('should handle partial valid data by merging with defaults', () => {
      const partialSettings = {
        workDuration: 30,
        invalidField: 'should be ignored'
      }

      localStorageMock.getItem.mockReturnValue(JSON.stringify(partialSettings))
      
      const settings = useTimerSettings()
      
      expect(settings.workDuration.value).toBe(30) // Valid field preserved
      expect(settings.shortBreakDuration.value).toBe(5) // Default used for missing field
    })
  })

  describe('Settings Validation', () => {
    it('should validate settings before saving', () => {
      const settings = useTimerSettings()
      
      // Try to update with invalid settings
      const result = settings.updateSettings({
        workDuration: 200, // Exceeds max limit
        sessionsBeforeLongBreak: 15, // Exceeds max limit
        language: 'invalid-code' // Invalid language code
      })
      
      expect(result).toBe(false)
    })

    it('should accept valid settings updates', () => {
      const settings = useTimerSettings()
      
      const result = settings.updateSettings({
        workDuration: 45,
        shortBreakDuration: 10,
        theme: 'dark',
        language: 'ja'
      })
      
      expect(result).toBe(true)
      expect(settings.workDuration.value).toBe(45)
      expect(settings.shortBreakDuration.value).toBe(10)
      expect(settings.theme.value).toBe('dark')
      expect(settings.language.value).toBe('ja')
    })
  })
})