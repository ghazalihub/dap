import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SplashPageComponent } from './pages/splash-page.component';
import { SignInPageComponent } from './pages/sign-in-page.component';
import { PhoneNumberPageComponent } from './pages/phone-number-page.component';
import { VerificationCodePageComponent } from './pages/verification-code-page.component';
import { SignUpPageComponent } from './pages/sign-up-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { ChatPageComponent } from './pages/chat-page.component';
import { ProfilePageComponent } from './pages/profile-page.component';
import { EditProfilePageComponent } from './pages/edit-profile-page.component';
import { SettingsPageComponent } from './pages/settings-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', component: SplashPageComponent },
  { path: 'sign-in', component: SignInPageComponent },
  { path: 'phone-number', component: PhoneNumberPageComponent },
  { path: 'verification-code', component: VerificationCodePageComponent },
  { path: 'sign-up', component: SignUpPageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'chat/:id', component: ChatPageComponent },
  { path: 'profile/:id', component: ProfilePageComponent },
  { path: 'edit-profile', component: EditProfilePageComponent },
  { path: 'settings', component: SettingsPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
