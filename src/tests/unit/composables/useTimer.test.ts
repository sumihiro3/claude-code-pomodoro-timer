import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTimer } from '../../../composables/useTimer'

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
    
    expect(session.type).toBe('work')
    expect(session.duration).toBe(1500)
    expect(session.completed).toBe(false)
    expect(session.interrupted).toBe(false)
    expect(session.id).toBeTruthy()
  })

  it('should advance time when running', () => {
    const timer = useTimer(25, 5, 15)
    
    timer.start()
    vi.advanceTimersByTime(1000) // 1 second
    
    expect(timer.timeLeft.value).toBe(1499) // 24:59
  })
})