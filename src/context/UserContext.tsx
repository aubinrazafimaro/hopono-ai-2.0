import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserData = {
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
};

type UserContextType = {
  userData: UserData | null;
  refreshUserData: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  userData: null,
  refreshUserData: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const refreshUserData = async () => {
    try {
      const dataStr = await AsyncStorage.getItem('userData');
      if (dataStr) {
        setUserData(JSON.parse(dataStr));
      }
    } catch (e) {
      console.error('Failed to load user data', e);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
