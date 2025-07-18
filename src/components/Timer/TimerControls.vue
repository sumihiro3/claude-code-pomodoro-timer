<template>
  <div class="timer-controls">
    <v-btn
      v-if="!isRunning"
      size="large"
      color="primary"
      variant="flat"
      :disabled="disabled"
      @click="$emit('start')"
    >
      {{ $t('timer.start') }}
    </v-btn>
    <v-btn
      v-else
      size="large"
      color="primary"
      variant="outlined"
      :disabled="disabled"
      @click="$emit('pause')"
    >
      {{ $t('timer.pause') }}
    </v-btn>
    <v-btn
      size="large"
      variant="outlined"
      :disabled="disabled"
      @click="$emit('reset')"
    >
      {{ $t('timer.reset') }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isRunning: boolean
  disabled?: boolean
}

defineProps<Props>()

defineEmits<{
  start: []
  pause: []
  reset: []
}>()
</script>

<style scoped>
.timer-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}
</style>