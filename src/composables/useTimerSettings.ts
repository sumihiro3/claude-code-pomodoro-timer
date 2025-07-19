import { ref, computed } from 'vue'
import type { PomodoroSettings } from '~/types'
import { DefaultPomodoroSettings, validatePomodoroSettings, isValidPomodoroSettings } from '~/types'

/** ローカルストレージのキー名 */
const STORAGE_KEY = 'pomodoro-settings'

/**
 * ストレージエラーの型定義
 * ローカルストレージの利用不可、容量超過、データ異常などのエラーを表現
 */
interface StorageError {
  type: 'storage_unavailable' | 'quota_exceeded' | 'invalid_data' | 'parse_error';
  message: string;
  originalError?: Error;
}

/**
 * ポモドーロタイマーの設定管理を行うcomposable
 * ローカルストレージへの保存・読み込み、バリデーション、エラーハンドリングを提供
 * 
 * @returns 設定状態、操作関数、computed値を含むオブジェクト
 */
export function useTimerSettings() {
  // 現在の設定値（デフォルト値で初期化）
  const settings = ref<PomodoroSettings>(new DefaultPomodoroSettings())
  // ストレージ操作のエラー状態
  const storageError = ref<StorageError | null>(null)

  /**
   * ローカルストレージが利用可能かどうかを確認する
   * テスト用のデータを書き込み・削除して動作を検証
   * @returns ストレージが利用可能な場合true、そうでなければfalse
   */
  const isStorageAvailable = (): boolean => {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, 'test')
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  /**
   * ローカルストレージから設定を読み込む
   * クライアントサイドでのみ実行し、バリデーションとエラーハンドリングを含む
   */
  const loadSettings = () => {
    if (!import.meta.client) return

    storageError.value = null

    if (!isStorageAvailable()) {
      storageError.value = {
        type: 'storage_unavailable',
        message: 'localStorage is not available'
      }
      return
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        
        // Validate parsed data using Zod
        if (isValidPomodoroSettings(parsed)) {
          settings.value = parsed
        } else {
          // Attempt to merge with defaults for partial data
          const validatedSettings = validatePomodoroSettings({
            ...new DefaultPomodoroSettings(),
            ...parsed
          })
          settings.value = validatedSettings
          // Re-save the corrected settings
          saveSettings()
        }
      }
    } catch (error) {
      const err = error as Error
      if (err instanceof SyntaxError) {
        storageError.value = {
          type: 'parse_error',
          message: 'Failed to parse stored settings',
          originalError: err
        }
      } else {
        storageError.value = {
          type: 'invalid_data',
          message: 'Stored settings data is invalid',
          originalError: err
        }
      }
      console.error('Failed to load settings from localStorage:', error)
      // Fall back to defaults
      settings.value = new DefaultPomodoroSettings()
    }
  }

  /**
   * 現在の設定をローカルストレージに保存する
   * 保存前にバリデーションを実行し、エラーハンドリングを含む
   * @returns 保存成功時true、失敗時false
   */
  const saveSettings = (): boolean => {
    if (!import.meta.client) return false

    storageError.value = null

    if (!isStorageAvailable()) {
      storageError.value = {
        type: 'storage_unavailable',
        message: 'localStorage is not available'
      }
      return false
    }

    try {
      // Validate settings before saving
      const validatedSettings = validatePomodoroSettings(settings.value)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validatedSettings))
      return true
    } catch (error) {
      const err = error as Error
      if (err.name === 'QuotaExceededError') {
        storageError.value = {
          type: 'quota_exceeded',
          message: 'Storage quota exceeded',
          originalError: err
        }
      } else {
        storageError.value = {
          type: 'invalid_data',
          message: 'Failed to save settings',
          originalError: err
        }
      }
      console.error('Failed to save settings to localStorage:', error)
      return false
    }
  }

  /**
   * 設定の一部を更新する
   * 既存の設定とマージし、バリデーション後に保存する
   * @param newSettings - 更新する設定の部分オブジェクト
   * @returns 更新成功時true、失敗時false
   */
  const updateSettings = (newSettings: Partial<PomodoroSettings>): boolean => {
    try {
      const mergedSettings = { ...settings.value, ...newSettings }
      // Validate before updating
      const validatedSettings = validatePomodoroSettings(mergedSettings)
      settings.value = validatedSettings
      return saveSettings()
    } catch (error) {
      console.error('Failed to update settings:', error)
      return false
    }
  }

  /**
   * 設定をデフォルト値にリセットする
   * @returns リセット成功時true、失敗時false
   */
  const resetSettings = (): boolean => {
    settings.value = new DefaultPomodoroSettings()
    return saveSettings()
  }

  /**
   * ストレージエラー状態をクリアする
   * エラー表示を消すために使用
   */
  const clearStorageError = () => {
    storageError.value = null
  }

  // 個別設定値へのアクセス用computedプロパティ
  
  /** 作業セッションの時間（分） */
  const workDuration = computed(() => settings.value.workDuration)
  /** 短い休憩の時間（分） */
  const shortBreakDuration = computed(() => settings.value.shortBreakDuration)
  /** 長い休憩の時間（分） */
  const longBreakDuration = computed(() => settings.value.longBreakDuration)
  /** 長い休憩までのセッション数 */
  const sessionsBeforeLongBreak = computed(() => settings.value.sessionsBeforeLongBreak)
  /** 次のセッションを自動開始するかどうか */
  const autoStartNextSession = computed(() => settings.value.autoStartNextSession)
  /** 通知設定 */
  const notifications = computed(() => settings.value.notifications)
  /** アプリケーションテーマ */
  const theme = computed(() => settings.value.theme)
  /** 表示言語 */
  const language = computed(() => settings.value.language)

  // 初期化時に設定を読み込み
  loadSettings()

  return {
    settings,
    storageError,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsBeforeLongBreak,
    autoStartNextSession,
    notifications,
    theme,
    language,
    updateSettings,
    resetSettings,
    loadSettings,
    saveSettings,
    clearStorageError,
    isStorageAvailable
  }
}