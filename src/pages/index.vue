<template lang="pug">
//- ポモドーロタイマーアプリのメインページ
//- アプリケーションタイトル、サブタイトル、メインタイマーコンポーネントを表示
v-container
  v-row(justify="center")
    v-col(cols="12" md="8" lg="6")
      //- ページヘッダー部分
      .page-header
        //- アプリケーションタイトル
        h1.text-h3.text-center.mb-2
          | {{ $t('app.title') }}
        //- アプリケーションサブタイトル
        p.text-subtitle-1.text-center.text-medium-emphasis.mb-6
          | {{ $t('app.subtitle') }}
      
      //- メインタイマーコンポーネント
      PomodoroTimer
</template>

<script setup lang="ts">
/**
 * ポモドーロタイマーアプリのメインページ
 * アプリケーションのメイン機能であるポモドーロタイマーを表示し、SEOメタデータを設定
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
import PomodoroTimer from '~/components/Timer/PomodoroTimer.vue'

/**
 * SEOメタデータの設定
 * ページタイトルとディスクリプションを設定し、検索エンジン最適化を行う
 */
useSeoMeta({
  title: 'Pomodoro Timer - Focus & Productivity',
  description: 'A modern Pomodoro timer to help you focus and boost productivity with the Pomodoro Technique.'
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 24px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

@media (max-width: 600px) {
  .home-page {
    padding: 16px 0;
  }
}
</style>