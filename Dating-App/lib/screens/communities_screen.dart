import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dating_app/api/community_api.dart';
import 'package:dating_app/datas/community.dart';
import 'package:dating_app/widgets/my_circular_progress.dart';
import 'package:flutter/material.dart';

class CommunitiesScreen extends StatelessWidget {
  const CommunitiesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Academic Communities"),
      ),
      body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
        stream: CommunityApi().getCommunities(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const MyCircularProgress();

          final docs = snapshot.data!.docs;
          if (docs.isEmpty) {
            return const Center(child: Text("No communities available yet."));
          }

          return GridView.builder(
            padding: const EdgeInsets.all(10),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.8,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
            ),
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final community = Community.fromDocument(docs[index].data());
              return _buildCommunityCard(context, community);
            },
          );
        },
      ),
    );
  }

  Widget _buildCommunityCard(BuildContext context, Community community) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 30,
              backgroundColor: Theme.of(context).primaryColor.withValues(alpha: 0.1),
              child: Text(community.icon, style: const TextStyle(fontSize: 30)),
            ),
            const SizedBox(height: 10),
            Text(
              community.name,
              textAlign: TextAlign.center,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 5),
            Text(
              "${community.memberCount} members",
              style: const TextStyle(color: Colors.grey, fontSize: 12),
            ),
            const Spacer(),
            ElevatedButton(
              onPressed: () => _joinCommunity(context, community.id),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 36),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              child: const Text("Join"),
            )
          ],
        ),
      ),
    );
  }

  void _joinCommunity(BuildContext context, String communityId) async {
    await CommunityApi().joinCommunity(communityId);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Joined community successfully!"))
    );
  }
}
