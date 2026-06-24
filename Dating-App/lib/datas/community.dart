class Community {
  final String id;
  final String name;
  final String description;
  final String category; // academic, professional, exam, institution
  final String icon;
  final int memberCount;

  Community({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.icon,
    this.memberCount = 0,
  });

  factory Community.fromDocument(Map<String, dynamic> doc) {
    return Community(
      id: doc['community_id'] ?? '',
      name: doc['community_name'] ?? '',
      description: doc['community_description'] ?? '',
      category: doc['community_category'] ?? '',
      icon: doc['community_icon'] ?? '',
      memberCount: doc['community_member_count'] ?? 0,
    );
  }
}
