import 'package:dating_app/constants/constants.dart';
import 'package:dating_app/datas/predefined_choices.dart';
import 'package:dating_app/dialogs/common_dialogs.dart';
import 'package:dating_app/dialogs/progress_dialog.dart';
import 'package:dating_app/helpers/app_localizations.dart';
import 'package:dating_app/models/user_model.dart';
import 'package:dating_app/screens/profile_screen.dart';
import 'package:dating_app/widgets/image_source_sheet.dart';
import 'package:dating_app/widgets/svg_icon.dart';
import 'package:dating_app/widgets/user_gallery.dart';
import 'package:flutter/material.dart';
import 'package:scoped_model/scoped_model.dart';

class EditProfileScreen extends StatefulWidget {
  const EditProfileScreen({super.key});

  @override
  EditProfileScreenState createState() => EditProfileScreenState();
}

class EditProfileScreenState extends State<EditProfileScreen> {
  // Variables
  final _formKey = GlobalKey<FormState>();
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  final _schoolController = TextEditingController(
    text: UserModel().user.userSchool,
  );
  final _jobController = TextEditingController(
    text: UserModel().user.userJobTitle,
  );
  final _bioController = TextEditingController(text: UserModel().user.userBio);

  // New Controllers
  final _institutionController =
      TextEditingController(text: UserModel().user.userInstitution);
  final _universityController =
      TextEditingController(text: UserModel().user.userUniversity);
  final _collegeController =
      TextEditingController(text: UserModel().user.userCollege);
  final _courseController =
      TextEditingController(text: UserModel().user.userCourse);
  final _occupationController =
      TextEditingController(text: UserModel().user.userOccupation);
  final _specializationController =
      TextEditingController(text: UserModel().user.userSpecialization);
  final _departmentController =
      TextEditingController(text: UserModel().user.userDepartment);
  final _graduationYearController =
      TextEditingController(text: UserModel().user.userGraduationYear);

  String? _selectedDegree = UserModel().user.userDegree;
  String? _selectedStudyYear = UserModel().user.userStudyYear;
  String? _selectedAcademicStatus = UserModel().user.userAcademicStatus;
  String? _selectedIndustry = UserModel().user.userIndustry;
  String? _selectedRelationshipIntent = UserModel().user.userRelationshipIntent;
  String? _selectedWorkSchedule = UserModel().user.userWorkSchedule;
  String? _selectedShiftType = UserModel().user.userShiftType;
  String? _selectedExercise = UserModel().user.userExercise;
  String? _selectedSmoking = UserModel().user.userSmoking;
  String? _selectedDrinking = UserModel().user.userDrinking;
  String? _selectedSleepSchedule = UserModel().user.userSleepSchedule;
  String? _selectedNativeLanguage = UserModel().user.userNativeLanguage;

  List<String> _selectedFutureGoals =
      List.from(UserModel().user.userFutureGoals);
  List<String> _selectedResearchInterests =
      List.from(UserModel().user.userResearchInterests);
  List<String> _selectedSpokenLanguages =
      List.from(UserModel().user.userSpokenLanguages);

  late AppLocalizations _i18n;
  late ProgressDialog _pr;

  @override
  Widget build(BuildContext context) {
    /// Initialization
    _i18n = AppLocalizations.of(context);
    _pr = ProgressDialog(context, isDismissible: false);

    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: Text(_i18n.translate("edit_profile")),
        actions: [
          // Save changes button
          TextButton(
            child: Text(
              _i18n.translate("SAVE"),
              style: TextStyle(color: Theme.of(context).primaryColor),
            ),
            onPressed: () {
              /// Validate form
              if (_formKey.currentState!.validate()) {
                _saveChanges();
              }
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(15),
        child: Form(
          key: _formKey,
          child: ScopedModelDescendant<UserModel>(
            builder: (context, child, userModel) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  /// Profile photo
                  GestureDetector(
                    child: Center(
                      child: Stack(
                        children: <Widget>[
                          CircleAvatar(
                            backgroundImage: NetworkImage(
                              userModel.user.userProfilePhoto,
                            ),
                            radius: 80,
                            backgroundColor: Theme.of(context).primaryColor,
                          ),

                          /// Edit icon
                          Positioned(
                            right: 0,
                            bottom: 0,
                            child: CircleAvatar(
                              radius: 18,
                              backgroundColor: Theme.of(context).primaryColor,
                              child: const Icon(
                                Icons.edit,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    onTap: () async {
                      /// Update profile image
                      _selectImage(
                        imageUrl: userModel.user.userProfilePhoto,
                        path: 'profile',
                      );
                    },
                  ),
                  const SizedBox(height: 10),
                  Center(
                    child: Text(
                      _i18n.translate("profile_photo"),
                      style: const TextStyle(fontSize: 18),
                      textAlign: TextAlign.center,
                    ),
                  ),

                  /// Profile gallery
                  Text(
                    _i18n.translate("gallery"),
                    style: const TextStyle(fontSize: 18, color: Colors.grey),
                    textAlign: TextAlign.left,
                  ),
                  const SizedBox(height: 5),

                  /// Show gallery
                  const UserGallery(),

                  const SizedBox(height: 20),

                  /// Bio field
                  TextFormField(
                    controller: _bioController,
                    maxLines: 4,
                    decoration: InputDecoration(
                      labelText: _i18n.translate("bio"),
                      hintText: _i18n.translate("write_about_you"),
                      floatingLabelBehavior: FloatingLabelBehavior.always,
                      prefixIcon: const Padding(
                        padding: EdgeInsets.all(12.0),
                        child: SvgIcon("assets/icons/info_icon.svg"),
                      ),
                    ),
                    validator: (bio) {
                      if (bio == null) {
                        return _i18n.translate("please_write_your_bio");
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  /// School field
                  TextFormField(
                    controller: _schoolController,
                    decoration: InputDecoration(
                      labelText: _i18n.translate("school"),
                      hintText: _i18n.translate("enter_your_school_name"),
                      floatingLabelBehavior: FloatingLabelBehavior.always,
                      prefixIcon: const Padding(
                        padding: EdgeInsets.all(9.0),
                        child: SvgIcon("assets/icons/university_icon.svg"),
                      ),
                    ),
                    validator: (school) {
                      if (school == null) {
                        return _i18n.translate("please_enter_your_school_name");
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  /// Job title field
                  TextFormField(
                    controller: _jobController,
                    decoration: InputDecoration(
                      labelText: _i18n.translate("job_title"),
                      hintText: _i18n.translate("enter_your_job_title"),
                      floatingLabelBehavior: FloatingLabelBehavior.always,
                      prefixIcon: const Padding(
                        padding: EdgeInsets.all(12.0),
                        child: SvgIcon("assets/icons/job_bag_icon.svg"),
                      ),
                    ),
                    validator: (job) {
                      if (job == null) {
                        return _i18n.translate("please_enter_your_job_title");
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  const Divider(),
                  const Text("Academic Identity",
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),

                  TextFormField(
                    controller: _institutionController,
                    decoration: const InputDecoration(labelText: "Institution"),
                  ),
                  const SizedBox(height: 10),

                  TextFormField(
                    controller: _universityController,
                    decoration: const InputDecoration(labelText: "University"),
                  ),
                  const SizedBox(height: 10),

                  TextFormField(
                    controller: _collegeController,
                    decoration: const InputDecoration(labelText: "College"),
                  ),
                  const SizedBox(height: 10),

                  DropdownButtonFormField<String>(
                    value: _selectedDegree!.isEmpty ? null : _selectedDegree,
                    items: ACADEMIC_DEGREES.map((val) {
                      return DropdownMenuItem(value: val, child: Text(val));
                    }).toList(),
                    hint: const Text("Select Degree"),
                    onChanged: (val) => setState(() => _selectedDegree = val),
                  ),
                  const SizedBox(height: 10),

                  TextFormField(
                    controller: _courseController,
                    decoration: const InputDecoration(labelText: "Course"),
                  ),
                  const SizedBox(height: 10),

                  DropdownButtonFormField<String>(
                    value:
                        _selectedStudyYear!.isEmpty ? null : _selectedStudyYear,
                    items: STUDY_YEARS.map((val) {
                      return DropdownMenuItem(value: val, child: Text(val));
                    }).toList(),
                    hint: const Text("Study Year"),
                    onChanged: (val) => setState(() => _selectedStudyYear = val),
                  ),
                  const SizedBox(height: 10),

                  TextFormField(
                    controller: _graduationYearController,
                    decoration:
                        const InputDecoration(labelText: "Graduation Year"),
                    keyboardType: TextInputType.number,
                  ),
                  const SizedBox(height: 10),

                  DropdownButtonFormField<String>(
                    value: _selectedAcademicStatus!.isEmpty
                        ? null
                        : _selectedAcademicStatus,
                    items: ACADEMIC_STATUSES.map((val) {
                      return DropdownMenuItem(value: val, child: Text(val));
                    }).toList(),
                    hint: const Text("Academic Status"),
                    onChanged: (val) =>
                        setState(() => _selectedAcademicStatus = val),
                  ),
                  const SizedBox(height: 20),

                  const Divider(),
                  const Text("Professional Identity",
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),

                  TextFormField(
                    controller: _occupationController,
                    decoration: const InputDecoration(labelText: "Occupation"),
                  ),
                  const SizedBox(height: 10),

                  TextFormField(
                    controller: _specializationController,
                    decoration:
                        const InputDecoration(labelText: "Specialization"),
                  ),
                  const SizedBox(height: 10),

                  TextFormField(
                    controller: _departmentController,
                    decoration: const InputDecoration(labelText: "Department"),
                  ),
                  const SizedBox(height: 10),

                  DropdownButtonFormField<String>(
                    value: _selectedIndustry!.isEmpty ? null : _selectedIndustry,
                    items: INDUSTRIES.map((val) {
                      return DropdownMenuItem(value: val, child: Text(val));
                    }).toList(),
                    hint: const Text("Industry"),
                    onChanged: (val) => setState(() => _selectedIndustry = val),
                  ),
                  const SizedBox(height: 20),

                  const Divider(),
                  const Text("Intent & Lifestyle",
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),

                  DropdownButtonFormField<String>(
                    value: _selectedRelationshipIntent!.isEmpty
                        ? null
                        : _selectedRelationshipIntent,
                    items: RELATIONSHIP_INTENTS.map((val) {
                      return DropdownMenuItem(value: val, child: Text(val));
                    }).toList(),
                    hint: const Text("Relationship Intent"),
                    onChanged: (val) =>
                        setState(() => _selectedRelationshipIntent = val),
                  ),
                  const SizedBox(height: 10),

                  DropdownButtonFormField<String>(
                    value:
                        _selectedWorkSchedule!.isEmpty
                            ? null
                            : _selectedWorkSchedule,
                    items: WORK_SCHEDULES.map((val) {
                      return DropdownMenuItem(value: val, child: Text(val));
                    }).toList(),
                    hint: const Text("Work Schedule"),
                    onChanged: (val) =>
                        setState(() => _selectedWorkSchedule = val),
                  ),
                  const SizedBox(height: 10),

                  DropdownButtonFormField<String>(
                    value: _selectedNativeLanguage!.isEmpty
                        ? null
                        : _selectedNativeLanguage,
                    items: LANGUAGES.map((val) {
                      return DropdownMenuItem(value: val, child: Text(val));
                    }).toList(),
                    hint: const Text("Native Language"),
                    onChanged: (val) =>
                        setState(() => _selectedNativeLanguage = val),
                  ),
                  const SizedBox(height: 10),

                  DropdownButtonFormField<String>(
                    value: _selectedSmoking!.isEmpty ? null : _selectedSmoking,
                    items: SMOKING_HABITS.map((val) {
                      return DropdownMenuItem(value: val, child: Text(val));
                    }).toList(),
                    hint: const Text("Smoking"),
                    onChanged: (val) => setState(() => _selectedSmoking = val),
                  ),
                  const SizedBox(height: 10),

                  DropdownButtonFormField<String>(
                    value: _selectedDrinking!.isEmpty ? null : _selectedDrinking,
                    items: DRINKING_HABITS.map((val) {
                      return DropdownMenuItem(value: val, child: Text(val));
                    }).toList(),
                    hint: const Text("Drinking"),
                    onChanged: (val) => setState(() => _selectedDrinking = val),
                  ),
                  const SizedBox(height: 10),

                  DropdownButtonFormField<String>(
                    value:
                        _selectedShiftType!.isEmpty ? null : _selectedShiftType,
                    items: SHIFT_TYPES.map((val) {
                      return DropdownMenuItem(value: val, child: Text(val));
                    }).toList(),
                    hint: const Text("Shift Type"),
                    onChanged: (val) => setState(() => _selectedShiftType = val),
                  ),
                  const SizedBox(height: 10),

                  DropdownButtonFormField<String>(
                    value: _selectedExercise!.isEmpty ? null : _selectedExercise,
                    items: EXERCISE_FREQUENCIES.map((val) {
                      return DropdownMenuItem(value: val, child: Text(val));
                    }).toList(),
                    hint: const Text("Exercise"),
                    onChanged: (val) => setState(() => _selectedExercise = val),
                  ),
                  const SizedBox(height: 10),

                  DropdownButtonFormField<String>(
                    value: _selectedSleepSchedule!.isEmpty
                        ? null
                        : _selectedSleepSchedule,
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
                  const SizedBox(height: 10),

                  _buildMultiSelect("Research Interests", RESEARCH_INTERESTS,
                      _selectedResearchInterests),
                  const SizedBox(height: 10),

                  _buildMultiSelect(
                      "Spoken Languages", LANGUAGES, _selectedSpokenLanguages),
                  const SizedBox(height: 30),
                ],
              );
            },
          ),
        ),
      ),
    );
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

  /// Get image from camera / gallery
  void _selectImage({required String imageUrl, required String path}) async {
    await showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => ImageSourceSheet(
        onImageSelected: (image) async {
          if (image != null) {
            /// Show progress dialog
            _pr.show(_i18n.translate("processing"));

            /// Update profile image
            await UserModel().updateProfileImage(
              imageFile: image,
              oldImageUrl: imageUrl,
              path: 'profile',
            );
            // Hide dialog
            _pr.hide();
            // close modal
            Future(() => Navigator.of(context).pop());
          }
        },
      ),
    );
  }

  /// Update profile changes for TextFormField only
  void _saveChanges() {
    /// Update uer profile
    UserModel().updateProfile(
      userSchool: _schoolController.text.trim(),
      userJobTitle: _jobController.text.trim(),
      userBio: _bioController.text.trim(),
      extraData: {
        USER_INSTITUTION: _institutionController.text.trim(),
        USER_UNIVERSITY: _universityController.text.trim(),
        USER_COLLEGE: _collegeController.text.trim(),
        USER_DEGREE: _selectedDegree ?? "",
        USER_COURSE: _courseController.text.trim(),
        USER_STUDY_YEAR: _selectedStudyYear ?? "",
        USER_GRADUATION_YEAR: _graduationYearController.text.trim(),
        USER_ACADEMIC_STATUS: _selectedAcademicStatus ?? "",
        USER_OCCUPATION: _occupationController.text.trim(),
        USER_SPECIALIZATION: _specializationController.text.trim(),
        USER_DEPARTMENT: _departmentController.text.trim(),
        USER_INDUSTRY: _selectedIndustry ?? "",
        USER_FUTURE_GOALS: _selectedFutureGoals,
        USER_RESEARCH_INTERESTS: _selectedResearchInterests,
        USER_NATIVE_LANGUAGE: _selectedNativeLanguage ?? "",
        USER_SPOKEN_LANGUAGES: _selectedSpokenLanguages,
        USER_RELATIONSHIP_INTENT: _selectedRelationshipIntent ?? "",
        USER_WORK_SCHEDULE: _selectedWorkSchedule ?? "",
        USER_SHIFT_TYPE: _selectedShiftType ?? "",
        USER_EXERCISE: _selectedExercise ?? "",
        USER_SMOKING: _selectedSmoking ?? "",
        USER_DRINKING: _selectedDrinking ?? "",
        USER_SLEEP_SCHEDULE: _selectedSleepSchedule ?? "",
        USER_PROFILE_QUALITY_SCORE: UserModel().calculateProfileQualityScore(UserModel().user),
      },
      onSuccess: () {
        /// Show success message
        successDialog(
          context,
          message: _i18n.translate("profile_updated_successfully"),
          positiveAction: () {
            /// Go to profilescreen
            Navigator.of(context).pushReplacement(
              MaterialPageRoute(
                builder: (context) =>
                    ProfileScreen(user: UserModel().user, showButtons: false),
              ),
            );
          },
        );
      },
      onFail: (error) {
        // Debug error
        debugPrint(error);
        // Show error message
        errorDialog(
          context,
          message: _i18n.translate(
            "an_error_occurred_while_updating_your_profile",
          ),
        );
      },
    );
  }
}
