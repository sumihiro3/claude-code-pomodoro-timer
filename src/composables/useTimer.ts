import { ref, computed, onUnmounted } from 'vue'
import type { SessionType, PomodoroSession } from '~/types'

interface TimerError {
  type: 'invalid_duration' | 'timer_conflict' | 'session_creation_failed';
  message: string;
  originalError?: Error;
}

export function useTimer(
  workDuration: number = 25,
  shortBreakDuration: number = 5,
  longBreakDuration: number = 15
) {
  const currentMode = ref<SessionType>('work')
  const timeLeft = ref(workDuration * 60)
  const isRunning = ref(false)
  const sessionsCompleted = ref(0)
  const intervalRef = ref<NodeJS.Timeout | null>(null)
  const currentSession = ref<PomodoroSession | null>(null)
  const timerError = ref<TimerError | null>(null)

  const validateDuration = (duration: number): boolean => {
    return duration > 0 && duration <= 7200 && Number.isInteger(duration) // Max 2 hours, positive integer
  }

  const getDuration = (mode: SessionType): number => {
    let duration: number
    switch (mode) {
      case 'work':
        duration = workDuration * 60
        break
      case 'shortBreak':
        duration = shortBreakDuration * 60
        break
      case 'longBreak':
        duration = longBreakDuration * 60
        break
    }

    if (!validateDuration(duration)) {
      timerError.value = {
        type: 'invalid_duration',
        message: `Invalid duration for ${mode}: ${duration} seconds`
      }
      // Return a safe default
      return mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60
    }

    return duration
  }

  const currentDuration = computed(() => getDuration(currentMode.value))
  
  const progress = computed(() => {
    return ((currentDuration.value - timeLeft.value) / currentDuration.value) * 100
  })

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60)
    const seconds = timeLeft.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  const getModeLabel = (mode: SessionType): string => {
    switch (mode) {
      case 'work':
        return 'timer.workSession'
      case 'shortBreak':
        return 'timer.shortBreak'
      case 'longBreak':
        return 'timer.longBreak'
    }
  }

  const getModeEmoji = (mode: SessionType): string => {
    switch (mode) {
      case 'work':
        return '💼'
      case 'shortBreak':
        return '☕'
      case 'longBreak':
        return '🏖️'
    }
  }

  const start = (): boolean => {
    try {
      if (isRunning.value) {
        timerError.value = {
          type: 'timer_conflict',
          message: 'Timer is already running'
        }
        return false
      }

      timerError.value = null

      // Create a new session if none exists
      if (!currentSession.value) {
        currentSession.value = createSession()
      }
      
      isRunning.value = true
      intervalRef.value = setInterval(() => {
        timeLeft.value--
        
        if (timeLeft.value <= 0) {
          complete()
        }
      }, 1000)

      return true
    } catch (error) {
      timerError.value = {
        type: 'timer_conflict',
        message: 'Failed to start timer',
        originalError: error as Error
      }
      console.error('Timer start failed:', error)
      return false
    }
  }

  const pause = (): boolean => {
    try {
      isRunning.value = false
      if (intervalRef.value) {
        clearInterval(intervalRef.value)
        intervalRef.value = null
      }

      // Mark current session as interrupted if it exists
      if (currentSession.value && !currentSession.value.completed) {
        currentSession.value.interrupted = true
        currentSession.value.endTime = new Date().toISOString()
      }

      return true
    } catch (error) {
      console.error('Timer pause failed:', error)
      return false
    }
  }

  const reset = (): boolean => {
    try {
      pause()
      timeLeft.value = currentDuration.value
      currentSession.value = null
      timerError.value = null
      return true
    } catch (error) {
      console.error('Timer reset failed:', error)
      return false
    }
  }

  const complete = () => {
    pause()
    
    if (currentMode.value === 'work') {
      sessionsCompleted.value++
      const nextMode = sessionsCompleted.value % 4 === 0 ? 'longBreak' : 'shortBreak'
      switchMode(nextMode)
    } else {
      switchMode('work')
    }
  }

  const switchMode = (mode: SessionType) => {
    pause()
    currentMode.value = mode
    timeLeft.value = getDuration(mode)
  }

  const createSession = (): PomodoroSession | null => {
    try {
      // Generate a more robust ID using crypto.randomUUID if available
      let sessionId: string
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        sessionId = crypto.randomUUID()
      } else {
        // Fallback to timestamp-based ID
        sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }

      return {
        id: sessionId,
        type: currentMode.value,
        duration: currentDuration.value,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        completed: false,
        interrupted: false
      }
    } catch (error) {
      timerError.value = {
        type: 'session_creation_failed',
        message: 'Failed to create session',
        originalError: error as Error
      }
      console.error('Session creation failed:', error)
      return null
    }
  }

  const clearTimerError = () => {
    timerError.value = null
  }

  onUnmounted(() => {
    try {
      if (intervalRef.value) {
        clearInterval(intervalRef.value)
      }
      // Mark session as interrupted if timer is unmounted while running
      if (currentSession.value && isRunning.value) {
        currentSession.value.interrupted = true
        currentSession.value.endTime = new Date().toISOString()
      }
    } catch (error) {
      console.error('Timer cleanup failed:', error)
    }
  })

  return {
    currentMode,
    timeLeft,
    isRunning,
    sessionsCompleted,
    currentSession,
    timerError,
    progress,
    formattedTime,
    currentDuration,
    getModeLabel,
    getModeEmoji,
    start,
    pause,
    reset,
    switchMode,
    createSession,
    clearTimerError
  }
}