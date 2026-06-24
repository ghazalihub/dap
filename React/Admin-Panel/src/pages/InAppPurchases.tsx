import { useState } from 'react';
import {
  Typography, Box, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, Avatar, Button, Grid
} from '@mui/material';
import { ShoppingBag, MonetizationOn, TrendingUp } from '@mui/icons-material';

const InAppPurchases = () => {
  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" className="font-bold text-gray-800">Monetization Hub</Typography>

      <Grid container spacing={3}>
         <Grid item xs={12} md={4}>
            <Paper className="p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
               <MonetizationOn className="text-orange-400 text-4xl mb-2" />
               <Typography variant="h4" className="font-black">$12,450</Typography>
               <Typography variant="caption" className="text-gray-400 uppercase font-bold tracking-widest">MTD Revenue</Typography>
            </Paper>
         </Grid>
         <Grid item xs={12} md={4}>
            <Paper className="p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
               <TrendingUp className="text-green-500 text-4xl mb-2" />
               <Typography variant="h4" className="font-black">840</Typography>
               <Typography variant="caption" className="text-gray-400 uppercase font-bold tracking-widest">Active Subs</Typography>
            </Paper>
         </Grid>
         <Grid item xs={12} md={4}>
            <Paper className="p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
               <ShoppingBag className="text-primary text-4xl mb-2" />
               <Typography variant="h4" className="font-black">12%</Typography>
               <Typography variant="caption" className="text-gray-400 uppercase font-bold tracking-widest">Conv. Rate</Typography>
            </Paper>
         </Grid>
      </Grid>

      <TableContainer component={Paper} className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell className="font-bold">Subscriber</TableCell>
              <TableCell className="font-bold">Plan</TableCell>
              <TableCell className="font-bold">Status</TableCell>
              <TableCell className="font-bold">Amount</TableCell>
              <TableCell className="font-bold text-right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1,2,3,4,5].map((i) => (
              <TableRow key={i} hover>
                <TableCell>
                  <Box className="flex items-center gap-3">
                    <Avatar className="w-8 h-8" />
                    <Typography variant="subtitle2" className="font-bold">Scholar {i}</Typography>
                  </Box>
                </TableCell>
                <TableCell><Chip label="12 Months" size="small" variant="outlined" /></TableCell>
                <TableCell><Chip label="Active" size="small" color="success" /></TableCell>
                <TableCell className="font-bold">$89.99</TableCell>
                <TableCell className="text-right text-gray-400">June {10+i}, 2026</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default InAppPurchases;
