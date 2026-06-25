import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithCredential,
  PhoneAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  setDoc,
  increment,
  FieldValue
} from '@angular/fire/firestore';
import { Messaging, getToken } from '@angular/fire/messaging';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import {
  C_USERS,
  USER_GEO_POINT,
  USER_STATUS,
  USER_DEVICE_TOKEN,
  NOTIFY_USERS,
  USER_MIN_AGE,
  USER_MAX_AGE,
  USER_MAX_DISTANCE,
  USER_SETTINGS,
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
  USER_LEVEL,
  USER_LAST_LOGIN,
  USER_REG_DATE,
  USER_COUNTRY,
  USER_LOCALITY
} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _firebaseUser = new BehaviorSubject<FirebaseUser | null>(null);
  firebaseUser$ = this._firebaseUser.asObservable();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private messaging: Messaging
  ) {
    onAuthStateChanged(this.auth, (user) => {
      this._firebaseUser.next(user);
    });
  }

  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  get firebaseUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  /**
   * Update user device token and subscribe to topic
   */
  async updateUserDeviceToken(): Promise<void> {
    const user = this.firebaseUser;
    if (!user) return;

    try {
      const token = await getToken(this.messaging, {
        vapidKey: 'YOUR_VAPID_KEY'
      });
      // Note: TOPIC subscription usually handled on backend for web
      // But we'll follow the logic flow

      if (token) {
        const userDocRef = doc(this.firestore, C_USERS, user.uid);
        await updateDoc(userDocRef, {
          [USER_DEVICE_TOKEN]: token
        });
        console.log("updateUserDeviceToken() -> success");
      }
    } catch (e) {
      console.error("updateUserDeviceToken() -> error:", e);
    }
  }

  /**
   * Verify phone number
   */
  async verifyPhoneNumber(params: {
    phoneNumber: string,
    recaptchaVerifier: any,
    codeSent: (verificationId: string) => void,
    onError: (errorType: string, msg: string | null) => void,
  }): Promise<void> {
    console.log('phoneNumber is:', params.phoneNumber);
    try {
      const confirmationResult = await signInWithPhoneNumber(
        this.auth,
        params.phoneNumber,
        params.recaptchaVerifier
      );
      params.codeSent(confirmationResult.verificationId);
      // Store confirmationResult globally to use in signInWithOTP if needed,
      // though PhoneAuthProvider.credential works with verificationId + code.
      (this as any)._confirmationResult = confirmationResult;
    } catch (error: any) {
      console.error('verificationFailed() -> error:', error);
      params.onError('invalid_number', error.message);
    }
  }

  /**
   * Sign In with OTP
   */
  async signInWithOTP(params: {
    verificationId: string,
    otp: string,
    checkUserAccount: () => void,
    onError: () => void,
  }): Promise<void> {
    try {
      const credential = PhoneAuthProvider.credential(params.verificationId, params.otp);
      await signInWithCredential(this.auth, credential);
      params.checkUserAccount();
    } catch (error) {
      console.error('signInWithOTP() -> error:', error);
      params.onError();
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log("signOut() -> success");
    } catch (e) {
      console.error('signOut() -> error:', e);
    }
  }

  /**
   * Authenticate User Account logic
   */
  async authUserAccount(callbacks: {
    homeScreen: () => void,
    signUpScreen: () => void,
    updateLocationScreen: () => void,
    signInScreen?: () => void,
    blockedScreen?: () => void,
  }): Promise<void> {
    const user = this.firebaseUser;
    if (user) {
      const userDocRef = doc(this.firestore, C_USERS, user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        const userGeoPoint = data[USER_GEO_POINT]?.geopoint;
        const latitude = userGeoPoint?.latitude || 0.0;
        const longitude = userGeoPoint?.longitude || 0.0;

        if (data[USER_STATUS] === 'blocked') {
          callbacks.blockedScreen?.();
        } else {
          // Note: In Angular, we'll have a UserService to hold the object
          // This will be called here

          await this.updateUserDeviceToken();

          if (latitude === 0.0 && longitude === 0.0) {
            callbacks.updateLocationScreen();
            return;
          }

          callbacks.homeScreen();
        }
        console.log("firebaseUser exists");
      } else {
        console.log("firebaseUser does not exists");
        callbacks.signUpScreen();
      }
    } else {
      console.log("firebaseUser not logged in");
      callbacks.signInScreen?.();
    }
  }
}
