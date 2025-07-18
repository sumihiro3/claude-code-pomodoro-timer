# Pomodoro Timer Web Application

## Tech Stack
- Framework: Nuxt 3 (Latest)
- Language: TypeScript
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

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Use Vue 3 Composition API with `<script setup>`
- Use composables for reusable logic
- Prefer arrow functions for methods
- Use destructuring for imports: `import { ref, computed } from 'vue'`
- Use kebab-case for component names and file names
- Use PascalCase for component imports

### Development Practices
- Run typecheck and lint after completing tasks and be sure they ALWAYS pass.

### Component Structure
```vue
<template>
  <div>
    <!-- Use Vuetify components -->
    <v-card>
      <v-card-title>{{ $t('timer.title') }}</v-card-title>
      <v-card-text>
        <!-- Component content -->
      </v-card-text>
    </v-card>
  </div>
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

### Cloudflare Pages
- Deploy from `dist/` directory after `npm run generate`
- Use environment variables for any API keys
- Configure custom domain if needed
- Enable preview deployments for branches

### Cloudflare Workers (if needed)
- Use for any server-side functionality
- API routes for data synchronization (future feature)
- Background tasks for notifications

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
