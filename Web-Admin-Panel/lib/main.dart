import 'package:dating_app_dashboard/constants/constants.dart';
import 'package:dating_app_dashboard/models/app_model.dart';
import 'package:dating_app_dashboard/screens/sign_in_screen.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:scoped_model/scoped_model.dart';

// TODO: Please "scroll down" to see the instructions to fix it.
import 'firebase_options.dart';

void main() async {
  // Initialized before calling runApp to init firebase app
  WidgetsFlutterBinding.ensureInitialized();

  /// ***  Initialize Firebase App *** ///
  /// 👉 Please check the [Documentation - README FIRST] instructions in the
  /// [Admin Panel Table of Contents] at section: [NEW - Firebase initialization for Admin Panel]
  /// in order to fix it and generate the required [firebase_options.dart] for your app.
  /// TODO:
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ScopedModel<AppModel>(
      model: AppModel(),
      child: MaterialApp(
        title: APP_NAME,
        debugShowCheckedModeBanner: false,
        home: const SignInScreen(),
        theme: ThemeData.light().copyWith(
          primaryColor: APP_PRIMARY_COLOR,
          colorScheme: const ColorScheme.light().copyWith(
            primary: APP_PRIMARY_COLOR,
            secondary: APP_ACCENT_COLOR,
            surface: APP_PRIMARY_COLOR,
          ),
          appBarTheme: const AppBarTheme(
            backgroundColor: APP_PRIMARY_COLOR,
            surfaceTintColor: Colors.transparent,
            titleTextStyle: TextStyle(
              fontSize: 18,
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: APP_PRIMARY_COLOR,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(28),
              ),
            ),
          ),
          dividerTheme: const DividerThemeData(
            thickness: 0.0,
            color: Color(0xFFcccccc),
          ),
          cardTheme: const CardThemeData(
            color: Colors.white,
            surfaceTintColor: Colors.transparent,
          ),
        ),
      ),
    );
  }
}
