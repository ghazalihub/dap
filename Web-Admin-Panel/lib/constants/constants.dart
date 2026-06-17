// ignore_for_file: constant_identifier_names

import 'package:flutter/material.dart';

/// APP INFO CONSTANTS ///
///
const String APP_NAME = "Flutter Dating App Admin Panel";
const Color APP_PRIMARY_COLOR = Colors.pink;
const Color APP_ACCENT_COLOR = Colors.pinkAccent;

/// FIREBASE MESSAGING TOPIC
const NOTIFY_USERS = "NOTIFY_USERS";

/// DATABASE FIELDS FOR AppInfo COLLECTION  ///
///
const String ANDROID_APP_CURRENT_VERSION = "android_app_current_version";
const String IOS_APP_CURRENT_VERSION = "ios_app_current_version";
const String ANDROID_PACKAGE_NAME = "android_package_name";
const String IOS_APP_ID = "ios_app_id";
const String APP_EMAIL = "app_email";
const String PRIVACY_POLICY_URL = "privacy_policy_url";
const String TERMS_OF_SERVICE_URL = "terms_of_service_url";
const String FIREBASE_SERVER_KEY = "firebase_server_key";
const String STORE_SUBSCRIPTION_IDS = "store_subscription_ids";
const String FREE_ACCOUNT_MAX_DISTANCE = "free_account_max_distance";
const String VIP_ACCOUNT_MAX_DISTANCE = "vip_account_max_distance";
// Admin variables
const String ADMIN_USERNAME = "admin_username";
const String ADMIN_PASSWORD = "admin_password";

/// DATABASE COLLECTION NAMES USED IN APP
///
const String C_APP_INFO = "AppInfo";
const String C_USERS = "Users";
const String C_FLAGGED_USERS = "FlaggedUsers";

/// DATABASE FIELDS FOR USER COLLECTION  ///
///
const String USER_ID = "user_id";
const String USER_PROFILE_PHOTO = "user_photo_link";
const String USER_FULLNAME = "user_fullname";
const String USER_GENDER = "user_gender";
const String USER_BIRTH_DAY = "user_birth_day";
const String USER_BIRTH_MONTH = "user_birth_month";
const String USER_BIRTH_YEAR = "user_birth_year";
const String USER_SCHOOL = "user_school";
const String USER_JOB_TITLE = "user_job_title";
const String USER_BIO = "user_bio";
const String USER_PHONE_NUMBER = "user_phone_number";
const String USER_EMAIL = "user_email";
const String USER_GALLERY = "user_gallery";
const String USER_COUNTRY = "user_country";
const String USER_LOCALITY = "user_locality";
const String USER_GEO_POINT = "user_geo_point";
const String USER_SETTINGS = "user_settings";
const String USER_STATUS = "user_status";
const String USER_IS_VERIFIED = "user_is_verified";
const String USER_LEVEL = "user_level";
const String USER_REG_DATE = "user_reg_date";
const String USER_LAST_LOGIN = "user_last_login";
const String USER_DEVICE_TOKEN = "user_device_token";
const String USER_TOTAL_LIKES = "user_total_likes";
const String USER_TOTAL_VISITS = "user_total_visits";
const String USER_TOTAL_DISLIKED = "user_total_disliked";
// Academic Identity
const String USER_INSTITUTION = "user_institution";
const String USER_UNIVERSITY = "user_university";
const String USER_COLLEGE = "user_college";
const String USER_DEGREE = "user_degree";
const String USER_COURSE = "user_course";
const String USER_STUDY_YEAR = "user_study_year";
const String USER_GRADUATION_YEAR = "user_graduation_year";
const String USER_ACADEMIC_STATUS = "user_academic_status";
// Professional Identity
const String USER_OCCUPATION = "user_occupation";
const String USER_SPECIALIZATION = "user_specialization";
const String USER_DEPARTMENT = "user_department";
const String USER_INDUSTRY = "user_industry";
// Future Goals
const String USER_FUTURE_GOALS = "user_future_goals";
// Research Interests
const String USER_RESEARCH_INTERESTS = "user_research_interests";
// Languages
const String USER_NATIVE_LANGUAGE = "user_native_language";
const String USER_SPOKEN_LANGUAGES = "user_spoken_languages";
// Lifestyle
const String USER_WORK_SCHEDULE = "user_work_schedule";
const String USER_SHIFT_TYPE = "user_shift_type";
const String USER_EXERCISE = "user_exercise";
const String USER_SMOKING = "user_smoking";
const String USER_DRINKING = "user_drinking";
const String USER_SLEEP_SCHEDULE = "user_sleep_schedule";
// Relationship Intent
const String USER_RELATIONSHIP_INTENT = "user_relationship_intent";
// Verification fields
const String USER_VERIFICATION_STATUS = "user_verification_status"; // pending, verified, rejected, unverified
const String USER_VERIFICATION_TYPE = "user_verification_type"; // student, professional, institution
const String USER_VERIFICATION_ID_NUMBER = "user_verification_id_number";
const String USER_VERIFICATION_DOCUMENT_URL = "user_verification_document_url";
const String USER_VERIFICATION_RANKING_BOOST = "user_verification_ranking_boost";
// Trust & Safety fields
const String USER_SUSPENSION_END_DATE = "user_suspension_end_date";
const String USER_IS_SUSPENDED = "user_is_suspended";
const String USER_IS_BANNED = "user_is_banned";
const String USER_PROFILE_QUALITY_SCORE = "user_profile_quality_score";
const String USER_BAN_REASON = "user_ban_reason";

// Collections
const String C_REPORTS = "Reports";
const String C_COMMUNITIES = "Communities";

// User Setting map - fields
const String USER_MIN_AGE = "user_min_age";
const String USER_MAX_AGE = "user_max_age";
const String USER_MAX_DISTANCE = "user_max_distance";

/// DATABASE FIELDS FOR FlaggedUsers COLLECTION  ///
///
const String FLAGGED_USER_ID = "flagged_user_id";
const String FLAG_REASON = "flag_reason";
const String FLAGGED_BY_USER_ID = "flagged_by_user_id";
const String TIMESTAMP = "timestamp";
