# Codebase Audit Report & Improvement Roadmap

## 1. Executive Summary
The existing codebase is a functional "Tinder-style" dating application built with Flutter and Firebase. While it provides a solid foundation for swiping, matching, and chatting, it is currently a generic template and lacks the necessary features, security, and professional "feel" required for an academic-focused platform for ambitious students and professionals. Significant technical debt exists in the discovery logic that will hinder scalability.

---

## 2. Technical Audit Findings

### 2.1 Architecture & State Management
- **State Management:** Uses `ScopedModel`, which is functional but considered legacy in the Flutter ecosystem. The implementation relies on Singletons (`AppModel`, `UserModel`), which makes testing difficult and can lead to side effects.
- **Folder Structure:** Organized by type (api, screens, widgets), but lacks modularity. As features grow (verification, advanced profiles), this structure will become cluttered.
- **Dependency Management:** Many dependencies are outdated. `scoped_model`, `carousel_pro`, and `geoflutterfire` (local) could be replaced with more modern equivalents.

### 2.2 Discovery & Matching Logic (Critical Scalability Risk)
- **In-Memory Filtering:** The `UsersApi.getUsers` method fetches all users within a geographic radius and then filters by gender, age, likes, dislikes, and blocked status **in-memory**.
- **Scalability Impact:** As the user base grows to thousands or millions, fetching and filtering all nearby users on every "Discover" tab load will cause extreme lag, high data usage, and potential app crashes.
- **Matching:** Simple reciprocal liking. No compatibility or interest-based matching.

### 2.3 Authentication & Onboarding
- **Verification Gaps:** Authentication is limited to Firebase Phone Auth (SMS). There is no verification of academic or professional credentials.
- **Onboarding Flow:** Generic and short. Doesn't collect enough data to create high-quality matches for professionals (e.g., degree level, specific field of study).
- **Trust & Safety:** The "Verified" badge is currently tied to VIP subscription status rather than actual identity or credential verification.

### 2.4 Data Model (`User` object)
- Fields are too basic: `userSchool` and `userJobTitle` are simple strings.
- Missing fields for: Degree Level (PhD, MD, JD, etc.), Research Interests, Professional Category, LinkedIn Profile, and Verified Credentials.

### 2.5 Web Admin Panel
- **Basic Functionality:** Provides simple user management and flagging.
- **Missing Features:** No workflow for manual verification of degrees, IDs, or professional certifications. The flagging system is disconnected from the user profile view (requires manual ID copying).

---

## 3. Security & Trust Audit
- **Security Rules:** API structure suggests heavy reliance on client-side filtering. If Firestore rules are not properly configured, any user could theoretically query the entire `Users` collection.
- **Trust & Safety:** Basic reporting/blocking is present, but no automated moderation or AI-driven safety features.

---

## 4. Improvement Roadmap (Phase 2)

### 4.1 "Academic" Identity Transformation
- **Credential Verification:**
    - Implement Academic Email (.edu / .ac.uk) verification.
    - Add a document upload system (Degree/Professional ID) for manual admin verification.
- **Enhanced Professional Profiles:**
    - Structured fields for: Degree Level, Field of Study, Institution, and Professional Industry.
    - Integration with LinkedIn API for professional profile syncing.

### 4.2 Matching & Discovery Optimization
- **Backend Filtering:** Refactor discovery logic to use more efficient Firestore queries or Cloud Functions to reduce in-memory filtering.
- **Compatibility Matching:** Introduce "Professional Compatibility" filters (e.g., "Only show PhDs/Doctors" or "People in STEM").

### 4.3 UI/UX Professionalization
- **Theme Update:** Replace the "Pink" palette with a more sophisticated and professional color scheme (Navy Blue, Emerald, or Slate).
- **Typography:** Update to clean, modern fonts suitable for an academic audience.
- **Badging System:** Introduce tiered badges (Verified Student, Verified Professional, Verified Researcher).

### 4.4 Admin Panel Upgrades
- **Verification Queue:** Create a dedicated screen for admins to review and approve/reject academic credentials and ID documents.
- **Audit Logs:** Track admin actions for better accountability.

### 4.5 Technical Debt Reduction
- **Migration Plan:** Gradually move from `ScopedModel` to a more robust state management solution (like `Provider` or `Bloc`) if major feature additions require it.
- **Refactoring:** Clean up the `UsersApi` to handle complex queries and caching.

---

## 5. Proposed Next Steps
1. **Database Schema Update:** Add academic/professional fields to the Firestore `Users` collection.
2. **Onboarding Refactor:** Update the Sign-Up flow to collect and verify academic data.
3. **Admin Verification Flow:** Implement the backend and frontend for manual credential approval.
4. **Discovery Refactor:** Optimize the matching logic for performance and professional filtering.
