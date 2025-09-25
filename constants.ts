import { ResumeData } from './types';

export const BLANK_RESUME_DATA: ResumeData = {
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    avatar: '',
  },
  summary: '',
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
};
