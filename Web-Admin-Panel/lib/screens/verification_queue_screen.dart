import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dating_app_dashboard/constants/constants.dart';
import 'package:dating_app_dashboard/widgets/my_circular_progress.dart';
import 'package:dating_app_dashboard/widgets/show_scaffold_msg.dart';
import 'package:flutter/material.dart';

class VerificationQueueScreen extends StatelessWidget {
  const VerificationQueueScreen({Key? key}) : super(key: key);

  static final _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Verification Queue")),
      body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
        stream: FirebaseFirestore.instance
            .collection(C_USERS)
            .where(USER_VERIFICATION_STATUS, isEqualTo: 'pending')
            .snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const MyCircularProgress();

          final docs = snapshot.data!.docs;
          if (docs.isEmpty) {
            return const Center(child: Text("No pending verifications"));
          }

          return ListView.builder(
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final user = docs[index];
              return Card(
                margin: const EdgeInsets.all(10),
                child: Column(
                  children: [
                    ListTile(
                      leading: CircleAvatar(
                        backgroundImage: NetworkImage(user[USER_PROFILE_PHOTO]),
                      ),
                      title: Text(user[USER_FULLNAME]),
                      subtitle: Text("${user[USER_VERIFICATION_TYPE]} - ID: ${user[USER_VERIFICATION_ID_NUMBER]}"),
                    ),
                    if (user[USER_VERIFICATION_DOCUMENT_URL] != null && user[USER_VERIFICATION_DOCUMENT_URL].isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Image.network(
                          user[USER_VERIFICATION_DOCUMENT_URL],
                          height: 200,
                          fit: BoxFit.contain,
                        ),
                      ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        TextButton(
                          onPressed: () => _reject(context, user.id),
                          child: const Text("REJECT", style: TextStyle(color: Colors.red)),
                        ),
                        ElevatedButton(
                          onPressed: () => _approve(context, user.id),
                          child: const Text("APPROVE"),
                        ),
                        const SizedBox(width: 10),
                      ],
                    ),
                    const SizedBox(height: 10),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }

  void _approve(BuildContext context, String userId) async {
    await FirebaseFirestore.instance.collection(C_USERS).doc(userId).update({
      USER_VERIFICATION_STATUS: 'verified',
      USER_IS_VERIFIED: true,
      USER_VERIFICATION_RANKING_BOOST: 10,
    });
    showScaffoldMessage(
        context: context,
        scaffoldkey: _scaffoldKey,
        message: "User verified successfully");
  }

  void _reject(BuildContext context, String userId) async {
    await FirebaseFirestore.instance.collection(C_USERS).doc(userId).update({
      USER_VERIFICATION_STATUS: 'rejected',
      USER_IS_VERIFIED: false,
    });
    showScaffoldMessage(
        context: context,
        scaffoldkey: _scaffoldKey,
        message: "Verification rejected");
  }
}
