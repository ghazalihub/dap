import { useState, useEffect } from 'react';
import {
  Typography, Grid2 as Grid, Paper, List, ListItem,
  ListItemAvatar, ListItemText, Avatar, Chip,
  Button, Box, Divider, ListItemButton
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { db } from '../api/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const ModerationCenter = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    const fetchReports = async () => {
      const snap = await getDocs(collection(db, 'reports'));
      setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchReports();
  }, []);

  const handleSanction = async (user_id: string, action: string) => {
    const userRef = doc(db, 'users', user_id);
    let status: 'active' | 'suspended' | 'banned' = 'active';
    let expiry = null;

    if (action === 'suspend') {
      status = 'suspended';
      expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
    } else if (action === 'ban') {
      status = 'banned';
    }

    await updateDoc(userRef, {
      user_status: status,
      sanction_expiry: expiry,
      sanction_reason: "Policy violation reported by community."
    });

    alert(`User ${action}ed successfully.`);
    setSelectedReport(null);
  };

  return (
    <div className="p-6 h-screen flex flex-col">
      <Typography variant="h5" className="font-bold mb-6">Moderation Center</Typography>

      <Grid container spacing={3} className="flex-1 overflow-hidden">
        <Grid size={{ xs: 12, md: 5 }} className="h-full overflow-y-auto">
           <Paper className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
              <List className="p-0">
                 {reports.map((r, i) => (
                   <div key={r.id}>
                     <ListItem disablePadding>
                       <ListItemButton
                         onClick={() => setSelectedReport(r)}
                         selected={selectedReport?.id === r.id}
                         className="py-4"
                       >
                         <ListItemAvatar>
                           <Avatar className="bg-red-50 text-red-500"><Warning fontSize="small" /></Avatar>
                         </ListItemAvatar>
                         <ListItemText
                           primary={<Typography className="font-bold">{r.category}</Typography>}
                           secondary={`Reported by: ${r.reporterName}`}
                         />
                         <Chip label="Pending" size="small" />
                       </ListItemButton>
                     </ListItem>
                     {i < reports.length - 1 && <Divider />}
                   </div>
                 ))}
                 {reports.length === 0 && <Typography className="p-10 text-center text-gray-400">No active reports</Typography>}
              </List>
           </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }} className="h-full">
           {selectedReport ? (
             <Paper className="p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                <Box className="flex justify-between items-start mb-6">
                   <div>
                      <Typography variant="h6" className="font-bold">Report Details</Typography>
                      <Typography variant="caption" className="text-gray-500">Case ID: {selectedReport.id}</Typography>
                   </div>
                   <Chip label={selectedReport.category} color="error" variant="outlined" />
                </Box>

                <div className="space-y-4 flex-1">
                   <Paper className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <Typography variant="subtitle2" className="font-bold mb-1">Reason</Typography>
                      <Typography variant="body2">{selectedReport.reason}</Typography>
                   </Paper>

                   <Box className="flex items-center gap-4 p-4 border rounded-xl">
                      <Avatar src={selectedReport.offenderPhoto} className="w-16 h-16" />
                      <div>
                         <Typography variant="subtitle1" className="font-bold">Offender: {selectedReport.offenderName}</Typography>
                         <Typography variant="caption" className="text-gray-500">Status: Active Member</Typography>
                      </div>
                   </Box>
                </div>

                <Box className="pt-6 border-t mt-6 flex gap-3">
                   <Button variant="outlined" fullWidth onClick={() => setSelectedReport(null)}>Dismiss</Button>
                   <Button variant="contained" color="warning" fullWidth onClick={() => handleSanction(selectedReport.offenderId, 'suspend')}>Suspend (7d)</Button>
                   <Button variant="contained" color="error" fullWidth onClick={() => handleSanction(selectedReport.offenderId, 'ban')}>Permanent Ban</Button>
                </Box>
             </Paper>
           ) : (
             <Box className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl">
                <Typography className="text-gray-400">Select a report to review details</Typography>
             </Box>
           )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ModerationCenter;
