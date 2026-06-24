import { useState } from 'react';
import {
  TextField, Button, Select, MenuItem, InputLabel, FormControl,
  Chip, Box, Typography, Stepper, Step, StepLabel, LinearProgress
} from '@mui/material';
import {
  ACADEMIC_DEGREES, ACADEMIC_STATUSES,
  INDUSTRIES, FUTURE_GOALS, RESEARCH_INTERESTS,
  RELATIONSHIP_INTENTS, SMOKING_HABITS, SLEEP_SCHEDULES
} from '../constants/predefinedChoices';
import { db, auth, storage } from '../api/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const steps = ['Basic Info', 'Academic Details', 'Professional Life', 'Goals & Interests', 'Lifestyle', 'Profile Photo'];

const Onboarding = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_fullname: '',
    user_gender: '',
    user_bio: '',
    user_degree: '',
    user_university: '',
    userCollege: '',
    user_institution: '',
    user_academic_status: '',
    userStudyYear: '',
    userGraduationYear: '',
    user_occupation: '',
    userSpecialization: '',
    userDepartment: '',
    user_industry: '',
    user_future_goals: [] as string[],
    user_research_interests: [] as string[],
    userLanguages: [] as string[],
    userWorkSchedule: '',
    userShiftType: '',
    userExercise: '',
    userSmoking: '',
    userDrinking: '',
    userSleepSchedule: '',
    user_relationship_intent: '',
  });

  const [photo, setPhoto] = useState<File | null>(null);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name: string, value: string) => {
    setFormData(prev => {
      const current = (prev as any)[name] as string[];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter(i => i !== value) };
      } else {
        return { ...prev, [name]: [...current, value] };
      }
    });
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      let photoUrl = '';
      if (photo) {
        const photoRef = ref(storage, `profiles/${auth.currentUser.uid}/photo.jpg`);
        await uploadBytes(photoRef, photo);
        photoUrl = await getDownloadURL(photoRef);
      }

      const userData = {
        ...formData,
        user_id: auth.currentUser.uid,
        user_profile_photo: photoUrl,
        user_is_verified: false,
        verification_status: 'unverified',
        user_status: 'active',
        profile_quality_score: 50, // Initial score
        userRegDate: serverTimestamp(),
        userLastLogin: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', auth.currentUser.uid), userData);
      navigate('/home');
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <TextField fullWidth label="Full Name" name="user_fullname" value={formData.user_fullname} onChange={handleChange} />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select name="user_gender" value={formData.user_gender} label="Gender" onChange={handleChange}>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth multiline rows={3} label="Bio" name="user_bio" value={formData.user_bio} onChange={handleChange} />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <FormControl fullWidth>
              <InputLabel>Academic Degree</InputLabel>
              <Select name="user_degree" value={formData.user_degree} label="Academic Degree" onChange={handleChange}>
                {ACADEMIC_DEGREES.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField fullWidth label="University" name="user_university" value={formData.user_university} onChange={handleChange} />
            <TextField fullWidth label="College" name="userCollege" value={formData.userCollege} onChange={handleChange} />
            <FormControl fullWidth>
              <InputLabel>Academic Status</InputLabel>
              <Select name="user_academic_status" value={formData.user_academic_status} label="Academic Status" onChange={handleChange}>
                {ACADEMIC_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
             <FormControl fullWidth>
              <InputLabel>Industry</InputLabel>
              <Select name="user_industry" value={formData.user_industry} label="Industry" onChange={handleChange}>
                {INDUSTRIES.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField fullWidth label="Occupation" name="user_occupation" value={formData.user_occupation} onChange={handleChange} />
            <TextField fullWidth label="Specialization" name="userSpecialization" value={formData.userSpecialization} onChange={handleChange} />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Typography variant="subtitle1">Future Goals</Typography>
            <Box className="flex flex-wrap gap-2">
              {FUTURE_GOALS.map(goal => (
                <Chip
                  key={goal}
                  label={goal}
                  onClick={() => handleMultiSelect('user_future_goals', goal)}
                  color={formData.user_future_goals.includes(goal) ? "primary" : "default"}
                />
              ))}
            </Box>
            <Typography variant="subtitle1" className="mt-4">Research Interests</Typography>
            <Box className="flex flex-wrap gap-2">
              {RESEARCH_INTERESTS.map(interest => (
                <Chip
                  key={interest}
                  label={interest}
                  onClick={() => handleMultiSelect('user_research_interests', interest)}
                  color={formData.user_research_interests.includes(interest) ? "primary" : "default"}
                />
              ))}
            </Box>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <FormControl fullWidth>
              <InputLabel>Relationship Intent</InputLabel>
              <Select name="user_relationship_intent" value={formData.user_relationship_intent} label="Relationship Intent" onChange={handleChange}>
                {RELATIONSHIP_INTENTS.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Sleep Schedule</InputLabel>
              <Select name="userSleepSchedule" value={formData.userSleepSchedule} label="Sleep Schedule" onChange={handleChange}>
                {SLEEP_SCHEDULES.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Smoking Habits</InputLabel>
              <Select name="userSmoking" value={formData.userSmoking} label="Smoking Habits" onChange={handleChange}>
                {SMOKING_HABITS.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
              </Select>
            </FormControl>
          </div>
        );
      case 5:
        return (
          <div className="text-center space-y-4">
            <Typography>Upload your professional profile photo</Typography>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
            {photo && <img src={URL.createObjectURL(photo)} alt="Preview" className="w-32 h-32 rounded-full mx-auto object-cover" />}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 min-h-screen bg-white">
      <Typography variant="h5" className="font-bold mb-6 text-primary">Complete Your Academic Profile</Typography>
      <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="min-h-[400px]">
        {renderStepContent(activeStep)}
      </div>

      <div className="flex justify-between mt-8">
        <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
        {activeStep === steps.length - 1 ? (
          <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Finish"}
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
        )}
      </div>
      {loading && <LinearProgress className="mt-4" />}
    </div>
  );
};

export default Onboarding;
