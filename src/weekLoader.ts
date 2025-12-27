// ============================================================================
// WEEK LOADER SYSTEM
// ============================================================================
// This file handles dynamic loading of week components and cycling logic

import Week2 from './week2';
import Week3 from './week3';
import Week4 from './week4';
import Week5 from './week5';
import Week6 from './week6';
import Week7 from './week7';
import Week8 from './week8';
import Week9 from './week9';
import Week10 from './week10';
import Week11 from './week11';
import Week12 from './week12';

// Map of week number to component
export const WEEK_COMPONENTS = {
  2: Week2,
  3: Week3,
  4: Week4,
  5: Week5,
  6: Week6,
  7: Week7,
  8: Week8,
  9: Week9,
  10: Week10,
  11: Week11,
  12: Week12,
};

/**
 * Get the appropriate week component for the current week
 * @param weekNumber - Current week (1-12)
 * @returns React component or null if week doesn't have a component
 */
export const getWeekComponent = (weekNumber: number) => {
  const normalizedWeek = Math.max(1, Math.min(12, weekNumber));
  
  // Week 1 doesn't have a component - return null to show default
  if (normalizedWeek === 1) {
    return null;
  }
  
  return WEEK_COMPONENTS[normalizedWeek] || null;
};

/**
 * Calculate if it's time to advance to the next week
 * @param startDate - ISO string of program start date
 * @returns Current week number (1-12)
 */
export const calculateCurrentWeek = (startDate: string): number => {
  if (!startDate) return 1;
  
  const start = new Date(startDate + 'T00:00:00');
  const today = new Date();
  const daysElapsed = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const weeksElapsed = Math.floor(daysElapsed / 7);
  
  // Cycle back to week 1 after week 12
  return (weeksElapsed % 12) + 1;
};

/**
 * Determine when the next week starts
 * @param startDate - ISO string of program start date
 * @param currentWeek - Current week number
 * @returns ISO string of next week's start date
 */
export const getNextWeekStartDate = (startDate: string, currentWeek: number): string => {
  if (!startDate) return '';
  
  const start = new Date(startDate + 'T00:00:00');
  const nextWeekStart = new Date(start.getTime() + (currentWeek * 7 * 24 * 60 * 60 * 1000));
  
  return nextWeekStart.toISOString().split('T')[0];
};

/**
 * Get week data that was previously saved
 * @param weekNumber - Week to retrieve
 * @param storageGet - Storage getter function
 * @returns Promise with week responses
 */
export const getWeekResponses = async (
  weekNumber: number,
  storageGet: (key: string) => Promise<any>
): Promise<Record<number, any>> => {
  const responses: Record<number, any> = {};
  
  try {
    // Try to load all 10 prompts for this week
    for (let i = 1; i <= 10; i++) {
      const key = `windingPath:week${weekNumber}:prompt${i}`;
      const data = await storageGet(key);
      
      if (data) {
        responses[i] = {
          completed: true,
          ...JSON.parse(typeof data === 'string' ? data : JSON.stringify(data)),
        };
      }
    }
  } catch (error) {
    console.error(`Failed to load week ${weekNumber} responses:`, error);
  }
  
  return responses;
};

/**
 * Clear the current week's responses (for week restart)
 * @param weekNumber - Week to clear
 * @param storageDel - Storage delete function
 */
export const clearWeekResponses = async (
  weekNumber: number,
  storageDel: (key: string) => Promise<void>
): Promise<void> => {
  try {
    for (let i = 1; i <= 10; i++) {
      const key = `windingPath:week${weekNumber}:prompt${i}`;
      await storageDel(key);
    }
    console.log(`Cleared all responses for week ${weekNumber}`);
  } catch (error) {
    console.error(`Failed to clear week ${weekNumber} responses:`, error);
  }
};
