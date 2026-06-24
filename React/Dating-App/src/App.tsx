import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Onboarding from './pages/Onboarding';
import Discover from './pages/Discover';
import Chat from './pages/Chat';
import Community from './pages/Community';
import Premium from './pages/Premium';
import Profile from './pages/Profile';
import Conversations from './pages/Conversations';
import BlockedAccount from './pages/BlockedAccount';
import Notifications from './pages/Notifications';
import { auth, db } from './api/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Search, ChatBubble, People, Person, Star } from '@mui/icons-material';
import { useUserStore } from './store/userStore';
import { AnimatePresence, motion } from 'framer-motion';
import type { User } from './types/user';

const App = () => {
  const { setUser, user } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const snap = await getDoc(doc(db, 'users', u.uid));
        if (snap.exists()) {
          setUser(snap.data() as User);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser]);

  if (loading) return null;

  if (user && user.userStatus !== 'active') {
    return <BlockedAccount user={user} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-16 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/signin" element={<PageWrapper><SignIn /></PageWrapper>} />
            <Route path="/onboarding" element={<PageWrapper><Onboarding /></PageWrapper>} />
            <Route path="/discover" element={user ? <PageWrapper><Discover /></PageWrapper> : <Navigate to="/signin" />} />
            <Route path="/chat/:userId" element={user ? <PageWrapper><Chat /></PageWrapper> : <Navigate to="/signin" />} />
            <Route path="/community" element={user ? <PageWrapper><Community /></PageWrapper> : <Navigate to="/signin" />} />
            <Route path="/premium" element={user ? <PageWrapper><Premium /></PageWrapper> : <Navigate to="/signin" />} />
            <Route path="/profile" element={user ? <PageWrapper><Profile /></PageWrapper> : <Navigate to="/signin" />} />
            <Route path="/conversations" element={user ? <PageWrapper><Conversations /></PageWrapper> : <Navigate to="/signin" />} />
            <Route path="/notifications" element={user ? <PageWrapper><Notifications /></PageWrapper> : <Navigate to="/signin" />} />
            <Route path="/" element={<Navigate to="/discover" />} />
          </Routes>
        </AnimatePresence>

        {user && (
          <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
            <BottomNavigation
              showLabels
              value={window.location.pathname.split('/')[1] || 'discover'}
              onChange={(_, newValue) => {
                window.location.href = `/${newValue}`;
              }}
            >
              <BottomNavigationAction label="Discover" value="discover" icon={<Search />} />
              <BottomNavigationAction label="Community" value="community" icon={<People />} />
              <BottomNavigationAction label="Chat" value="conversations" icon={<ChatBubble />} />
              <BottomNavigationAction label="Premium" value="premium" icon={<Star />} />
              <BottomNavigationAction label="Profile" value="profile" icon={<Person />} />
            </BottomNavigation>
          </Paper>
        )}
      </div>
    </Router>
  );
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);

export default App;
