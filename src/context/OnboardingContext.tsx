import React, { createContext, useContext, useState, ReactNode } from 'react';

type OnboardingState = {
  name: string;
  age: string;
  gender: string;
  screenTime: string;
  resolutionGoal: string[];
  lifeGoals: string[];
  guiltLevel: number;
  selfImageImpact: string[];
  obstacles: string[];
  deepPain: string[];
  commitmentLevel?: string;
};

type OnboardingContextType = {
  data: OnboardingState;
  updateData: (updates: Partial<OnboardingState>) => void;
};

const defaultState: OnboardingState = {
  name: '',
  age: '',
  gender: '',
  screenTime: '',
  resolutionGoal: [],
  lifeGoals: [],
  guiltLevel: 4,
  selfImageImpact: [],
  obstacles: [],
  deepPain: [],
  commitmentLevel: '',
};

const OnboardingContext = createContext<OnboardingContextType>({
  data: defaultState,
  updateData: () => {},
});

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingState>(defaultState);

  const updateData = (updates: Partial<OnboardingState>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => useContext(OnboardingContext);
