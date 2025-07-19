# Pomodoro Timer Web Application

## Tech Stack
- Framework: Nuxt 3 (Latest)
- Language: TypeScript
- Template Engine: Pug (for Vue templates)
- Testing: Vitest (Unit tests)
- E2E Testing: Playwright
- UI Component Library: Vuetify
- Storage: Browser Local Storage
- Internationalization: Nuxt i18n
- Deployment: Cloudflare Pages with Cloudflare Workers

## Project Structure
```
/
├── components/          # Vue.js components
│   ├── Timer/          # Timer-related components
│   ├── Settings/       # Settings UI components
│   └── History/        # History tracking components
├── composables/        # Vue composables for state management
├── locales/            # i18n translation files
│   ├── en.json         # English translations
│   ├── ja.json         # Japanese translations
│   └── es.json         # Spanish translations
├── pages/              # Nuxt 3 pages
├── server/             # Server-side API routes (if needed)
├── stores/             # Pinia stores for global state
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── tests/              # Test files
│   ├── unit/           # Vitest unit tests
│   └── e2e/            # Playwright e2e tests
└── workers/            # Cloudflare Workers code
```

## Key Commands
- `yarn dev`: Start development server
- `yarn build`: Build for production
- `yarn generate`: Generate static site for Cloudflare Pages
- `yarn test`: Run unit tests with Vitest
- `yarn test:e2e`: Run Playwright e2e tests
- `yarn lint`: Run ESLint
- `yarn typecheck`: Run TypeScript type checking
- `yarn preview`: Preview production build locally
- `yarn install`: Install all dependencies

### Cloudflare Workers Deployment Commands
- `yarn deploy:dev`: Deploy to Cloudflare Workers development environment
- `yarn deploy:prod`: Deploy to Cloudflare Workers production environment
- `yarn dev:wrangler`: Start local development with Wrangler
- `yarn preview:cloudflare`: Build and preview with Cloudflare Workers locally

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Use Vue 3 Composition API with `<script setup>`
- Use Pug for all Vue component templates with `<template lang="pug">`
- Use composables for reusable logic
- Prefer arrow functions for methods
- Use destructuring for imports: `import { ref, computed } from 'vue'`
- Use kebab-case for component names and file names
- Use PascalCase for component imports

### JSDoc Documentation Guidelines
- **All functions, methods, classes, and interfaces MUST have JSDoc comments in Japanese**
- Use consistent JSDoc formatting with proper `@param` and `@returns` tags
- Document the purpose, parameters, return values, and any important side effects
- Include meaningful examples for complex functions when necessary

#### TypeScript Functions and Methods
```typescript
/**
 * ポモドーロタイマーの状態と操作を管理するcomposable
 * 作業セッション、短い休憩、長い休憩の時間管理と制御を提供
 * 
 * @param workDuration - 作業セッションの時間（分）、デフォルト: 25分
 * @param shortBreakDuration - 短い休憩の時間（分）、デフォルト: 5分
 * @param longBreakDuration - 長い休憩の時間（分）、デフォルト: 15分
 * @returns タイマーの状態、操作関数、computed値を含むオブジェクト
 */
export function useTimer(
  workDuration: number = 25,
  shortBreakDuration: number = 5,
  longBreakDuration: number = 15
) {
  // 実装
}

/**
 * セッション時間の妥当性を検証する
 * @param duration - 検証対象の時間（秒）
 * @returns 時間が有効範囲内（1秒〜2時間）で整数の場合true
 */
const validateDuration = (duration: number): boolean => {
  return duration > 0 && duration <= 7200 && Number.isInteger(duration)
}
```

#### Interface and Type Definitions
```typescript
/**
 * ポモドーロタイマーの設定項目スキーマ
 * 作業時間、休憩時間、通知設定、テーマなどの全設定を定義
 */
export const PomodoroSettingsSchema = z.object({
  // 実装
});

/**
 * タイマーエラーの型定義
 * バリデーションエラー、タイマー競合状態、セッション作成失敗を表現
 */
interface TimerError {
  /** エラーの種類 */
  type: 'invalid_duration' | 'timer_conflict' | 'session_creation_failed';
  /** エラーメッセージ */
  message: string;
  /** 元のエラーオブジェクト（存在する場合） */
  originalError?: Error;
}
```

#### Vue Component Documentation
```vue
<script setup lang="ts">
/**
 * ポモドーロタイマーのメインコンポーネント
 * 円形プログレスバー、タイマーコントロール、モード選択を統合したポモドーロタイマーUI
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
```

#### Pug Template Comments
```pug
template(lang="pug")
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
        
        //- メインタイマーコンポーネント
        PomodoroTimer
```

#### Configuration File Documentation
```typescript
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
  
  /**
   * ビルド設定
   * Vuetifyをトランスパイル対象に追加し、ESモジュールをCommonJSに変換
   */
  build: {
    transpile: ['vuetify']
  }
})
```

#### Documentation Quality Standards
- **Purpose clarity**: 関数やクラスの目的を明確に記述
- **Parameter details**: 全パラメータの型、意味、デフォルト値を記載
- **Return value explanation**: 戻り値の型と意味を明確に説明
- **Side effects**: 重要な副作用や注意点を記載
- **Usage context**: 適切な使用場面や制約を説明
- **Error conditions**: 例外やエラーケースを記載

### Development Practices
- Run typecheck and lint after completing tasks and be sure they ALWAYS pass.

### Component Structure
```vue
<template lang="pug">
div
  //- Use Vuetify components
  v-card
    v-card-title
      | {{ $t('timer.title') }}
    v-card-text
      //- Component content
</template>

<script setup lang="ts">
// Imports
// Types
// Props/Emits
// Composables
// Reactive state
// Computed properties
// Methods
// Lifecycle hooks
</script>

<style scoped>
/* Component styles (minimal due to Vuetify) */
</style>
```

### Pug Template Guidelines
- Always use `<template lang="pug">` for Vue component templates
- Use indentation to represent nesting (2 spaces recommended)
- Attributes in parentheses: `v-btn(color="primary" @click="action")`
- CSS classes with dot notation: `v-card.my-class` or `div.container`
- Text content with pipe: `| {{ $t('timer.title') }}`
- Vue interpolations remain unchanged: `{{ variable }}`
- Comments with `//- Comment text`
- Preserve all Vue directives, accessibility attributes, and i18n functions

#### Pug Conversion Examples
```pug
// HTML to Pug conversion patterns:

// Attributes
<v-btn color="primary" @click="action">
v-btn(color="primary" @click="action")

// CSS Classes
<div class="container">
.container

// Combined class and attributes
<v-card class="timer-card" elevation="2">
v-card.timer-card(elevation="2")

// Text content
<h1>{{ title }}</h1>
h1
  | {{ title }}

// Multiple attributes (multiline for readability)
<v-btn
  color="primary"
  variant="flat"
  @click="action"
>
v-btn(
  color="primary"
  variant="flat"
  @click="action"
)
```

### Vuetify Guidelines
- Use Vuetify components for all UI elements
- Leverage Vuetify's theming system for light/dark mode
- Use Vuetify's responsive breakpoints system
- Implement consistent spacing using Vuetify's spacing classes
- Use Vuetify icons (mdi) for all icons
- Follow Vuetify's Material Design principles

### State Management
- Use Pinia for global state management
- Use composables for shared logic between components
- Store user settings and history in browser Local Storage
- Implement proper error handling for Local Storage operations

### Testing Requirements
- Write unit tests for all composables and utility functions
- Write component tests for complex UI interactions
- Write e2e tests for complete user workflows
- Maintain >80% code coverage for critical paths
- Test Vuetify component integration

## Pomodoro Timer Features

### Core Features
- 25-minute work sessions (configurable)
- 5-minute short breaks (configurable)
- 15-minute long breaks (configurable)
- Visual and audio notifications
- Session counting and progress tracking
- Pause/resume functionality
- Circular progress indicator using Vuetify

### Settings
- Customizable timer durations
- Notification preferences (visual/audio/both)
- Theme selection (light/dark/system)
- Language selection (English, Japanese, Spanish, etc.)
- Auto-start next session option
- All settings persist in Local Storage

### History Tracking
- Daily session completion tracking
- Weekly/monthly statistics
- Session interruption tracking
- Export functionality for data
- All history stored in Local Storage
- Data visualization using Vuetify charts

## Local Storage Schema
```typescript
interface PomodoroSettings {
  workDuration: number;        // minutes
  shortBreakDuration: number;  // minutes
  longBreakDuration: number;   // minutes
  sessionsBeforeLongBreak: number;
  autoStartNextSession: boolean;
  notifications: {
    visual: boolean;
    audio: boolean;
    sound: string;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;            // locale code (e.g., 'en', 'ja', 'es')
}

interface PomodoroSession {
  id: string;
  type: 'work' | 'shortBreak' | 'longBreak';
  duration: number;
  startTime: string;
  endTime: string;
  completed: boolean;
  interrupted: boolean;
}

interface PomodoroHistory {
  sessions: PomodoroSession[];
  stats: {
    totalSessions: number;
    completedSessions: number;
    totalWorkTime: number;
    streakDays: number;
  };
}
```

## Internationalization (i18n)

### Supported Languages
- English (en) - Default
- Japanese (ja)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Chinese Simplified (zh-CN)
- Korean (ko)

### i18n Configuration
- Use Nuxt i18n module for internationalization
- Store translations in `/locales/` directory as JSON files
- Implement lazy loading for translation files
- Use browser language detection with fallback to English
- Allow manual language switching in settings
- Integrate with Vuetify's i18n system

### Translation Guidelines
- Use namespaced keys for better organization (e.g., `timer.start`, `settings.language`)
- Implement pluralization for count-based messages
- Use interpolation for dynamic content (e.g., session duration)
- Provide context-aware translations for timer states
- Include accessibility labels in all languages
- Translate Vuetify component labels and messages

### Translation File Structure
```json
{
  "timer": {
    "start": "Start",
    "pause": "Pause",
    "resume": "Resume",
    "stop": "Stop",
    "workSession": "Work Session",
    "shortBreak": "Short Break",
    "longBreak": "Long Break",
    "timeRemaining": "Time Remaining: {time}"
  },
  "settings": {
    "title": "Settings",
    "language": "Language",
    "theme": "Theme",
    "notifications": "Notifications",
    "workDuration": "Work Duration (minutes)",
    "shortBreakDuration": "Short Break Duration (minutes)",
    "longBreakDuration": "Long Break Duration (minutes)"
  },
  "history": {
    "title": "History",
    "totalSessions": "Total Sessions",
    "completedSessions": "Completed Sessions",
    "totalWorkTime": "Total Work Time",
    "streakDays": "Streak Days"
  }
}
```

### RTL Language Support
- Implement proper RTL layout for Arabic, Hebrew, etc.
- Use Vuetify's RTL support configuration
- Test UI components in both LTR and RTL modes
- Ensure proper text alignment and icon positioning

## Deployment Configuration

### Cloudflare Workers + Pages (Hybrid Deployment)
The application uses a hybrid deployment approach combining Cloudflare Pages for static assets and Cloudflare Workers for server-side functionality.

#### Configuration Files
- `wrangler.toml`: Cloudflare Workers configuration with development/production environments
- `nuxt.config.ts`: Nitro configuration with `cloudflare-pages` preset
- `.github/workflows/`: CI/CD pipelines for automated deployment

#### Environment Setup
1. **Development Environment** (`develop` branch):
   - Worker name: `pomodoro-timer-development`
   - Domain: `dev.pomodoro-timer.example.com`
   - Auto-deploys on push to `develop` branch

2. **Production Environment** (`main` branch):
   - Worker name: `pomodoro-timer-production`
   - Domain: `pomodoro-timer.example.com`
   - Auto-deploys on push to `main` branch

#### Required GitHub Secrets
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Workers and Pages permissions
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

#### Deployment Process
1. **Automated CI/CD**: 
   - TypeScript type checking → ESLint → Unit tests → E2E tests → Build → Deploy
   - Tests must pass before deployment proceeds
   - Deployment only occurs on direct pushes (not PRs)

2. **Manual Deployment**:
   ```bash
   # Development
   yarn build && yarn deploy:dev
   
   # Production
   yarn build && yarn deploy:prod
   ```

#### Local Development with Cloudflare
```bash
# Start local Wrangler development server
yarn dev:wrangler

# Build and preview with Cloudflare Workers
yarn preview:cloudflare
```

## Browser Compatibility
- Target modern browsers (ES2020+)
- Ensure Notification API compatibility
- Test Local Storage limits and fallbacks
- Progressive Web App features consideration
- Vuetify browser compatibility requirements

## Performance Requirements
- First Contentful Paint < 2s
- Largest Contentful Paint < 3s
- Timer accuracy within 100ms
- Smooth animations at 60fps
- Efficient Local Storage operations
- Optimize Vuetify bundle size

## Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management for timer states
- Leverage Vuetify's built-in accessibility features

## Do Not
- Do not implement server-side session storage initially
- Do not add complex animations that impact performance
- Do not use heavy third-party libraries
- Do not store sensitive data in Local Storage
- Do not implement user authentication initially
- Do not add features that require network connectivity for core functionality
- Do not hardcode text strings in components (use i18n instead)
- Do not assume left-to-right text direction in CSS
- Do not create custom UI components when Vuetify equivalents exist
- Do not override Vuetify's default accessibility features

## Future Enhancements
- Browser extension version
- Additional language support based on user feedback

## Known Issues and Workarounds

### Test Runner Behavior
- When running tests, you might encounter a prompt `press h to show help, press q to quit`. 
  - To avoid this, you can modify the test script in `package.json` to run tests in non-interactive mode
  - Add the `--run` flag to Vitest command to prevent interactive mode