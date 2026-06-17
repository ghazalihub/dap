import 'package:dating_app_dashboard/constants/constants.dart';
import 'package:dating_app_dashboard/screens/admin_profile.dart';
import 'package:dating_app_dashboard/screens/app_settings.dart';
import 'package:dating_app_dashboard/screens/dashboard.dart';
import 'package:dating_app_dashboard/screens/flagged_users.dart';
import 'package:dating_app_dashboard/screens/in_app_purchases.dart';
import 'package:dating_app_dashboard/screens/push_notifications.dart';
import 'package:dating_app_dashboard/screens/sign_in_screen.dart';
import 'package:dating_app_dashboard/screens/users_screen.dart';
import 'package:dating_app_dashboard/screens/verification_queue_screen.dart';
import 'package:dating_app_dashboard/screens/moderation_center_screen.dart';
import 'package:dating_app_dashboard/screens/communities_management.dart';
import 'package:dating_app_dashboard/screens/analytics_dashboard.dart';
import 'package:dating_app_dashboard/widgets/app_logo.dart';
import 'package:flutter/material.dart';

class MyNavigationDrawer extends StatefulWidget {

  const MyNavigationDrawer({Key? key}) : super(key: key);

  @override
  State<MyNavigationDrawer> createState() => _NavigationDrawerState();
}

class _NavigationDrawerState extends State<MyNavigationDrawer> {
  // Variables
  final _menuTextStyle = const TextStyle(
    color: Colors.black,
    fontSize: 16.0,
    fontWeight: FontWeight.w500,
  );

  final _scrollController = ScrollController();

  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 16, top: 10, bottom: 5),
      child: Text(title,
          style: const TextStyle(
              color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        controller: _scrollController,
        padding: const EdgeInsets.all(0),
        children: <Widget>[
          /// DrawerHeader
          _drawerHeader(context),
          const Divider(height: 0),
          _sectionTitle("OPERATIONS"),
          ListTile(
            leading: const Icon(Icons.dashboard_outlined),
            title: Text("Overview", style: _menuTextStyle),
            onTap: () {
              Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => const Dashboard()));
            },
          ),
          ListTile(
            leading: const Icon(Icons.verified_user_outlined),
            title: Text("Verification Queue", style: _menuTextStyle),
            onTap: () {
              Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const VerificationQueueScreen()));
            },
          ),
          ListTile(
            leading: const Icon(Icons.account_balance_outlined),
            title: Text("Communities", style: _menuTextStyle),
            onTap: () {
              Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const CommunitiesManagementScreen()));
            },
          ),
          const Divider(),
          _sectionTitle("ANALYTICS"),
          ListTile(
            leading: const Icon(Icons.analytics_outlined),
            title: Text("Performance Stats", style: _menuTextStyle),
            onTap: () {
              Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const AnalyticsDashboard()));
            },
          ),
          const Divider(),
          _sectionTitle("TRUST & SAFETY"),
          ListTile(
            leading: const Icon(Icons.security_outlined),
            title: Text("Moderation Center", style: _menuTextStyle),
            onTap: () {
              Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const ModerationCenterScreen()));
            },
          ),
          ListTile(
            leading: const Icon(Icons.people_outline),
            title: Text("User Management", style: _menuTextStyle),
            onTap: () {
              Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => const UsersScreen()));
            },
          ),
          const Divider(),
          _sectionTitle("MANAGEMENT"),
          ListTile(
            leading: const Icon(Icons.settings_outlined),
            title: Text("App Settings", style: _menuTextStyle),
            onTap: () {
              Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => const AppSettings()));
            },
          ),
          ListTile(
            leading: const Icon(Icons.monetization_on_outlined),
            title: Text("Revenue & IAP", style: _menuTextStyle),
            onTap: () {
              Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const InAppPurchases()));
            },
          ),
          const Divider(height: 0),
          ListTile(
            leading: const Icon(Icons.notifications_outlined),
            title: Text("Push Notifications", style: _menuTextStyle),
            onTap: () {
              // Go to push notifications screen
              Navigator.of(context).push(MaterialPageRoute(
                  builder: (context) => const PushNotifications()));
            },
          ),
          const Divider(height: 0),
          ListTile(
            leading: const Icon(Icons.person_outline),
            title: Text("Admin Profile", style: _menuTextStyle),
            onTap: () {
              // Go to admin account screen
              Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => const AdminProfile()));
            },
          ),
          const Divider(height: 0),
          ListTile(
            leading: const Icon(Icons.logout),
            title: Text("Log out", style: _menuTextStyle),
            onTap: () {
              // Go to sign in screen
              Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (context) => const SignInScreen()));
            },
          ),
        ],
      ),
    );
  }
}

/// DrawerHeader
Widget _drawerHeader(BuildContext context) {
  return Container(
    color: Theme.of(context).primaryColor,
    padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 10),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: const <Widget>[
         /// App logo
         AppLogo(),
         SizedBox(height: 10),
         Text(APP_NAME,
            style: TextStyle(
                fontSize: 18,
                color: Colors.white,
                fontWeight: FontWeight.bold)),
      ],
    ),
  );
}
