import { useState, useEffect } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, Box, TextField,
  IconButton, Chip, InputAdornment, Button
} from '@mui/material';
import { Search, Visibility, Edit, Block } from '@mui/icons-material';
import { db } from '../api/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

const UsersScreen = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, 'users'), limit(50));
      const snap = await getDocs(q);
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.userFullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.userInstitution?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Box className="flex justify-between items-center">
         <Typography variant="h4" className="font-bold text-gray-800">User Management</Typography>
         <TextField
           size="small"
           placeholder="Search by name or institution..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           InputProps={{
             startAdornment: (
               <InputAdornment position="start">
                 <Search fontSize="small" />
               </InputAdornment>
             ),
             className: "bg-white rounded-xl shadow-sm border-none"
           }}
         />
      </Box>

      <TableContainer component={Paper} className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-bold">Member</TableCell>
              <TableCell className="font-bold">Status</TableCell>
              <TableCell className="font-bold">Academic Info</TableCell>
              <TableCell className="font-bold">Last Active</TableCell>
              <TableCell className="font-bold text-right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((u) => (
              <TableRow key={u.id} hover>
                <TableCell>
                  <Box className="flex items-center gap-3">
                    <Avatar src={u.userProfilePhoto} className="w-10 h-10" />
                    <div>
                      <Typography variant="subtitle2" className="font-bold">{u.userFullname}</Typography>
                      <Typography variant="caption" className="text-gray-500">{u.userId}</Typography>
                    </div>
                  </Box>
                </TableCell>
                <TableCell>
                   <Chip
                     label={u.userStatus || 'Active'}
                     size="small"
                     color={u.userStatus === 'active' ? 'success' : 'error'}
                     variant="outlined"
                   />
                </TableCell>
                <TableCell>
                   <Typography variant="body2" className="font-medium">{u.userDegree}</Typography>
                   <Typography variant="caption" className="text-gray-400">{u.userInstitution}</Typography>
                </TableCell>
                <TableCell>
                   <Typography variant="caption">{u.userLastLogin?.seconds ? new Date(u.userLastLogin.seconds * 1000).toLocaleDateString() : 'N/A'}</Typography>
                </TableCell>
                <TableCell className="text-right">
                   <IconButton size="small"><Visibility fontSize="small"/></IconButton>
                   <IconButton size="small"><Edit fontSize="small"/></IconButton>
                   <IconButton size="small" color="error"><Block fontSize="small"/></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UsersScreen;
