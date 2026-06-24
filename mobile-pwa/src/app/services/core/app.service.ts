import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  getDoc,
  onSnapshot,
  DocumentData
} from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppInfo } from '../../models/app-info.model';
import {
  C_APP_INFO,
  ANDROID_APP_CURRENT_VERSION,
  IOS_APP_CURRENT_VERSION,
  ANDROID_PACKAGE_NAME,
  IOS_APP_ID,
  APP_EMAIL,
  PRIVACY_POLICY_URL,
  TERMS_OF_SERVICE_URL,
  FREE_ACCOUNT_MAX_DISTANCE,
  VIP_ACCOUNT_MAX_DISTANCE
} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _appInfo = new BehaviorSubject<AppInfo | null>(null);
  appInfo$ = this._appInfo.asObservable();

  constructor(private firestore: Firestore) { }

  get currentUserAppInfo(): AppInfo | null {
    return this._appInfo.value;
  }

  /**
   * Get App Settings from database => Stream
   */
  getAppInfoStream(): Observable<AppInfo | null> {
    const settingsDocRef = doc(this.firestore, C_APP_INFO, 'settings');
    return new Observable<AppInfo | null>(subscriber => {
      const unsubscribe = onSnapshot(settingsDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const info = this.mapDocumentToAppInfo(snapshot.data());
          this._appInfo.next(info);
          subscriber.next(info);
        } else {
          subscriber.next(null);
        }
      }, (error) => {
        subscriber.error(error);
      });
      return { unsubscribe };
    });
  }

  /**
   * Update AppInfo object in state
   */
  updateAppObject(appData: DocumentData): void {
    const appInfo = this.mapDocumentToAppInfo(appData);
    this._appInfo.next(appInfo);
  }

  private mapDocumentToAppInfo(docData: DocumentData): AppInfo {
    return {
      androidAppCurrentVersion: docData[ANDROID_APP_CURRENT_VERSION] || 1,
      iosAppCurrentVersion: docData[IOS_APP_CURRENT_VERSION] || 1,
      androidPackageName: docData[ANDROID_PACKAGE_NAME] || '',
      iOsAppId: docData[IOS_APP_ID] || '',
      appEmail: docData[APP_EMAIL] || '',
      privacyPolicyUrl: docData[PRIVACY_POLICY_URL] || '',
      termsOfServicesUrl: docData[TERMS_OF_SERVICE_URL] || '',
      subscriptionIds: docData['store_subscription_ids'] || [],
      freeAccountMaxDistance: docData[FREE_ACCOUNT_MAX_DISTANCE] || 100,
      vipAccountMaxDistance: docData[VIP_ACCOUNT_MAX_DISTANCE] || 200,
      agoraAppID: docData['agora_app_id'] || '',
    };
  }
}
