<template lang="pug">
.pomodoro-timer(
  role="region"
  :aria-label="$t('timer.timerRegion')"
)
  v-card.timer-card
    v-card-title.text-center
      .timer-header
        span.mode-emoji(
          role="img"
          :aria-label="$t('timer.modeEmoji', { mode: $t(getModeLabel(currentMode)) })"
        )
          | {{ getModeEmoji(currentMode) }}
        span
          | {{ $t(getModeLabel(currentMode)) }}
    
    v-card-text.timer-content
      .progress-container
        CircularProgress(
          :progress="progress"
          :size="240"
          :stroke-width="12"
          :color="getCurrentModeColor()"
          :aria-label="$t('timer.progressLabel', { progress: Math.round(progress) })"
        )
          .timer-display
            .time-text(
              role="timer"
              :aria-live="isRunning ? 'polite' : 'off'"
              :aria-label="$t('timer.timeRemaining', { time: formattedTime })"
            )
              | {{ formattedTime }}
            .session-text
              | {{ $t('timer.session') }}: {{ sessionsCompleted }}
      
      TimerControls(
        :is-running="isRunning"
        @start="start"
        @pause="pause"
        @reset="reset"
      )

  ModeSelector.mode-selector(
    :current-mode="currentMode"
    :work-duration="workDuration"
    :short-break-duration="shortBreakDuration"
    :long-break-duration="longBreakDuration"
    :work-color="workColor"
    :short-break-color="shortBreakColor"
    :long-break-color="longBreakColor"
    @mode-change="switchMode"
  )
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import CircularProgress from './CircularProgress.vue'
import TimerControls from './TimerControls.vue'
import ModeSelector from './ModeSelector.vue'
import { useTimer } from '~/composables/useTimer'
import { useTimerSettings } from '~/composables/useTimerSettings'

const { workDuration, shortBreakDuration, longBreakDuration } = useTimerSettings()

const {
  currentMode,
  isRunning,
  sessionsCompleted,
  progress,
  formattedTime,
  getModeLabel,
  getModeEmoji,
  start,
  pause,
  reset,
  switchMode
} = useTimer(
  workDuration.value,
  shortBreakDuration.value,
  longBreakDuration.value
)

const workColor = '#1976d2'
const shortBreakColor = '#388e3c'
const longBreakColor = '#f57c00'

const getCurrentModeColor = () => {
  switch (currentMode.value) {
    case 'work':
      return workColor
    case 'shortBreak':
      return shortBreakColor
    case 'longBreak':
      return longBreakColor
  }
}
</script>

<style scoped>
.pomodoro-timer {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.timer-card {
  padding: 16px;
}

.timer-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1.5rem;
  font-weight: 600;
}

.mode-emoji {
  font-size: 1.75rem;
}

.timer-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.progress-container {
  display: flex;
  justify-content: center;
  margin: 24px 0;
}

.timer-display {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.time-text {
  font-size: 3rem;
  font-weight: 600;
  font-family: 'Roboto Mono', monospace;
  line-height: 1;
}

.session-text {
  font-size: 1rem;
  opacity: 0.7;
  margin-top: 8px;
}

.mode-selector {
  margin-top: 8px;
}

@media (max-width: 600px) {
  .pomodoro-timer {
    padding: 16px;
  }
  
  .time-text {
    font-size: 2.5rem;
  }
  
  .progress-container :deep(.circular-progress) {
    width: 200px !important;
    height: 200px !important;
  }
}
</style>