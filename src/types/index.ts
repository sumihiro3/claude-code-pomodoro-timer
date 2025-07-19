import { z } from 'zod';

const NotificationSchema = z.object({
  visual: z.boolean(),
  audio: z.boolean(),
  sound: z.enum(['bell', 'chime', 'ding', 'none'])
});

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

export type PomodoroSettings = z.infer<typeof PomodoroSettingsSchema>;

export const PomodoroSessionSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['work', 'shortBreak', 'longBreak']),
  duration: z.number().positive(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  completed: z.boolean(),
  interrupted: z.boolean()
});

export const PomodoroHistorySchema = z.object({
  sessions: z.array(PomodoroSessionSchema),
  stats: z.object({
    totalSessions: z.number().nonnegative(),
    completedSessions: z.number().nonnegative(),
    totalWorkTime: z.number().nonnegative(),
    streakDays: z.number().nonnegative()
  })
});

export type PomodoroSession = z.infer<typeof PomodoroSessionSchema>;
export type PomodoroHistory = z.infer<typeof PomodoroHistorySchema>;

export interface TimerState {
  currentSession: PomodoroSession | null;
  isRunning: boolean;
  isPaused: boolean;
  remainingTime: number;
  currentSessionType: 'work' | 'shortBreak' | 'longBreak';
  sessionsCompleted: number;
}

export type SessionType = 'work' | 'shortBreak' | 'longBreak';
export type ThemeMode = 'light' | 'dark' | 'system';
export type NotificationSound = 'bell' | 'chime' | 'ding' | 'none';

export class DefaultPomodoroSettings implements PomodoroSettings {
  workDuration: number = 25; // Default 25 minutes for work
  shortBreakDuration: number = 5; // Default 5 minutes for short break
  longBreakDuration: number = 15; // Default 15 minutes for long break
  sessionsBeforeLongBreak: number = 4;
  autoStartNextSession: boolean = false;
  notifications = {
    visual: true,
    audio: true,
    sound: 'bell' as const
  };
  theme: ThemeMode = 'system';
  language: string = 'en'; // Default to English
}

// Validation utility functions
export function validatePomodoroSettings(data: unknown): PomodoroSettings {
  return PomodoroSettingsSchema.parse(data);
}

export function isValidPomodoroSettings(data: unknown): data is PomodoroSettings {
  return PomodoroSettingsSchema.safeParse(data).success;
}