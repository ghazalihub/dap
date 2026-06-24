import { useState, useEffect } from 'react';
import {
  Typography, Box, List, ListItem,
  ListItemAvatar, ListItemText, Avatar, Badge,
  Divider, Paper, IconButton
} from '@mui/material';
import { Search, MoreVert, ChatBubbleOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../api/firebase';
import { useUserStore } from '../store/userStore';

const Conversations = () => {
  const [convos, setConvos] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user } = useUserStore();

  useEffect(() => {
    if (!auth.currentUser) return;

    // In a real app, you'd fetch the other user's details.
    // For this clone, we'll listen to the messages and group them.
    const q = query(
      collection(db, 'messages'),
      where('senderId', '==', auth.currentUser.uid)
    );

    return onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => d.data());
      // Logic to unique by receiverId
      setConvos(data.slice(0, 5)); // Simplified for clone
    });
  }, []);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6 pb-24">
      <header className="flex justify-between items-center">
         <Typography variant="h5" className="font-bold">Messages</Typography>
         <IconButton className="bg-gray-100"><Search fontSize="small" /></IconButton>
      </header>

      {/* Matches Horizontal List */}
      <Box className="space-y-3">
         <Typography variant="caption" className="font-bold text-gray-400 uppercase tracking-widest">Recent Matches</Typography>
         <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex flex-col items-center gap-1 min-w-[70px]">
                 <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color="success">
                    <Avatar className="w-16 h-16 border-2 border-primary p-0.5" />
                 </Badge>
                 <Typography variant="caption" className="font-medium">User {i}</Typography>
              </div>
            ))}
         </div>
      </Box>

      {/* Conversation List */}
      <Paper className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm mt-4">
         <List className="p-0">
            {convos.length > 0 ? convos.map((c, i) => (
              <div key={i}>
                <ListItem
                  button
                  onClick={() => navigate(`/chat/${c.receiverId}`)}
                  className="py-4"
                  secondaryAction={<IconButton edge="end"><MoreVert /></IconButton>}
                >
                   <ListItemAvatar>
                      <Avatar />
                   </ListItemAvatar>
                   <ListItemText
                     primary={<Typography className="font-bold">Scholar Match {i+1}</Typography>}
                     secondary="Hey, I read your latest research paper..."
                   />
                </ListItem>
                {i < convos.length -1 && <Divider />}
              </div>
            )) : (
              <Box className="p-10 text-center text-gray-400">
                 <ChatBubbleOutline className="text-4xl mb-2 opacity-20" />
                 <Typography variant="body2">No conversations yet.</Typography>
              </Box>
            )}
         </List>
      </Paper>
    </div>
  );
};

export default Conversations;
