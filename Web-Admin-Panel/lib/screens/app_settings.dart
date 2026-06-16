import 'package:dating_app_dashboard/models/app_model.dart';
import 'package:dating_app_dashboard/widgets/app_version_control.dart';
import 'package:dating_app_dashboard/widgets/default_button.dart';
import 'package:dating_app_dashboard/widgets/show_scaffold_msg.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AppSettings extends StatefulWidget {
  const AppSettings({Key? key}) : super(key: key);

  @override
  _AppSettingsState createState() => _AppSettingsState();
}

class _AppSettingsState extends State<AppSettings> {
  // Variables
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  int _androidCurrentVersion = 1;
  int _iosCurrentVersion = 1;

  // Get inicial App Versions
  void _getAppVersions() {
    // Get App Versions
    if (mounted) {
      setState(() {
        _androidCurrentVersion = AppModel().appInfo!.androidAppCurrentVersion;
        _iosCurrentVersion = AppModel().appInfo!.iosAppCurrentVersion;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _getAppVersions();
  }

  /// Set initial values to text controllers
  ///
  // Android Package Name
  final _androidPackageNameController =
      TextEditingController(text: AppModel().appInfo!.androidPackageName);

  // iOS App ID
  final _iOsAppIdController =
      TextEditingController(text: AppModel().appInfo!.iOsAppId);

  // App Email for Support
  final _appEmailController =
      TextEditingController(text: AppModel().appInfo!.appEmail);

  // Privacy Policy Url
  final _privacyUrlController =
      TextEditingController(text: AppModel().appInfo!.privacyPolicyUrl);

  // Terms of Service Url
  final _termsUrlController =
      TextEditingController(text: AppModel().appInfo!.termsOfServicesUrl);

  // Free Account Max Distance
  final _freeAccountMaxDistanceController = TextEditingController(
      text: AppModel().appInfo!.freeAccountMaxDistance.toString());

  // VIP Account Max Distance
  final _vipAccountMaxDistanceController = TextEditingController(
      text: AppModel().appInfo!.vipAccountMaxDistance.toString());

  // Increment Android App version number
  void _incrementAndroidVersion() {
    // Update UI
    setState(() => _androidCurrentVersion++);
    // Debug
    debugPrint('_incrementAndroidVersion() -> $_androidCurrentVersion');
  }

  // Decrement Android App version number
  void _decrementAndroidVersion() {
    // Update UI
    if (_androidCurrentVersion > 1) setState(() => _androidCurrentVersion--);
    // Debug
    debugPrint('_decrementAndroidVersion() -> $_androidCurrentVersion');
  }

// Increment iOS App version number
  void _incrementIOSversion() {
    // Update UI
    setState(() => _iosCurrentVersion++);
    // Debug
    debugPrint('_incrementIOSversion() -> $_iosCurrentVersion');
  }

  // Decrement iOS App version number
  void _decrementIOSversion() {
    // Update UI
    if (_iosCurrentVersion > 1) setState(() => _iosCurrentVersion--);
    // Debug
    debugPrint('_decrementIOSversion() -> $_iosCurrentVersion');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: const Text("App Settings"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
        child: Column(
          children: [
            /// Row 01
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Android Version Control
                AppVersionControl(
                    title: 'Android App Version Control',
                    subtitle: 'Google Play - App Current Version Number',
                    appVersion: _androidCurrentVersion,
                    onDecrement: _decrementAndroidVersion,
                    onIncrement: _incrementAndroidVersion),

                const SizedBox(width: 20),

                // iOS App Version Control
                AppVersionControl(
                    title: 'iOS App Version Control',
                    subtitle: 'App Store - Current Version Number',
                    appVersion: _iosCurrentVersion,
                    onDecrement: _decrementIOSversion,
                    onIncrement: _incrementIOSversion),
              ],
            ),
            const SizedBox(height: 25),

            /// Row 02
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Android Package name
                Expanded(
                  child: TextField(
                    controller: _androidPackageNameController,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: "Android Package name",
                      hintText: "E.g: com.example.package",
                      floatingLabelBehavior: FloatingLabelBehavior.always,
                      prefixIcon: Icon(Icons.android),
                    ),
                  ),
                ),
                const SizedBox(width: 20),
                // iOS App ID
                Expanded(
                  child: TextField(
                    controller: _iOsAppIdController,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: "iOS App ID",
                      hintText: "E.g: 0123456789",
                      floatingLabelBehavior: FloatingLabelBehavior.always,
                      prefixIcon: Icon(Icons.phone_iphone),
                    ),
                    inputFormatters: [
                      FilteringTextInputFormatter.allow(RegExp("[0-9]"))
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 25),

            /// Row 03
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Privacy Policy Url
                Expanded(
                  child: TextField(
                    controller: _privacyUrlController,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: "Privacy Policy Url",
                      hintText: "E.g: https://your.website.com/privacy",
                      floatingLabelBehavior: FloatingLabelBehavior.always,
                      prefixIcon: Icon(Icons.link),
                    ),
                  ),
                ),
                const SizedBox(width: 20),
                // Terms of Service Url
                Expanded(
                  child: TextField(
                    controller: _termsUrlController,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: "Terms of Service Url",
                      hintText:
                          "E.g: https://your.website.com/terms-of-service",
                      floatingLabelBehavior: FloatingLabelBehavior.always,
                      prefixIcon: Icon(Icons.link),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 25),

            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              // App Email Address for Support
              Expanded(
                child: TextField(
                  controller: _appEmailController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    labelText: "App Email Address for Support",
                    hintText: "E.g: your.email@admin.com",
                    floatingLabelBehavior: FloatingLabelBehavior.always,
                    prefixIcon: Icon(Icons.email_outlined),
                  ),
                ),
              ),
            ]),
            const SizedBox(height: 25),

            /// Row 05 - Distance Radius Settings
            const Padding(
              padding: EdgeInsets.all(8.0),
              child: Text("Distance Radius Settings",
                  style: TextStyle(fontSize: 18, color: Colors.grey)),
            ),
            const SizedBox(height: 10),

            /// Row 04 - Max Distance for Free/Vip Account
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: TextField(
                    controller: _freeAccountMaxDistanceController,
                    decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: "Free Account Max Distance Radius",
                        hintText: "E.g: 160 (KM) - only numbers are allowed",
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                        prefixIcon: Icon(Icons.location_on_outlined),
                        suffixIcon: Padding(
                          padding: EdgeInsets.all(8.0),
                          child: Text('(KM)', textAlign: TextAlign.center),
                        )),
                    inputFormatters: [
                      FilteringTextInputFormatter.allow(RegExp("[0-9]"))
                    ],
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: TextField(
                    controller: _vipAccountMaxDistanceController,
                    decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: "VIP Account Max Distance Radius",
                        hintText:
                            "E.g: 500 (Kilometers KM) - only numbers are allowed",
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                        prefixIcon: Icon(Icons.location_on_outlined),
                        suffixIcon: Padding(
                          padding: EdgeInsets.all(8.0),
                          child: Text('(KM)', textAlign: TextAlign.center),
                        )),
                    inputFormatters: [
                      FilteringTextInputFormatter.allow(RegExp("[0-9]"))
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 30),

            /// Save changes
            DefaultButton(
              child: const Text("SAVE CHANGES", style: TextStyle(fontSize: 18)),
              onPressed: () {
                /// Save / Update App Settings
                AppModel().saveAppSettings(
                    androidAppCurrentVersion: _androidCurrentVersion,
                    iosAppCurrentVersion: _iosCurrentVersion,
                    androidPackageName:
                        _androidPackageNameController.text.trim(),
                    iOsAppId: _iOsAppIdController.text.trim(),
                    appEmail: _appEmailController.text.trim(),
                    privacyPolicyUrl: _privacyUrlController.text.trim(),
                    termsOfServicesUrl: _termsUrlController.text.trim(),
                    freeAccountMaxDistance: double.parse(
                        _freeAccountMaxDistanceController.text.trim()),
                    vipAccountMaxDistance: double.parse(
                        _vipAccountMaxDistanceController.text.trim()),
                    onSuccess: () {
                      // Show success message
                      showScaffoldMessage(
                          context: context,
                          scaffoldkey: _scaffoldKey,
                          message: "App Settings updated successfully!");
                    },
                    onError: () {
                      // Show error message
                      showScaffoldMessage(
                          context: context,
                          scaffoldkey: _scaffoldKey,
                          message:
                              "Error while updating App Settings.\nPlease try again later!");
                    });
              },
            ),
          ],
        ),
      ),
    );
  }
}
