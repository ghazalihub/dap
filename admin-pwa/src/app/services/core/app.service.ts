import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  DocumentSnapshot,
  DocumentData,
  QuerySnapshot,
  serverTimestamp
} from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppInfo } from '../../models/app-info.model';
import {
  C_APP_INFO,
  C_USERS,
  C_FLAGGED_USERS,
  TIMESTAMP,
  USER_REG_DATE,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  ANDROID_APP_CURRENT_VERSION,
  IOS_APP_CURRENT_VERSION,
  ANDROID_PACKAGE_NAME,
  IOS_APP_ID,
  PRIVACY_POLICY_URL,
  TERMS_OF_SERVICE_URL,
  APP_EMAIL,
  FREE_ACCOUNT_MAX_DISTANCE,
  VIP_ACCOUNT_MAX_DISTANCE,
  APP_NAME
} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _appInfo = new BehaviorSubject<AppInfo | null>(null);
  appInfo$ = this._appInfo.asObservable();

  private _users = new BehaviorSubject<DocumentSnapshot<DocumentData>[]>([]);
  users$ = this._users.asObservable();

  sortColumnIndex = 0;
  sortAscending = true;

  constructor(
    private firestore: Firestore,
    private functions: Functions
  ) { }

  /**
   * Admin sign in method
   */
  async adminSignIn(params: {
    username: string,
    password: string,
    onSuccess: () => void,
    onError: () => void,
  }): Promise<void> {
    try {
      const appInfoDoc = await this.getAppInfoDoc();
      const data = appInfoDoc.data();

      if (data && data[ADMIN_USERNAME] === params.username && data[ADMIN_PASSWORD] === params.password) {
        params.onSuccess();
      } else {
        params.onError();
      }
    } catch (e) {
      console.error('adminSignIn() -> error:', e);
      params.onError();
    }
  }

  /**
   * Get App Settings from database => Stream
   */
  getAppInfoStream(): Observable<DocumentSnapshot<DocumentData>> {
    const settingsDocRef = doc(this.firestore, C_APP_INFO, 'settings');
    return new Observable<DocumentSnapshot<DocumentData>>(subscriber => {
      const unsubscribe = onSnapshot(settingsDocRef, (snapshot) => {
        subscriber.next(snapshot);
      }, (error) => {
        subscriber.error(error);
      });
      return { unsubscribe };
    });
  }

  /**
   * Get App Settings from database => DocumentSnapshot
   */
  async getAppInfoDoc(): Promise<DocumentSnapshot<DocumentData>> {
    const settingsDocRef = doc(this.firestore, C_APP_INFO, 'settings');
    const snapshot = await getDoc(settingsDocRef);
    if (snapshot.exists()) {
      this.updateAppObject(snapshot.data());
    }
    return snapshot;
  }

  /**
   * Update AppInfo in database
   */
  async updateAppData(data: Partial<DocumentData>): Promise<void> {
    const settingsDocRef = doc(this.firestore, C_APP_INFO, 'settings');
    await updateDoc(settingsDocRef, data);
  }

  /**
   * Update user data in database
   */
  async updateUserData(userId: string, data: Partial<DocumentData>): Promise<void> {
    const userDocRef = doc(this.firestore, C_USERS, userId);
    await updateDoc(userDocRef, data);
  }

  /**
   * Update Admin sign in info
   */
  updateAdminSignInInfo(params: {
    adminUsername: string,
    adminPassword: string,
    onSuccess: () => void,
    onError: () => void,
  }): void {
    this.updateAppData({
      [ADMIN_USERNAME]: params.adminUsername,
      [ADMIN_PASSWORD]: params.adminPassword,
    }).then(() => {
      params.onSuccess();
      console.log('updateAdminSignInInfo() -> success');
    }).catch(error => {
      params.onError();
      console.error('updateAdminSignInInfo() -> error:', error);
    });
  }

  /**
   * Update AppInfo object
   */
  updateAppObject(appData: DocumentData): void {
    // Map Firestore document to AppInfo interface
    const appInfo: AppInfo = {
      androidAppCurrentVersion: appData[ANDROID_APP_CURRENT_VERSION] || 1,
      iosAppCurrentVersion: appData[IOS_APP_CURRENT_VERSION] || 1,
      androidPackageName: appData[ANDROID_PACKAGE_NAME] || '',
      iOsAppId: appData[IOS_APP_ID] || '',
      appEmail: appData[APP_EMAIL] || '',
      privacyPolicyUrl: appData[PRIVACY_POLICY_URL] || '',
      termsOfServicesUrl: appData[TERMS_OF_SERVICE_URL] || '',
      subscriptionIds: appData['store_subscription_ids'] || [],
      freeAccountMaxDistance: appData[FREE_ACCOUNT_MAX_DISTANCE] || 100,
      vipAccountMaxDistance: appData[VIP_ACCOUNT_MAX_DISTANCE] || 200,
      agoraAppID: appData['agora_app_id'] || '',
    };
    this._appInfo.next(appInfo);
  }

  /**
   * Get Users from database => stream
   */
  getUsersStream(): Observable<QuerySnapshot<DocumentData>> {
    const usersCol = collection(this.firestore, C_USERS);
    const q = query(usersCol, orderBy(USER_REG_DATE, 'desc'));

    return new Observable<QuerySnapshot<DocumentData>>(subscriber => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        subscriber.next(snapshot);
      }, (error) => {
        subscriber.error(error);
      });
      return { unsubscribe };
    });
  }

  /**
   * Get Flagged Users Alert from database => stream
   */
  getFlaggedUsersAlert(): Observable<QuerySnapshot<DocumentData>> {
    const flaggedCol = collection(this.firestore, C_FLAGGED_USERS);
    const q = query(flaggedCol, orderBy(TIMESTAMP, 'desc'));

    return new Observable<QuerySnapshot<DocumentData>>(subscriber => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        subscriber.next(snapshot);
      }, (error) => {
        subscriber.error(error);
      });
      return { unsubscribe };
    });
  }

  /**
   * Update User list
   */
  updateUsers(docs: DocumentSnapshot<DocumentData>[]): void {
    this._users.next(docs);
    console.log('Users -> updated!');
  }

  /**
   * Update variables used on table
   */
  updateOnSort(columnIndex: number, sortAsc: boolean): void {
    this.sortColumnIndex = columnIndex;
    this.sortAscending = sortAsc;
    console.log('sortColumnIndex:', columnIndex);
    console.log('sortAscending:', sortAsc);
  }

  /**
   * Save/Update app settings in database
   */
  saveAppSettings(params: {
    androidAppCurrentVersion: number,
    iosAppCurrentVersion: number,
    androidPackageName: string,
    iOsAppId: string,
    appEmail: string,
    privacyPolicyUrl: string,
    termsOfServicesUrl: string,
    freeAccountMaxDistance: number | null,
    vipAccountMaxDistance: number | null,
    onSuccess: () => void,
    onError: () => void,
  }): void {
    this.updateAppData({
      [ANDROID_APP_CURRENT_VERSION]: params.androidAppCurrentVersion,
      [IOS_APP_CURRENT_VERSION]: params.iosAppCurrentVersion,
      [ANDROID_PACKAGE_NAME]: params.androidPackageName,
      [IOS_APP_ID]: params.iOsAppId,
      [PRIVACY_POLICY_URL]: params.privacyPolicyUrl,
      [TERMS_OF_SERVICE_URL]: params.termsOfServicesUrl,
      [APP_EMAIL]: params.appEmail,
      [FREE_ACCOUNT_MAX_DISTANCE]: params.freeAccountMaxDistance ?? 100,
      [VIP_ACCOUNT_MAX_DISTANCE]: params.vipAccountMaxDistance ?? 200,
    }).then(() => {
      params.onSuccess();
      console.log('updateAppSettings() -> success');
    }).catch(error => {
      params.onError();
      console.error('updateAppSettings() -> error:', error);
    });
  }

  /**
   * Format firestore server Timestamp
   */
  formatDate(date: Date): string {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * Calculate user current age
   */
  calculateUserAge(userBirthYear: number): number {
    const currentYear = new Date().getFullYear();
    return currentYear - userBirthYear;
  }

  /**
   * Send push notification method
   */
  async sendPushNotification(params: {
    nBody: string,
    onSuccess: () => void,
    onError: () => void,
  }): Promise<void> {
    try {
      const sendPushFn = httpsCallable(this.functions, 'sendPushNotification');
      await sendPushFn({
        'type': 'alert',
        'title': APP_NAME,
        'body': params.nBody,
        'deviceToken': 'admin',
        'senderId': 'admin',
      });
      params.onSuccess();
      console.log('sendPushNotification() -> success');
    } catch (e) {
      params.onError();
      console.error('sendPushNotification() -> error:', e);
    }
  }
}
