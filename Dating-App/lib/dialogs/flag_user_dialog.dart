import 'package:dating_app/dialogs/progress_dialog.dart';
import 'package:dating_app/helpers/app_localizations.dart';
import 'package:dating_app/main.dart';
import 'package:dating_app/models/user_model.dart';
import 'package:dating_app/widgets/show_scaffold_msg.dart';
import 'package:flutter/material.dart';

class FlagUserDialog extends StatefulWidget {
  // Variables
  final String flaggedUserId;

  const FlagUserDialog({super.key, required this.flaggedUserId});

  @override
  FlagUserDialogState createState() => FlagUserDialogState();
}

class FlagUserDialogState extends State<FlagUserDialog> {
  // Variables
  String _selectedFlagOption = "";
  late ProgressDialog _pr;
  late AppLocalizations _i18n;
  bool _isOtherSelected = false;
  final _otherController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  // Close dialog method
  void _close() => navigatorKey.currentState?.pop();

  @override
  Widget build(BuildContext context) {
    // Initialization
    _i18n = AppLocalizations.of(context);
    _pr = ProgressDialog(navigatorKey.currentContext ?? context);

    // Get flag option list
    final List<String> flagOptions = [
      "Harassment",
      "Fake Profile",
      "Scam",
      "Spam",
      "Impersonation",
      "Abuse",
      "Inappropriate Content",
      _i18n.translate("other"),
    ];

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
      elevation: 3,
      child: _dialogContent(context, flagOptions),
    );
  }

  // Build dialog
  Widget _dialogContent(BuildContext context, List<String> flagOptions) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: <Widget>[
              const Icon(Icons.flag_outlined),
              const SizedBox(width: 5),
              Text(
                _i18n.translate("report"),
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
            ],
          ),
        ),
        const Divider(color: Colors.black, height: 5),
        Flexible(
          fit: FlexFit.loose,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: flagOptions.map((selectedOption) {
                return RadioListTile(
                  value: selectedOption,
                  groupValue: _selectedFlagOption,
                  title: Text(selectedOption),
                  onChanged: (value) {
                    setState(() {
                      _selectedFlagOption = value.toString();
                      if (_i18n.translate('other') == value.toString()) {
                        _isOtherSelected = true;
                      } else {
                        _isOtherSelected = false;
                      }
                    });
                  },
                  activeColor: Theme.of(context).primaryColor,
                );
              }).toList(),
            ),
          ),
        ),
        // Show Input field for other information
        if (_isOtherSelected)
          Form(
            key: _formKey,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: TextFormField(
                controller: _otherController,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  hintText: _i18n.translate("type_the_reason"),
                  floatingLabelBehavior: FloatingLabelBehavior.always,
                  prefixIcon: const Icon(Icons.info_outline),
                ),
                validator: (reason) {
                  // Basic validation
                  if (reason?.isEmpty ?? false) {
                    return _i18n.translate("please_type_the_reason");
                  }
                  return null;
                },
              ),
            ),
          ),
        // Add divider
        const Divider(color: Colors.black, height: 5),
        // Build
        Builder(
          builder: (context) {
            return Padding(
              padding: const EdgeInsets.all(5),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  TextButton(
                    onPressed: _close,
                    child: Text(
                      _i18n.translate("CANCEL"),
                      style: const TextStyle(color: Colors.grey),
                    ),
                  ),
                  TextButton(
                    onPressed: _selectedFlagOption == ''
                        ? null
                        : () async {
                            // Close Report dialog
                            _close();

                            // Check selected option
                            if (_isOtherSelected) {
                              _selectedFlagOption = _otherController.text;
                            }

                            // Show processing dialog
                            _pr.show(_i18n.translate("processing"));

                            /// Flag profile
                            await UserModel().flagUserProfile(
                              flaggedUserId: widget.flaggedUserId,
                              reason: _selectedFlagOption,
                            );

                            // Close progress
                            _pr.hide();

                            // Debug
                            debugPrint('flagUserProfile() -> success');

                            String message = _i18n.translate(
                              "thank_you_the_profile_will_be_reviewed",
                            );

                            // Show success dialog
                            showScaffoldMessage(
                              message: message,
                              bgcolor: Colors.green,
                            );
                          },
                    child: Text(
                      _i18n.translate("report").toUpperCase(),
                      style: TextStyle(
                        color: _selectedFlagOption != ''
                            ? Theme.of(context).primaryColor
                            : Colors.grey,
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
