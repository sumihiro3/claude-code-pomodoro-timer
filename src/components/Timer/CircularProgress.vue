<template>
  <div class="circular-progress-container">
    <v-progress-circular
      :model-value="progress"
      :size="size"
      :width="strokeWidth"
      :color="color"
      class="circular-progress"
    >
      <slot />
    </v-progress-circular>
  </div>
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