export interface User {
  userId: string;
  userFullname: string;
  userGender: string;
  userBirthDay: number;
  userBirthMonth: number;
  userBirthYear: number;
  userSchool: string;
  userJobTitle: string;
  userBio: string;
  userInterests: string[];
  userProfilePhoto: string;
  userGallery: string[];
  userDeviceToken: string;
  userRegDate: any;
  userLastLogin: any;
  userDevicePlatform: string;
  userTotalLikes: number;
  userTotalVisits: number;
  userTotalDislikes: number;
  userLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  userStatus: 'active' | 'suspended' | 'banned';
  userIsVerified: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationType?: 'student' | 'professional';
  verificationTier?: 'standard' | 'representative';

  // Academic Fields
  userDegree: string;
  userUniversity: string;
  userCollege: string;
  userInstitution: string;
  userAcademicStatus: string;
  userStudyYear: string;
  userGraduationYear: string;

  // Professional Fields
  userOccupation: string;
  userSpecialization: string;
  userDepartment: string;
  userIndustry: string;

  // Lifestyle & Interests
  userFutureGoals: string[];
  userResearchInterests: string[];
  userLanguages: string[];
  userWorkSchedule: string;
  userShiftType: string;
  userExercise: string;
  userSmoking: string;
  userDrinking: string;
  userSleepSchedule: string;
  userRelationshipIntent: string;

  // Trust & Safety
  profileQualityScore: number;
  sanctionReason?: string;
  sanctionExpiry?: any;
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
    if (currentUser.userDegree && currentUser.userDegree === otherUser.userDegree) {
      totalScore += 20;
      explanations.push(`You both are pursuing or hold a ${currentUser.userDegree} degree.`);
    } else if (currentUser.userUniversity && currentUser.userUniversity === otherUser.userUniversity) {
      totalScore += 15;
      explanations.push(`You both attended ${currentUser.userUniversity}.`);
    }

    // 2. Career & Industry (20 points)
    if (currentUser.userIndustry && currentUser.userIndustry === otherUser.userIndustry) {
      totalScore += 20;
      explanations.push(`You both work in the ${currentUser.userIndustry} industry.`);
    }

    // 3. Relationship Intent (20 points)
    if (currentUser.userRelationshipIntent && currentUser.userRelationshipIntent === otherUser.userRelationshipIntent) {
      totalScore += 20;
      explanations.push(`You both are looking for a ${currentUser.userRelationshipIntent.toLowerCase()}.`);
    }

    // 4. Future Goals Overlap (15 points)
    const commonGoals = (currentUser.userFutureGoals || [])
        .filter(goal => (otherUser.userFutureGoals || []).includes(goal));
    if (commonGoals.length > 0) {
      totalScore += 15;
      explanations.push(`You both share future goals in ${commonGoals.join(', ')}.`);
    }

    // 5. Research Interests Overlap (15 points)
    const commonInterests = (currentUser.userResearchInterests || [])
        .filter(interest => (otherUser.userResearchInterests || []).includes(interest));
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
