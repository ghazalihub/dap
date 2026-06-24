import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  updateDoc,
  getDoc,
  DocumentSnapshot,
  DocumentData
} from '@angular/fire/firestore';
import {
  C_APP_INFO,
  ANDROID_APP_CURRENT_VERSION,
  IOS_APP_CURRENT_VERSION
} from '../constants/constants';
import { UserService } from './user.service';
import { AppService } from './app.service'; // shared or core
import * as geofire from 'geofire-common';

@Injectable({
  providedIn: 'root'
})
export class AppHelper {

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private appService: AppService
  ) { }

  /**
   * Restore VIP Account Subscription (Logic placeholder for InAppPurchase)
   */
  async restoreVipAccount(showMsg: boolean = false): Promise<void> {
    try {
      // In-app purchase logic would be here
      if (showMsg) {
        this.userService.updateRestoreVipMsg(true);
      }
    } catch (e) {
      console.error('restoreVipAccount() -> error:', e);
    }
  }

  /**
   * Check and request location permission
   */
  async checkLocationPermission(callbacks: {
    onGpsDisabled: () => void,
    onDenied: () => void,
    onGranted: () => void,
  }): Promise<void> {
    if (!navigator.geolocation) {
      callbacks.onGpsDisabled();
      return;
    }

    // In web, permissions are requested during getCurrentPosition
    navigator.geolocation.getCurrentPosition(
      () => callbacks.onGranted(),
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          callbacks.onDenied();
        } else {
          callbacks.onGpsDisabled();
        }
      }
    );
  }

  /**
   * Get User current location
   */
  getUserCurrentLocation(callbacks: {
    onSuccess: (position: GeolocationPosition) => void,
    onFail: (error: any) => void,
    onTimeoutException: (error: any) => void,
  }): void {
    navigator.geolocation.getCurrentPosition(
      (pos) => callbacks.onSuccess(pos),
      (err) => callbacks.onFail(err),
      { timeout: 10000 }
    );
  }

  /**
   * Update User location data in database
   */
  async updateUserLocation(params: {
    userId: string,
    latitude: number,
    longitude: number,
    country: string,
    locality: string,
  }): Promise<void> {
    const hash = geofire.geohashForLocation([params.latitude, params.longitude]);

    await this.userService.updateUserData(params.userId, {
      user_geo_point: {
        geopoint: { latitude: params.latitude, longitude: params.longitude },
        geohash: hash
      },
      user_country: params.country,
      user_locality: params.locality,
    });
  }

  /**
   * Get distance between current user and another user
   */
  getDistanceBetweenUsers(userLat: number, userLong: number): number {
    const currentUser = this.userService.currentUser;
    if (!currentUser) return 0;

    const distanceInKm = geofire.distanceBetween(
      [currentUser.userGeoPoint.latitude, currentUser.userGeoPoint.longitude],
      [userLat, userLong]
    );

    return Math.round(distanceInKm);
  }

  /**
   * Get app current version from database
   */
  async getAppStoreVersion(): Promise<number> {
    const settingsDocRef = doc(this.firestore, C_APP_INFO, 'settings');
    const snapshot = await getDoc(settingsDocRef);
    const data = snapshot.data();

    if (data) {
      this.appService.updateAppObject(data);
      // Assuming web doesn't care about Android/iOS versions specifically
      // but we return based on detection or constant if needed.
      return data[ANDROID_APP_CURRENT_VERSION] || 1;
    }
    return 1;
  }

  /**
   * Share app method
   */
  async shareApp(): Promise<void> {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this app!',
        url: window.location.href
      });
    }
  }

  /**
   * Open Privacy Policy Page
   */
  async openPrivacyPage(): Promise<void> {
    const url = this.appService.currentUserAppInfo?.privacyPolicyUrl;
    if (url) window.open(url, '_blank');
  }

  /**
   * Open Terms of Services
   */
  async openTermsPage(): Promise<void> {
    const url = this.appService.currentUserAppInfo?.termsOfServicesUrl;
    if (url) window.open(url, '_blank');
  }
}
