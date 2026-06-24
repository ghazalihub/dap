import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select, MenuItem, Typography
} from '@mui/material';
import { ReportsApi } from '../api/reportsApi';
import type { User } from '../types/user';

interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  offender: User;
  reporter: User;
}

const REPORT_CATEGORIES = [
  'Inappropriate Content',
  'Fake Profile / Scammer',
  'Harassment',
  'Underage',
  'Other'
];

export const ReportDialog = ({ open, onClose, offender, reporter }: ReportDialogProps) => {
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!category || !reason) return;
    setLoading(true);
    try {
      await ReportsApi.reportUser({
        reporterId: reporter.user_id,
        reporterName: reporter.user_fullname,
        offenderId: offender.user_id,
        offenderName: offender.user_fullname,
        offenderPhoto: offender.user_profile_photo,
        category,
        reason
      });
      alert("Report submitted successfully.");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle className="font-bold">Report Profile</DialogTitle>
      <DialogContent className="space-y-4 pt-4">
        <Typography variant="body2" className="text-gray-500 mb-4">
          Tell us why you are reporting {offender.user_fullname}. Your report is anonymous.
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            {REPORT_CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Detailed Reason"
          placeholder="Please provide more details..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={loading || !category || !reason}
        >
          Submit Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};
