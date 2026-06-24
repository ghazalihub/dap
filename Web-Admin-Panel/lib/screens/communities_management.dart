import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dating_app_dashboard/constants/constants.dart';
import 'package:dating_app_dashboard/widgets/my_circular_progress.dart';
import 'package:dating_app_dashboard/widgets/show_scaffold_msg.dart';
import 'package:flutter/material.dart';

class CommunitiesManagementScreen extends StatefulWidget {
  const CommunitiesManagementScreen({Key? key}) : super(key: key);

  @override
  State<CommunitiesManagementScreen> createState() => _CommunitiesManagementScreenState();
}

class _CommunitiesManagementScreenState extends State<CommunitiesManagementScreen> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  final _nameController = TextEditingController();
  final _descController = TextEditingController();
  final _iconController = TextEditingController();
  String _selectedCategory = 'academic';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(title: const Text("Communities Management")),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddDialog,
        child: const Icon(Icons.add),
      ),
      body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
        stream: FirebaseFirestore.instance.collection(C_COMMUNITIES).snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const MyCircularProgress();
          final docs = snapshot.data!.docs;

          return ListView.builder(
            itemCount: docs.length,
            itemBuilder: (context, index) {
              final community = docs[index];
              return ListTile(
                leading: CircleAvatar(child: Text(community['community_icon'])),
                title: Text(community['community_name']),
                subtitle: Text(community['community_category']),
                trailing: IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () => _deleteCommunity(community.id),
                ),
              );
            },
          );
        },
      ),
    );
  }

  void _showAddDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Add New Community"),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: _nameController, decoration: const InputDecoration(labelText: "Name")),
            TextField(controller: _descController, decoration: const InputDecoration(labelText: "Description")),
            TextField(controller: _iconController, decoration: const InputDecoration(labelText: "Icon (Emoji)")),
            DropdownButton<String>(
              value: _selectedCategory,
              items: ['academic', 'professional', 'exam', 'institution'].map((cat) => DropdownMenuItem(value: cat, child: Text(cat))).toList(),
              onChanged: (val) => setState(() => _selectedCategory = val!),
            )
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("CANCEL")),
          ElevatedButton(onPressed: _addCommunity, child: const Text("ADD")),
        ],
      ),
    );
  }

  void _addCommunity() async {
    final id = FirebaseFirestore.instance.collection(C_COMMUNITIES).doc().id;
    await FirebaseFirestore.instance.collection(C_COMMUNITIES).doc(id).set({
      'community_id': id,
      'community_name': _nameController.text.trim(),
      'community_description': _descController.text.trim(),
      'community_icon': _iconController.text.trim(),
      'community_category': _selectedCategory,
      'community_member_count': 0,
    });
    Navigator.pop(context);
    showScaffoldMessage(context: context, scaffoldkey: _scaffoldKey, message: "Community added!");
  }

  void _deleteCommunity(String id) async {
    await FirebaseFirestore.instance.collection(C_COMMUNITIES).doc(id).delete();
    showScaffoldMessage(context: context, scaffoldkey: _scaffoldKey, message: "Community deleted!");
  }
}
