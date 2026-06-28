import React, { createContext, useContext, useState } from 'react';

export const peaceStates = [
  { text: 'clouded', emoji: '🌧️', color: '#334155' },
  { text: 'restless', emoji: '🌩️', color: '#475569' },
  { text: 'settling', emoji: '🍃', color: '#94a3b8' },
  { text: 'clear', emoji: '☀️', color: '#fcd34d' },
  { text: 'aligned', emoji: '✨', color: '#fbbf24' },
];

export const moodStates = [
  { text: 'terrible', emoji: '😔', color: '#7f1d1d' },
  { text: 'low', emoji: '😕', color: '#9a3412' },
  { text: 'okay', emoji: '😐', color: '#ca8a04' },
  { text: 'good', emoji: '😊', color: '#0d9488' },
  { text: 'amazing', emoji: '😇', color: '#0891b2' },
];

export type DailyCheckIn = {
  date: string;
  peaceIndex: number;
  moodIndex: number;
  sessions: number;
  hasCheckIn: boolean; // Did they open the app and check in?
};

// Generate 365 days of mock data
const generateMockHistory = (): DailyCheckIn[] => {
  const history: DailyCheckIn[] = [];
  const today = new Date();
  
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    
    // Simulate a realistic pattern: 12-day current streak.
    const isStreak = i < 12;
    // Before 12 days, random check-ins
    const hasCheckIn = isStreak || Math.random() > 0.4;
    
    history.push({
      date: d.toISOString().split('T')[0],
      peaceIndex: hasCheckIn ? Math.min(4, Math.max(0, Math.floor(Math.random() * 3) + (i < 30 ? 1 : 0))) : 0,
      moodIndex: hasCheckIn ? Math.min(4, Math.max(0, Math.floor(Math.random() * 3) + (i < 30 ? 1 : 0))) : 0,
      sessions: hasCheckIn ? Math.floor(Math.random() * 3) + 1 : 0, // 1 to 3 sessions if checked in
      hasCheckIn,
    });
  }
  return history;
};

type CheckInContextType = {
  peaceIndex: number;
  setPeaceIndex: (index: number) => void;
  moodIndex: number;
  setMoodIndex: (index: number) => void;
  getAverages: (days: number) => { 
    avgPeace: number; 
    avgMood: number; 
    totalSessions: number;
    streak: number;
    bestStreak: number;
  };
  history: DailyCheckIn[];
  selectedPeriod: number;
  setSelectedPeriod: (days: number) => void;
};

const CheckInContext = createContext<CheckInContextType | undefined>(undefined);

export function CheckInProvider({ children }: { children: React.ReactNode }) {
  const [peaceIndex, setPeaceIndex] = useState(2);
  const [moodIndex, setMoodIndex] = useState(2);
  const [history] = useState<DailyCheckIn[]>(generateMockHistory());
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7);

  const getAverages = (days: number) => {
    const periodData = history.slice(0, days); // Since history is sorted from today backwards
    
    let sumPeace = 0;
    let sumMood = 0;
    let totalSessions = 0;
    let streak = 0;
    let countingStreak = true;

    periodData.forEach((day, index) => {
      sumPeace += day.peaceIndex;
      sumMood += day.moodIndex;
      totalSessions += day.sessions;
      
      if (countingStreak) {
        if (day.hasCheckIn) {
          streak++;
        } else {
          // If no checkin today and it's index 0, we forgive. Else break streak.
          if (index !== 0) countingStreak = false;
        }
      }
    });

    // Calculate Best Streak
    let bestStreak = 0;
    let tempStreak = 0;
    for (let i = periodData.length - 1; i >= 0; i--) {
      if (periodData[i].hasCheckIn) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    return {
      avgPeace: days > 0 ? sumPeace / days : 0,
      avgMood: days > 0 ? sumMood / days : 0,
      totalSessions,
      streak,
      bestStreak,
    };
  };

  return (
    <CheckInContext.Provider value={{ peaceIndex, setPeaceIndex, moodIndex, setMoodIndex, getAverages, history, selectedPeriod, setSelectedPeriod }}>
      {children}
    </CheckInContext.Provider>
  );
}

export function useCheckIn() {
  const context = useContext(CheckInContext);
  if (context === undefined) {
    throw new Error('useCheckIn must be used within a CheckInProvider');
  }
  return context;
}
