import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTimerStore } from '../../../stores/timer'
import type { PomodoroSession } from '../../../types'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('useTimerStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should initialize with correct default state', () => {
    const store = useTimerStore()
    
    expect(store.currentSession).toBe(null)
    expect(store.isRunning).toBe(false)
    expect(store.isPaused).toBe(false)
    expect(store.remainingTime).toBe(0)
    expect(store.currentSessionType).toBe('work')
    expect(store.sessionsCompleted).toBe(0)
    expect(store.history.sessions).toEqual([])
    expect(store.history.stats.totalSessions).toBe(0)
    expect(store.history.stats.completedSessions).toBe(0)
    expect(store.history.stats.totalWorkTime).toBe(0)
    expect(store.history.stats.streakDays).toBe(0)
  })

  it('should start session correctly', () => {
    const store = useTimerStore()
    const session: PomodoroSession = {
      id: '1',
      type: 'work',
      duration: 1500,
      startTime: new Date().toISOString(),
      endTime: '',
      completed: false,
      interrupted: false
    }
    
    store.startSession(session)
    
    expect(store.currentSession).toStrictEqual(session)
    expect(store.isRunning).toBe(true)
    expect(store.isPaused).toBe(false)
    expect(store.remainingTime).toBe(1500)
    expect(store.currentSessionType).toBe('work')
  })

  it('should pause session correctly', () => {
    const store = useTimerStore()
    const session: PomodoroSession = {
      id: '1',
      type: 'work',
      duration: 1500,
      startTime: new Date().toISOString(),
      endTime: '',
      completed: false,
      interrupted: false
    }
    
    store.startSession(session)
    store.pauseSession()
    
    expect(store.isRunning).toBe(false)
    expect(store.isPaused).toBe(true)
  })

  it('should resume session correctly', () => {
    const store = useTimerStore()
    const session: PomodoroSession = {
      id: '1',
      type: 'work',
      duration: 1500,
      startTime: new Date().toISOString(),
      endTime: '',
      completed: false,
      interrupted: false
    }
    
    store.startSession(session)
    store.pauseSession()
    store.resumeSession()
    
    expect(store.isRunning).toBe(true)
    expect(store.isPaused).toBe(false)
  })

  it('should stop session correctly', () => {
    const store = useTimerStore()
    const session: PomodoroSession = {
      id: '1',
      type: 'work',
      duration: 1500,
      startTime: new Date().toISOString(),
      endTime: '',
      completed: false,
      interrupted: false
    }
    
    store.startSession(session)
    store.stopSession()
    
    expect(store.currentSession).toBe(null)
    expect(store.isRunning).toBe(false)
    expect(store.isPaused).toBe(false)
    expect(store.remainingTime).toBe(0)
    expect(store.history.sessions).toHaveLength(1)
    expect(store.history.sessions[0].interrupted).toBe(true)
  })

  it('should complete session correctly', () => {
    const store = useTimerStore()
    const session: PomodoroSession = {
      id: '1',
      type: 'work',
      duration: 1500,
      startTime: new Date().toISOString(),
      endTime: '',
      completed: false,
      interrupted: false
    }
    
    store.startSession(session)
    store.completeSession()
    
    expect(store.currentSession).toBe(null)
    expect(store.isRunning).toBe(false)
    expect(store.isPaused).toBe(false)
    expect(store.remainingTime).toBe(0)
    expect(store.history.sessions).toHaveLength(1)
    expect(store.history.sessions[0].completed).toBe(true)
    expect(store.sessionsCompleted).toBe(1)
    expect(store.history.stats.completedSessions).toBe(1)
    expect(store.history.stats.totalWorkTime).toBe(1500)
  })

  it('should reset timer correctly', () => {
    const store = useTimerStore()
    const session: PomodoroSession = {
      id: '1',
      type: 'work',
      duration: 1500,
      startTime: new Date().toISOString(),
      endTime: '',
      completed: false,
      interrupted: false
    }
    
    store.startSession(session)
    store.resetTimer()
    
    expect(store.currentSession).toBe(null)
    expect(store.isRunning).toBe(false)
    expect(store.isPaused).toBe(false)
    expect(store.remainingTime).toBe(0)
  })

  it('should clear history correctly', () => {
    const store = useTimerStore()
    
    // Add some sessions to history
    store.addSessionToHistory({
      id: '1',
      type: 'work',
      duration: 1500,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      completed: true,
      interrupted: false
    })
    
    store.clearHistory()
    
    expect(store.history.sessions).toEqual([])
    expect(store.history.stats.totalSessions).toBe(0)
    expect(store.history.stats.completedSessions).toBe(0)
    expect(store.history.stats.totalWorkTime).toBe(0)
    expect(store.history.stats.streakDays).toBe(0)
  })

  it('should get todays sessions correctly', () => {
    const store = useTimerStore()
    const today = new Date().toISOString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    // Add sessions for today and yesterday
    store.addSessionToHistory({
      id: '1',
      type: 'work',
      duration: 1500,
      startTime: today,
      endTime: today,
      completed: true,
      interrupted: false
    })
    
    store.addSessionToHistory({
      id: '2',
      type: 'work',
      duration: 1500,
      startTime: yesterday,
      endTime: yesterday,
      completed: true,
      interrupted: false
    })
    
    const todaysSessions = store.getTodaysSessions()
    expect(todaysSessions).toHaveLength(1)
    expect(todaysSessions[0].id).toBe('1')
  })

  it('should get weekly stats correctly', () => {
    const store = useTimerStore()
    const today = new Date().toISOString()
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    
    // Add sessions for this week and two weeks ago
    store.addSessionToHistory({
      id: '1',
      type: 'work',
      duration: 1500,
      startTime: today,
      endTime: today,
      completed: true,
      interrupted: false
    })
    
    store.addSessionToHistory({
      id: '2',
      type: 'work',
      duration: 1500,
      startTime: twoWeeksAgo,
      endTime: twoWeeksAgo,
      completed: true,
      interrupted: false
    })
    
    const weeklyStats = store.getWeeklyStats()
    expect(weeklyStats).toHaveLength(1)
    expect(weeklyStats[0].id).toBe('1')
  })

  it('should compute timer state correctly', () => {
    const store = useTimerStore()
    const session: PomodoroSession = {
      id: '1',
      type: 'work',
      duration: 1500,
      startTime: new Date().toISOString(),
      endTime: '',
      completed: false,
      interrupted: false
    }
    
    store.startSession(session)
    
    const timerState = store.timerState
    expect(timerState.currentSession).toStrictEqual(session)
    expect(timerState.isRunning).toBe(true)
    expect(timerState.isPaused).toBe(false)
    expect(timerState.remainingTime).toBe(1500)
    expect(timerState.currentSessionType).toBe('work')
    expect(timerState.sessionsCompleted).toBe(0)
  })
})