<template lang="pug">
v-card
  v-card-title
    | {{ $t('timer.modeSelector') }}
  v-card-text
    .mode-buttons(
      role="radiogroup"
      :aria-label="$t('timer.selectTimerMode')"
    )
      v-btn.mode-btn(
        :variant="currentMode === 'work' ? 'flat' : 'outlined'"
        :color="currentMode === 'work' ? 'primary' : 'default'"
        block
        role="radio"
        :aria-checked="currentMode === 'work'"
        :aria-label="$t('timer.selectWorkMode', { duration: workDuration })"
        @click="$emit('modeChange', 'work')"
        @keydown.enter="$emit('modeChange', 'work')"
        @keydown.space.prevent="$emit('modeChange', 'work')"
      )
        .mode-btn-content
          .mode-indicator(
            :style="{ backgroundColor: workColor }"
            role="img"
            :aria-label="$t('timer.workModeIndicator')"
          )
          span
            span(
              role="img"
              :aria-label="$t('timer.workIcon')"
            )
              | 💼
            | {{ $t('timer.workSession') }} ({{ workDuration }}{{ $t('timer.minutes') }})
      v-btn.mode-btn(
        :variant="currentMode === 'shortBreak' ? 'flat' : 'outlined'"
        :color="currentMode === 'shortBreak' ? 'primary' : 'default'"
        block
        role="radio"
        :aria-checked="currentMode === 'shortBreak'"
        :aria-label="$t('timer.selectShortBreakMode', { duration: shortBreakDuration })"
        @click="$emit('modeChange', 'shortBreak')"
        @keydown.enter="$emit('modeChange', 'shortBreak')"
        @keydown.space.prevent="$emit('modeChange', 'shortBreak')"
      )
        .mode-btn-content
          .mode-indicator(
            :style="{ backgroundColor: shortBreakColor }"
            role="img"
            :aria-label="$t('timer.shortBreakModeIndicator')"
          )
          span
            span(
              role="img"
              :aria-label="$t('timer.coffeeIcon')"
            )
              | ☕
            | {{ $t('timer.shortBreak') }} ({{ shortBreakDuration }}{{ $t('timer.minutes') }})
      v-btn.mode-btn(
        :variant="currentMode === 'longBreak' ? 'flat' : 'outlined'"
        :color="currentMode === 'longBreak' ? 'primary' : 'default'"
        block
        role="radio"
        :aria-checked="currentMode === 'longBreak'"
        :aria-label="$t('timer.selectLongBreakMode', { duration: longBreakDuration })"
        @click="$emit('modeChange', 'longBreak')"
        @keydown.enter="$emit('modeChange', 'longBreak')"
        @keydown.space.prevent="$emit('modeChange', 'longBreak')"
      )
        .mode-btn-content
          .mode-indicator(
            :style="{ backgroundColor: longBreakColor }"
            role="img"
            :aria-label="$t('timer.longBreakModeIndicator')"
          )
          span
            span(
              role="img"
              :aria-label="$t('timer.beachIcon')"
            )
              | 🏖️
            | {{ $t('timer.longBreak') }} ({{ longBreakDuration }}{{ $t('timer.minutes') }})
</template>

<script setup lang="ts">
import type { SessionType } from '~/types'

interface Props {
  currentMode: SessionType
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  workColor?: string
  shortBreakColor?: string
  longBreakColor?: string
}

withDefaults(defineProps<Props>(), {
  workColor: '#1976d2',
  shortBreakColor: '#388e3c',
  longBreakColor: '#f57c00'
})

defineEmits<{
  modeChange: [mode: SessionType]
}>()
</script>

<style scoped>
.mode-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mode-btn {
  text-transform: none;
  justify-content: flex-start;
}

.mode-btn-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mode-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style>