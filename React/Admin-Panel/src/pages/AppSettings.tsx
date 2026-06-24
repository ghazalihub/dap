import { useState } from 'react';
import {
  Typography, TextField, Button, Box,
  Paper, Grid, Switch, Divider, List, ListItem, ListItemText
} from '@mui/material';
import { AppRegistration, Shield, MonetizationOn } from '@mui/icons-material';

const AppSettings = () => {
  return (
    <div className="p-6 space-y-6">
      <Typography variant="h4" className="font-bold mb-6">System Settings</Typography>

      <Grid container spacing={4}>
         <Grid item xs={12} md={6}>
            <Paper className="p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
               <Box className="flex items-center gap-2 mb-2">
                  <Shield className="text-primary" />
                  <Typography variant="h6" className="font-bold">Security & Trust</Typography>
               </Box>

               <List>
                  <ListItem className="px-0">
                     <ListItemText primary="Mandatory Verification" secondary="Require ID verification to like profiles" />
                     <Switch defaultChecked color="primary" />
                  </ListItem>
                  <Divider />
                  <ListItem className="px-0">
                     <ListItemText primary="AI Content Moderation" secondary="Automatically flag inappropriate images" />
                     <Switch defaultChecked color="primary" />
                  </ListItem>
                  <Divider />
                  <ListItem className="px-0">
                     <ListItemText primary="Shadow-ban New Users" secondary="Manual review before discovery" />
                     <Switch color="primary" />
                  </ListItem>
               </List>
            </Paper>
         </Grid>

         <Grid item xs={12} md={6}>
            <Paper className="p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
               <Box className="flex items-center gap-2 mb-2">
                  <MonetizationOn className="text-orange-500" />
                  <Typography variant="h6" className="font-bold">Global Monetization</Typography>
               </Box>

               <div className="space-y-4">
                  <TextField fullWidth label="VIP Price (1 Month)" defaultValue="$14.99" size="small" />
                  <TextField fullWidth label="VIP Price (6 Months)" defaultValue="$59.99" size="small" />
                  <TextField fullWidth label="Verified Discount (%)" defaultValue="20" size="small" />
               </div>

               <Button variant="contained" fullWidth className="rounded-xl py-3 font-bold mt-4">Save Configuration</Button>
            </Paper>
         </Grid>
      </Grid>
    </div>
  );
};

export default AppSettings;
