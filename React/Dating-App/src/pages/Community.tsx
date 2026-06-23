import { useState } from 'react';
import {
  Typography, Card, CardContent,
  Box, Avatar, Button, Paper
} from '@mui/material';
import {
  Business, Science, Engineering,
  HealthAndSafety, Gavel, Biotech
} from '@mui/icons-material';

const COMMUNITY_LIST = [
  { id: 'mbbs', name: 'MBBS & Doctors', icon: <HealthAndSafety />, color: '#f44336' },
  { id: 'eng', name: 'Engineering', icon: <Engineering />, color: '#2196f3' },
  { id: 'research', name: 'Researchers', icon: <Science />, color: '#4caf50' },
  { id: 'law', name: 'Law Students', icon: <Gavel />, color: '#795548' },
  { id: 'pharma', name: 'Pharmacists', icon: <Biotech />, color: '#9c27b0' },
  { id: 'biz', name: 'MBA & Business', icon: <Business />, color: '#ff9800' },
];

const Community = () => {
  const [selected, setSelected] = useState('mbbs');

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 pb-20">
      <header>
        <Typography variant="h5" className="font-bold text-primary">Academic Communities</Typography>
        <Typography variant="body2" className="text-gray-500">Discover peers and matches within specialized fields.</Typography>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {COMMUNITY_LIST.map((c) => (
          <Card
            key={c.id}
            onClick={() => setSelected(c.id)}
            className={`cursor-pointer rounded-2xl transition-all ${selected === c.id ? 'ring-2 ring-primary border-primary' : 'border-gray-200'}`}
            elevation={selected === c.id ? 4 : 1}
          >
            <CardContent className="flex flex-col items-center text-center py-6">
              <Box className="p-3 rounded-full mb-3" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                {c.icon}
              </Box>
              <Typography variant="subtitle2" className="font-bold">{c.name}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <Box className="mt-8">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" className="font-bold">Recent Members</Typography>
          <Button size="small" variant="text" color="primary">See All</Button>
        </Box>

        <Box className="space-y-4">
           {[1, 2, 3].map((i) => (
             <Paper key={i} className="p-3 rounded-xl border border-gray-100 flex items-center gap-3">
                <Avatar className="w-12 h-12" />
                <div className="flex-1">
                   <Typography variant="subtitle2" className="font-bold">Dr. Academic User {i}</Typography>
                   <Typography variant="caption" className="text-gray-500">Specialist @ University Hospital</Typography>
                </div>
                <Button size="small" variant="outlined" className="rounded-full">View</Button>
             </Paper>
           ))}
        </Box>
      </Box>

      <Box className="bg-primary/5 p-6 rounded-2xl border border-primary/10 text-center">
         <Typography variant="subtitle1" className="font-bold text-primary mb-2">Institutional SSO Verification</Typography>
         <Typography variant="body2" className="text-gray-600 mb-4">Are you a student? Use your .edu email to instantly verify your profile.</Typography>
         <Button variant="contained" color="primary" className="rounded-full px-8">Verify via SSO</Button>
      </Box>
    </div>
  );
};

export default Community;
