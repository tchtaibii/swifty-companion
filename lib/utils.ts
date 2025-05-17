import { SkillProfile, ProjectProfile, UserProfile } from '../types/types';


export function formatDateToDDMMYY(dateString: string): string {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

export function map42UserToUserProfile(data: any): UserProfile {
  const rawLevel = data.cursus_users?.[1]?.level || 0;
  const level = Math.floor(rawLevel);
  const progress = Math.round((rawLevel % 1) * 100);
  const skills: SkillProfile[] = (data.cursus_users?.[1]?.skills || []).map((skill: any) => ({
    id: skill.id,
    name: skill.name,
    level: skill.level,
    percent: Math.round((skill.level % 1) * 100),
  }));
  const projects: ProjectProfile[] = (data.projects_users || []).map((p: any) => ({
    id: p.project?.id,
    name: p.project?.name,
    finalMark: p.final_mark,
    validated: !!p['validated?'],
    createdAt: p.created_at,
    status: p.status,
  }));
  return {
    avatar: data.image?.link || '',
    login: data.login,
    name: data.displayname || data.usual_full_name || data.login,
    location: data.campus?.[0]?.name || '',
    email: data.email,
    date: formatDateToDDMMYY(data.anonymize_date),
    currency: data.wallet,
    evp: data.correction_point,
    score: 0,
    level,
    progress,
    alumniDate: data.anonymize_date ? formatDateToDDMMYY(data.anonymize_date) : '',
    alumniCountdown: '',
    rank: 0,
    skills,
    projects,
  };
}