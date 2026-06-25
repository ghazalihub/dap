import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import VerificationQueue from './pages/VerificationQueue';
import ModerationCenter from './pages/ModerationCenter';
import PushNotifications from './pages/PushNotifications';
import AppSettings from './pages/AppSettings';
import UsersScreen from './pages/UsersScreen';
import UserProfileView from './pages/UserProfileView';
import CommunitiesManagement from './pages/CommunitiesManagement';
import InAppPurchases from './pages/InAppPurchases';
import AdminProfile from './pages/AdminProfile';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  Box, Typography, ListItemButton
} from '@mui/material';
import {
  Dashboard, VerifiedUser, Gavel, People, Settings, Groups, MonetizationOn, Person
} from '@mui/icons-material';

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', borderRight: '1px solid #eee' },
          }}
        >
          <Box className="p-6">
            <Typography variant="h6" className="font-bold text-primary">Academic Admin</Typography>
            <Typography variant="caption" className="text-gray-400 font-medium">Operations Center</Typography>
          </Box>

          <Box className="px-4 py-2">
             <Typography variant="caption" className="text-gray-400 uppercase font-bold text-[10px]">Operations</Typography>
             <List>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/dashboard">
                    <ListItemIcon><Dashboard /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/verification">
                    <ListItemIcon><VerifiedUser /></ListItemIcon>
                    <ListItemText primary="Verification" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/notifications">
                    <ListItemIcon><Dashboard /></ListItemIcon>
                    <ListItemText primary="Broadcast" />
                  </ListItemButton>
                </ListItem>
             </List>

             <Typography variant="caption" className="text-gray-400 uppercase font-bold text-[10px] mt-4 block">Management</Typography>
             <List>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/communities">
                    <ListItemIcon><Groups /></ListItemIcon>
                    <ListItemText primary="Communities" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/purchases">
                    <ListItemIcon><MonetizationOn /></ListItemIcon>
                    <ListItemText primary="Revenue" />
                  </ListItemButton>
                </ListItem>
             </List>

             <Typography variant="caption" className="text-gray-400 uppercase font-bold text-[10px] mt-4 block">Trust & Safety</Typography>
             <List>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/moderation">
                    <ListItemIcon><Gavel /></ListItemIcon>
                    <ListItemText primary="Moderation" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/users">
                    <ListItemIcon><People /></ListItemIcon>
                    <ListItemText primary="User Management" />
                  </ListItemButton>
                </ListItem>
             </List>

             <Typography variant="caption" className="text-gray-400 uppercase font-bold text-[10px] mt-4 block">System</Typography>
             <List>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/settings">
                    <ListItemIcon><Settings /></ListItemIcon>
                    <ListItemText primary="Settings" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/admin">
                    <ListItemIcon><Person /></ListItemIcon>
                    <ListItemText primary="Admin Profile" />
                  </ListItemButton>
                </ListItem>
             </List>
          </Box>
        </Drawer>

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/dashboard" element={<AnalyticsDashboard />} />
            <Route path="/verification" element={<VerificationQueue />} />
            <Route path="/moderation" element={<ModerationCenter />} />
            <Route path="/notifications" element={<PushNotifications />} />
            <Route path="/settings" element={<AppSettings />} />
            <Route path="/users" element={<UsersScreen />} />
            <Route path="/user/:user_id" element={<UserProfileView />} />
            <Route path="/communities" element={<CommunitiesManagement />} />
            <Route path="/purchases" element={<InAppPurchases />} />
            <Route path="/admin" element={<AdminProfile />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
