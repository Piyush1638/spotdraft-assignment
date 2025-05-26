"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// Simplified user type for global context
export interface IUserContext {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
  sharedFiles: string[]; // Use string[] since ObjectIds will be serialized
}

// Type for the context value
interface UserContextType {
  user: IUserContext | null;
  setUser: (user: IUserContext | null) => void;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  // const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUserContext | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/data/user-data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUser({
            _id: data.user.userId, // map userId -> _id here
            name: data.user.name,
            email: data.user.email,
            profilePicture: data.user.profilePicture,
            sharedFiles: data.user.sharedFiles,
          });
        } else {
          setUser(null); // Handle error or user not found
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUser(null); // not logged in or error
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
