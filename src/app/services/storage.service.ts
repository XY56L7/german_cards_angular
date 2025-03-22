import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  constructor() { }
  
  /**
   * Set an item in local storage
   * @param key The key to store the item under
   * @param value The value to store
   */
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing item in localStorage:', error);
    }
  }
  
  /**
   * Get an item from local storage
   * @param key The key to retrieve
   * @returns The stored value or null if not found
   */
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error retrieving item from localStorage:', error);
      return null;
    }
  }
  
  /**
   * Remove an item from local storage
   * @param key The key to remove
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  }
  
  /**
   * Clear all items from local storage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
} 