import {
  Typography, Box, List, ListItem,
  ListItemAvatar, ListItemText, Avatar,
  Divider, Paper, IconButton
} from '@mui/material';
import { ArrowBack, NotificationsActive } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 pb-24">
      <header className="flex items-center gap-2">
         <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
         <Typography variant="h5" className="font-bold">Notifications</Typography>
      </header>

      <Paper className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm mt-4">
         <List className="p-0">
            {[1,2,3].map((i) => (
              <div key={i}>
                <ListItem className="py-4">
                   <ListItemAvatar>
                      <Avatar className="bg-primary/10 text-primary">
                         <NotificationsActive fontSize="small" />
                      </Avatar>
                   </ListItemAvatar>
                   <ListItemText
                     primary={<Typography variant="body2" className="font-bold text-gray-800">You have a new match!</Typography>}
                     secondary="Someone just liked your profile. Check it out now."
                   />
                   <Typography variant="caption" className="text-gray-400">2h ago</Typography>
                </ListItem>
                {i < 3 && <Divider />}
              </div>
            ))}
         </List>
      </Paper>
    </div>
  );
};

export default Notifications;
