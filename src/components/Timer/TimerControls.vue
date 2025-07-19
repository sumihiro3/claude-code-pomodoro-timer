<template lang="pug">
.timer-controls(
  role="group"
  :aria-label="$t('timer.controls')"
)
  v-btn(
    v-if="!isRunning"
    size="large"
    color="primary"
    variant="flat"
    :disabled="disabled"
    :aria-label="$t('timer.startTimer')"
    @click="$emit('start')"
    @keydown.enter="$emit('start')"
    @keydown.space.prevent="$emit('start')"
  )
    | {{ $t('timer.start') }}
  v-btn(
    v-else
    size="large"
    color="primary"
    variant="outlined"
    :disabled="disabled"
    :aria-label="$t('timer.pauseTimer')"
    @click="$emit('pause')"
    @keydown.enter="$emit('pause')"
    @keydown.space.prevent="$emit('pause')"
  )
    | {{ $t('timer.pause') }}
  v-btn(
    size="large"
    variant="outlined"
    :disabled="disabled"
    :aria-label="$t('timer.resetTimer')"
    @click="$emit('reset')"
    @keydown.enter="$emit('reset')"
    @keydown.space.prevent="$emit('reset')"
  )
    | {{ $t('timer.reset') }}
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