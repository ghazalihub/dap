/**
 * APP SETTINGS INFO CONSTANTS
 */
export const APP_NAME = "Dating App";
export const APP_PRIMARY_COLOR = "#E91E63"; // pink
export const APP_ACCENT_COLOR = "#FF4081"; // pinkAccent
export const APP_VERSION_NAME = "Android v1.0.0 & iOS v1.0.0";
export const ANDROID_APP_VERSION_NUMBER = 1;
export const IOS_APP_VERSION_NUMBER = 1;

/**
 * API KEYS
 */
export const ANDROID_MAPS_API_KEY = "YOUR ANDROID API KEY";
export const IOS_MAPS_API_KEY = "YOUR IOS API KEY";
export const ANDROID_INTERSTITIAL_ID = "YOUR ANDROID AD ID";
export const IOS_INTERSTITIAL_ID = "YOUR iOS AD ID";

/**
 * FIREBASE MESSAGING TOPIC
 */
export const NOTIFY_USERS = "NOTIFY_USERS";

/**
 * DATABASE COLLECTION NAMES
 */
export const C_APP_INFO = "AppInfo";
export const C_USERS = "Users";
export const C_FLAGGED_USERS = "FlaggedUsers";
export const C_CONNECTIONS = "Connections";
export const C_MATCHES = "Matches";
export const C_CONVERSATIONS = "Conversations";
export const C_LIKES = "Likes";
export const C_VISITS = "Visits";
export const C_DISLIKES = "Dislikes";
export const C_MESSAGES = "Messages";
export const C_NOTIFICATIONS = "Notifications";
export const C_BLOCKED_USERS = 'BlockedUsers';

/**
 * DATABASE FIELDS FOR AppInfo COLLECTION
 */
export const ANDROID_APP_CURRENT_VERSION = "android_app_current_version";
export const IOS_APP_CURRENT_VERSION = "ios_app_current_version";
export const ANDROID_PACKAGE_NAME = "android_package_name";
export const IOS_APP_ID = "ios_app_id";
export const APP_EMAIL = "app_email";
export const PRIVACY_POLICY_URL = "privacy_policy_url";
export const TERMS_OF_SERVICE_URL = "terms_of_service_url";
export const FIREBASE_SERVER_KEY = "firebase_server_key";
export const STORE_SUBSCRIPTION_IDS = "store_subscription_ids";
export const FREE_ACCOUNT_MAX_DISTANCE = "free_account_max_distance";
export const VIP_ACCOUNT_MAX_DISTANCE = "vip_account_max_distance";
export const ADMOB_APP_ID = "admob_app_id";
export const ADMOB_INTERSTITIAL_AD_ID = "admob_interstitial_ad_id";

/**
 * DATABASE FIELDS FOR USER COLLECTION
 */
export const USER_ID = "user_id";
export const USER_PROFILE_PHOTO = "user_photo_link";
export const USER_FULLNAME = "user_fullname";
export const USER_GENDER = "user_gender";
export const USER_BIRTH_DAY = "user_birth_day";
export const USER_BIRTH_MONTH = "user_birth_month";
export const USER_BIRTH_YEAR = "user_birth_year";
export const USER_SCHOOL = "user_school";
export const USER_JOB_TITLE = "user_job_title";
export const USER_BIO = "user_bio";
export const USER_PHONE_NUMBER = "user_phone_number";
export const USER_EMAIL = "user_email";
export const USER_GALLERY = "user_gallery";
export const USER_COUNTRY = "user_country";
export const USER_LOCALITY = "user_locality";
export const USER_GEO_POINT = "user_geo_point";
export const USER_SETTINGS = "user_settings";
export const USER_STATUS = "user_status";
export const USER_IS_VERIFIED = "user_is_verified";
export const USER_LEVEL = "user_level";
export const USER_REG_DATE = "user_reg_date";
export const USER_LAST_LOGIN = "user_last_login";
export const USER_DEVICE_TOKEN = "user_device_token";
export const USER_TOTAL_LIKES = "user_total_likes";
export const USER_TOTAL_VISITS = "user_total_visits";
export const USER_TOTAL_DISLIKED = "user_total_disliked";

// User Setting map - fields
export const USER_MIN_AGE = "user_min_age";
export const USER_MAX_AGE = "user_max_age";
export const USER_MAX_DISTANCE = "user_max_distance";
export const USER_SHOW_ME = "user_show_me";

/**
 * DATABASE FIELDS FOR FlaggedUsers COLLECTION
 */
export const FLAGGED_USER_ID = "flagged_user_id";
export const FLAG_REASON = "flag_reason";
export const FLAGGED_BY_USER_ID = "flagged_by_user_id";

/**
 * DATABASE FIELDS FOR Messages and Conversations COLLECTION
 */
export const MESSAGE_TEXT = "message_text";
export const MESSAGE_TYPE = "message_type";
export const MESSAGE_IMG_LINK = "message_img_link";
export const MESSAGE_READ = "message_read";
export const LAST_MESSAGE = "last_message";

/**
 * DATABASE FIELDS FOR Notifications COLLECTION
 */
export const N_SENDER_ID = "n_sender_id";
export const N_SENDER_FULLNAME = "n_sender_fullname";
export const N_SENDER_PHOTO_LINK = "n_sender_photo_link";
export const N_RECEIVER_ID = "n_receiver_id";
export const N_TYPE = "n_type";
export const N_MESSAGE = "n_message";
export const N_READ = "n_read";

/**
 * DATABASE FIELDS FOR Likes COLLECTION
 */
export const LIKED_USER_ID = 'liked_user_id';
export const LIKED_BY_USER_ID = 'liked_by_user_id';
export const LIKE_TYPE = 'like_type';

/**
 * DATABASE FIELDS FOR Dislikes COLLECTION
 */
export const DISLIKED_USER_ID = 'disliked_user_id';
export const DISLIKED_BY_USER_ID = 'disliked_by_user_id';

/**
 * DATABASE FIELDS FOR Visits COLLECTION
 */
export const VISITED_USER_ID = 'visited_user_id';
export const VISITED_BY_USER_ID = 'visited_by_user_id';

/**
 * DATABASE FIELDS FOR BlockedUsers COLLECTION
 */
export const BLOCKED_USER_ID = 'blocked_user_id';
export const BLOCKED_BY_USER_ID = 'blocked_by_user_id';

/**
 * DATABASE SHARED FIELDS
 */
export const TIMESTAMP = "timestamp";
