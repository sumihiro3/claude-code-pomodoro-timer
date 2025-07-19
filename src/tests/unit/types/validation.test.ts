import { describe, it, expect } from 'vitest'
import { 
  PomodoroSettingsSchema, 
  PomodoroSessionSchema,
  PomodoroHistorySchema,
  validatePomodoroSettings,
  isValidPomodoroSettings
} from '../../../types'

describe('Type Validation', () => {
  describe('PomodoroSettingsSchema', () => {
    it('should validate correct settings', () => {
      const validSettings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
        autoStartNextSession: false,
        notifications: {
          visual: true,
          audio: true,
          sound: 'bell'
        },
        theme: 'system',
        language: 'en'
      }

      const result = PomodoroSettingsSchema.safeParse(validSettings)
      expect(result.success).toBe(true)
    })

    it('should reject invalid durations', () => {
      const invalidSettings = {
        workDuration: -5, // Negative duration
        shortBreakDuration: 0, // Zero duration
        longBreakDuration: 150, // Exceeds max
        sessionsBeforeLongBreak: 4,
        autoStartNextSession: false,
        notifications: {
          visual: true,
          audio: true,
          sound: 'bell'
        },
        theme: 'system',
        language: 'en'
      }

      const result = PomodoroSettingsSchema.safeParse(invalidSettings)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(3) // Three validation errors
      }
    })

    it('should reject invalid sessions before long break', () => {
      const invalidSettings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 1, // Too low
        autoStartNextSession: false,
        notifications: {
          visual: true,
          audio: true,
          sound: 'bell'
        },
        theme: 'system',
        language: 'en'
      }

      const result = PomodoroSettingsSchema.safeParse(invalidSettings)
      expect(result.success).toBe(false)
    })

    it('should reject invalid theme values', () => {
      const invalidSettings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
        autoStartNextSession: false,
        notifications: {
          visual: true,
          audio: true,
          sound: 'bell'
        },
        theme: 'invalid_theme', // Invalid theme
        language: 'en'
      }

      const result = PomodoroSettingsSchema.safeParse(invalidSettings)
      expect(result.success).toBe(false)
    })

    it('should reject invalid language codes', () => {
      const invalidSettings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
        autoStartNextSession: false,
        notifications: {
          visual: true,
          audio: true,
          sound: 'bell'
        },
        theme: 'system',
        language: 'invalid-language-code' // Invalid language code
      }

      const result = PomodoroSettingsSchema.safeParse(invalidSettings)
      expect(result.success).toBe(false)
    })

    it('should accept valid language codes with region', () => {
      const validSettings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
        autoStartNextSession: false,
        notifications: {
          visual: true,
          audio: true,
          sound: 'bell'
        },
        theme: 'system',
        language: 'en-US' // Valid language code with region
      }

      const result = PomodoroSettingsSchema.safeParse(validSettings)
      expect(result.success).toBe(true)
    })

    it('should reject invalid notification sound', () => {
      const invalidSettings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
        autoStartNextSession: false,
        notifications: {
          visual: true,
          audio: true,
          sound: 'invalid_sound' // Invalid sound
        },
        theme: 'system',
        language: 'en'
      }

      const result = PomodoroSettingsSchema.safeParse(invalidSettings)
      expect(result.success).toBe(false)
    })
  })

  describe('PomodoroSessionSchema', () => {
    it('should validate correct session', () => {
      const validSession = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'work',
        duration: 1500,
        startTime: '2023-07-19T10:00:00.000Z',
        endTime: '2023-07-19T10:25:00.000Z',
        completed: true,
        interrupted: false
      }

      const result = PomodoroSessionSchema.safeParse(validSession)
      expect(result.success).toBe(true)
    })

    it('should reject invalid session type', () => {
      const invalidSession = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'invalid_type',
        duration: 1500,
        startTime: '2023-07-19T10:00:00.000Z',
        endTime: '2023-07-19T10:25:00.000Z',
        completed: true,
        interrupted: false
      }

      const result = PomodoroSessionSchema.safeParse(invalidSession)
      expect(result.success).toBe(false)
    })

    it('should reject invalid UUID', () => {
      const invalidSession = {
        id: 'not-a-uuid',
        type: 'work',
        duration: 1500,
        startTime: '2023-07-19T10:00:00.000Z',
        endTime: '2023-07-19T10:25:00.000Z',
        completed: true,
        interrupted: false
      }

      const result = PomodoroSessionSchema.safeParse(invalidSession)
      expect(result.success).toBe(false)
    })

    it('should reject negative duration', () => {
      const invalidSession = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'work',
        duration: -100,
        startTime: '2023-07-19T10:00:00.000Z',
        endTime: '2023-07-19T10:25:00.000Z',
        completed: true,
        interrupted: false
      }

      const result = PomodoroSessionSchema.safeParse(invalidSession)
      expect(result.success).toBe(false)
    })
  })

  describe('Validation Utility Functions', () => {
    it('should validate settings using validatePomodoroSettings', () => {
      const validSettings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
        autoStartNextSession: false,
        notifications: {
          visual: true,
          audio: true,
          sound: 'bell'
        },
        theme: 'system',
        language: 'en'
      }

      expect(() => validatePomodoroSettings(validSettings)).not.toThrow()
      const result = validatePomodoroSettings(validSettings)
      expect(result).toEqual(validSettings)
    })

    it('should throw on invalid settings using validatePomodoroSettings', () => {
      const invalidSettings = {
        workDuration: -5,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
        autoStartNextSession: false,
        notifications: {
          visual: true,
          audio: true,
          sound: 'bell'
        },
        theme: 'system',
        language: 'en'
      }

      expect(() => validatePomodoroSettings(invalidSettings)).toThrow()
    })

    it('should check validity using isValidPomodoroSettings', () => {
      const validSettings = {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
        autoStartNextSession: false,
        notifications: {
          visual: true,
          audio: true,
          sound: 'bell'
        },
        theme: 'system',
        language: 'en'
      }

      const invalidSettings = {
        workDuration: -5,
        // Missing required fields
      }

      expect(isValidPomodoroSettings(validSettings)).toBe(true)
      expect(isValidPomodoroSettings(invalidSettings)).toBe(false)
    })
  })

  describe('PomodoroHistorySchema', () => {
    it('should validate correct history', () => {
      const validHistory = {
        sessions: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            type: 'work',
            duration: 1500,
            startTime: '2023-07-19T10:00:00.000Z',
            endTime: '2023-07-19T10:25:00.000Z',
            completed: true,
            interrupted: false
          }
        ],
        stats: {
          totalSessions: 1,
          completedSessions: 1,
          totalWorkTime: 1500,
          streakDays: 1
        }
      }

      const result = PomodoroHistorySchema.safeParse(validHistory)
      expect(result.success).toBe(true)
    })

    it('should reject negative stats', () => {
      const invalidHistory = {
        sessions: [],
        stats: {
          totalSessions: -1, // Negative value
          completedSessions: 0,
          totalWorkTime: 0,
          streakDays: 0
        }
      }

      const result = PomodoroHistorySchema.safeParse(invalidHistory)
      expect(result.success).toBe(false)
    })
  })
})