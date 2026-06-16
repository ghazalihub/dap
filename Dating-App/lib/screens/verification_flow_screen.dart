import 'dart:io';
import 'package:dating_app/api/verification_api.dart';
import 'package:dating_app/helpers/app_localizations.dart';
import 'package:dating_app/models/user_model.dart';
import 'package:dating_app/widgets/default_button.dart';
import 'package:dating_app/widgets/image_source_sheet.dart';
import 'package:dating_app/widgets/processing.dart';
import 'package:dating_app/widgets/show_scaffold_msg.dart';
import 'package:flutter/material.dart';

class VerificationFlowScreen extends StatefulWidget {
  const VerificationFlowScreen({super.key});

  @override
  State<VerificationFlowScreen> createState() => _VerificationFlowScreenState();
}

class _VerificationFlowScreenState extends State<VerificationFlowScreen> {
  final _formKey = GlobalKey<FormState>();
  final _idController = TextEditingController();
  String? _selectedType;
  File? _documentFile;
  bool _isSubmitting = false;

  final List<String> _verificationTypes = [
    'Student',
    'Professional',
    'Institution'
  ];

  @override
  Widget build(BuildContext context) {
    final i18n = AppLocalizations.of(context);

    if (_isSubmitting) return const Processing();

    return Scaffold(
      appBar: AppBar(
        title: const Text("Account Verification"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                "Verify Your Academic or Professional Identity",
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              const Text(
                "Trust is vital in our academic community. Verified profiles get higher ranking and full access to features.",
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
              const SizedBox(height: 30),
              DropdownButtonFormField<String>(
                items: _verificationTypes.map((type) {
                  return DropdownMenuItem(value: type, child: Text(type));
                }).toList(),
                onChanged: (val) => setState(() => _selectedType = val),
                decoration: const InputDecoration(
                  labelText: "Verification Type",
                  border: OutlineInputBorder(),
                ),
                validator: (val) => val == null ? "Please select a type" : null,
              ),
              const SizedBox(height: 20),
              TextFormField(
                controller: _idController,
                decoration: const InputDecoration(
                  labelText: "ID / Registration Number",
                  hintText: "Enter your Student ID or License Number",
                  border: OutlineInputBorder(),
                ),
                validator: (val) =>
                    val == null || val.isEmpty ? "Required field" : null,
              ),
              const SizedBox(height: 30),
              const Text("Upload Document (ID Card, License, or Degree)",
                  style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 10),
              GestureDetector(
                onTap: () => _pickDocument(context),
                child: Container(
                  height: 150,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: _documentFile == null
                      ? const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.upload_file, size: 50, color: Colors.grey),
                            Text("Tap to upload document"),
                          ],
                        )
                      : Image.file(_documentFile!, fit: BoxFit.cover),
                ),
              ),
              const SizedBox(height: 40),
              SizedBox(
                width: double.infinity,
                child: DefaultButton(
                  child: const Text("SUBMIT FOR VERIFICATION"),
                  onPressed: () {
                    if (_formKey.currentState!.validate() &&
                        _documentFile != null) {
                      _submit();
                    } else if (_documentFile == null) {
                      showScaffoldMessage(
                          context: context,
                          message: "Please upload a document",
                          bgcolor: Colors.red);
                    }
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _pickDocument(BuildContext context) async {
    await showModalBottomSheet(
        context: context,
        backgroundColor: Colors.transparent,
        builder: (context) => ImageSourceSheet(onImageSelected: (file) {
              if (file != null) {
                setState(() => _documentFile = file);
                Navigator.pop(context);
              }
            }));
  }

  void _submit() async {
    setState(() => _isSubmitting = true);

    await VerificationApi().submitVerification(
      type: _selectedType!,
      idNumber: _idController.text.trim(),
      documentFile: _documentFile,
      onSuccess: () {
        setState(() => _isSubmitting = false);
        showDialog(
            context: context,
            builder: (context) => AlertDialog(
                  title: const Text("Request Submitted"),
                  content: const Text(
                      "Your verification request is pending review. You will be notified once approved."),
                  actions: [
                    TextButton(
                        onPressed: () =>
                            Navigator.of(context).popUntil((r) => r.isFirst),
                        child: const Text("OK"))
                  ],
                ));
      },
      onFail: (err) {
        setState(() => _isSubmitting = false);
        showScaffoldMessage(context: context, message: err, bgcolor: Colors.red);
      },
    );
  }
}
