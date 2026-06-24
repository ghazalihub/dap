import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminSignInPageComponent } from './pages/sign-in-page.component';
import { AdminDashboardPageComponent } from './pages/dashboard-page.component';
import { AdminUsersPageComponent } from './pages/users-page.component';
import { AdminUserProfilePageComponent } from './pages/user-profile-page.component';
import { AdminSettingsPageComponent } from './pages/settings-page.component';
import { AdminFlaggedUsersPageComponent } from './pages/flagged-users-page.component';
import { AdminPushNotificationsPageComponent } from './pages/push-notifications-page.component';
import { AdminProfilePageComponent } from './pages/admin-profile-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: AdminSignInPageComponent },
  { path: 'dashboard', component: AdminDashboardPageComponent },
  { path: 'users', component: AdminUsersPageComponent },
  { path: 'user-profile/:id', component: AdminUserProfilePageComponent },
  { path: 'app-settings', component: AdminSettingsPageComponent },
  { path: 'flagged-users', component: AdminFlaggedUsersPageComponent },
  { path: 'push-notifications', component: AdminPushNotificationsPageComponent },
  { path: 'admin-profile', component: AdminProfilePageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
