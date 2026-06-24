import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  db, auth
} from '../api/firebase';
import {
  collection, addDoc, query, where, orderBy, onSnapshot,
  serverTimestamp, getDoc, doc
} from 'firebase/firestore';
import {
  AppBar, Toolbar, IconButton, Typography, TextField,
  Box, Avatar, Paper, Chip, Menu, MenuItem
} from '@mui/material';
import { ArrowBack, Send, MoreVert, Block, Flag, VisibilityOff } from '@mui/icons-material';
import type { User } from '../types/user';
import { ChatQualityHelper } from '../utils/chatQualityHelper';
import { useUserStore } from '../store/userStore';
import { BlockedUsersApi } from '../api/blockedUsersApi';
import { ReportDialog } from '../components/ReportDialog';

const Chat = () => {
  const { user_id } = useParams();
  const { user: currentUser } = useUserStore();
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user_id) return;
    getDoc(doc(db, 'users', user_id)).then(s => s.exists() && setOtherUser(s.data() as User));

    const q = query(
      collection(db, 'messages'),
      where('conversationId', 'in', [
        `${auth.currentUser?.uid}_${user_id}`,
        `${user_id}_${auth.currentUser?.uid}`
      ]),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (s) => {
      setMessages(s.docs.map(d => ({ id: d.id, ...d.data() })));
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [user_id]);

  const handleSend = async () => {
    if (!text.trim() || !auth.currentUser || !user_id) return;
    const conversationId = `${auth.currentUser.uid}_${user_id}`;
    await addDoc(collection(db, 'messages'), {
      text: text.trim(),
      senderId: auth.currentUser.uid,
      receiverId: user_id,
      conversationId,
      timestamp: serverTimestamp()
    });
    setText('');
  };

  const handleAction = async (type: string) => {
    setAnchorEl(null);
    if (!currentUser || !user_id) return;

    if (type === 'block') {
       if (window.confirm("Are you sure you want to block this user?")) {
         await BlockedUsersApi.blockUser(currentUser.user_id, user_id);
         alert("User blocked.");
         navigate('/discover');
       }
    } else if (type === 'restrict') {
       await BlockedUsersApi.blockUser(currentUser.user_id, user_id, true);
       alert("Interactions restricted.");
    } else if (type === 'report') {
       setReportOpen(true);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate(-1)}><ArrowBack /></IconButton>
          <Avatar src={otherUser?.user_profile_photo} className="mx-2" />
          <div className="flex-1">
            <Typography variant="subtitle1" className="font-bold">{otherUser?.user_fullname}</Typography>
            <Typography variant="caption" className="text-gray-500">{otherUser?.user_occupation}</Typography>
          </div>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}><MoreVert /></IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
             <MenuItem onClick={() => handleAction('restrict')}><VisibilityOff fontSize="small" className="mr-2"/> Restrict</MenuItem>
             <MenuItem onClick={() => handleAction('block')} className="text-red-600"><Block fontSize="small" className="mr-2"/> Block</MenuItem>
             <MenuItem onClick={() => handleAction('report')}><Flag fontSize="small" className="mr-2"/> Report</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && otherUser && (
          <div className="space-y-6 py-10">
             <div className="text-center space-y-2">
                <Typography variant="h6" className="font-bold">Start a meaningful conversation</Typography>
                <Typography variant="body2" className="text-gray-500">Based on their academic profile:</Typography>
             </div>
             <div className="space-y-3">
                {ChatQualityHelper.getConversationStarters(otherUser).map((s, i) => (
                  <Paper key={i} onClick={() => setText(s)} className="p-3 cursor-pointer hover:bg-primary/5 border border-primary/20 rounded-xl transition-colors">
                    <Typography variant="body2" className="text-primary">{s}</Typography>
                  </Paper>
                ))}
             </div>
             <Typography variant="body2" className="font-bold mt-8">Academic Ice Breakers:</Typography>
             <div className="flex flex-wrap gap-2">
                {ChatQualityHelper.getIceBreakers().map((s, i) => (
                  <Chip key={i} label={s} onClick={() => setText(s)} variant="outlined" className="max-w-full overflow-hidden text-ellipsis" />
                ))}
             </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.senderId === auth.currentUser?.uid ? 'justify-end' : 'justify-start'}`}>
            <Paper className={`p-3 max-w-[80%] rounded-2xl ${m.senderId === auth.currentUser?.uid ? 'bg-primary text-white' : 'bg-white'}`}>
              <Typography variant="body1">{m.text}</Typography>
            </Paper>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <Box className="p-4 bg-white border-t flex gap-2 items-center">
        <TextField
          fullWidth
          placeholder="Type a message..."
          size="small"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="rounded-full"
        />
        <IconButton color="primary" onClick={handleSend} disabled={!text.trim()}><Send /></IconButton>
      </Box>

      {otherUser && currentUser && (
        <ReportDialog
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          offender={otherUser}
          reporter={currentUser}
        />
      )}
    </div>
  );
};

export default Chat;
