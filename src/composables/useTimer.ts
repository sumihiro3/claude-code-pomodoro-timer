import { ref, computed, onUnmounted } from 'vue'
import type { SessionType, PomodoroSession } from '~/types'

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

  const getDuration = (mode: SessionType): number => {
    switch (mode) {
      case 'work':
        return workDuration * 60
      case 'shortBreak':
        return shortBreakDuration * 60
      case 'longBreak':
        return longBreakDuration * 60
    }
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

  const start = () => {
    if (isRunning.value) return
    
    isRunning.value = true
    intervalRef.value = setInterval(() => {
      timeLeft.value--
      
      if (timeLeft.value <= 0) {
        complete()
      }
    }, 1000)
  }

  const pause = () => {
    isRunning.value = false
    if (intervalRef.value) {
      clearInterval(intervalRef.value)
      intervalRef.value = null
    }
  }

  const reset = () => {
    pause()
    timeLeft.value = currentDuration.value
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

  const createSession = (): PomodoroSession => {
    return {
      id: Date.now().toString(),
      type: currentMode.value,
      duration: currentDuration.value,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      completed: false,
      interrupted: false
    }
  }

  onUnmounted(() => {
    if (intervalRef.value) {
      clearInterval(intervalRef.value)
    }
  })

  return {
    currentMode,
    timeLeft,
    isRunning,
    sessionsCompleted,
    progress,
    formattedTime,
    currentDuration,
    getModeLabel,
    getModeEmoji,
    start,
    pause,
    reset,
    switchMode,
    createSession
  }
}