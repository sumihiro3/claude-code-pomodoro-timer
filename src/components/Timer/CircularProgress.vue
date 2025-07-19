<template lang="pug">
.circular-progress-container
  v-progress-circular.circular-progress(
    :model-value="progress"
    :size="size"
    :width="strokeWidth"
    :color="color"
  )
    slot
</template>

<script setup lang="ts">
interface Props {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
}

withDefaults(defineProps<Props>(), {
  size: 240,
  strokeWidth: 12,
  color: 'primary'
})
</script>

<style scoped>
.circular-progress-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.circular-progress {
  position: relative;
}
</style>