import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'candidate_graduate' | 'candidate_professional' | 'recruiter' | 'admin';

export interface UserProfile {
  id: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  company_description?: string;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface GraduateProfile {
  id: string;
  user_id: string;
  education_level: string;
  institution: string;
  graduation_year: number;
  program_description: string;
  subjects_liked: string[];
  thesis_title?: string;
  thesis_problem?: string;
  thesis_favorite_part?: string;
  additional_info?: string;
  cv_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalProfile {
  id: string;
  user_id: string;
  years_experience: number;
  current_position?: string;
  cv_url: string;
  cv_text?: string;
  best_skills: string;
  passion_description?: string;
  preferred_work_environment?: string;
  additional_info?: string;
  created_at: string;
  updated_at: string;
}

export interface Mission {
  id: string;
  recruiter_id: string;
  title: string;
  description: string;
  requirements?: string;
  activities: string[];
  keywords: string[];
  location?: string;
  contract_type?: string;
  salary_range?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileAnalysis {
  id: string;
  user_id: string;
  profile_type: string;
  analysis_data: any;
  profile_description?: string;
  identified_strengths: string[];
  recommended_activities: string[];
  overall_score: number;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  candidate_id: string;
  mission_id: string;
  compatibility_score: number;
  match_reason?: string;
  recruiter_viewed: boolean;
  candidate_viewed: boolean;
  recruiter_interested: boolean;
  candidate_interested: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditActivity {
  id: string;
  name: string;
  description?: string;
  category: string;
  keywords: string[];
  created_at: string;
}
