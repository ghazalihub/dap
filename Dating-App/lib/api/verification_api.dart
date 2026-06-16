import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dating_app/constants/constants.dart';
import 'package:dating_app/models/user_model.dart';
import 'package:flutter/material.dart';

class VerificationApi {
  final _firestore = FirebaseFirestore.instance;

  /// Submit verification request
  Future<void> submitVerification({
    required String type,
    required String idNumber,
    required File? documentFile,
    required Function() onSuccess,
    required Function(String) onFail,
  }) async {
    try {
      String documentUrl = '';
      if (documentFile != null) {
        documentUrl = await UserModel().uploadFile(
          file: documentFile,
          path: 'uploads/verification',
          userId: UserModel().user.userId,
        );
      }

      await _firestore.collection(C_USERS).doc(UserModel().user.userId).update({
        USER_VERIFICATION_STATUS: 'pending',
        USER_VERIFICATION_TYPE: type,
        USER_VERIFICATION_ID_NUMBER: idNumber,
        USER_VERIFICATION_DOCUMENT_URL: documentUrl,
      });

      onSuccess();
    } catch (e) {
      debugPrint('submitVerification() -> error: $e');
      onFail(e.toString());
    }
  }

  /// Check verification status
  static bool isVerified(Map<String, dynamic> userDoc) {
    return userDoc[USER_VERIFICATION_STATUS] == 'verified';
  }

  /// Get pending verifications (for admin)
  Stream<QuerySnapshot<Map<String, dynamic>>> getPendingVerifications() {
    return _firestore
        .collection(C_USERS)
        .where(USER_VERIFICATION_STATUS, isEqualTo: 'pending')
        .snapshots();
  }

  /// Approve verification
  Future<void> approveVerification(String userId, {int rankingBoost = 10}) async {
    await _firestore.collection(C_USERS).doc(userId).update({
      USER_VERIFICATION_STATUS: 'verified',
      USER_VERIFICATION_RANKING_BOOST: rankingBoost,
      USER_IS_VERIFIED: true,
    });
  }

  /// Reject verification
  Future<void> rejectVerification(String userId) async {
    await _firestore.collection(C_USERS).doc(userId).update({
      USER_VERIFICATION_STATUS: 'rejected',
      USER_IS_VERIFIED: false,
    });
  }
}
