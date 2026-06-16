import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dating_app/api/blocked_users_api.dart';
import 'package:dating_app/api/conversations_api.dart';
import 'package:dating_app/api/dislikes_api.dart';
import 'package:dating_app/api/likes_api.dart';
import 'package:dating_app/api/matches_api.dart';
import 'package:dating_app/api/messages_api.dart';
import 'package:dating_app/api/notifications_api.dart';
import 'package:dating_app/api/visits_api.dart';
import 'package:dating_app/constants/constants.dart';
import 'package:dating_app/helpers/app_localizations.dart';
import 'package:dating_app/models/user_model.dart';
import 'package:dating_app/screens/sign_in_screen.dart';
import 'package:dating_app/widgets/processing.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';

class DeleteAccountScreen extends StatefulWidget {
  const DeleteAccountScreen({super.key});

  @override
  DeleteAccountScreenState createState() => DeleteAccountScreenState();
}

class DeleteAccountScreenState extends State<DeleteAccountScreen> {
  // Variables
  final _firestore = FirebaseFirestore.instance;
  final _storageRef = FirebaseStorage.instance;

  /// Api instances
  final _notificationsApi = NotificationsApi();
  final _conversationsApi = ConversationsApi();
  final _messagesApi = MessagesApi();
  final _matchesApi = MatchesApi();
  final _likesApi = LikesApi();
  final _dislikesApi = DislikesApi();
  final _visitsApi = VisitsApi();

  /// DELETE USER PROFILE
  Future<void> deleteUserProfile() async {
    try {
      // Delete current user profile
      await _firestore
          .collection(C_USERS)
          .doc(UserModel().user.userId)
          .delete();
      debugPrint('User profile -> deleted...');
    } catch (e) {
      debugPrint('Failed to delete user profile: $e');
    }
  }

  /// Delete all user data from other collections
  ///
  Future<void> deleteUserData() async {
    try {
      await Future.wait([
        // Delete profile images and gallery
        deleteImages(),

        // Delete user matches
        deleteMatches(),

        // Delete user conversations and chat messages
        deleteChats(),

        // Delete user ID from likes (both directions)
        _likesApi.deleteLikedUsers(),
        _likesApi.deleteLikedMeUsers(),

        // Delete user ID from dislikes (both directions)
        _dislikesApi.deleteDislikedUsers(),
        _dislikesApi.deleteDislikedMeUsers(),

        // Delete visited users
        _visitsApi.deleteVisitedUsers(),

        // Delete notifications (received and sent)
        _notificationsApi.deleteUserNotifications(),
        _notificationsApi.deleteUserSentNotifications(),

        // Delete blocked users
        BlockedUsersApi().deleteBlockedUsers(),
      ]);
      debugPrint('All user data -> deleted...');
    } catch (e) {
      debugPrint('Error deleting user data: $e');
    }
  }

  /// ============================
  /// DELETE USER ACCOUNT
  /// ============================
  Future<void> deleteUserAccount() async {
    try {
      await deleteUserData();
    } finally {
      await deleteUserProfile();
    }
  }

  Future<void> deleteImages() async {
    final List<String> imagesRef = UserModel().getUserProfileImages(
      UserModel().user,
    );
    for (var imgUrl in imagesRef) {
      try {
        await _storageRef.refFromURL(imgUrl).delete();
      } catch (e) {
        debugPrint('Error deleting image: $e');
      }
    }
  }

  Future<void> deleteMatches() async {
    final matches = await _matchesApi.getMatches();
    if (matches.isNotEmpty) {
      for (var match in matches) {
        await _matchesApi.deleteMatch(match.id);
      }
    }
  }

  Future<void> deleteChats() async {
    final List<DocumentSnapshot<Map<String, dynamic>>> conversations =
        (await _conversationsApi.getConversations().first).docs;
    // Check conversations
    if (conversations.isNotEmpty) {
      // Loop conversations to be deleted
      for (var converse in conversations) {
        await _conversationsApi.deleteConverce(converse.id, isDoubleDel: true);
        // Delete chat for current user and for other users
        await _messagesApi.deleteChat(converse.id, isDoubleDel: true);
      }
    }
  }

  @override
  void initState() {
    super.initState();
    // Start deleting user account
    deleteUserAccount().then((_) {
      // Sign out user
      UserModel().signOut();
      // Go to sign in screen
      Future(() {
        Navigator.of(context).popUntil((route) => route.isFirst);
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const SignInScreen()),
        );
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final i18n = AppLocalizations.of(context);
    return Scaffold(
      body: Processing(text: i18n.translate("deleting_your_account")),
    );
  }
}
