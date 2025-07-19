<template lang="pug">
//- アプリケーションのルートコンポーネント
//- Vuetifyのv-appでラップし、Nuxtのルーティングとアクセシビリティを統合
v-app
  //- ルート変更のアナウンス（アクセシビリティ対応）
  NuxtRouteAnnouncer
  //- メインコンテンツエリア
  v-main
    //- ページコンポーネントをレンダリング
    NuxtPage
</template>
