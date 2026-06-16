import 'dart:io';

import 'package:dating_app/api/verification_api.dart';
import 'package:dating_app/dialogs/common_dialogs.dart';
import 'package:dating_app/datas/predefined_choices.dart';
import 'package:dating_app/helpers/app_localizations.dart';
import 'package:dating_app/models/user_model.dart';
import 'package:dating_app/screens/sign_in_screen.dart';
import 'package:dating_app/screens/update_location_sceen.dart';
import 'package:dating_app/widgets/default_button.dart';
import 'package:dating_app/widgets/image_source_sheet.dart';
import 'package:dating_app/widgets/processing.dart';
import 'package:dating_app/widgets/show_scaffold_msg.dart';
import 'package:dating_app/widgets/svg_icon.dart';
import 'package:dating_app/widgets/terms_of_service_row.dart';
import 'package:flutter/material.dart';
import 'package:flutter_cupertino_datetime_picker/flutter_cupertino_datetime_picker.dart';
import 'package:scoped_model/scoped_model.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  SignUpScreenState createState() => SignUpScreenState();
}

class SignUpScreenState extends State<SignUpScreen> {
  // Variables
  final _formKey = GlobalKey<FormState>();
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  final _nameController = TextEditingController();
  final _schoolController = TextEditingController();
  final _jobController = TextEditingController();
  final _bioController = TextEditingController();

  // New Identity Controllers
  final _institutionController = TextEditingController();
  final _universityController = TextEditingController();
  final _collegeController = TextEditingController();
  final _courseController = TextEditingController();
  final _occupationController = TextEditingController();
  final _specializationController = TextEditingController();
  final _departmentController = TextEditingController();
  final _graduationYearController = TextEditingController();

  // Selection variables
  String? _selectedDegree;
  String? _selectedStudyYear;
  String? _selectedAcademicStatus;
  String? _selectedIndustry;
  String? _selectedWorkSchedule;
  String? _selectedShiftType;
  String? _selectedExercise;
  String? _selectedSmoking;
  String? _selectedDrinking;
  String? _selectedSleepSchedule;
  String? _selectedRelationshipIntent;
  String? _selectedNativeLanguage;

  List<String> _selectedFutureGoals = [];
  List<String> _selectedResearchInterests = [];
  List<String> _selectedSpokenLanguages = [];

  /// User Birthday info
  int _userBirthDay = 0;
  int _userBirthMonth = 0;
  int _userBirthYear = DateTime.now().year;
  // End
  DateTime _initialDateTime = DateTime.now();
  String? _birthday;
  File? _imageFile;
  bool _agreeTerms = false;
  String? _selectedGender;
  final List<String> _genders = ['Male', 'Female'];
  late AppLocalizations _i18n;

  /// Set terms
  void _setAgreeTerms(bool value) {
    setState(() {
      _agreeTerms = value;
    });
  }

  /// Get image from camera / gallery
  void _getImage(BuildContext context) async {
    await showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => ImageSourceSheet(
        onImageSelected: (image) {
          if (image != null) {
            setState(() {
              _imageFile = image;
            });
            // close modal
            Future(() => Navigator.of(context).pop());
          }
        },
      ),
    );
  }

  void _updateUserBithdayInfo(DateTime date) {
    setState(() {
      // Update the inicial date
      _initialDateTime = date;
      // Set for label
      _birthday = date.toString().split(' ')[0];
      // User birthday info
      _userBirthDay = date.day;
      _userBirthMonth = date.month;
      _userBirthYear = date.year;
    });
  }

  // Get Date time picker app locale
  DateTimePickerLocale _getDatePickerLocale() {
    // Inicial value
    DateTimePickerLocale locale = DateTimePickerLocale.en_us;
    // Get the name of the current locale.
    switch (_i18n.translate('lang')) {
      // Handle your Supported Languages below:
      case 'en': // English
        locale = DateTimePickerLocale.en_us;
        break;
    }
    return locale;
  }

  /// Display date picker.
  void _showDatePicker() {
    DatePicker.showDatePicker(
      context,
      onMonthChangeStartWithFirstDate: true,
      pickerTheme: DateTimePickerTheme(
        showTitle: true,
        confirm: Text(
          _i18n.translate('DONE'),
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18.0,
            color: Theme.of(context).primaryColor,
          ),
        ),
      ),
      minDateTime: DateTime(1920, 1, 1),
      maxDateTime: DateTime.now(),
      initialDateTime: _initialDateTime,
      dateFormat: 'yyyy-MMMM-dd', // Date format
      locale: _getDatePickerLocale(), // Set your App Locale here
      onClose: () => debugPrint("----- onClose -----"),
      onCancel: () => debugPrint('onCancel'),
      onChange: (dateTime, List<int> index) {
        // Get birthday info
        _updateUserBithdayInfo(dateTime);
      },
      onConfirm: (dateTime, List<int> index) {
        // Get birthday info
        _updateUserBithdayInfo(dateTime);
      },
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();

    /// Initialization
    _i18n = AppLocalizations.of(context);
    _birthday = _i18n.translate("select_your_birthday");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: Text(_i18n.translate("sign_up")),
        actions: [
          // LOGOUT BUTTON
          TextButton(
            child: Text(
              _i18n.translate('sign_out'),
              style: TextStyle(color: Theme.of(context).primaryColor),
            ),
            onPressed: () {
              // Log out button
              UserModel().signOut().then((_) {
                /// Go to login screen
                Future(() {
                  Navigator.of(context).popUntil((route) => route.isFirst);
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(
                      builder: (context) => const SignInScreen(),
                    ),
                  );
                });
              });
            },
          ),
        ],
      ),
      body: ScopedModelDescendant<UserModel>(
        builder: (context, child, userModel) {
          /// Check loading status
          if (userModel.isLoading) return const Processing();
          return SingleChildScrollView(
            padding: const EdgeInsets.all(15),
            child: Column(
              children: <Widget>[
                Text(
                  _i18n.translate("create_account"),
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 20),

                /// Profile photo
                GestureDetector(
                  child: Center(
                    child: _imageFile == null
                        ? CircleAvatar(
                            radius: 60,
                            backgroundColor: Theme.of(context).primaryColor,
                            child: const SvgIcon(
                              "assets/icons/camera_icon.svg",
                              width: 40,
                              height: 40,
                              color: Colors.white,
                            ),
                          )
                        : CircleAvatar(
                            radius: 60,
                            backgroundImage: FileImage(_imageFile!),
                          ),
                  ),
                  onTap: () {
                    /// Get profile image
                    _getImage(context);
                  },
                ),
                const SizedBox(height: 10),
                Text(
                  _i18n.translate("profile_photo"),
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: 22),

                /// Form
                Form(
                  key: _formKey,
                  child: Column(
                    children: <Widget>[
                      /// FullName field
                      TextFormField(
                        controller: _nameController,
                        decoration: InputDecoration(
                          labelText: _i18n.translate("fullname"),
                          hintText: _i18n.translate("enter_your_fullname"),
                          floatingLabelBehavior: FloatingLabelBehavior.always,
                          prefixIcon: const Padding(
                            padding: EdgeInsets.all(12.0),
                            child: SvgIcon("assets/icons/user_icon.svg"),
                          ),
                        ),
                        validator: (name) {
                          // Basic validation
                          if (name?.isEmpty ?? false) {
                            return _i18n.translate(
                              "please_enter_your_fullname",
                            );
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),

                      /// User gender
                      DropdownButtonFormField<String>(
                        items: _genders.map((gender) {
                          return DropdownMenuItem(
                            value: gender,
                            child: _i18n.translate("lang") != 'en'
                                ? Text(
                                    '${gender.toString()} - ${_i18n.translate(gender.toString().toLowerCase())}',
                                  )
                                : Text(gender.toString()),
                          );
                        }).toList(),
                        hint: Text(_i18n.translate("select_gender")),
                        onChanged: (gender) {
                          setState(() {
                            _selectedGender = gender;
                          });
                        },
                        validator: (String? value) {
                          if (value == null) {
                            return _i18n.translate("please_select_your_gender");
                          }
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),

                      /// Birthday card
                      Card(
                        clipBehavior: Clip.antiAlias,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(28),
                          side: BorderSide(color: Colors.grey[350] as Color),
                        ),
                        child: ListTile(
                          leading: const SvgIcon(
                            "assets/icons/calendar_icon.svg",
                          ),
                          title: Text(
                            _birthday!,
                            style: const TextStyle(color: Colors.grey),
                          ),
                          trailing: const Icon(Icons.arrow_drop_down),
                          onTap: () {
                            /// Select birthday
                            _showDatePicker();
                          },
                        ),
                      ),
                      const SizedBox(height: 20),

                      /// Bio field
                      TextFormField(
                        controller: _bioController,
                        maxLines: 4,
                        decoration: InputDecoration(
                          labelText: _i18n.translate("bio"),
                          hintText: _i18n.translate("please_write_your_bio"),
                          floatingLabelBehavior: FloatingLabelBehavior.always,
                          prefixIcon: const Padding(
                            padding: EdgeInsets.all(12.0),
                            child: SvgIcon("assets/icons/info_icon.svg"),
                          ),
                        ),
                        validator: (bio) {
                          if (bio?.isEmpty ?? false) {
                            return _i18n.translate("please_write_your_bio");
                          }
                          return null;
                        },
                      ),

                      const SizedBox(height: 30),
                      const Text("Academic Identity",
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 20),

                      TextFormField(
                        controller: _institutionController,
                        decoration: const InputDecoration(
                            labelText: "Institution",
                            hintText: "Enter your Institution"),
                      ),
                      const SizedBox(height: 20),

                      TextFormField(
                        controller: _universityController,
                        decoration: const InputDecoration(
                            labelText: "University",
                            hintText: "Enter your University"),
                      ),
                      const SizedBox(height: 20),

                      TextFormField(
                        controller: _collegeController,
                        decoration: const InputDecoration(
                            labelText: "College",
                            hintText: "Enter your College"),
                      ),
                      const SizedBox(height: 20),

                      DropdownButtonFormField<String>(
                        items: ACADEMIC_DEGREES.map((val) {
                          return DropdownMenuItem(value: val, child: Text(val));
                        }).toList(),
                        hint: const Text("Select Degree"),
                        onChanged: (val) => setState(() => _selectedDegree = val),
                      ),
                      const SizedBox(height: 20),

                      TextFormField(
                        controller: _courseController,
                        decoration: const InputDecoration(
                            labelText: "Course", hintText: "Enter your Course"),
                      ),
                      const SizedBox(height: 20),

                      DropdownButtonFormField<String>(
                        items: STUDY_YEARS.map((val) {
                          return DropdownMenuItem(value: val, child: Text(val));
                        }).toList(),
                        hint: const Text("Study Year"),
                        onChanged: (val) =>
                            setState(() => _selectedStudyYear = val),
                      ),
                      const SizedBox(height: 20),

                      TextFormField(
                        controller: _graduationYearController,
                        decoration: const InputDecoration(
                            labelText: "Graduation Year",
                            hintText: "Expected Graduation Year"),
                        keyboardType: TextInputType.number,
                      ),
                      const SizedBox(height: 20),

                      DropdownButtonFormField<String>(
                        items: ACADEMIC_STATUSES.map((val) {
                          return DropdownMenuItem(value: val, child: Text(val));
                        }).toList(),
                        hint: const Text("Academic Status"),
                        onChanged: (val) =>
                            setState(() => _selectedAcademicStatus = val),
                      ),
                      const SizedBox(height: 30),
                      const Text("Professional Identity",
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 20),

                      TextFormField(
                        controller: _occupationController,
                        decoration: const InputDecoration(
                            labelText: "Occupation",
                            hintText: "e.g. Cardiologist, Software Engineer"),
                      ),
                      const SizedBox(height: 20),

                      TextFormField(
                        controller: _specializationController,
                        decoration: const InputDecoration(
                            labelText: "Specialization",
                            hintText: "Enter specialization"),
                      ),
                      const SizedBox(height: 20),

                      TextFormField(
                        controller: _departmentController,
                        decoration: const InputDecoration(
                            labelText: "Department",
                            hintText: "Enter department"),
                      ),
                      const SizedBox(height: 20),

                      DropdownButtonFormField<String>(
                        items: INDUSTRIES.map((val) {
                          return DropdownMenuItem(value: val, child: Text(val));
                        }).toList(),
                        hint: const Text("Industry"),
                        onChanged: (val) => setState(() => _selectedIndustry = val),
                      ),
                      const SizedBox(height: 30),
                      const Text("Relationship Intent",
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 20),

                      DropdownButtonFormField<String>(
                        items: RELATIONSHIP_INTENTS.map((val) {
                          return DropdownMenuItem(value: val, child: Text(val));
                        }).toList(),
                        hint: const Text("Select Intent"),
                        onChanged: (val) =>
                            setState(() => _selectedRelationshipIntent = val),
                        validator: (val) =>
                            val == null ? "Please select your intent" : null,
                      ),

                      const SizedBox(height: 30),
                      const Text("Lifestyle",
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 20),

                      DropdownButtonFormField<String>(
                        items: WORK_SCHEDULES.map((val) {
                          return DropdownMenuItem(value: val, child: Text(val));
                        }).toList(),
                        hint: const Text("Work Schedule"),
                        onChanged: (val) =>
                            setState(() => _selectedWorkSchedule = val),
                      ),
                      const SizedBox(height: 20),

                      DropdownButtonFormField<String>(
                        items: SMOKING_HABITS.map((val) {
                          return DropdownMenuItem(value: val, child: Text(val));
                        }).toList(),
                        hint: const Text("Smoking"),
                        onChanged: (val) => setState(() => _selectedSmoking = val),
                      ),
                      const SizedBox(height: 20),

                      DropdownButtonFormField<String>(
                        items: DRINKING_HABITS.map((val) {
                          return DropdownMenuItem(value: val, child: Text(val));
                        }).toList(),
                        hint: const Text("Drinking"),
                        onChanged: (val) => setState(() => _selectedDrinking = val),
                      ),
                      const SizedBox(height: 20),

                      DropdownButtonFormField<String>(
                        items: SHIFT_TYPES.map((val) {
                          return DropdownMenuItem(value: val, child: Text(val));
                        }).toList(),
                        hint: const Text("Shift Type"),
                        onChanged: (val) =>
                            setState(() => _selectedShiftType = val),
                      ),
                      const SizedBox(height: 20),

                      DropdownButtonFormField<String>(
                        items: EXERCISE_FREQUENCIES.map((val) {
                          return DropdownMenuItem(value: val, child: Text(val));
                        }).toList(),
                        hint: const Text("Exercise"),
                        onChanged: (val) => setState(() => _selectedExercise = val),
                      ),
                      const SizedBox(height: 20),

                      DropdownButtonFormField<String>(
                        items: SLEEP_SCHEDULES.map((val) {
                          return DropdownMenuItem(value: val, child: Text(val));
                        }).toList(),
                        hint: const Text("Sleep Schedule"),
                        onChanged: (val) =>
                            setState(() => _selectedSleepSchedule = val),
                      ),
                      const SizedBox(height: 20),

                      _buildMultiSelect(
                          "Future Goals", FUTURE_GOALS, _selectedFutureGoals),
                      const SizedBox(height: 20),

                      _buildMultiSelect("Research Interests", RESEARCH_INTERESTS,
                          _selectedResearchInterests),
                      const SizedBox(height: 20),

                      _buildMultiSelect(
                          "Spoken Languages", LANGUAGES, _selectedSpokenLanguages),
                      const SizedBox(height: 20),

                      DropdownButtonFormField<String>(
                        items: LANGUAGES.map((val) {
                          return DropdownMenuItem(value: val, child: Text(val));
                        }).toList(),
                        hint: const Text("Native Language"),
                        onChanged: (val) =>
                            setState(() => _selectedNativeLanguage = val),
                      ),

                      /// Agree terms
                      const SizedBox(height: 5),
                      _agreePrivacy(),
                      const SizedBox(height: 20),

                      /// Sign Up button
                      SizedBox(
                        width: double.maxFinite,
                        child: DefaultButton(
                          child: Text(
                            _i18n.translate("CREATE_ACCOUNT"),
                            style: const TextStyle(fontSize: 18),
                          ),
                          onPressed: () {
                            /// Sign up
                            _createAccount();
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  /// Handle Create account
  void _createAccount() async {
    /// check image file
    if (_imageFile == null) {
      // Show error message
      showScaffoldMessage(
        context: context,
        message: _i18n.translate("please_select_your_profile_photo"),
        bgcolor: Colors.red,
      );
      // validate terms
    } else if (!_agreeTerms) {
      // Show error message
      showScaffoldMessage(
        context: context,
        message: _i18n.translate("you_must_agree_to_our_privacy_policy"),
        bgcolor: Colors.red,
      );

      /// Validate form
    } else if (UserModel().calculateUserAge(_initialDateTime) < 18) {
      // Show error message
      showScaffoldMessage(
        context: context,
        duration: const Duration(seconds: 7),
        message: _i18n.translate(
          "only_18_years_old_and_above_are_allowed_to_create_an_account",
        ),
        bgcolor: Colors.red,
      );
    } else if (!_formKey.currentState!.validate()) {
    } else {
      /// Call all input onSaved method
      _formKey.currentState!.save();

      /// Call sign up method
      UserModel().signUp(
        userPhotoFile: _imageFile!,
        userFullName: _nameController.text.trim(),
        userGender: _selectedGender!,
        userBirthDay: _userBirthDay,
        userBirthMonth: _userBirthMonth,
        userBirthYear: _userBirthYear,
        userSchool: _schoolController.text.trim(),
        userJobTitle: _jobController.text.trim(),
        userBio: _bioController.text.trim(),
        userInstitution: _institutionController.text.trim(),
        userUniversity: _universityController.text.trim(),
        userCollege: _collegeController.text.trim(),
        userDegree: _selectedDegree ?? "",
        userCourse: _courseController.text.trim(),
        userStudyYear: _selectedStudyYear ?? "",
        userGraduationYear: _graduationYearController.text.trim(),
        userAcademicStatus: _selectedAcademicStatus ?? "",
        userOccupation: _occupationController.text.trim(),
        userSpecialization: _specializationController.text.trim(),
        userDepartment: _departmentController.text.trim(),
        userIndustry: _selectedIndustry ?? "",
        userFutureGoals: _selectedFutureGoals,
        userResearchInterests: _selectedResearchInterests,
        userNativeLanguage: _selectedNativeLanguage ?? "",
        userSpokenLanguages: _selectedSpokenLanguages,
        userWorkSchedule: _selectedWorkSchedule ?? "",
        userShiftType: _selectedShiftType ?? "",
        userExercise: _selectedExercise ?? "",
        userSmoking: _selectedSmoking ?? "",
        userDrinking: _selectedDrinking ?? "",
        userSleepSchedule: _selectedSleepSchedule ?? "",
        userRelationshipIntent: _selectedRelationshipIntent ?? "",
        onSuccess: () async {
          // Show success message
          successDialog(
            context,
            message: _i18n.translate(
              "your_account_has_been_created_successfully",
            ),
            positiveAction: () {
              // Execute action
              // Go to get the user device's current location
              Future(() {
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(
                    builder: (context) => const UpdateLocationScreen(),
                  ),
                  (route) => false,
                );
              });
              // End
            },
          );
        },
        onFail: (error) {
          // Debug error
          debugPrint(error);
          // Show error message
          errorDialog(
            context,
            message:
                "${_i18n.translate("an_error_occurred_while_creating_your_account")}Error: $error",
          );
        },
      );
    }
  }

  Widget _buildMultiSelect(
      String title, List<String> options, List<String> selectedList) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        Wrap(
          spacing: 8,
          children: options.map((option) {
            final isSelected = selectedList.contains(option);
            return FilterChip(
              label: Text(option),
              selected: isSelected,
              onSelected: (selected) {
                setState(() {
                  if (selected) {
                    selectedList.add(option);
                  } else {
                    selectedList.remove(option);
                  }
                });
              },
            );
          }).toList(),
        ),
      ],
    );
  }

  /// Handle Agree privacy policy
  Widget _agreePrivacy() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: <Widget>[
          Checkbox(
            activeColor: Theme.of(context).primaryColor,
            value: _agreeTerms,
            onChanged: (value) {
              _setAgreeTerms(value!);
            },
          ),
          Row(
            children: <Widget>[
              GestureDetector(
                onTap: () => _setAgreeTerms(!_agreeTerms),
                child: Text(
                  _i18n.translate("i_agree_with"),
                  style: const TextStyle(fontSize: 16),
                ),
              ),
              // Terms of Service and Privacy Policy
              TermsOfServiceRow(color: Colors.black),
            ],
          ),
        ],
      ),
    );
  }
}
