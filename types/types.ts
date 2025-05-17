export interface SkillProfile {
    id: number;
    name: string;
    level: number;
    percent: number;
  }
  
  export interface ProjectProfile {
    id: number;
    name: string;
    finalMark: number | null;
    validated: boolean;
    createdAt: string;
    status: string;
  }
  
  export interface UserProfile {
    avatar: string;
    login: string;
    name: string;
    location: string;
    email: string;
    date: string;
    currency: number;
    evp: number;
    score: number;
    level: number;
    progress: number;
    alumniDate: string;
    alumniCountdown: string;
    rank: number;
    skills: SkillProfile[];
    projects: ProjectProfile[];
  }
  