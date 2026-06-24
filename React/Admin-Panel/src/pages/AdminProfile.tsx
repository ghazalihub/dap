import {
  Typography, Box, Avatar, Paper,
  Button, List, ListItem, ListItemIcon,
  ListItemText, Divider, Chip
} from '@mui/material';
import { Logout, Shield, Speed } from '@mui/icons-material';
import { auth } from '../api/firebase';

const AdminProfile = () => {
  return (
    <div className="p-12 max-w-4xl">
       <Box className="flex items-center gap-6 mb-12">
          <Avatar className="w-24 h-24 bg-primary text-3xl font-bold">A</Avatar>
          <div>
             <Typography variant="h4" className="font-bold">System Administrator</Typography>
             <Typography variant="body1" className="text-gray-500">Connect Platform Operations</Typography>
             <Chip label="Super Admin" color="primary" size="small" className="mt-2 font-bold" />
          </div>
       </Box>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Paper className="p-8 rounded-[2rem] border border-gray-100 shadow-sm">
             <Typography variant="h6" className="font-bold mb-6">Security Settings</Typography>
             <List>
                <ListItem className="px-0">
                   <ListItemIcon><Shield color="primary" /></ListItemIcon>
                   <ListItemText primary="Two-Factor Auth" secondary="Enabled via SMS" />
                </ListItem>
                <Divider />
                <ListItem className="px-0">
                   <ListItemIcon><Speed color="secondary" /></ListItemIcon>
                   <ListItemText primary="Action Thresholds" secondary="Auto-flag after 5 reports" />
                </ListItem>
             </List>
          </Paper>

          <Paper className="p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between">
             <div>
                <Typography variant="h6" className="font-bold mb-2">Operations</Typography>
                <Typography variant="body2" className="text-gray-500 mb-6">Manage your administrative credentials and session.</Typography>
             </div>
             <Button
               variant="outlined"
               color="error"
               fullWidth
               className="rounded-xl py-3 font-bold"
               startIcon={<Logout />}
               onClick={() => auth.signOut()}
             >
                Sign Out from Panel
             </Button>
          </Paper>
       </div>
    </div>
  );
};

export default AdminProfile;
