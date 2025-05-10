/**
 * Helper functions for API interactions
 */

import { apiRequest } from "./queryClient";

/**
 * Creates a journal entry with error handling
 * @param userId - The user ID
 * @param content - The journal content
 * @returns The created journal or null if there was an error
 */
export async function createJournal(userId: number, content: string) {
  try {
    // Log the request
    console.log("Creating journal with:", { userId, content });
    
    // Make the API request
    const response = await apiRequest("POST", "/api/journals", {
      userId,
      content,
      date: new Date().toISOString()
    });
    
    // Parse and return the response
    const data = await response.json();
    console.log("Journal created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating journal:", error);
    return null;
  }
}

/**
 * Fetches journal entries for a user
 * @param userId - The user ID
 * @returns Array of journal entries or empty array if there was an error
 */
export async function fetchJournals(userId: number) {
  try {
    const response = await apiRequest("GET", `/api/users/${userId}/journals`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching journals:", error);
    return [];
  }
}

/**
 * Deletes a journal entry
 * @param journalId - The journal ID to delete
 * @returns Boolean indicating success
 */
export async function deleteJournal(journalId: number) {
  try {
    await apiRequest("DELETE", `/api/journals/${journalId}`);
    return true;
  } catch (error) {
    console.error("Error deleting journal:", error);
    return false;
  }
}