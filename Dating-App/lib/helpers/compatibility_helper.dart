import 'package:dating_app/datas/user.dart';

class CompatibilityResult {
  final int score;
  final List<String> explanations;

  CompatibilityResult({required this.score, required this.explanations});
}

class CompatibilityHelper {
  static CompatibilityResult calculate(User currentUser, User otherUser) {
    int totalScore = 0;
    List<String> explanations = [];

    // 1. Education Similarity (20 points)
    if (currentUser.userDegree == otherUser.userDegree && currentUser.userDegree.isNotEmpty) {
      totalScore += 20;
      explanations.add("You both are pursuing or hold a ${currentUser.userDegree} degree.");
    } else if (currentUser.userUniversity == otherUser.userUniversity && currentUser.userUniversity.isNotEmpty) {
      totalScore += 15;
      explanations.add("You both attended ${currentUser.userUniversity}.");
    }

    // 2. Career & Industry (20 points)
    if (currentUser.userIndustry == otherUser.userIndustry && currentUser.userIndustry.isNotEmpty) {
      totalScore += 20;
      explanations.add("You both work in the ${currentUser.userIndustry} industry.");
    }

    // 3. Relationship Intent (20 points)
    if (currentUser.userRelationshipIntent == otherUser.userRelationshipIntent && currentUser.userRelationshipIntent.isNotEmpty) {
      totalScore += 20;
      explanations.add("You both are looking for a ${currentUser.userRelationshipIntent.toLowerCase()}.");
    }

    // 4. Future Goals Overlap (15 points)
    List<String> commonGoals = currentUser.userFutureGoals
        .where((goal) => otherUser.userFutureGoals.contains(goal))
        .toList();
    if (commonGoals.isNotEmpty) {
      totalScore += 15;
      explanations.add("You both share future goals in ${commonGoals.join(', ')}.");
    }

    // 5. Research Interests Overlap (15 points)
    List<String> commonInterests = currentUser.userResearchInterests
        .where((interest) => otherUser.userResearchInterests.contains(interest))
        .toList();
    if (commonInterests.isNotEmpty) {
      totalScore += 15;
      explanations.add("You both are interested in ${commonInterests.join(', ')}.");
    }

    // 6. Lifestyle (10 points)
    if (currentUser.userSmoking == otherUser.userSmoking && currentUser.userSmoking.isNotEmpty) {
      totalScore += 5;
    }
    if (currentUser.userDrinking == otherUser.userDrinking && currentUser.userDrinking.isNotEmpty) {
      totalScore += 5;
    }
    if (currentUser.userSmoking == otherUser.userSmoking && currentUser.userDrinking == otherUser.userDrinking && currentUser.userSmoking.isNotEmpty) {
        explanations.add("You have similar lifestyle habits.");
    }

    // Baseline score to ensure a minimum for verified profiles
    if (totalScore < 30) totalScore = 30 + (totalScore % 20);
    if (totalScore > 100) totalScore = 100;

    return CompatibilityResult(score: totalScore, explanations: explanations);
  }
}
