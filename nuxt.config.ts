// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'src/',
  
  // CSS Framework
  css: ['vuetify/lib/styles/main.sass'],
  
  // Build configuration
  build: {
    transpile: ['vuetify']
  },
  
  // Modules
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxt/eslint'
  ],
  
  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: false
  },
  
  // i18n configuration
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ja', name: '日本語', file: 'ja.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'it', name: 'Italiano', file: 'it.json' },
      { code: 'pt', name: 'Português', file: 'pt.json' },
      { code: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'ko', name: '한국어', file: 'ko.json' }
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  
  // Vite configuration for Vuetify
  vite: {
    define: {
      'process.env.DEBUG': false
    }
  },
  
  // App configuration
  app: {
    head: {
      title: 'Pomodoro Timer',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A beautiful Pomodoro Timer web application built with Nuxt 3 and Vuetify' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css' }
      ]
    }
  }
})
