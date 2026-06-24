import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dating_app/constants/constants.dart';
import 'package:dating_app/models/user_model.dart';

class CommunityApi {
  final _firestore = FirebaseFirestore.instance;

  /// Get all communities
  Stream<QuerySnapshot<Map<String, dynamic>>> getCommunities() {
    return _firestore.collection(C_COMMUNITIES).snapshots();
  }

  /// Join a community
  Future<void> joinCommunity(String communityId) async {
    final userId = UserModel().user.userId;

    // Add user to community members
    await _firestore.collection(C_COMMUNITIES).doc(communityId).collection('Members').doc(userId).set({
      'joined_at': FieldValue.serverTimestamp(),
    });

    // Increment member count
    await _firestore.collection(C_COMMUNITIES).doc(communityId).update({
      'community_member_count': FieldValue.increment(1),
    });

    // Add community to user's joined list
    await _firestore.collection(C_USERS).doc(userId).update({
      'user_communities': FieldValue.arrayUnion([communityId]),
    });
  }

  /// Leave a community
  Future<void> leaveCommunity(String communityId) async {
    final userId = UserModel().user.userId;

    await _firestore.collection(C_COMMUNITIES).doc(communityId).collection('Members').doc(userId).delete();

    await _firestore.collection(C_COMMUNITIES).doc(communityId).update({
      'community_member_count': FieldValue.increment(-1),
    });

    await _firestore.collection(C_USERS).doc(userId).update({
      'user_communities': FieldValue.arrayRemove([communityId]),
    });
  }
}
