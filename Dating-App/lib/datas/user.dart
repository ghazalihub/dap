import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dating_app/constants/constants.dart';

class User {
  /// User info
  final String userId;
  final String userProfilePhoto;
  final String userFullname;
  final String userGender;
  final int userBirthDay;
  final int userBirthMonth;
  final int userBirthYear;
  final String userSchool;
  final String userJobTitle;
  final String userBio;
  final String userPhoneNumber;
  final String userEmail;
  final String userCountry;
  final String userLocality;
  final GeoPoint userGeoPoint;
  final String userStatus;
  final bool userIsVerified;
  final String userLevel;
  final DateTime userRegDate;
  final DateTime userLastLogin;
  final String userDeviceToken;
  final int userTotalLikes;
  final int userTotalVisits;
  final int userTotalDisliked;
  // Academic Identity
  final String userInstitution;
  final String userUniversity;
  final String userCollege;
  final String userDegree;
  final String userCourse;
  final String userStudyYear;
  final String userGraduationYear;
  final String userAcademicStatus;
  // Professional Identity
  final String userOccupation;
  final String userSpecialization;
  final String userDepartment;
  final String userIndustry;
  // Future Goals
  final List<String> userFutureGoals;
  // Research Interests
  final List<String> userResearchInterests;
  // Languages
  final String userNativeLanguage;
  final List<String> userSpokenLanguages;
  // Lifestyle
  final String userWorkSchedule;
  final String userShiftType;
  final String userExercise;
  final String userSmoking;
  final String userDrinking;
  final String userSleepSchedule;
  // Relationship Intent
  final String userRelationshipIntent;
  // Verification
  final String userVerificationStatus;
  final String userVerificationType;
  final String userVerificationIdNumber;
  final String userVerificationDocumentUrl;
  final int userVerificationRankingBoost;
  // Trust & Safety
  final DateTime? userSuspensionEndDate;
  final bool userIsSuspended;
  final bool userIsBanned;
  final int userProfileQualityScore;
  final String userBanReason;

  final Map<String, dynamic>? userGallery;
  final Map<String, dynamic>? userSettings;

  // Constructor
  User({
    required this.userId,
    required this.userProfilePhoto,
    required this.userFullname,
    required this.userGender,
    required this.userBirthDay,
    required this.userBirthMonth,
    required this.userBirthYear,
    required this.userSchool,
    required this.userJobTitle,
    required this.userBio,
    required this.userPhoneNumber,
    required this.userEmail,
    required this.userGallery,
    required this.userCountry,
    required this.userLocality,
    required this.userGeoPoint,
    required this.userSettings,
    required this.userStatus,
    required this.userLevel,
    required this.userIsVerified,
    required this.userRegDate,
    required this.userLastLogin,
    required this.userDeviceToken,
    required this.userTotalLikes,
    required this.userTotalVisits,
    required this.userTotalDisliked,
    // Academic Identity
    required this.userInstitution,
    required this.userUniversity,
    required this.userCollege,
    required this.userDegree,
    required this.userCourse,
    required this.userStudyYear,
    required this.userGraduationYear,
    required this.userAcademicStatus,
    // Professional Identity
    required this.userOccupation,
    required this.userSpecialization,
    required this.userDepartment,
    required this.userIndustry,
    // Future Goals
    required this.userFutureGoals,
    // Research Interests
    required this.userResearchInterests,
    // Languages
    required this.userNativeLanguage,
    required this.userSpokenLanguages,
    // Lifestyle
    required this.userWorkSchedule,
    required this.userShiftType,
    required this.userExercise,
    required this.userSmoking,
    required this.userDrinking,
    required this.userSleepSchedule,
    // Relationship Intent
    required this.userRelationshipIntent,
    // Verification
    required this.userVerificationStatus,
    required this.userVerificationType,
    required this.userVerificationIdNumber,
    required this.userVerificationDocumentUrl,
    required this.userVerificationRankingBoost,
    // Trust & Safety
    this.userSuspensionEndDate,
    required this.userIsSuspended,
    required this.userIsBanned,
    required this.userProfileQualityScore,
    required this.userBanReason,
  });

  /// factory user object
  factory User.fromDocument(Map<String, dynamic> doc) {
    return User(
      userId: doc[USER_ID],
      userProfilePhoto: doc[USER_PROFILE_PHOTO],
      userFullname: doc[USER_FULLNAME],
      userGender: doc[USER_GENDER],
      userBirthDay: doc[USER_BIRTH_DAY],
      userBirthMonth: doc[USER_BIRTH_MONTH],
      userBirthYear: doc[USER_BIRTH_YEAR],
      userSchool: doc[USER_SCHOOL] ?? '',
      userJobTitle: doc[USER_JOB_TITLE] ?? '',
      userBio: doc[USER_BIO] ?? '',
      userPhoneNumber: doc[USER_PHONE_NUMBER] ?? '',
      userEmail: doc[USER_EMAIL] ?? '',
      userGallery: doc[USER_GALLERY],
      userCountry: doc[USER_COUNTRY] ?? '',
      userLocality: doc[USER_LOCALITY] ?? '',
      userGeoPoint: doc[USER_GEO_POINT]['geopoint'],
      userSettings: doc[USER_SETTINGS],
      userStatus: doc[USER_STATUS],
      userIsVerified: doc[USER_IS_VERIFIED] ?? false,
      userLevel: doc[USER_LEVEL],
      userRegDate: doc[USER_REG_DATE].toDate(), // Firestore Timestamp
      userLastLogin: doc[USER_LAST_LOGIN].toDate(), // Firestore Timestamp
      userDeviceToken: doc[USER_DEVICE_TOKEN],
      userTotalLikes: doc[USER_TOTAL_LIKES] ?? 0,
      userTotalVisits: doc[USER_TOTAL_VISITS] ?? 0,
      userTotalDisliked: doc[USER_TOTAL_DISLIKED] ?? 0,
      // Academic Identity
      userInstitution: doc[USER_INSTITUTION] ?? '',
      userUniversity: doc[USER_UNIVERSITY] ?? '',
      userCollege: doc[USER_COLLEGE] ?? '',
      userDegree: doc[USER_DEGREE] ?? '',
      userCourse: doc[USER_COURSE] ?? '',
      userStudyYear: doc[USER_STUDY_YEAR] ?? '',
      userGraduationYear: doc[USER_GRADUATION_YEAR] ?? '',
      userAcademicStatus: doc[USER_ACADEMIC_STATUS] ?? '',
      // Professional Identity
      userOccupation: doc[USER_OCCUPATION] ?? '',
      userSpecialization: doc[USER_SPECIALIZATION] ?? '',
      userDepartment: doc[USER_DEPARTMENT] ?? '',
      userIndustry: doc[USER_INDUSTRY] ?? '',
      // Future Goals
      userFutureGoals: List<String>.from(doc[USER_FUTURE_GOALS] ?? []),
      // Research Interests
      userResearchInterests:
          List<String>.from(doc[USER_RESEARCH_INTERESTS] ?? []),
      // Languages
      userNativeLanguage: doc[USER_NATIVE_LANGUAGE] ?? '',
      userSpokenLanguages: List<String>.from(doc[USER_SPOKEN_LANGUAGES] ?? []),
      // Lifestyle
      userWorkSchedule: doc[USER_WORK_SCHEDULE] ?? '',
      userShiftType: doc[USER_SHIFT_TYPE] ?? '',
      userExercise: doc[USER_EXERCISE] ?? '',
      userSmoking: doc[USER_SMOKING] ?? '',
      userDrinking: doc[USER_DRINKING] ?? '',
      userSleepSchedule: doc[USER_SLEEP_SCHEDULE] ?? '',
      // Relationship Intent
      userRelationshipIntent: doc[USER_RELATIONSHIP_INTENT] ?? '',
      // Verification
      userVerificationStatus: doc[USER_VERIFICATION_STATUS] ?? 'unverified',
      userVerificationType: doc[USER_VERIFICATION_TYPE] ?? '',
      userVerificationIdNumber: doc[USER_VERIFICATION_ID_NUMBER] ?? '',
      userVerificationDocumentUrl: doc[USER_VERIFICATION_DOCUMENT_URL] ?? '',
      userVerificationRankingBoost: doc[USER_VERIFICATION_RANKING_BOOST] ?? 0,
      // Trust & Safety
      userSuspensionEndDate: doc[USER_SUSPENSION_END_DATE]?.toDate(),
      userIsSuspended: doc[USER_IS_SUSPENDED] ?? false,
      userIsBanned: doc[USER_IS_BANNED] ?? false,
      userProfileQualityScore: doc[USER_PROFILE_QUALITY_SCORE] ?? 0,
      userBanReason: doc[USER_BAN_REASON] ?? '',
    );
  }
}
