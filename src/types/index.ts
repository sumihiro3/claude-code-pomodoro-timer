export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  autoStartNextSession: boolean;
  notifications: {
    visual: boolean;
    audio: boolean;
    sound: string;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface PomodoroSession {
  id: string;
  type: 'work' | 'shortBreak' | 'longBreak';
  duration: number;
  startTime: string;
  endTime: string;
  completed: boolean;
  interrupted: boolean;
}

export interface PomodoroHistory {
  sessions: PomodoroSession[];
  stats: {
    totalSessions: number;
    completedSessions: number;
    totalWorkTime: number;
    streakDays: number;
  };
}

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
  workDuration: number = 2;
  shortBreakDuration: number = 1;
  longBreakDuration: number = 15;
  sessionsBeforeLongBreak: number = 4;
  autoStartNextSession: boolean = false;
  notifications = {
    visual: true,
    audio: true,
    sound: 'bell'
  };
  theme: ThemeMode = 'system';
  language: string = 'ja';
}