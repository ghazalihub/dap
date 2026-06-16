import 'package:dating_app/models/app_model.dart';
import 'package:dating_app/helpers/app_localizations.dart';
import 'package:dating_app/models/user_model.dart';
import 'package:flutter/material.dart';
import 'package:timeago/timeago.dart' as timeago;

class BlockedAccountScreen extends StatelessWidget {
  final bool isSuspended;
  final DateTime? suspensionEndDate;
  final String? reason;

  const BlockedAccountScreen({
    super.key,
    this.isSuspended = false,
    this.suspensionEndDate,
    this.reason,
  });

  @override
  Widget build(BuildContext context) {
    final i18n = AppLocalizations.of(context);
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircleAvatar(
            radius: 50,
            backgroundColor: Theme.of(context).primaryColor,
            child:
                const Icon(Icons.lock_outline, size: 60, color: Colors.white),
          ),
          const SizedBox(height: 20),
          Text(i18n.translate("oops"), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
          Text(isSuspended ? "Account Suspended" : i18n.translate("your_account_was_blocked"),
              style:
                  const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          if (isSuspended && suspensionEndDate != null)
            Padding(
              padding: const EdgeInsets.only(top: 10),
              child: Text(
                "Suspension ends: ${timeago.format(suspensionEndDate!)}",
                style: const TextStyle(fontSize: 18, color: Colors.red),
              ),
            ),
          if (reason != null && reason!.isNotEmpty)
            Padding(
              padding: const EdgeInsets.all(10),
              child: Text(
                "Reason: $reason",
                style: const TextStyle(fontSize: 16, color: Colors.grey),
                textAlign: TextAlign.center,
              ),
            ),
          Text(i18n.translate("please_contact_support_to_active_it")),
          const SizedBox(height: 10),
          Text(AppModel().appInfo.appEmail,
              style: TextStyle(
                  color: Theme.of(context).primaryColor, fontSize: 18),
              textAlign: TextAlign.center),
          const SizedBox(height: 30),
          TextButton(
            onPressed: () => UserModel().signOut(),
            child: const Text("SIGN OUT"),
          )
        ],
      ),
    ));
  }
}
