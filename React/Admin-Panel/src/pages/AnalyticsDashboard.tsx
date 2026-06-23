import { useState, useEffect } from 'react';
import {
  Typography, Grid2 as Grid, Paper, Box, CircularProgress,
  Chip
} from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {
  TrendingUp, People, School, MonetizationOn
} from '@mui/icons-material';
import { db } from '../api/firebase';
import { collection, getDocs } from 'firebase/firestore';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const users = usersSnap.docs.map(d => d.data());

        const totalUsers = users.length;
        const verifiedUsers = users.filter((u: any) => u.userIsVerified).length;

        // Calculate Institution Stats
        const instMap: any = {};
        users.forEach((u: any) => {
          if (u.userInstitution) instMap[u.userInstitution] = (instMap[u.userInstitution] || 0) + 1;
        });
        const institutionData = Object.entries(instMap).map(([name, value]) => ({ name, value })).slice(0, 5);

        // Calculate Profession Stats
        const profMap: any = {};
        users.forEach((u: any) => {
          if (u.userIndustry) profMap[u.userIndustry] = (profMap[u.userIndustry] || 0) + 1;
        });
        const professionData = Object.entries(profMap).map(([name, value]) => ({ name, value })).slice(0, 5);

        setStats({
          totalUsers,
          verifiedUsers,
          institutionData,
          professionData,
          growthData: [
            { name: 'Mon', users: 10 },
            { name: 'Tue', users: 25 },
            { name: 'Wed', users: 45 },
            { name: 'Thu', users: 70 },
            { name: 'Fri', users: 85 },
          ]
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Box className="flex justify-center p-10"><CircularProgress /></Box>;
  if (!stats) return <Typography>Error loading stats</Typography>;

  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" className="font-bold mb-6">Operations Center</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Total Members" value={stats.totalUsers} icon={<People color="primary" />} trend="+12%" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Verified Scholars" value={stats.verifiedUsers} icon={<School color="secondary" />} trend="+5%" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Active Matches" value="1.2k" icon={<TrendingUp sx={{ color: '#4caf50' }} />} trend="+18%" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard title="Revenue" value="$4,500" icon={<MonetizationOn sx={{ color: '#ff9800' }} />} trend="+22%" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper className="p-6 rounded-2xl shadow-sm border border-gray-100">
            <Typography variant="h6" className="font-bold mb-4">User Growth</Typography>
            <Box className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.growthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#E91E63" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
           <Paper className="p-6 rounded-2xl shadow-sm border border-gray-100 h-full">
              <Typography variant="h6" className="font-bold mb-4">Top Institutions</Typography>
              <div className="space-y-4">
                {stats.institutionData.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <Typography variant="body2" className="text-gray-600">{item.name}</Typography>
                    <Chip label={String(item.value)} size="small" color="primary" variant="outlined" />
                  </div>
                ))}
              </div>
           </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
           <Paper className="p-6 rounded-2xl shadow-sm border border-gray-100">
              <Typography variant="h6" className="font-bold mb-4">Industry Distribution</Typography>
              <Box className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.professionData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3f51b5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
           </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend }: any) => (
  <Paper className="p-5 rounded-2xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start mb-2">
      <Box className="p-2 rounded-xl bg-gray-50">{icon}</Box>
      <Typography variant="caption" className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">{trend}</Typography>
    </div>
    <Typography variant="h4" className="font-bold">{value}</Typography>
    <Typography variant="caption" className="text-gray-500 font-medium">{title}</Typography>
  </Paper>
);

export default AnalyticsDashboard;
