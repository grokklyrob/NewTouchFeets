
import { User } from '../types';

const USER_STORAGE_KEY = 'touchfeets_user';

/**
 * Signs the user out by clearing their data from localStorage.
 */
export const signOut = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
  console.log("User session cleared from storage.");
};

/**
 * Retrieves the user object from localStorage.
 */
export const getStoredUser = (): User | null => {
  const userJson = localStorage.getItem(USER_STORAGE_KEY);
  if (!userJson) {
    return null;
  }
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error("Error parsing stored user data:", error);
    // Clear corrupted data
    signOut();
    return null;
  }
};

/**
 * Stores the user object in localStorage.
 * @param user The user object to store.
 */
export const setStoredUser = (user: User): void => {
    try {
        const userJson = JSON.stringify(user);
        localStorage.setItem(USER_STORAGE_KEY, userJson);
    } catch (error) {
        console.error("Could not store user data:", error);
    }
}
