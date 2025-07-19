/**
 * Nuxt 3フレームワークの設定ファイル
 * ポモドーロタイマーアプリのビルド、モジュール、多言語化、UIフレームワーク設定
 * 参考: https://nuxt.com/docs/api/configuration/nuxt-config
 */
export default defineNuxtConfig({
  // 互換性日付（Nuxtの新機能と破壊的変更の基準日）
  compatibilityDate: '2025-07-15',
  // 開発ツールを有効化（デバッグ、パフォーマンスモニタリング等）
  devtools: { enabled: true },
  // ソースコードのルートディレクトリ
  srcDir: 'src/',
  
  
  /**
   * ビルド設定
   * Vuetifyをトランスパイル対象に追加し、ESモジュールをCommonJSに変換
   */
  build: {
    transpile: ['vuetify']
  },
  
  /**
   * Nuxtモジュール設定
   * 多言語化、状態管理、リンターのモジュールを組み込み
   */
  modules: [
    '@nuxtjs/i18n',    // 多言語化サポート
    '@pinia/nuxt',     // 状態管理（Pinia）
    '@nuxt/eslint'     // コード品質管理（ESLint）
  ],
  
  /**
   * TypeScript設定
   * 厳格な型チェックを有効化し、ビルド時の型チェックは無効化（パフォーマンス向上）
   */
  typescript: {
    strict: true,     // 厳格モード有効
    typeCheck: false  // ビルド時型チェック無効（別途実行）
  },
  
  /**
   * 多言語化（i18n）設定
   * 9言語をサポートし、遅延読み込みとブラウザ言語検出に対応
   */
  i18n: {
    // サポートする言語一覧（コード、表示名、翻訳ファイル）
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },      // 英語
      { code: 'ja', name: '日本語', file: 'ja.json' },         // 日本語
      { code: 'es', name: 'Español', file: 'es.json' },       // スペイン語
      { code: 'fr', name: 'Français', file: 'fr.json' },      // フランス語
      { code: 'de', name: 'Deutsch', file: 'de.json' },       // ドイツ語
      { code: 'it', name: 'Italiano', file: 'it.json' },      // イタリア語
      { code: 'pt', name: 'Português', file: 'pt.json' },     // ポルトガル語
      { code: 'zh-CN', name: '简体中文', file: 'zh-CN.json' }, // 中国語簡体字
      { code: 'ko', name: '한국어', file: 'ko.json' }          // 韓国語
    ],
    lazy: true,              // 翻訳ファイルの遅延読み込み有効
    langDir: 'locales',      // 翻訳ファイルの格納ディレクトリ
    defaultLocale: 'en',     // デフォルト言語設定
    strategy: 'prefix',      // URLに言語プレフィックスを付与
    // ブラウザ言語自動検出設定
    detectBrowserLanguage: {
      useCookie: true,           // Cookieで言語選択を保存
      cookieKey: 'i18n_redirected', // Cookie名
      redirectOn: 'root'         // ルートページでのみリダイレクト
    }
  },
  
  /**
   * Vite設定（Vuetify用カスタマイズ）
   * デバッグフラグの無効化とSSRでのVuetify外部化設定
   */
  vite: {
    // グローバル定数の定義
    define: {
      'process.env.DEBUG': false  // デバッグモード無効化
    },
    // SSR設定
    ssr: {
      noExternal: ['vuetify']       // VuetifyをSSRで外部化しない
    }
  },

  /**
   * CSSプリプロセッサー設定
   * VuetifyのメインスタイルとMaterial Design Iconsを読み込み
   */
  css: [
    'vuetify/lib/styles/main.sass',           // Vuetifyメインスタイル
    '@mdi/font/css/materialdesignicons.css'   // Material Designアイコン
  ],
  
  
  /**
   * アプリケーション設定
   * HTMLヘッダー、メタタグ、ファビコン、外部リソースの設定
   */
  app: {
    // HTMLヘッダー設定
    head: {
      title: 'Pomodoro Timer',  // デフォルトページタイトル
      // メタタグ設定
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A beautiful Pomodoro Timer web application built with Nuxt 3 and Vuetify' }
      ],
      // 外部リソースリンク
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },  // ファビコン
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css' }  // MDIアイコン
      ]
    }
  }
})
