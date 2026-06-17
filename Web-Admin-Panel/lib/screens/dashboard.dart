import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dating_app_dashboard/constants/constants.dart';
import 'package:dating_app_dashboard/models/app_model.dart';
import 'package:dating_app_dashboard/screens/analytics_dashboard.dart';
import 'package:dating_app_dashboard/screens/communities_management.dart';
import 'package:dating_app_dashboard/screens/moderation_center_screen.dart';
import 'package:dating_app_dashboard/screens/verification_queue_screen.dart';
import 'package:dating_app_dashboard/widgets/my_navigation_drawer.dart';
import 'package:dating_app_dashboard/widgets/processing.dart';
import 'package:dating_app_dashboard/widgets/users_pie_chart.dart';
import 'package:dating_app_dashboard/widgets/statistic_card.dart';
import 'package:flutter/material.dart';

class Dashboard extends StatefulWidget {
  const Dashboard({Key? key}) : super(key: key);

  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  // Variables
  late Stream<DocumentSnapshot<Map<String, dynamic>>> _appInfo;
  Stream<QuerySnapshot<Map<String, dynamic>>>? _users;

  /// Get AppInfo Stream to update UI after changes
  void _getAppInfoUpdates() {
    _appInfo = AppModel().getAppInfoStream();
    // Listen updates
    _appInfo.listen((appEvent) {
      // Update AppInfo object
      AppModel().updateAppObject(appEvent.data()!);
    });
  }

  /// Get Users Stream to listen updates
  void _getUsersUpdates() {
    _users = AppModel().getUsers();
    // Listen updates
    _users!.listen((usersEvent) {
      // Update users
      AppModel().updateUsers(usersEvent.docs);
    });
  }

  /// Count User Statistics
  int _countUsers(
      List<DocumentSnapshot<Map<String, dynamic>>> users, String userStatus) {
    // Variables
    String field = USER_STATUS;
    dynamic status = userStatus;
    // Check status
    if (userStatus == 'verified') {
      field = USER_IS_VERIFIED;
      status = true;
    }
    return users.where((user) => user.data()![field] == status).toList().length;
  }

  @override
  void initState() {
    super.initState();
    // Get updates
    _getUsersUpdates();
    _getAppInfoUpdates();
  }

  @override
  void dispose() {
    _appInfo.drain();
    _users?.drain();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text(APP_NAME)),
        drawer: const MyNavigationDrawer(),
        backgroundColor: Colors.grey.withAlpha(70),
        body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
            stream: _users,
            builder: (context, snapshot) {
              // Check data
              if (!snapshot.hasData) {
                return const Processing();
              } else {
                // Variables
                final List<DocumentSnapshot<Map<String, dynamic>>> users =
                    snapshot.data!.docs;
                final int totalActiveUsers = _countUsers(users, 'active');
                final int totalVerifiedUsers = _countUsers(users, 'verified');
                final int totalFlaggedUsers = _countUsers(users, 'flagged');
                final int totalBlockedUsers = _countUsers(users, 'blocked');

                return SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Dashboard Header
                      Center(
                        child: Container(
                          width: double.maxFinite,
                          color: Colors.white,
                          padding: const EdgeInsets.all(10.0),
                          child: Column(
                            children: const [
                               Icon(Icons.score, size: 80, color: Colors.grey),
                               Text("Control Panel",
                                  style: TextStyle(
                                      fontSize: 25,
                                      fontWeight: FontWeight.bold)),
                               Text("Academic Community Operations Center",
                                  style: TextStyle(color: Colors.grey)),
                            ],
                          ),
                        ),
                      ),

                      // Dashboard Statistics section 01
                      SingleChildScrollView(
                        scrollDirection: Axis.horizontal,
                        child: Row(
                          children: [
                            StatisticCard(
                              iconBgColor: Colors.green,
                              icon: Icons.person_add_outlined,
                              total: totalActiveUsers,
                              description: "Total Active Users",
                            ),
                            StatisticCard(
                              iconBgColor: Colors.blue,
                              icon: Icons.check,
                              total: totalVerifiedUsers,
                              description: "Total Verified Users",
                            ),
                            StatisticCard(
                              iconBgColor: Colors.amber,
                              icon: Icons.flag_outlined,
                              total: totalFlaggedUsers,
                              description: "Total Flagged Users",
                            ),
                            StatisticCard(
                              iconBgColor: Colors.red,
                              icon: Icons.lock_outlined,
                              total: totalBlockedUsers,
                              description: "Total Blocked Users",
                            ),
                          ],
                        ),
                      ),

                      /// Show Pie Chart Statistic
                      UsersPieChart(
                        totalUsers: users.length,
                        totalActiveUsers: totalActiveUsers,
                        totalVerifiedUsers: totalVerifiedUsers,
                        totalFlaggedUsers: totalFlaggedUsers,
                        totalBlockedUsers: totalBlockedUsers,
                      ),
                      const SizedBox(height: 20),
                      _buildQuickLinks(context),
                    ],
                  ),
                );
              }
            }));
  }

  Widget _buildQuickLinks(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Operations Shortcuts",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Wrap(
            spacing: 15,
            runSpacing: 15,
            children: [
              _quickLinkCard(context, "Verify Users", Icons.verified_user,
                  Colors.blue, const VerificationQueueScreen()),
              _quickLinkCard(context, "Moderation", Icons.security, Colors.red,
                  const ModerationCenterScreen()),
              _quickLinkCard(context, "Analytics", Icons.analytics,
                  Colors.green, const AnalyticsDashboard()),
              _quickLinkCard(context, "Communities", Icons.group, Colors.orange,
                  const CommunitiesManagementScreen()),
            ],
          )
        ],
      ),
    );
  }

  Widget _quickLinkCard(BuildContext context, String title, IconData icon,
      Color color, Widget screen) {
    return InkWell(
      onTap: () =>
          Navigator.push(context, MaterialPageRoute(builder: (context) => screen)),
      child: Container(
        width: 150,
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
                color: Colors.grey.withAlpha(50),
                blurRadius: 5,
                offset: const Offset(0, 2))
          ],
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 30),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
          ],
        ),
      ),
    );
  }
}
