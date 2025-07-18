<template>
  <v-card>
    <v-card-title>
      {{ $t('timer.modeSelector') }}
    </v-card-title>
    <v-card-text>
      <div class="mode-buttons">
        <v-btn
          :variant="currentMode === 'work' ? 'flat' : 'outlined'"
          :color="currentMode === 'work' ? 'primary' : 'default'"
          class="mode-btn"
          block
          @click="$emit('modeChange', 'work')"
        >
          <div class="mode-btn-content">
            <div 
              class="mode-indicator" 
              :style="{ backgroundColor: workColor }"
            />
            <span>💼 {{ $t('timer.workSession') }} ({{ workDuration }}{{ $t('timer.minutes') }})</span>
          </div>
        </v-btn>
        <v-btn
          :variant="currentMode === 'shortBreak' ? 'flat' : 'outlined'"
          :color="currentMode === 'shortBreak' ? 'primary' : 'default'"
          class="mode-btn"
          block
          @click="$emit('modeChange', 'shortBreak')"
        >
          <div class="mode-btn-content">
            <div 
              class="mode-indicator" 
              :style="{ backgroundColor: shortBreakColor }"
            />
            <span>☕ {{ $t('timer.shortBreak') }} ({{ shortBreakDuration }}{{ $t('timer.minutes') }})</span>
          </div>
        </v-btn>
        <v-btn
          :variant="currentMode === 'longBreak' ? 'flat' : 'outlined'"
          :color="currentMode === 'longBreak' ? 'primary' : 'default'"
          class="mode-btn"
          block
          @click="$emit('modeChange', 'longBreak')"
        >
          <div class="mode-btn-content">
            <div 
              class="mode-indicator" 
              :style="{ backgroundColor: longBreakColor }"
            />
            <span>🏖️ {{ $t('timer.longBreak') }} ({{ longBreakDuration }}{{ $t('timer.minutes') }})</span>
          </div>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
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