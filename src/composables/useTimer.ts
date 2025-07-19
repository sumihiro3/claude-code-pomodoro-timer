import { ref, computed, onUnmounted } from 'vue'
import type { SessionType, PomodoroSession } from '~/types'

/**
 * タイマーエラーの型定義
 * バリデーションエラー、タイマー競合状態、セッション作成失敗を表現
 */
interface TimerError {
  type: 'invalid_duration' | 'timer_conflict' | 'session_creation_failed';
  message: string;
  originalError?: Error;
}

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
  // 現在のセッションタイプ（作業、短い休憩、長い休憩）
  const currentMode = ref<SessionType>('work')
  // 残り時間（秒）
  const timeLeft = ref(workDuration * 60)
  // タイマーが動作中かどうか
  const isRunning = ref(false)
  // 完了した作業セッション数
  const sessionsCompleted = ref(0)
  // タイマーのインターバルID
  const intervalRef = ref<NodeJS.Timeout | null>(null)
  // 現在実行中のセッション情報
  const currentSession = ref<PomodoroSession | null>(null)
  // タイマーエラー状態
  const timerError = ref<TimerError | null>(null)

  /**
   * セッション時間の妥当性を検証する
   * @param duration - 検証対象の時間（秒）
   * @returns 時間が有効範囲内（1秒〜2時間）で整数の場合true
   */
  const validateDuration = (duration: number): boolean => {
    return duration > 0 && duration <= 7200 && Number.isInteger(duration) // Max 2 hours, positive integer
  }

  /**
   * セッションタイプに応じた時間を取得する
   * @param mode - セッションタイプ（work/shortBreak/longBreak）
   * @returns セッション時間（秒）、無効な場合はデフォルト値
   */
  const getDuration = (mode: SessionType): number => {
    let duration: number
    switch (mode) {
      case 'work':
        duration = workDuration * 60
        break
      case 'shortBreak':
        duration = shortBreakDuration * 60
        break
      case 'longBreak':
        duration = longBreakDuration * 60
        break
    }

    if (!validateDuration(duration)) {
      timerError.value = {
        type: 'invalid_duration',
        message: `Invalid duration for ${mode}: ${duration} seconds`
      }
      // Return a safe default
      return mode === 'work' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60
    }

    return duration
  }

  /** 現在のモードの時間（秒）を算出 */
  const currentDuration = computed(() => getDuration(currentMode.value))
  
  /**
   * タイマーの進捗率を計算する
   * @returns 0〜100の進捗パーセンテージ
   */
  const progress = computed(() => {
    return ((currentDuration.value - timeLeft.value) / currentDuration.value) * 100
  })

  /**
   * 残り時間をMM:SS形式でフォーマットする
   * @returns フォーマットされた時間文字列（例: "25:00"）
   */
  const formattedTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60)
    const seconds = timeLeft.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  })

  /**
   * セッションタイプに対応するi18nキーを取得する
   * @param mode - セッションタイプ
   * @returns 多言語対応のラベルキー
   */
  const getModeLabel = (mode: SessionType): string => {
    switch (mode) {
      case 'work':
        return 'timer.workSession'
      case 'shortBreak':
        return 'timer.shortBreak'
      case 'longBreak':
        return 'timer.longBreak'
    }
  }

  /**
   * セッションタイプに対応する絵文字を取得する
   * @param mode - セッションタイプ
   * @returns セッションを表す絵文字
   */
  const getModeEmoji = (mode: SessionType): string => {
    switch (mode) {
      case 'work':
        return '💼'
      case 'shortBreak':
        return '☕'
      case 'longBreak':
        return '🏖️'
    }
  }

  /**
   * タイマーを開始する
   * 既に動作中の場合はエラーを返し、新しいセッションがない場合は作成する
   * @returns 成功時true、失敗時false
   */
  const start = (): boolean => {
    try {
      if (isRunning.value) {
        timerError.value = {
          type: 'timer_conflict',
          message: 'Timer is already running'
        }
        return false
      }

      timerError.value = null

      // Create a new session if none exists
      if (!currentSession.value) {
        currentSession.value = createSession()
      }
      
      isRunning.value = true
      intervalRef.value = setInterval(() => {
        timeLeft.value--
        
        if (timeLeft.value <= 0) {
          complete()
        }
      }, 1000)

      return true
    } catch (error) {
      timerError.value = {
        type: 'timer_conflict',
        message: 'Failed to start timer',
        originalError: error as Error
      }
      console.error('Timer start failed:', error)
      return false
    }
  }

  /**
   * タイマーを一時停止する
   * 現在のセッションがある場合は中断フラグを設定する
   * @returns 成功時true、失敗時false
   */
  const pause = (): boolean => {
    try {
      isRunning.value = false
      if (intervalRef.value) {
        clearInterval(intervalRef.value)
        intervalRef.value = null
      }

      // Mark current session as interrupted if it exists
      if (currentSession.value && !currentSession.value.completed) {
        currentSession.value.interrupted = true
        currentSession.value.endTime = new Date().toISOString()
      }

      return true
    } catch (error) {
      console.error('Timer pause failed:', error)
      return false
    }
  }

  /**
   * タイマーをリセットし、初期状態に戻す
   * タイマーを停止し、時間を元に戻し、セッションとエラーをクリアする
   * @returns 成功時true、失敗時false
   */
  const reset = (): boolean => {
    try {
      pause()
      timeLeft.value = currentDuration.value
      currentSession.value = null
      timerError.value = null
      return true
    } catch (error) {
      console.error('Timer reset failed:', error)
      return false
    }
  }

  /**
   * セッションを完了し、次のセッションタイプに切り替える
   * 作業セッションの場合はカウンターを増やし、休憩タイプを決定する
   */
  const complete = () => {
    pause()
    
    if (currentMode.value === 'work') {
      sessionsCompleted.value++
      const nextMode = sessionsCompleted.value % 4 === 0 ? 'longBreak' : 'shortBreak'
      switchMode(nextMode)
    } else {
      switchMode('work')
    }
  }

  /**
   * セッションモードを切り替える
   * タイマーを停止し、新しいモードに応じた時間を設定する
   * @param mode - 切り替え先のセッションタイプ
   */
  const switchMode = (mode: SessionType) => {
    pause()
    currentMode.value = mode
    timeLeft.value = getDuration(mode)
  }

  /**
   * 新しいポモドーロセッションを作成する
   * UUIDまたはタイムスタンプベースのIDでユニークなセッションを生成
   * @returns 作成されたセッションオブジェクト、失敗時はnull
   */
  const createSession = (): PomodoroSession | null => {
    try {
      // Generate a more robust ID using crypto.randomUUID if available
      let sessionId: string
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        sessionId = crypto.randomUUID()
      } else {
        // Fallback to timestamp-based ID
        sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
      }

      return {
        id: sessionId,
        type: currentMode.value,
        duration: currentDuration.value,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        completed: false,
        interrupted: false
      }
    } catch (error) {
      timerError.value = {
        type: 'session_creation_failed',
        message: 'Failed to create session',
        originalError: error as Error
      }
      console.error('Session creation failed:', error)
      return null
    }
  }

  /**
   * タイマーエラー状態をクリアする
   * エラー表示を消すために使用
   */
  const clearTimerError = () => {
    timerError.value = null
  }

  /**
   * コンポーネントのアンマウント時のクリーンアップ処理
   * タイマーのインターバルをクリアし、実行中のセッションを中断する
   */
  onUnmounted(() => {
    try {
      if (intervalRef.value) {
        clearInterval(intervalRef.value)
      }
      // Mark session as interrupted if timer is unmounted while running
      if (currentSession.value && isRunning.value) {
        currentSession.value.interrupted = true
        currentSession.value.endTime = new Date().toISOString()
      }
    } catch (error) {
      console.error('Timer cleanup failed:', error)
    }
  })

  return {
    currentMode,
    timeLeft,
    isRunning,
    sessionsCompleted,
    currentSession,
    timerError,
    progress,
    formattedTime,
    currentDuration,
    getModeLabel,
    getModeEmoji,
    start,
    pause,
    reset,
    switchMode,
    createSession,
    clearTimerError
  }
}