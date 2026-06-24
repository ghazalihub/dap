import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
  collection,
  deleteField,
  Query,
  where,
  FieldValue,
  query,
  DocumentSnapshot,
  DocumentData,
  addDoc
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from '@angular/fire/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { getToken, Messaging } from '@angular/fire/messaging';
import { User } from '../../models/user.model';
import { AuthService } from './auth.service';
import {
  C_USERS,
  USER_ID,
  USER_PROFILE_PHOTO,
  USER_FULLNAME,
  USER_GENDER,
  USER_BIRTH_DAY,
  USER_BIRTH_MONTH,
  USER_BIRTH_YEAR,
  USER_SCHOOL,
  USER_JOB_TITLE,
  USER_BIO,
  USER_PHONE_NUMBER,
  USER_EMAIL,
  USER_STATUS,
  USER_LEVEL,
  USER_GEO_POINT,
  USER_COUNTRY,
  USER_LOCALITY,
  USER_LAST_LOGIN,
  USER_REG_DATE,
  USER_DEVICE_TOKEN,
  USER_SETTINGS,
  USER_MIN_AGE,
  USER_MAX_AGE,
  USER_MAX_DISTANCE,
  C_FLAGGED_USERS,
  FLAGGED_USER_ID,
  FLAG_REASON,
  FLAGGED_BY_USER_ID,
  TIMESTAMP,
  USER_GALLERY,
  USER_SHOW_ME
} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user = new BehaviorSubject<User | null>(null);
  user$ = this._user.asObservable();

  userIsVip = false;
  isLoading = false;
  activeVipId = '';
  showRestoreVipMsg = false;

  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private authService: AuthService,
    private messaging: Messaging
  ) { }

  get currentUser(): User | null {
    return this._user.value;
  }

  /**
   * Update the state for restore VIP message
   */
  updateRestoreVipMsg(value: boolean): void {
    this.showRestoreVipMsg = value;
    console.log('updateRestoreVipMsg() ->', value);
  }

  /**
   * Get user from database
   */
  async getUser(userId: string): Promise<DocumentSnapshot<DocumentData>> {
    const userDocRef = doc(this.firestore, C_USERS, userId);
    return await getDoc(userDocRef);
  }

  /**
   * Get user object
   */
  async getUserObject(userId: string): Promise<User> {
    const userDoc = await this.getUser(userId);
    const data = userDoc.data();
    if (!data) throw new Error('User data not found');
    return this.mapDocumentToUser(data);
  }

  /**
   * Update user object in state
   */
  updateUserObject(userDoc: DocumentData): void {
    const user = this.mapDocumentToUser(userDoc);
    this._user.next(user);
    console.log('User object -> updated!');
  }

  /**
   * Update user data in Firestore
   */
  async updateUserData(userId: string, data: Partial<DocumentData>): Promise<void> {
    const userDocRef = doc(this.firestore, C_USERS, userId);
    await updateDoc(userDocRef, data);
  }

  /**
   * Set user VIP true
   */
  setUserVip(): void {
    this.userIsVip = true;
  }

  /**
   * Set Active VIP Subscription ID
   */
  setActiveVipId(subscriptionId: string): void {
    this.activeVipId = subscriptionId;
  }

  /**
   * Calculate user current age
   */
  calculateUserAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Create User Account (SignUp)
   */
  async signUp(params: {
    userPhotoFile: File,
    userFullName: string,
    userGender: string,
    userBirthDay: number,
    userBirthMonth: number,
    userBirthYear: number,
    userSchool: string,
    userJobTitle: string,
    userBio: string,
    onSuccess: () => void,
    onFail: (error: any) => void,
    freeAccountMaxDistance: number
  }): Promise<void> {
    this.isLoading = true;
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.isLoading = false;
      return;
    }

    try {
      const geoPoint = { latitude: 0.0, longitude: 0.0 };

      let userDeviceToken = '';
      try {
        if (this.messaging) {
          userDeviceToken = await getToken(this.messaging);
        }
      } catch (e) {
        console.warn("Could not get FCM token during signup:", e);
      }

      const imageProfileUrl = await this.uploadFile(
        params.userPhotoFile,
        'uploads/users/profiles',
        userId
      );

      const userDocRef = doc(this.firestore, C_USERS, userId);
      await setDoc(userDocRef, {
        [USER_ID]: userId,
        [USER_PROFILE_PHOTO]: imageProfileUrl,
        [USER_FULLNAME]: params.userFullName,
        [USER_GENDER]: params.userGender,
        [USER_BIRTH_DAY]: params.userBirthDay,
        [USER_BIRTH_MONTH]: params.userBirthMonth,
        [USER_BIRTH_YEAR]: params.userBirthYear,
        [USER_SCHOOL]: params.userSchool,
        [USER_JOB_TITLE]: params.userJobTitle,
        [USER_BIO]: params.userBio,
        [USER_PHONE_NUMBER]: this.authService.firebaseUser?.phoneNumber || '',
        [USER_EMAIL]: this.authService.firebaseUser?.email || '',
        [USER_STATUS]: 'active',
        [USER_LEVEL]: 'user',
        [USER_GEO_POINT]: { geopoint: geoPoint },
        [USER_COUNTRY]: '',
        [USER_LOCALITY]: '',
        [USER_LAST_LOGIN]: serverTimestamp(),
        [USER_REG_DATE]: serverTimestamp(),
        [USER_DEVICE_TOKEN]: userDeviceToken,
        [USER_SETTINGS]: {
          [USER_MIN_AGE]: 18,
          [USER_MAX_AGE]: 100,
          [USER_MAX_DISTANCE]: params.freeAccountMaxDistance,
        },
      });

      const userDoc = await this.getUser(userId);
      this.updateUserObject(userDoc.data()!);

      this.isLoading = false;
      params.onSuccess();
      console.log('signUp() -> success');
    } catch (error) {
      this.isLoading = false;
      console.error('signUp() -> error:', error);
      params.onFail(error);
    }
  }

  /**
   * Update current user profile
   */
  async updateProfile(params: {
    userSchool: string,
    userJobTitle: string,
    userBio: string,
    onSuccess: () => void,
    onFail: (error: any) => void,
  }): Promise<void> {
    const user = this.currentUser;
    if (!user) return;

    try {
      await this.updateUserData(user.userId, {
        [USER_SCHOOL]: params.userSchool,
        [USER_JOB_TITLE]: params.userJobTitle,
        [USER_BIO]: params.userBio,
      });
      this.isLoading = false;
      params.onSuccess();
      console.log('updateProfile() -> success');
    } catch (error) {
      this.isLoading = false;
      console.error('updateProfile() -> error:', error);
      params.onFail(error);
    }
  }

  /**
   * Flag User profile
   */
  async flagUserProfile(flaggedUserId: string, reason: string): Promise<void> {
    const user = this.currentUser;
    if (!user) return;

    const flaggedCol = collection(this.firestore, C_FLAGGED_USERS);
    await addDoc(flaggedCol, {
      [FLAGGED_USER_ID]: flaggedUserId,
      [FLAG_REASON]: reason,
      [FLAGGED_BY_USER_ID]: user.userId,
      [TIMESTAMP]: serverTimestamp(),
    });

    await this.updateUserData(flaggedUserId, { [USER_STATUS]: 'flagged' });
  }

  /**
   * Update User location info
   */
  async updateUserLocation(params: {
    isPassport: boolean,
    locationResult?: any, // From location picker
    onSuccess: () => void,
    onFail: () => void,
  }): Promise<void> {
    const user = this.currentUser;
    if (!user) return;

    let country = '';
    let locality = '';
    let latitude = 0.0;
    let longitude = 0.0;

    if (!params.isPassport) {
      // In web, use Geolocation API
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        // Reverse geocoding using Google Maps API (behavioral clone of placemarkFromCoordinates)
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({ location: { lat: latitude, lng: longitude } });

        if (response.results[0]) {
          const addressComponents = response.results[0].address_components;
          const countryComp = addressComponents.find(c => c.types.includes('country'));
          const localityComp = addressComponents.find(c => c.types.includes('locality')) ||
                               addressComponents.find(c => c.types.includes('administrative_area_level_2'));

          country = countryComp?.long_name || '';
          locality = localityComp?.long_name || '';
        }
      } catch (e) {
        console.error('Error getting location:', e);
        params.onFail();
        return;
      }
    } else {
      if (params.locationResult) {
        country = params.locationResult.country?.name || '';
        locality = params.locationResult.city?.name || params.locationResult.locality || '';
        latitude = params.locationResult.latLng.latitude;
        longitude = params.locationResult.latLng.longitude;
      }
    }

    if (country !== '') {
      await this.updateUserData(user.userId, {
        [USER_GEO_POINT]: { geopoint: { latitude, longitude } },
        [USER_COUNTRY]: country,
        [USER_LOCALITY]: locality,
      });
      params.onSuccess();
      console.log('updateUserLocation() -> success');
    } else {
      params.onFail();
    }
  }

  /**
   * Upload file to storage
   */
  async uploadFile(file: File, path: string, userId: string): Promise<string> {
    const imageName = userId + Date.now().toString();
    const fileRef = ref(this.storage, `${path}/${userId}/${imageName}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  }

  /**
   * Add / Update profile image and gallery
   */
  async updateProfileImage(params: {
    imageFile: File,
    oldImageUrl?: string,
    path: 'profile' | 'gallery',
    index?: number
  }): Promise<void> {
    const user = this.currentUser;
    if (!user) return;

    let uploadPath = params.path === 'profile' ? 'uploads/users/profiles' : 'uploads/users/gallery';

    if (params.oldImageUrl) {
      const oldRef = ref(this.storage, params.oldImageUrl);
      await deleteObject(oldRef).catch(e => console.error('Error deleting old image:', e));
    }

    const imageLink = await this.uploadFile(params.imageFile, uploadPath, user.userId);

    if (params.path === 'profile') {
      await this.updateUserData(user.userId, { [USER_PROFILE_PHOTO]: imageLink });
    } else {
      await this.updateUserData(user.userId, { [`${USER_GALLERY}.image_${params.index}`]: imageLink });
    }
  }

  /**
   * Delete image from user gallery
   */
  async deleteGalleryImage(imageUrl: string, index: number): Promise<void> {
    const user = this.currentUser;
    if (!user) return;

    const imgRef = ref(this.storage, imageUrl);
    await deleteObject(imgRef);

    await this.updateUserData(user.userId, { [`${USER_GALLERY}.image_${index}`]: deleteField() });
  }

  /**
   * Get user profile images list
   */
  getUserProfileImages(user: User): string[] {
    const images = [user.userProfilePhoto];
    if (user.userGallery) {
      Object.values(user.userGallery).forEach(imgUrl => {
        if (typeof imgUrl === 'string') images.push(imgUrl);
      });
    }
    return images;
  }

  /**
   * Filter the User Gender for discovery
   */
  filterUserGender(q: Query<DocumentData>): Query<DocumentData> {
    const user = this.currentUser;
    if (!user) return q;

    const oppositeGender = user.userGender === "Male" ? "Female" : "Male";
    const settings = user.userSettings;

    if (settings) {
      const showMe = settings[USER_SHOW_ME];
      if (showMe === 'men') {
        return query(q, where(USER_GENDER, '==', 'Male'));
      } else if (showMe === 'women') {
        return query(q, where(USER_GENDER, '==', 'Female'));
      } else if (showMe === 'everyone') {
        return q;
      }
    }
    return query(q, where(USER_GENDER, '==', oppositeGender));
  }

  private mapDocumentToUser(docData: DocumentData): User {
    return {
      userId: docData[USER_ID],
      userProfilePhoto: docData[USER_PROFILE_PHOTO],
      userFullname: docData[USER_FULLNAME],
      userGender: docData[USER_GENDER],
      userBirthDay: docData[USER_BIRTH_DAY],
      userBirthMonth: docData[USER_BIRTH_MONTH],
      userBirthYear: docData[USER_BIRTH_YEAR],
      userSchool: docData[USER_SCHOOL] || '',
      userJobTitle: docData[USER_JOB_TITLE] || '',
      userBio: docData[USER_BIO] || '',
      userPhoneNumber: docData[USER_PHONE_NUMBER] || '',
      userEmail: docData[USER_EMAIL] || '',
      userGallery: docData[USER_GALLERY],
      userCountry: docData[USER_COUNTRY] || '',
      userLocality: docData[USER_LOCALITY] || '',
      userGeoPoint: docData[USER_GEO_POINT]?.geopoint || { latitude: 0.0, longitude: 0.0 },
      userSettings: docData[USER_SETTINGS],
      userStatus: docData[USER_STATUS],
      userIsVerified: docData['user_is_verified'] || false,
      userLevel: docData[USER_LEVEL],
      userRegDate: docData[USER_REG_DATE],
      userLastLogin: docData[USER_LAST_LOGIN],
      userDeviceToken: docData[USER_DEVICE_TOKEN],
      userTotalLikes: docData['user_total_likes'] || 0,
      userTotalVisits: docData['user_total_visits'] || 0,
      userTotalDisliked: docData['user_total_disliked'] || 0,
    };
  }
}
