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
/**
 * タイマーのコントロールボタンコンポーネント
 * 開始・一時停止・リセットボタンを提供し、アクセシビリティとキーボード操作に対応
 */

/**
 * コンポーネントのProp型定義
 */
interface Props {
  /** タイマーが動作中かどうか（ボタン表示切り替え用） */
  isRunning: boolean
  /** コントロールボタンを無効化するかどうか */
  disabled?: boolean
}

// Propsを定義
defineProps<Props>()

/**
 * コンポーネントが発行するイベントの型定義
 */
defineEmits<{
  /** タイマー開始イベント */
  start: []
  /** タイマー一時停止イベント */
  pause: []
  /** タイマーリセットイベント */
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