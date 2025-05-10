/**
 * Utility functions for handling dates in the application
 */
import { format } from "date-fns";

/**
 * Safely formats a date value that might be in various formats
 * @param dateValue - The date value to format
 * @param fallback - Fallback string to return if date is invalid
 * @param formatString - Optional date-fns format string
 * @returns Formatted date string or fallback value
 */
export function formatSafeDate(
  dateValue: any, 
  fallback: string = 'No date set',
  formatString: string = 'MMMM d, yyyy'
): string {
  // If it's undefined or null
  if (!dateValue) return fallback;
  
  try {
    // If it's a string, try to parse it
    if (typeof dateValue === 'string') {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return fallback;
      return format(date, formatString);
    }
    
    // If it's a Date object
    if (dateValue instanceof Date) {
      if (isNaN(dateValue.getTime())) return fallback;
      return format(dateValue, formatString);
    }
    
    // If it's an object with a date property (our custom format)
    if (typeof dateValue === 'object' && dateValue.date) {
      return format(new Date(dateValue.date), formatString);
    }
    
    // If it's an empty object (from DynamoDB)
    if (typeof dateValue === 'object' && Object.keys(dateValue).length === 0) {
      return fallback;
    }
    
    // Default fallback
    return fallback;
  } catch (error) {
    console.error('Error formatting date:', error);
    return fallback;
  }
}

/**
 * Checks if a date value is valid
 * @param dateValue - The date value to check
 * @returns Boolean indicating if the date is valid
 */
export function isValidDate(dateValue: any): boolean {
  if (!dateValue) return false;
  
  try {
    // If it's a string, try to parse it
    if (typeof dateValue === 'string') {
      return !isNaN(new Date(dateValue).getTime());
    }
    
    // If it's a Date object
    if (dateValue instanceof Date) {
      return !isNaN(dateValue.getTime());
    }
    
    // If it's an object with a date property (our custom format)
    if (typeof dateValue === 'object' && dateValue.date) {
      return !isNaN(new Date(dateValue.date).getTime());
    }
    
    // If it's an empty object (from DynamoDB)
    if (typeof dateValue === 'object' && Object.keys(dateValue).length === 0) {
      return false;
    }
    
    return false;
  } catch (error) {
    return false;
  }
}