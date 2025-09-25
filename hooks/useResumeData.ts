import { useState, useEffect, useCallback } from 'react';
import type { ResumeData } from '../types';
import { initialResumeData } from '../constants';

const LOCAL_STORAGE_KEY = 'resume-data';

export const useResumeData = (t: (key: string) => string) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  useEffect(() => {
    // Load data from localStorage on initial render
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        setResumeData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Failed to load resume data from localStorage", error);
    }
  }, []);

  const saveResume = useCallback(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resumeData));
      console.log("Resume saved!");
// Fix: Added braces to the catch block to fix a syntax error.
    } catch (error) {
      console.error("Failed to save resume data to localStorage", error);
    }
  }, [resumeData]);

  // Auto-save on data change
  useEffect(() => {
    const handler = setTimeout(() => {
        saveResume();
    }, 500); // Debounce saving
    return () => clearTimeout(handler);
  }, [resumeData, saveResume]);

  const loadResume = useCallback(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        setResumeData(JSON.parse(savedData));
      } else {
        alert(t('alerts.noSavedResume'));
      }
    } catch (error) {
      console.error("Failed to load resume data from localStorage", error);
    }
  }, [t]);

  const resetResume = useCallback(() => {
    setResumeData(initialResumeData);
    // Also clear from storage
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear resume data from localStorage", error);
    }
  }, []);

  return { resumeData, setResumeData, saveResume, loadResume, resetResume };
};