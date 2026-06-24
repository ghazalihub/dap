export interface User {
  userId: string;
  userProfilePhoto: string;
  userFullname: string;
  userGender: string;
  userBirthDay: number;
  userBirthMonth: number;
  userBirthYear: number;
  userSchool: string;
  userJobTitle: string;
  userBio: string;
  userPhoneNumber: string;
  userEmail: string;
  userCountry: string;
  userLocality: string;
  userGeoPoint: {
    latitude: number;
    longitude: number;
  };
  userStatus: string;
  userIsVerified: boolean;
  userLevel: string;
  userRegDate: any; // Firestore Timestamp
  userLastLogin: any; // Firestore Timestamp
  userDeviceToken: string;
  userTotalLikes: number;
  userTotalVisits: number;
  userTotalDisliked: number;
  userGallery?: { [key: string]: any };
  userSettings?: { [key: string]: any };
}
