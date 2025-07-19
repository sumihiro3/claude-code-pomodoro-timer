import { z } from 'zod';

/**
 * 通知設定のスキーマ定義
 * ビジュアル通知、オーディオ通知、通知音の設定を管理
 */
const NotificationSchema = z.object({
  visual: z.boolean(),
  audio: z.boolean(),
  sound: z.enum(['bell', 'chime', 'ding', 'none'])
});

/**
 * ポモドーロタイマーの設定項目スキーマ
 * 作業時間、休憩時間、通知設定、テーマなどの全設定を定義
 */
export const PomodoroSettingsSchema = z.object({
  workDuration: z.number().min(1).max(120), // 1-120 minutes
  shortBreakDuration: z.number().min(1).max(60), // 1-60 minutes
  longBreakDuration: z.number().min(1).max(120), // 1-120 minutes
  sessionsBeforeLongBreak: z.number().min(2).max(10), // 2-10 sessions
  autoStartNextSession: z.boolean(),
  notifications: NotificationSchema,
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/) // ISO language codes
});

/** ポモドーロタイマーの設定型 */
export type PomodoroSettings = z.infer<typeof PomodoroSettingsSchema>;

/**
 * ポモドーロセッション（作業・休憩の一単位）のスキーマ定義
 * セッションの開始・終了時刻、完了状態、中断状態を管理
 */
export const PomodoroSessionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['work', 'shortBreak', 'longBreak']),
  duration: z.number().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  completed: z.boolean(),
  interrupted: z.boolean()
});

/**
 * ポモドーロセッションの履歴データスキーマ
 * 過去のセッション記録と統計情報を管理
 */
export const PomodoroHistorySchema = z.object({
  sessions: z.array(PomodoroSessionSchema),
  stats: z.object({
    totalSessions: z.number().nonnegative(),
    completedSessions: z.number().nonnegative(),
    totalWorkTime: z.number().nonnegative(),
    streakDays: z.number().nonnegative()
  })
});

/** ポモドーロセッションの型 */
export type PomodoroSession = z.infer<typeof PomodoroSessionSchema>;

/** ポモドーロ履歴データの型 */
export type PomodoroHistory = z.infer<typeof PomodoroHistorySchema>;

/**
 * タイマーの現在状態を表すインターフェース
 * 実行中セッション、動作状態、残り時間などを管理
 */
export interface TimerState {
  currentSession: PomodoroSession | null;
  isRunning: boolean;
  isPaused: boolean;
  remainingTime: number;
  currentSessionType: 'work' | 'shortBreak' | 'longBreak';
  sessionsCompleted: number;
}

/** セッションの種類（作業・短い休憩・長い休憩） */
export type SessionType = 'work' | 'shortBreak' | 'longBreak';

/** アプリケーションのテーマモード */
export type ThemeMode = 'light' | 'dark' | 'system';

/** 通知音の種類 */
export type NotificationSound = 'bell' | 'chime' | 'ding' | 'none';

/**
 * ポモドーロタイマーのデフォルト設定クラス
 * アプリケーション初回起動時や設定リセット時に使用される標準値を定義
 */
export class DefaultPomodoroSettings implements PomodoroSettings {
  workDuration: number = 25; // Default 25 minutes for work
  shortBreakDuration: number = 5; // Default 5 minutes for short break
  longBreakDuration: number = 15; // Default 15 minutes for long break
  sessionsBeforeLongBreak: number = 4;
  autoStartNextSession: boolean = false;
  notifications = {
    visual: true,
    audio: true,
    sound: 'bell' as NotificationSound
  };
  theme: ThemeMode = 'system';
  language: string = 'en'; // Default to English
}

/**
 * ポモドーロ設定データの検証を行う関数
 * @param data - 検証対象のデータ（型不明）
 * @returns 検証済みのポモドーロ設定
 * @throws Zodバリデーションエラー（データが無効な場合）
 */
export function validatePomodoroSettings(data: unknown): PomodoroSettings {
  return PomodoroSettingsSchema.parse(data);
}

/**
 * データがポモドーロ設定として有効かどうかを判定する関数
 * @param data - 判定対象のデータ（型不明）
 * @returns データが有効なポモドーロ設定の場合true、そうでなければfalse
 */
export function isValidPomodoroSettings(data: unknown): data is PomodoroSettings {
  return PomodoroSettingsSchema.safeParse(data).success;
}