import type { User } from '../types/user';

export class ChatQualityHelper {
  static getConversationStarters(otherUser: User): string[] {
    const starters: string[] = [];

    if (otherUser.user_degree) {
      starters.push(`How is your ${otherUser.user_degree} journey going?`);
    }

    if (otherUser.user_institution) {
      starters.push(`What is the most interesting thing about ${otherUser.user_institution}?`);
    }

    if (otherUser.user_research_interests && otherUser.user_research_interests.length > 0) {
      starters.push(`I noticed you're interested in ${otherUser.user_research_interests[0]}. Tell me more!`);
    }

    if (otherUser.user_occupation) {
      starters.push(`What inspired you to specialize in ${otherUser.user_occupation}?`);
    }

    if (otherUser.user_future_goals && otherUser.user_future_goals.length > 0) {
      starters.push(`Your goal of ${otherUser.user_future_goals[0]} is very ambitious. How are you working towards it?`);
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
