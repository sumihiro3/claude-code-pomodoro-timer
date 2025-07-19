import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  TimerState, 
  PomodoroSession, 
  PomodoroHistory, 
  SessionType 
} from '~/types'

/**
 * ポモドーロタイマーのグローバル状態管理ストア
 * セッションの実行状態、履歴データ、統計情報を一元管理
 * Piniaを使用したコンポジションAPIベースのストア
 */
export const useTimerStore = defineStore('timer', () => {
  // タイマーの基本状態
  
  /** 現在実行中のセッション */
  const currentSession = ref<PomodoroSession | null>(null)
  /** タイマーが動作中かどうか */
  const isRunning = ref(false)
  /** タイマーが一時停止中かどうか */
  const isPaused = ref(false)
  /** 残り時間（秒） */
  const remainingTime = ref(0)
  /** 現在のセッションタイプ */
  const currentSessionType = ref<SessionType>('work')
  /** 完了したセッション数 */
  const sessionsCompleted = ref(0)
  /** セッション履歴と統計データ */
  const history = ref<PomodoroHistory>({
    sessions: [],
    stats: {
      totalSessions: 0,
      completedSessions: 0,
      totalWorkTime: 0,
      streakDays: 0
    }
  })

  /**
   * タイマーの現在状態を統合したオブジェクト
   * @returns タイマーの全状態を含むTimerStateオブジェクト
   */
  const timerState = computed<TimerState>(() => ({
    currentSession: currentSession.value,
    isRunning: isRunning.value,
    isPaused: isPaused.value,
    remainingTime: remainingTime.value,
    currentSessionType: currentSessionType.value,
    sessionsCompleted: sessionsCompleted.value
  }))

  /**
   * 新しいセッションを開始する
   * @param session - 開始するセッションの情報
   */
  const startSession = (session: PomodoroSession) => {
    currentSession.value = session
    isRunning.value = true
    isPaused.value = false
    remainingTime.value = session.duration
    currentSessionType.value = session.type
  }

  /**
   * 現在のセッションを一時停止する
   */
  const pauseSession = () => {
    isPaused.value = true
    isRunning.value = false
  }

  /**
   * 一時停止中のセッションを再開する
   */
  const resumeSession = () => {
    isPaused.value = false
    isRunning.value = true
  }

  /**
   * 現在のセッションを停止し、中断として履歴に記録する
   */
  const stopSession = () => {
    if (currentSession.value) {
      currentSession.value.interrupted = true
      currentSession.value.endTime = new Date().toISOString()
      addSessionToHistory(currentSession.value)
    }
    resetTimer()
  }

  /**
   * 現在のセッションを完了し、統計を更新して履歴に記録する
   */
  const completeSession = () => {
    if (currentSession.value) {
      currentSession.value.completed = true
      currentSession.value.endTime = new Date().toISOString()
      addSessionToHistory(currentSession.value)
      
      if (currentSession.value.type === 'work') {
        sessionsCompleted.value++
        history.value.stats.completedSessions++
        history.value.stats.totalWorkTime += currentSession.value.duration
      }
    }
    resetTimer()
  }

  /**
   * タイマーを初期状態にリセットする
   */
  const resetTimer = () => {
    currentSession.value = null
    isRunning.value = false
    isPaused.value = false
    remainingTime.value = 0
  }

  /**
   * セッションを履歴に追加し、統計を更新してストレージに保存する
   * @param session - 履歴に追加するセッション
   */
  const addSessionToHistory = (session: PomodoroSession) => {
    history.value.sessions.push(session)
    history.value.stats.totalSessions++
    saveHistoryToStorage()
  }

  /**
   * ローカルストレージから履歴データを読み込む
   * クライアントサイドでのみ実行し、エラーハンドリングを含む
   */
  const loadHistoryFromStorage = () => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem('pomodoro-history')
        if (stored) {
          const parsed = JSON.parse(stored)
          history.value = { ...history.value, ...parsed }
        }
      } catch (error) {
        console.error('Failed to load history from localStorage:', error)
      }
    }
  }

  /**
   * 現在の履歴データをローカルストレージに保存する
   * クライアントサイドでのみ実行し、エラーハンドリングを含む
   */
  const saveHistoryToStorage = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem('pomodoro-history', JSON.stringify(history.value))
      } catch (error) {
        console.error('Failed to save history to localStorage:', error)
      }
    }
  }

  /**
   * 履歴データを全てクリアし、統計をリセットする
   */
  const clearHistory = () => {
    history.value = {
      sessions: [],
      stats: {
        totalSessions: 0,
        completedSessions: 0,
        totalWorkTime: 0,
        streakDays: 0
      }
    }
    saveHistoryToStorage()
  }

  /**
   * 今日のセッション一覧を取得する
   * @returns 今日実行されたセッションの配列
   */
  const getTodaysSessions = () => {
    const today = new Date().toDateString()
    return history.value.sessions.filter(session => 
      new Date(session.startTime).toDateString() === today
    )
  }

  /**
   * 過去1週間のセッション統計を取得する
   * @returns 過去7日間のセッションの配列
   */
  const getWeeklyStats = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    return history.value.sessions.filter(session => 
      new Date(session.startTime) >= weekAgo
    )
  }

  // 初期化時に履歴データを読み込み
  loadHistoryFromStorage()

  return {
    timerState,
    currentSession,
    isRunning,
    isPaused,
    remainingTime,
    currentSessionType,
    sessionsCompleted,
    history,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    completeSession,
    resetTimer,
    addSessionToHistory,
    loadHistoryFromStorage,
    saveHistoryToStorage,
    clearHistory,
    getTodaysSessions,
    getWeeklyStats
  }
})