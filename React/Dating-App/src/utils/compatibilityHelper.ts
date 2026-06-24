export interface User {
  user_id: string;
  user_fullname: string;
  user_gender: string;
  userBirthDay: number;
  userBirthMonth: number;
  userBirthYear: number;
  userSchool: string;
  userJobTitle: string;
  user_bio: string;
  userInterests: string[];
  user_profile_photo: string;
  userGallery: string[];
  userDeviceToken: string;
  userRegDate: any;
  userLastLogin: any;
  userDevicePlatform: string;
  userTotalLikes: number;
  userTotalVisits: number;
  userTotalDislikes: number;
  user_location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  user_status: 'active' | 'suspended' | 'banned';
  user_is_verified: boolean;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationType?: 'student' | 'professional';
  verificationTier?: 'standard' | 'representative';

  // Academic Fields
  user_degree: string;
  user_university: string;
  userCollege: string;
  user_institution: string;
  user_academic_status: string;
  userStudyYear: string;
  userGraduationYear: string;

  // Professional Fields
  user_occupation: string;
  userSpecialization: string;
  userDepartment: string;
  user_industry: string;

  // Lifestyle & Interests
  user_future_goals: string[];
  user_research_interests: string[];
  userLanguages: string[];
  userWorkSchedule: string;
  userShiftType: string;
  userExercise: string;
  userSmoking: string;
  userDrinking: string;
  userSleepSchedule: string;
  user_relationship_intent: string;

  // Trust & Safety
  profile_quality_score: number;
  sanction_reason?: string;
  sanction_expiry?: any;
}

export interface CompatibilityResult {
  score: number;
  explanations: string[];
}

export class CompatibilityHelper {
  static calculate(currentUser: User, otherUser: User): CompatibilityResult {
    let totalScore = 0;
    const explanations: string[] = [];

    // 1. Education Similarity (20 points)
    if (currentUser.user_degree && currentUser.user_degree === otherUser.user_degree) {
      totalScore += 20;
      explanations.push(`You both are pursuing or hold a ${currentUser.user_degree} degree.`);
    } else if (currentUser.user_university && currentUser.user_university === otherUser.user_university) {
      totalScore += 15;
      explanations.push(`You both attended ${currentUser.user_university}.`);
    }

    // 2. Career & Industry (20 points)
    if (currentUser.user_industry && currentUser.user_industry === otherUser.user_industry) {
      totalScore += 20;
      explanations.push(`You both work in the ${currentUser.user_industry} industry.`);
    }

    // 3. Relationship Intent (20 points)
    if (currentUser.user_relationship_intent && currentUser.user_relationship_intent === otherUser.user_relationship_intent) {
      totalScore += 20;
      explanations.push(`You both are looking for a ${currentUser.user_relationship_intent.toLowerCase()}.`);
    }

    // 4. Future Goals Overlap (15 points)
    const commonGoals = (currentUser.user_future_goals || [])
        .filter(goal => (otherUser.user_future_goals || []).includes(goal));
    if (commonGoals.length > 0) {
      totalScore += 15;
      explanations.push(`You both share future goals in ${commonGoals.join(', ')}.`);
    }

    // 5. Research Interests Overlap (15 points)
    const commonInterests = (currentUser.user_research_interests || [])
        .filter(interest => (otherUser.user_research_interests || []).includes(interest));
    if (commonInterests.length > 0) {
      totalScore += 15;
      explanations.push(`You both are interested in ${commonInterests.join(', ')}.`);
    }

    // 6. Lifestyle (10 points)
    let lifestyleMatch = false;
    if (currentUser.userSmoking && currentUser.userSmoking === otherUser.userSmoking) {
      totalScore += 5;
      lifestyleMatch = true;
    }
    if (currentUser.userDrinking && currentUser.userDrinking === otherUser.userDrinking) {
      totalScore += 5;
      lifestyleMatch = true;
    }
    if (lifestyleMatch && currentUser.userSmoking && currentUser.userDrinking) {
        explanations.push("You have similar lifestyle habits.");
    }

    // Baseline score to ensure a minimum for verified profiles
    if (totalScore < 30) totalScore = 30 + (totalScore % 20);
    if (totalScore > 100) totalScore = 100;

    return { score: totalScore, explanations };
  }
}
