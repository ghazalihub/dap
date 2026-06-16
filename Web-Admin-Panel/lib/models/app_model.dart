import 'package:cloud_functions/cloud_functions.dart';
import 'package:intl/intl.dart';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dating_app_dashboard/constants/constants.dart';
import 'package:dating_app_dashboard/datas/app_info.dart';
import 'package:flutter/material.dart';
import 'package:scoped_model/scoped_model.dart';

class AppModel extends Model {
  // Variables
  final _firestore = FirebaseFirestore.instance;
  final _functions = FirebaseFunctions.instance;

  AppInfo? appInfo;
  List<DocumentSnapshot<Map<String, dynamic>>> users = [];
  int sortColumnIndex = 0;
  bool sortAscending = true;

  /// Create Singleton factory for [AppModel]
  ///
  static final AppModel _appModel = AppModel._internal();
  factory AppModel() {
    return _appModel;
  }
  AppModel._internal();
  // End

  /// Admin sign in method
  void adminSignIn({
    required String username,
    required String password,
    // VoidCallback functions
    required VoidCallback onSuccess,
    required VoidCallback onError,
  }) async {
    // Get app info
    final DocumentSnapshot<Map<String, dynamic>> appInfo =
        await getAppInfoDoc();
    // Get admin sign in credentials
    final String adminUsername = appInfo.data()![ADMIN_USERNAME];
    final String adminPassword = appInfo.data()![ADMIN_PASSWORD];

    // Check info
    if (adminUsername == username && adminPassword == password) {
      // Enable access
      onSuccess();
    } else {
      // Access denied
      onError();
    }
  }

  /// Get App Settings from database => Stream
  Stream<DocumentSnapshot<Map<String, dynamic>>> getAppInfoStream() {
    return _firestore.collection(C_APP_INFO).doc('settings').snapshots();
  }

  /// Get App Settings from database => DocumentSnapshot<Map<String, dynamic>>
  Future<DocumentSnapshot<Map<String, dynamic>>> getAppInfoDoc() async {
    final infoDoc =
        await _firestore.collection(C_APP_INFO).doc('settings').get();
    updateAppObject(infoDoc.data()!);
    return infoDoc;
  }

  /// Update AppInfo in database
  Future<void> updateAppData({required Map<String, dynamic> data}) {
    _firestore.collection(C_APP_INFO).doc('settings').update(data);
    return Future.value();
  }

  /// Update user data in database
  Future<void> updateUserData(
      {required String userId, required Map<String, dynamic> data}) async {
    // Update user data
    _firestore.collection(C_USERS).doc(userId).update(data);
  }

  /// Update Admin sign in info
  void updateAdminSignInInfo({
    required String adminUsername,
    required String adminPassword,
    // VoidCallback functions
    required VoidCallback onSuccess,
    required VoidCallback onError,
  }) {
    updateAppData(data: {
      ADMIN_USERNAME: adminUsername,
      ADMIN_PASSWORD: adminPassword,
    }).then((_) {
      onSuccess();
      debugPrint('updateAdminSignInInfo() -> success');
    }).catchError((error) {
      onError();
      debugPrint('updateAdminSignInInfo() -> error: $error');
    });
  }

  /// Update AppInfo object
  void updateAppObject(Map<String, dynamic> appDoc) {
    appInfo = AppInfo.fromDocument(appDoc);
    notifyListeners();
  }

  /// Get Users from database => stream
  Stream<QuerySnapshot<Map<String, dynamic>>> getUsers() {
    return _firestore
        .collection(C_USERS)
        .orderBy(USER_REG_DATE, descending: true)
        .snapshots();
  }

  /// Get Flagged Users Alert from database => stream
  Stream<QuerySnapshot<Map<String, dynamic>>> getFlaggedUsersAlert() {
    return _firestore
        .collection(C_FLAGGED_USERS)
        .orderBy(TIMESTAMP, descending: true)
        .snapshots();
  }

  /// Update User list
  void updateUsers(List<DocumentSnapshot<Map<String, dynamic>>> docs) {
    users = docs;
    notifyListeners();
    debugPrint('Users -> updated!');
  }

  // Update variables used on table
  void updateOnSort(int columnIndex, bool sortAsc) {
    sortColumnIndex = columnIndex;
    sortAscending = sortAsc;
    notifyListeners();
    debugPrint('sortColumnIndex: $columnIndex');
    debugPrint('sortAscending: $sortAsc');
  }

  /// Save/Update app settings in database
  /// it is called in AppSettings screen
  void saveAppSettings({
    required int androidAppCurrentVersion,
    required int iosAppCurrentVersion,
    required String androidPackageName,
    required String iOsAppId,
    required String appEmail,
    required String privacyPolicyUrl,
    required String termsOfServicesUrl,
    required double? freeAccountMaxDistance,
    required double? vipAccountMaxDistance,
    // VoidCallback functions
    required VoidCallback onSuccess,
    required VoidCallback onError,
  }) {
    updateAppData(data: {
      ANDROID_APP_CURRENT_VERSION: androidAppCurrentVersion,
      IOS_APP_CURRENT_VERSION: iosAppCurrentVersion,
      ANDROID_PACKAGE_NAME: androidPackageName,
      IOS_APP_ID: iOsAppId,
      PRIVACY_POLICY_URL: privacyPolicyUrl,
      TERMS_OF_SERVICE_URL: termsOfServicesUrl,
      APP_EMAIL: appEmail,
      FREE_ACCOUNT_MAX_DISTANCE: freeAccountMaxDistance ?? 100,
      VIP_ACCOUNT_MAX_DISTANCE: vipAccountMaxDistance ?? 200,
    }).then((_) {
      onSuccess();
      debugPrint('updateAppSettings() -> success');
    }).catchError((error) {
      onError();
      debugPrint('updateAppSettings() -> error:$error ');
    });
  }

  /// Format firestore server Timestamp
  String formatDate(DateTime timestamp) {
    // Format
    final DateFormat dateFormat = DateFormat('yyyy-MM-dd h:m a');
    return dateFormat.format(timestamp);
  }

  /// Calculate user current age
  int calculateUserAge(int userBirthYear) {
    DateTime date = DateTime.now();
    int currentYear = date.year;
    return (currentYear - userBirthYear);
  }

  /// Send push notification method
  Future<void> sendPushNotification({
    required String nBody,
    // VoidCallback functions
    required VoidCallback onSuccess,
    required VoidCallback onError,
  }) async {
    try {
      await _functions.httpsCallable('sendPushNotification').call({
        'type': 'alert',
        'title': APP_NAME,
        'body': nBody,
        'deviceToken': 'admin',
        'senderId': 'admin',
      });
      onSuccess();
      debugPrint('sendPushNotification() -> success');
    } catch (e) {
      onError();
      debugPrint('sendPushNotification() -> error: $e');
    }
  }
}
