import { useState } from 'react';
import {
  Typography, TextField, Button, Box,
  Paper, Grid, Chip, List, ListItem,
  ListItemText, ListItemIcon, Divider
} from '@mui/material';
import { Send, History, People, Campaign } from '@mui/icons-material';

const PushNotifications = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSend = () => {
    alert(`Broadcast sent: ${title}`);
    setTitle('');
    setBody('');
  };

  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" className="font-bold mb-6 text-gray-800">Broadcast Center</Typography>

      <Grid container spacing={4}>
         <Grid item xs={12} md={7}>
            <Paper className="p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
               <Box className="flex items-center gap-3 mb-2">
                  <Campaign className="text-primary" />
                  <Typography variant="h6" className="font-bold">New Notification</Typography>
               </Box>

               <TextField
                 fullWidth
                 label="Notification Title"
                 placeholder="e.g. New Feature: Academic Communities!"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
               />
               <TextField
                 fullWidth
                 multiline
                 rows={4}
                 label="Message Body"
                 placeholder="Write your broadcast message here..."
                 value={body}
                 onChange={(e) => setBody(e.target.value)}
               />

               <div className="flex gap-4">
                  <Button variant="outlined" fullWidth className="rounded-xl py-3">Schedule</Button>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="rounded-xl py-3 font-bold"
                    startIcon={<Send />}
                    onClick={handleSend}
                    disabled={!title || !body}
                  >
                    Send to All Members
                  </Button>
               </div>
            </Paper>
         </Grid>

         <Grid item xs={12} md={5}>
            <Paper className="p-6 rounded-3xl border border-gray-100 shadow-sm h-full">
               <Box className="flex items-center justify-between mb-4">
                  <Typography variant="subtitle1" className="font-bold">Sent History</Typography>
                  <History className="text-gray-300" />
               </Box>
               <List className="p-0">
                  {[1,2,3].map(i => (
                    <div key={i}>
                       <ListItem className="px-0 py-4">
                          <ListItemText
                            primary={<Typography className="font-bold text-sm">Exam Season Support</Typography>}
                            secondary="Good luck with your USMLE steps! We are here for you..."
                          />
                          <Chip label="20k sent" size="small" variant="outlined" />
                       </ListItem>
                       {i < 3 && <Divider />}
                    </div>
                  ))}
               </List>
            </Paper>
         </Grid>
      </Grid>
    </div>
  );
};

export default PushNotifications;
