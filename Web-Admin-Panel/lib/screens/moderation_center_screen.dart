import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dating_app_dashboard/constants/constants.dart';
import 'package:dating_app_dashboard/widgets/my_circular_progress.dart';
import 'package:dating_app_dashboard/widgets/show_scaffold_msg.dart';
import 'package:flutter/material.dart';
import 'package:timeago/timeago.dart' as timeago;

class ModerationCenterScreen extends StatelessWidget {
  const ModerationCenterScreen({Key? key}) : super(key: key);

  static final _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Moderation Center")),
      body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
        stream: FirebaseFirestore.instance
            .collection(C_REPORTS)
            .where('status', isEqualTo: 'pending')
            .snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const MyCircularProgress();
          final docs = snapshot.data!.docs;
          if (docs.isEmpty) return const Center(child: Text("No pending reports"));

          return ListView.builder(
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final report = docs[index];
              return Card(
                margin: const EdgeInsets.all(10),
                child: Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Reason: ${report['reason']}", style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                      const SizedBox(height: 5),
                      Text("Reported User: ${report['reported_user_id']}"),
                      Text("Reporter: ${report['reporter_user_id']}"),
                      Text("Time: ${timeago.format(report['timestamp'].toDate())}"),
                      const Divider(),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          TextButton(
                            onPressed: () => _warnUser(context, report),
                            child: const Text("WARN"),
                          ),
                          TextButton(
                            onPressed: () => _suspendUser(context, report),
                            child: const Text("SUSPEND (7d)"),
                          ),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                            onPressed: () => _banUser(context, report),
                            child: const Text("BAN USER", style: TextStyle(color: Colors.white)),
                          ),
                          const SizedBox(width: 10),
                          IconButton(
                            icon: const Icon(Icons.check_circle_outline, color: Colors.green),
                            onPressed: () => _resolveReport(context, report.id),
                          )
                        ],
                      )
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  void _warnUser(BuildContext context, DocumentSnapshot report) async {
    // Logic for sending warning (e.g., via notification)
    await _resolveReport(context, report.id);
    showScaffoldMessage(
        context: context,
        scaffoldkey: _scaffoldKey,
        message: "Warning issued to user.");
  }

  void _suspendUser(BuildContext context, DocumentSnapshot report) async {
    final reportedId = report['reported_user_id'];
    await FirebaseFirestore.instance.collection(C_USERS).doc(reportedId).update({
      USER_IS_SUSPENDED: true,
      USER_SUSPENSION_END_DATE: DateTime.now().add(const Duration(days: 7)),
      USER_STATUS: 'suspended',
    });
    await _resolveReport(context, report.id);
    showScaffoldMessage(
        context: context,
        scaffoldkey: _scaffoldKey,
        message: "User suspended for 7 days.");
  }

  void _banUser(BuildContext context, DocumentSnapshot report) async {
    final reportedId = report['reported_user_id'];
    await FirebaseFirestore.instance.collection(C_USERS).doc(reportedId).update({
      USER_IS_BANNED: true,
      USER_STATUS: 'blocked',
      USER_BAN_REASON: report['reason'],
    });
    await _resolveReport(context, report.id);
    showScaffoldMessage(
        context: context,
        scaffoldkey: _scaffoldKey,
        message: "User banned permanently.");
  }

  Future<void> _resolveReport(BuildContext context, String reportId) async {
    await FirebaseFirestore.instance.collection(C_REPORTS).doc(reportId).update({'status': 'resolved'});
  }
}
