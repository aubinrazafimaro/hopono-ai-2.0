import AsyncStorage from '@react-native-async-storage/async-storage';

export type DailyProgress = {
  date: string;
  morningCompleted: boolean;
  middayCompleted: boolean;
  eveningCompleted: boolean;
};

export type HistoryEntry = {
  date: string;
  sessionType: 'morning' | 'midday' | 'evening';
  peaceScore: string;
  moodScore: string;
  feedbackText: string;
};

const PROGRESS_KEY = '@daily_ritual_progress';
const HISTORY_KEY = '@hopono_session_history';

export async function getDailyProgress(): Promise<DailyProgress> {
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultProgress: DailyProgress = {
    date: todayStr,
    morningCompleted: false,
    middayCompleted: false,
    eveningCompleted: false,
  };

  try {
    const raw = await AsyncStorage.getItem(PROGRESS_KEY);
    if (!raw) return defaultProgress;

    const parsed: DailyProgress = JSON.parse(raw);
    if (parsed.date !== todayStr) {
      // It is a new day, reset progress
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(defaultProgress));
      return defaultProgress;
    }
    return parsed;
  } catch (err) {
    console.warn('Failed to load daily progress from AsyncStorage:', err);
    return defaultProgress;
  }
}

export async function completeSession(sessionType: 'morning' | 'midday' | 'evening'): Promise<DailyProgress> {
  const current = await getDailyProgress();
  if (sessionType === 'morning') current.morningCompleted = true;
  if (sessionType === 'midday') current.middayCompleted = true;
  if (sessionType === 'evening') current.eveningCompleted = true;

  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(current));
  } catch (err) {
    console.warn('Failed to save daily progress to AsyncStorage:', err);
  }
  return current;
}

export async function getSessionHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load session history from AsyncStorage:', err);
    return [];
  }
}

export async function saveSessionToHistory(
  sessionType: 'morning' | 'midday' | 'evening',
  peaceScore: string,
  moodScore: string,
  feedbackText: string
): Promise<void> {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const history = await getSessionHistory();

    const newEntry: HistoryEntry = {
      date: todayStr,
      sessionType,
      peaceScore,
      moodScore,
      feedbackText,
    };

    // Prepend new entry
    const updatedHistory = [newEntry, ...history].slice(0, 15); // limit to last 15 sessions to save storage & LLM token space

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (err) {
    console.warn('Failed to save session history to AsyncStorage:', err);
  }
}
