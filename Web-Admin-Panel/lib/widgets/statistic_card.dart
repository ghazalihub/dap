import 'package:flutter/material.dart';

class StatisticCard extends StatelessWidget {
  // Variables
  final IconData icon;
  final Color iconBgColor;
  final int total;
  final String description;

  const StatisticCard(
      {Key? key, required this.icon,
      required this.iconBgColor,
      required this.total,
      required this.description}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
        margin: const EdgeInsets.symmetric(vertical: 20, horizontal: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 230,
              padding: const EdgeInsets.all(15.0),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: iconBgColor,
                    child: Icon(icon, color: Colors.white, size: 50),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("$total", style: const TextStyle(fontSize: 25)),
                        Text(description,
                            style: const TextStyle(fontSize: 17, color: Colors.grey))
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ));
  }
}
