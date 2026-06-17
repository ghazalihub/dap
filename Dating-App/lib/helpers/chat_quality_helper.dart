import 'package:dating_app/datas/user.dart';

class ChatQualityHelper {
  static List<String> getConversationStarters(User otherUser) {
    List<String> starters = [];

    if (otherUser.userDegree.isNotEmpty) {
      starters.add("What inspired you to pursue a ${otherUser.userDegree}?");
    }

    if (otherUser.userOccupation.isNotEmpty) {
      starters.add("How's your experience been working as a ${otherUser.userOccupation}?");
    }

    if (otherUser.userResearchInterests.isNotEmpty) {
      starters.add("I saw you're interested in ${otherUser.userResearchInterests.first}. What's the most exciting development in that field recently?");
    }

    if (otherUser.userFutureGoals.isNotEmpty) {
      starters.add("Your goal of ${otherUser.userFutureGoals.first} is impressive. How are you planning to achieve it?");
    }

    // Generic fallback if user profile is sparse
    if (starters.isEmpty) {
      starters.add("Hello! I'd love to learn more about your academic journey.");
      starters.add("Hi! What's the most interesting thing you're working on right now?");
    }

    return starters;
  }

  static List<String> getIceBreakers() {
    return [
      "If you could have a conversation with any famous scholar, who would it be?",
      "What's one piece of advice you'd give to someone just starting in your field?",
      "Early bird or night owl for study/work sessions?",
      "What's your go-to productivity hack?",
      "If you weren't in your current profession/degree, what would you be doing?"
    ];
  }
}
