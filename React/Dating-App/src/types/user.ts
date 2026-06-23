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
