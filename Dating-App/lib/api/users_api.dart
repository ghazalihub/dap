import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dating_app/api/blocked_users_api.dart';
import 'package:dating_app/constants/constants.dart';
import 'package:dating_app/datas/user.dart';
import 'package:dating_app/helpers/compatibility_helper.dart';
import 'package:dating_app/models/user_model.dart';
import 'package:dating_app/plugins/geoflutterfire/geoflutterfire.dart';
import 'package:flutter/material.dart';

class UsersApi {
  /// Get firestore instance
  ///
  final _firestore = FirebaseFirestore.instance;

  /// Get all users
  Future<List<DocumentSnapshot<Map<String, dynamic>>>> getUsers({
    required List<DocumentSnapshot<Map<String, dynamic>>> dislikedUsers,
    DiscoveryMode discoveryMode = DiscoveryMode.general,
  }) async {
    /// Build Users query
    Query<Map<String, dynamic>> usersQuery = _firestore
        .collection(C_USERS)
        .where(USER_STATUS, isEqualTo: 'active')
        .where(USER_LEVEL, isEqualTo: 'user');

    // Filter the User Gender
    usersQuery = UserModel().filterUserGender(usersQuery);

    // ONLY SHOW VERIFIED USERS
    usersQuery = usersQuery.where(USER_VERIFICATION_STATUS, isEqualTo: 'verified');

    // Instance of Geoflutterfire
    final Geoflutterfire geo = Geoflutterfire();

    /// Get user settings
    final Map<String, dynamic>? settings = UserModel().user.userSettings;

    // // Get user geo center
    final GeoFirePoint center = geo.point(
        latitude: UserModel().user.userGeoPoint.latitude,
        longitude: UserModel().user.userGeoPoint.longitude);

    final allUsers = await geo
        .collection(collectionRef: usersQuery)
        .within(
            center: center,
            radius: settings![USER_MAX_DISTANCE].toDouble(),
            field: USER_GEO_POINT,
            strictMode: true)
        .first;

    // Remove the current user profile - If choosed to see everyone
    if (allUsers.isNotEmpty) {
      allUsers.removeWhere(
          (userDoc) => userDoc[USER_ID] == UserModel().user.userId);
    }

    /// Remove Disliked Users in list
    if (dislikedUsers.isNotEmpty) {
      for (var dislikedUser in dislikedUsers) {
        allUsers.removeWhere(
            (userDoc) => userDoc[USER_ID] == dislikedUser[DISLIKED_USER_ID]);
      }
    }

    // Get Liked Profiles
    final List<DocumentSnapshot<Map<String, dynamic>>> likedProfiles =
        (await _firestore
                .collection(C_LIKES)
                .where(LIKED_BY_USER_ID, isEqualTo: UserModel().user.userId)
                .get())
            .docs;

    // Remove Liked Profiles
    if (likedProfiles.isNotEmpty) {
      for (var likedUser in likedProfiles) {
        allUsers.removeWhere(
            (userDoc) => userDoc[USER_ID] == likedUser[LIKED_USER_ID]);
      }
    }

    // NEW feature - Remove Blocked Profiles from the list
    await BlockedUsersApi().removeBlockedUsers(allUsers).then((_) {
      debugPrint('removeBlockedUsers() -> success');
    }).catchError((e) {
      debugPrint('removeBlockedUsers() -> error: $e');
    });

    /// Sort by Verification, Compatibility, Quality, and Recency
    allUsers.sort((a, b) {
      // 1. Ranking Boost (Verification Type)
      final int boostA =
          (a.data() as Map<String, dynamic>).containsKey(USER_VERIFICATION_RANKING_BOOST)
              ? a[USER_VERIFICATION_RANKING_BOOST]
              : 0;
      final int boostB =
          (b.data() as Map<String, dynamic>).containsKey(USER_VERIFICATION_RANKING_BOOST)
              ? b[USER_VERIFICATION_RANKING_BOOST]
              : 0;

      if (boostA != boostB) {
        return boostB.compareTo(boostA);
      }

      // 2. Compatibility Score
      final User userA = User.fromDocument(a.data()!);
      final User userB = User.fromDocument(b.data()!);
      final int scoreA = CompatibilityHelper.calculate(UserModel().user, userA).score;
      final int scoreB = CompatibilityHelper.calculate(UserModel().user, userB).score;

      if (scoreA != scoreB) {
        return scoreB.compareTo(scoreA);
      }

      // 3. Profile Quality Score
      final int qualityA = (a.data() as Map<String, dynamic>).containsKey(USER_PROFILE_QUALITY_SCORE)
          ? a[USER_PROFILE_QUALITY_SCORE]
          : 0;
      final int qualityB = (b.data() as Map<String, dynamic>).containsKey(USER_PROFILE_QUALITY_SCORE)
          ? b[USER_PROFILE_QUALITY_SCORE]
          : 0;

      if (qualityA != qualityB) {
          return qualityB.compareTo(qualityA);
      }

      // 4. Recency
      final DateTime userRegDateA = a[USER_REG_DATE].toDate();
      final DateTime userRegDateB = b[USER_REG_DATE].toDate();
      return userRegDateA.compareTo(userRegDateB);
    });

    final int minAge = settings[USER_MIN_AGE];
    final int maxAge = settings[USER_MAX_AGE];

    // Filter Profile Ages and Discovery Mode
    return allUsers.where((DocumentSnapshot<Map<String, dynamic>> userDoc) {
      final User otherUser = User.fromDocument(userDoc.data()!);
      final User currentUser = UserModel().user;

      // 1. Age Filter
      final DateTime userBirthday = DateTime(otherUser.userBirthYear,
          otherUser.userBirthMonth, otherUser.userBirthDay);
      final int profileAge = UserModel().calculateUserAge(userBirthday);
      if (profileAge < minAge || profileAge > maxAge) return false;

      // 2. Discovery Mode Filter
      switch (discoveryMode) {
        case DiscoveryMode.general:
          return true;
        case DiscoveryMode.academic:
          return otherUser.userDegree.isNotEmpty ||
              otherUser.userAcademicStatus.isNotEmpty;
        case DiscoveryMode.sameInstitution:
          return (otherUser.userInstitution.isNotEmpty &&
                  otherUser.userInstitution == currentUser.userInstitution) ||
              (otherUser.userUniversity.isNotEmpty &&
                  otherUser.userUniversity == currentUser.userUniversity);
        case DiscoveryMode.sameProfession:
          return (otherUser.userIndustry.isNotEmpty &&
                  otherUser.userIndustry == currentUser.userIndustry) ||
              (otherUser.userOccupation.isNotEmpty &&
                  otherUser.userOccupation == currentUser.userOccupation);
        case DiscoveryMode.similarGoals:
          return otherUser.userFutureGoals
              .any((goal) => currentUser.userFutureGoals.contains(goal));
        case DiscoveryMode.highlyCompatible:
          return CompatibilityHelper.calculate(currentUser, otherUser).score >=
              75;
        case DiscoveryMode.seriousRelationships:
          return otherUser.userRelationshipIntent == 'Marriage' ||
              otherUser.userRelationshipIntent == 'Long-Term Relationship';
      }
    }).toList();
  }
}
