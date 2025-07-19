import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

/**
 * Vuetify UIフレームワークのNuxtプラグイン設定
 * Material Designコンポーネント、ディレクティブ、テーマ設定を初期化
 * アプリケーション全体で一貫したUIコンポーネントを提供
 */
export default defineNuxtPlugin((nuxtApp) => {
  /**
   * Vuetifyインスタンスを作成し、UIコンポーネントとテーマを設定
   */
  const vuetify = createVuetify({
    // 全Vuetifyコンポーネントをインポート
    components,
    // 全Vuetifyディレクティブをインポート
    directives,
    theme: {
      // デフォルトテーマをライトモードに設定
      defaultTheme: 'light'
    }
  })

  // NuxtアプリケーションにVuetifyプラグインを登録
  nuxtApp.vueApp.use(vuetify)
})