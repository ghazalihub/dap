export interface User {
  user_id: string;
  user_fullname: string;
  user_gender: string;
  user_birth_day: number;
  user_birth_month: number;
  user_birth_year: number;
  user_school: string;
  user_job_title: string;
  user_bio: string;
  user_interests: string[];
  user_profile_photo: string;
  user_gallery: string[];
  user_device_token: string;
  user_reg_date: any;
  user_last_login: any;
  user_device_platform: string;
  user_total_likes: number;
  user_total_visits: number;
  user_total_dislikes: number;
  user_location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  geohash?: string;
  user_status: 'active' | 'suspended' | 'banned';
  user_is_verified: boolean;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  verification_type?: 'student' | 'professional';
  verification_tier?: 'standard' | 'representative';
  user_is_vip: boolean;

  // Academic Fields
  user_degree: string;
  user_university: string;
  user_college: string;
  user_institution: string;
  user_academic_status: string;
  user_study_year: string;
  user_graduation_year: string;

  // Professional Fields
  user_occupation: string;
  user_specialization: string;
  user_department: string;
  user_industry: string;

  // Lifestyle & Interests
  user_future_goals: string[];
  user_research_interests: string[];
  user_languages: string[];
  user_work_schedule: string;
  user_shift_type: string;
  user_exercise: string;
  user_smoking: string;
  user_drinking: string;
  user_sleep_schedule: string;
  user_relationship_intent: string;

  // Trust & Safety
  profile_quality_score: number;
  sanction_reason?: string;
  sanction_expiry?: any;
}
