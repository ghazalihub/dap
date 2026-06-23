import { useState, useEffect } from 'react';
import {
  Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, Box
} from '@mui/material';
import { db } from '../api/firebase';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

const VerificationQueue = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchQueue = async () => {
    const q = query(collection(db, 'users'), where('verificationStatus', '==', 'pending'));
    const snap = await getDocs(q);
    setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchQueue(); }, []);

  const handleAction = async (userId: string, status: string, tier: string = 'standard') => {
    await updateDoc(doc(db, 'users', userId), {
      verificationStatus: status,
      userIsVerified: status === 'verified',
      verificationTier: tier,
      profileQualityScore: status === 'verified' ? 80 : 50
    });
    fetchQueue();
    setSelectedUser(null);
  };

  return (
    <div className="p-6">
      <Typography variant="h5" className="font-bold mb-6">Verification Queue</Typography>

      <TableContainer component={Paper} className="rounded-2xl shadow-sm border border-gray-100">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-bold">Member</TableCell>
              <TableCell className="font-bold">Credential Type</TableCell>
              <TableCell className="font-bold">Institution</TableCell>
              <TableCell className="font-bold">Submitted</TableCell>
              <TableCell className="font-bold text-right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Box className="flex items-center gap-3">
                    <Avatar src={row.userProfilePhoto} />
                    <div>
                      <Typography variant="subtitle2" className="font-bold">{row.userFullname}</Typography>
                      <Typography variant="caption" className="text-gray-500">{row.userDegree}</Typography>
                    </div>
                  </Box>
                </TableCell>
                <TableCell><Chip label={row.verificationType || 'Student ID'} size="small" variant="outlined" /></TableCell>
                <TableCell>{row.userInstitution}</TableCell>
                <TableCell>{new Date(row.userRegDate?.seconds * 1000).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="contained" size="small" onClick={() => setSelectedUser(row)}>Review</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle className="font-bold">Review Credentials</DialogTitle>
        <DialogContent className="space-y-4">
          {selectedUser && (
            <div className="space-y-4 pt-4">
              <Box className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <Typography variant="caption" className="text-gray-400">Credential Document View</Typography>
              </Box>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <Typography variant="caption" className="text-gray-400 uppercase font-bold">University</Typography>
                    <Typography variant="body2">{selectedUser.userUniversity}</Typography>
                 </div>
                 <div>
                    <Typography variant="caption" className="text-gray-400 uppercase font-bold">Industry</Typography>
                    <Typography variant="body2">{selectedUser.userIndustry}</Typography>
                 </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => handleAction(selectedUser.id, 'rejected')} color="error">Reject</Button>
          <Button onClick={() => handleAction(selectedUser.id, 'verified')} variant="contained">Verify Standard</Button>
          <Button onClick={() => handleAction(selectedUser.id, 'verified', 'representative')} variant="contained" color="secondary">Verify Rep</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VerificationQueue;
