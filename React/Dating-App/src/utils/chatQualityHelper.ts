import type { User } from '../types/user';

export class ChatQualityHelper {
  static getConversationStarters(otherUser: User): string[] {
    const starters: string[] = [];

    if (otherUser.userDegree) {
      starters.push(`How is your ${otherUser.userDegree} journey going?`);
    }

    if (otherUser.userInstitution) {
      starters.push(`What is the most interesting thing about ${otherUser.userInstitution}?`);
    }

    if (otherUser.userResearchInterests && otherUser.userResearchInterests.length > 0) {
      starters.push(`I noticed you're interested in ${otherUser.userResearchInterests[0]}. Tell me more!`);
    }

    if (otherUser.userOccupation) {
      starters.push(`What inspired you to specialize in ${otherUser.userOccupation}?`);
    }

    if (otherUser.userFutureGoals && otherUser.userFutureGoals.length > 0) {
      starters.push(`Your goal of ${otherUser.userFutureGoals[0]} is very ambitious. How are you working towards it?`);
    }

    return starters.length > 0 ? starters : ["Hi! Tell me about your academic journey."];
  }

  static getIceBreakers(): string[] {
    return [
      "If you could have dinner with any scientist/expert in your field, who would it be?",
      "What is the most challenging research paper you've ever read?",
      "Late-night study sessions: library or coffee shop?",
      "What is your 'holy grail' achievement in your profession?",
      "Digital notes or physical notebooks for your research?"
    ];
  }
}
