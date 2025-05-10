import { FutureProfile } from "@shared/schema";

/**
 * Helper functions for managing profile data in localStorage
 */
import { FutureProfile } from "@shared/schema";

// Key prefix for profile data
const PROFILE_KEY_PREFIX = 'futureProfile_';
const GLOBAL_PROFILE_KEY = 'lastSavedProfile';
const USER_PROFILE_MAP_KEY = 'userProfileMap';

/**
 * Save a profile to localStorage with enhanced reliability
 */
export function saveProfileToStorage(userId: number | string | undefined, profile: Partial<FutureProfile>): void {
  try {
    if (!userId) {
      console.warn('No userId provided for profile storage, using fallback');
      // Save to a global key as fallback
      localStorage.setItem(GLOBAL_PROFILE_KEY, JSON.stringify(profile));
      return;
    }
    
    // Convert userId to string to ensure consistent key format
    const userIdStr = String(userId);
    const key = `${PROFILE_KEY_PREFIX}${userIdStr}`;
    
    console.log(`Saving profile for user ${userIdStr} with key ${key}`, profile);
    
    // Save the profile with the user-specific key
    localStorage.setItem(key, JSON.stringify(profile));
    
    // Also save to a backup key that doesn't depend on user ID
    localStorage.setItem(GLOBAL_PROFILE_KEY, JSON.stringify(profile));
    
    // Update the user-profile map for easier retrieval
    try {
      const mapStr = localStorage.getItem(USER_PROFILE_MAP_KEY) || '{}';
      const map = JSON.parse(mapStr);
      map[userIdStr] = key;
      localStorage.setItem(USER_PROFILE_MAP_KEY, JSON.stringify(map));
    } catch (e) {
      console.error('Error updating user-profile map:', e);
    }
    
    console.log(`Profile saved successfully to ${key} and ${GLOBAL_PROFILE_KEY}`);
  } catch (error) {
    console.error('Error saving profile to localStorage:', error);
    
    // Last resort fallback - try to save without any keys
    try {
      localStorage.setItem('emergencyProfileBackup', JSON.stringify(profile));
    } catch (e) {
      console.error('Emergency profile backup failed:', e);
    }
  }
}

/**
 * Load a profile from localStorage with fallbacks
 */
export function loadProfileFromStorage(userId: number | string | undefined): Partial<FutureProfile> | null {
  try {
    if (!userId) {
      console.warn('No userId provided for profile loading, using fallback');
      // Try to load from global key as fallback
      const globalProfile = localStorage.getItem(GLOBAL_PROFILE_KEY);
      if (globalProfile) {
        return JSON.parse(globalProfile);
      }
      return null;
    }
    
    // Convert userId to string for consistent key format
    const userIdStr = String(userId);
    const key = `${PROFILE_KEY_PREFIX}${userIdStr}`;
    
    console.log(`Attempting to load profile for user ${userIdStr} with key ${key}`);
    
    // Try to load from the user-specific key
    let storedProfile = localStorage.getItem(key);
    
    if (!storedProfile) {
      console.log(`No profile found with key ${key}, checking map...`);
      
      // Try to find the key in the user-profile map
      try {
        const mapStr = localStorage.getItem(USER_PROFILE_MAP_KEY) || '{}';
        const map = JSON.parse(mapStr);
        const mappedKey = map[userIdStr];
        
        if (mappedKey) {
          console.log(`Found mapped key ${mappedKey} for user ${userIdStr}`);
          storedProfile = localStorage.getItem(mappedKey);
        }
      } catch (e) {
        console.error('Error checking user-profile map:', e);
      }
    }
    
    // If still no profile, try the global key
    if (!storedProfile) {
      console.log(`No profile found for user ${userIdStr}, trying global key...`);
      storedProfile = localStorage.getItem(GLOBAL_PROFILE_KEY);
    }
    
    // Last resort - try emergency backup
    if (!storedProfile) {
      console.log('Trying emergency backup...');
      storedProfile = localStorage.getItem('emergencyProfileBackup');
    }
    
    if (!storedProfile) {
      console.log('No profile found in any storage location');
      return null;
    }
    
    const parsedProfile = JSON.parse(storedProfile);
    console.log(`Successfully loaded profile:`, parsedProfile);
    return parsedProfile;
  } catch (error) {
    console.error('Error loading profile from localStorage:', error);
    return null;
  }
}

/**
 * Clear a profile from localStorage
 */
export function clearProfileFromStorage(userId: number | string | undefined): void {
  try {
    if (!userId) {
      return;
    }
    
    const userIdStr = String(userId);
    const key = `${PROFILE_KEY_PREFIX}${userIdStr}`;
    localStorage.removeItem(key);
    console.log(`Profile removed from localStorage with key: ${key}`);
    
    // Also update the user-profile map
    try {
      const mapStr = localStorage.getItem(USER_PROFILE_MAP_KEY) || '{}';
      const map = JSON.parse(mapStr);
      delete map[userIdStr];
      localStorage.setItem(USER_PROFILE_MAP_KEY, JSON.stringify(map));
    } catch (e) {
      console.error('Error updating user-profile map:', e);
    }
  } catch (error) {
    console.error('Error removing profile from localStorage:', error);
  }
}

/**
 * Sync profile between localStorage and API data
 * This merges API data with any additional data stored locally
 */
export function syncProfileData(
  userId: number | string | undefined, 
  apiProfile: Partial<FutureProfile> | null | undefined
): Partial<FutureProfile> | null {
  // If we have API data, use it as the base
  if (apiProfile) {
    // Save the API data to localStorage for offline access
    saveProfileToStorage(userId, apiProfile);
    return apiProfile;
  }
  
  // If no API data, try to load from localStorage
  return loadProfileFromStorage(userId);
}