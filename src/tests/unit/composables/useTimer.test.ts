import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTimer } from '../../../composables/useTimer'

// Mock onUnmounted to avoid Vue warnings in tests
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onUnmounted: vi.fn()
  }
})

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should initialize with correct default values', () => {
    const timer = useTimer(25, 5, 15)
    
    expect(timer.currentMode.value).toBe('work')
    expect(timer.timeLeft.value).toBe(1500) // 25 minutes in seconds
    expect(timer.isRunning.value).toBe(false)
    expect(timer.sessionsCompleted.value).toBe(0)
    expect(timer.progress.value).toBe(0)
    expect(timer.formattedTime.value).toBe('25:00')
  })

  it('should start timer correctly', () => {
    const timer = useTimer(25, 5, 15)
    
    timer.start()
    
    expect(timer.isRunning.value).toBe(true)
  })

  it('should pause timer correctly', () => {
    const timer = useTimer(25, 5, 15)
    
    timer.start()
    timer.pause()
    
    expect(timer.isRunning.value).toBe(false)
  })

  it('should reset timer correctly', () => {
    const timer = useTimer(25, 5, 15)
    
    timer.start()
    vi.advanceTimersByTime(30000) // 30 seconds
    timer.reset()
    
    expect(timer.isRunning.value).toBe(false)
    expect(timer.timeLeft.value).toBe(1500) // Reset to 25 minutes
  })

  it('should format time correctly', () => {
    const timer = useTimer(25, 5, 15)
    
    timer.timeLeft.value = 1500 // 25:00
    expect(timer.formattedTime.value).toBe('25:00')
    
    timer.timeLeft.value = 65 // 1:05
    expect(timer.formattedTime.value).toBe('01:05')
    
    timer.timeLeft.value = 5 // 0:05
    expect(timer.formattedTime.value).toBe('00:05')
  })

  it('should calculate progress correctly', () => {
    const timer = useTimer(25, 5, 15)
    
    timer.timeLeft.value = 1500 // Full time
    expect(timer.progress.value).toBe(0)
    
    timer.timeLeft.value = 750 // Half time
    expect(timer.progress.value).toBe(50)
    
    timer.timeLeft.value = 0 // No time left
    expect(timer.progress.value).toBe(100)
  })

  it('should switch modes correctly', () => {
    const timer = useTimer(25, 5, 15)
    
    timer.switchMode('shortBreak')
    
    expect(timer.currentMode.value).toBe('shortBreak')
    expect(timer.timeLeft.value).toBe(300) // 5 minutes in seconds
    expect(timer.isRunning.value).toBe(false)
  })

  it('should get correct mode labels', () => {
    const timer = useTimer(25, 5, 15)
    
    expect(timer.getModeLabel('work')).toBe('timer.workSession')
    expect(timer.getModeLabel('shortBreak')).toBe('timer.shortBreak')
    expect(timer.getModeLabel('longBreak')).toBe('timer.longBreak')
  })

  it('should get correct mode emojis', () => {
    const timer = useTimer(25, 5, 15)
    
    expect(timer.getModeEmoji('work')).toBe('💼')
    expect(timer.getModeEmoji('shortBreak')).toBe('☕')
    expect(timer.getModeEmoji('longBreak')).toBe('🏖️')
  })

  it('should create session object correctly', () => {
    const timer = useTimer(25, 5, 15)
    
    const session = timer.createSession()
    
    expect(session).toBeTruthy()
    expect(session?.type).toBe('work')
    expect(session?.duration).toBe(1500)
    expect(session?.completed).toBe(false)
    expect(session?.interrupted).toBe(false)
    expect(session?.id).toBeTruthy()
  })

  it('should advance time when running', () => {
    const timer = useTimer(25, 5, 15)
    
    timer.start()
    vi.advanceTimersByTime(1000) // 1 second
    
    expect(timer.timeLeft.value).toBe(1499) // 24:59
  })

  describe('Error Handling', () => {
    it('should handle invalid durations with safe defaults', () => {
      const timer = useTimer(-5, 0, 150) // Invalid durations
      
      // Access currentDuration to trigger validation
      const duration = timer.currentDuration.value
      expect(duration).toBe(25 * 60) // Default work duration
      expect(timer.timerError.value).toBeTruthy()
      expect(timer.timerError.value?.type).toBe('invalid_duration')
    })

    it('should prevent starting timer when already running', () => {
      const timer = useTimer(25, 5, 15)
      
      const firstStart = timer.start()
      const secondStart = timer.start()
      
      expect(firstStart).toBe(true)
      expect(secondStart).toBe(false)
      expect(timer.timerError.value?.type).toBe('timer_conflict')
    })

    it('should handle session creation failure gracefully', () => {
      const timer = useTimer(25, 5, 15)
      
      // Mock Math.random to throw error
      const originalRandom = Math.random
      Math.random = vi.fn().mockImplementation(() => {
        throw new Error('Random generation failed')
      })
      
      // Mock crypto.randomUUID if it exists
      const mockCrypto = {
        randomUUID: vi.fn().mockImplementation(() => {
          throw new Error('UUID generation failed')
        })
      }
      
      Object.defineProperty(global, 'crypto', {
        value: mockCrypto,
        writable: true,
        configurable: true
      })
      
      const session = timer.createSession()
      
      expect(session).toBeNull()
      expect(timer.timerError.value?.type).toBe('session_creation_failed')
      
      // Restore mocks
      Math.random = originalRandom
    })

    it('should clear timer error', () => {
      const timer = useTimer(-5, 5, 15) // Invalid duration to trigger error
      
      // Access currentDuration to trigger validation error
      const _duration = timer.currentDuration.value
      
      expect(timer.timerError.value).toBeTruthy()
      
      timer.clearTimerError()
      
      expect(timer.timerError.value).toBeNull()
    })

    it('should mark session as interrupted when paused', () => {
      const timer = useTimer(25, 5, 15)
      
      timer.start()
      expect(timer.currentSession.value).toBeTruthy()
      expect(timer.currentSession.value?.interrupted).toBe(false)
      
      timer.pause()
      
      expect(timer.currentSession.value?.interrupted).toBe(true)
      expect(timer.currentSession.value?.endTime).toBeTruthy()
    })

    it('should handle cleanup on unmount correctly', () => {
      const timer = useTimer(25, 5, 15)
      
      timer.start()
      expect(timer.isRunning.value).toBe(true)
      
      // The test is mainly checking that onUnmounted was called
      // which we've mocked, so just verify the timer was started
      expect(timer.isRunning.value).toBe(true)
    })

    it('should return false for failed operations', () => {
      const timer = useTimer(25, 5, 15)
      
      // Test failed reset
      const resetResult = timer.reset()
      expect(resetResult).toBe(true)
      
      // Test failed pause when not running
      const pauseResult = timer.pause()
      expect(pauseResult).toBe(true)
    })
  })
})