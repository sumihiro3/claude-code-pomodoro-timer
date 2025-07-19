import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  TimerState, 
  PomodoroSession, 
  PomodoroHistory, 
  SessionType 
} from '~/types'

export const useTimerStore = defineStore('timer', () => {
  const currentSession = ref<PomodoroSession | null>(null)
  const isRunning = ref(false)
  const isPaused = ref(false)
  const remainingTime = ref(0)
  const currentSessionType = ref<SessionType>('work')
  const sessionsCompleted = ref(0)
  const history = ref<PomodoroHistory>({
    sessions: [],
    stats: {
      totalSessions: 0,
      completedSessions: 0,
      totalWorkTime: 0,
      streakDays: 0
    }
  })

  const timerState = computed<TimerState>(() => ({
    currentSession: currentSession.value,
    isRunning: isRunning.value,
    isPaused: isPaused.value,
    remainingTime: remainingTime.value,
    currentSessionType: currentSessionType.value,
    sessionsCompleted: sessionsCompleted.value
  }))

  const startSession = (session: PomodoroSession) => {
    currentSession.value = session
    isRunning.value = true
    isPaused.value = false
    remainingTime.value = session.duration
    currentSessionType.value = session.type
  }

  const pauseSession = () => {
    isPaused.value = true
    isRunning.value = false
  }

  const resumeSession = () => {
    isPaused.value = false
    isRunning.value = true
  }

  const stopSession = () => {
    if (currentSession.value) {
      currentSession.value.interrupted = true
      currentSession.value.endTime = new Date().toISOString()
      addSessionToHistory(currentSession.value)
    }
    resetTimer()
  }

  const completeSession = () => {
    if (currentSession.value) {
      currentSession.value.completed = true
      currentSession.value.endTime = new Date().toISOString()
      addSessionToHistory(currentSession.value)
      
      if (currentSession.value.type === 'work') {
        sessionsCompleted.value++
        history.value.stats.completedSessions++
        history.value.stats.totalWorkTime += currentSession.value.duration
      }
    }
    resetTimer()
  }

  const resetTimer = () => {
    currentSession.value = null
    isRunning.value = false
    isPaused.value = false
    remainingTime.value = 0
  }

  const addSessionToHistory = (session: PomodoroSession) => {
    history.value.sessions.push(session)
    history.value.stats.totalSessions++
    saveHistoryToStorage()
  }

  const loadHistoryFromStorage = () => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem('pomodoro-history')
        if (stored) {
          const parsed = JSON.parse(stored)
          history.value = { ...history.value, ...parsed }
        }
      } catch (error) {
        console.error('Failed to load history from localStorage:', error)
      }
    }
  }

  const saveHistoryToStorage = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem('pomodoro-history', JSON.stringify(history.value))
      } catch (error) {
        console.error('Failed to save history to localStorage:', error)
      }
    }
  }

  const clearHistory = () => {
    history.value = {
      sessions: [],
      stats: {
        totalSessions: 0,
        completedSessions: 0,
        totalWorkTime: 0,
        streakDays: 0
      }
    }
    saveHistoryToStorage()
  }

  const getTodaysSessions = () => {
    const today = new Date().toDateString()
    return history.value.sessions.filter(session => 
      new Date(session.startTime).toDateString() === today
    )
  }

  const getWeeklyStats = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    return history.value.sessions.filter(session => 
      new Date(session.startTime) >= weekAgo
    )
  }

  loadHistoryFromStorage()

  return {
    timerState,
    currentSession,
    isRunning,
    isPaused,
    remainingTime,
    currentSessionType,
    sessionsCompleted,
    history,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    completeSession,
    resetTimer,
    addSessionToHistory,
    loadHistoryFromStorage,
    saveHistoryToStorage,
    clearHistory,
    getTodaysSessions,
    getWeeklyStats
  }
})