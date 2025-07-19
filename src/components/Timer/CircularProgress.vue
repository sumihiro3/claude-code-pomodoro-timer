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
/**
 * 円形プログレスバーコンポーネント
 * Vuetifyのv-progress-circularをラップし、ポモドーロタイマー用にカスタマイズ
 */

/**
 * コンポーネントのProp型定義
 */
interface Props {
  /** 進捗率（0-100の数値） */
  progress: number
  /** プログレスバーのサイズ（px） */
  size?: number
  /** プログレスバーの線の太さ（px） */
  strokeWidth?: number
  /** プログレスバーの色 */
  color?: string
}

/**
 * Propsのデフォルト値を設定
 */
withDefaults(defineProps<Props>(), {
  size: 240,           // デフォルトサイズ: 240px
  strokeWidth: 12,     // デフォルト線太: 12px
  color: 'primary'     // デフォルト色: Vuetifyのprimaryカラー
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