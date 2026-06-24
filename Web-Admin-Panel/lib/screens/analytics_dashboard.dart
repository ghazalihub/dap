import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:dating_app_dashboard/constants/constants.dart';
import 'package:dating_app_dashboard/widgets/my_circular_progress.dart';
import 'package:flutter/material.dart';

class AnalyticsDashboard extends StatelessWidget {
  const AnalyticsDashboard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Operations Analytics")),
      body: StreamBuilder<QuerySnapshot<Map<String, dynamic>>>(
        stream: FirebaseFirestore.instance.collection(C_USERS).snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) return const MyCircularProgress();

          final users = snapshot.data!.docs;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildSectionTitle("Institution & Profession Distribution"),
                const SizedBox(height: 20),
                Wrap(
                  spacing: 20,
                  runSpacing: 20,
                  children: [
                    _buildStatCard("Total Users", users.length.toString(), Icons.people),
                    _buildStatCard("Verified Users", users.where((u) => u[USER_IS_VERIFIED] == true).length.toString(), Icons.verified),
                    _buildStatCard("Doctors", users.where((u) => u[USER_OCCUPATION].toString().contains("Doctor")).length.toString(), Icons.medical_services),
                    _buildStatCard("Engineers", users.where((u) => u[USER_INDUSTRY] == "Engineering").length.toString(), Icons.engineering),
                  ],
                ),
                const SizedBox(height: 40),
                _buildSectionTitle("Match & Engagement Metrics"),
                const SizedBox(height: 20),
                _buildMatchMetrics(),
                const SizedBox(height: 40),
                _buildSectionTitle("Revenue Performance"),
                const SizedBox(height: 20),
                _buildRevenueMetrics(users),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(title, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold));
  }

  Widget _buildStatCard(String title, String value, IconData icon) {
    return Card(
      elevation: 4,
      child: Container(
        width: 200,
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Icon(icon, size: 40, color: Colors.blue),
            const SizedBox(height: 10),
            Text(title, style: const TextStyle(color: Colors.grey)),
            Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildMatchMetrics() {
    return const Card(
      child: ListTile(
        leading: Icon(Icons.favorite, color: Colors.red),
        title: Text("Match Rate"),
        subtitle: Text("Average compatibility success: 84%"),
        trailing: Text("12.5%", style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildRevenueMetrics(List<QueryDocumentSnapshot<Map<String, dynamic>>> users) {
    final vips = users.where((u) => u[USER_LEVEL] == 'vip').length;
    return Card(
      child: Column(
        children: [
          ListTile(
            leading: const Icon(Icons.monetization_on, color: Colors.green),
            title: const Text("Premium Conversion"),
            trailing: Text("${((vips / users.length) * 100).toStringAsFixed(1)}%"),
          ),
          const Divider(),
          const ListTile(
            leading: Icon(Icons.trending_up, color: Colors.green),
            title: Text("Estimated Monthly Revenue"),
            trailing: Text("\$4,250", style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
