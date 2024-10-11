import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ProfileContextType = {
  profileName: string;
  setProfileName: (name: string) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileName, setProfileNameState] = useState("");

  useEffect(() => {
    loadProfileName();
  }, []);

  const loadProfileName = async () => {
    try {
      const savedName = await AsyncStorage.getItem("profileName");
      if (savedName) {
        setProfileNameState(savedName);
      }
    } catch (error) {
      console.error("Error loading profile name:", error);
    }
  };

  const setProfileName = async (name: string) => {
    try {
      await AsyncStorage.setItem("profileName", name);
      setProfileNameState(name);
    } catch (error) {
      console.error("Error saving profile name:", error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profileName, setProfileName }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (undefined === context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
