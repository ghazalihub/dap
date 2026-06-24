import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { AdminLogoComponent } from './components/app-logo.component';
import { AdminButtonComponent } from './components/default-button.component';
import { AdminNavigationDrawerComponent } from './components/my_navigation_drawer.component';
import { StatisticCardComponent } from './components/statistic-card.component';
import { UsersPieChartComponent } from './components/users-pie-chart.component';
import { AppVersionControlComponent } from './components/app-version-control.component';
import { UserStatusComponent } from './components/user-status.component';
import { AdminProcessingComponent } from './components/processing.component';
import { AdminCircularProgressComponent } from './components/my-circular-progress.component';
import { InfoTileComponent } from './pages/user-profile-page.component';

// Dialogs
import { CommonDialogComponent } from './services/core/dialog.service';
import { AdminProgressDialogComponent } from './components/progress-dialog.component';

// Pages
import { AdminSignInPageComponent } from './pages/sign-in-page.component';
import { AdminDashboardPageComponent } from './pages/dashboard-page.component';
import { AdminUsersPageComponent } from './pages/users-page.component';
import { AdminUserProfilePageComponent } from './pages/user-profile-page.component';
import { AdminSettingsPageComponent } from './pages/settings-page.component';
import { AdminFlaggedUsersPageComponent } from './pages/flagged-users-page.component';
import { AdminPushNotificationsPageComponent } from './pages/push-notifications-page.component';
import { AdminProfilePageComponent } from './pages/admin-profile-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLogoComponent, AdminButtonComponent, AdminNavigationDrawerComponent,
    StatisticCardComponent, UsersPieChartComponent, AppVersionControlComponent,
    UserStatusComponent, AdminProcessingComponent, AdminCircularProgressComponent,
    CommonDialogComponent, AdminProgressDialogComponent, InfoTileComponent,
    AdminSignInPageComponent, AdminDashboardPageComponent, AdminUsersPageComponent,
    AdminUserProfilePageComponent, AdminSettingsPageComponent, AdminFlaggedUsersPageComponent,
    AdminPushNotificationsPageComponent, AdminProfilePageComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, HttpClientModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideFunctions(() => getFunctions()),
    MatButtonModule, MatIconModule, MatDialogModule, MatListModule, MatCardModule,
    MatFormFieldModule, MatInputModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatMenuModule, MatDividerModule, MatTooltipModule, MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
