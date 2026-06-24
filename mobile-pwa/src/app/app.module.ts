import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Components
import { AppLogoComponent } from './components/app-logo.component';
import { DefaultButtonComponent } from './components/default-button.component';
import { ChatMessageComponent } from './components/chat-message.component';
import { CircleButtonComponent } from './components/circle-button.component';
import { CustomBadgeComponent } from './components/custom-badge.component';
import { GalleryImageCardComponent } from './components/gallery-image-card.component';
import { LoadingCardComponent } from './components/loading-card.component';
import { MyCircularProgressComponent } from './components/my-circular-progress.component';
import { NoDataComponent } from './components/no-data.component';
import { NotificationCounterComponent } from './components/notification-counter.component';
import { ProcessingComponent } from './components/processing.component';
import { ProfileBasicInfoCardComponent } from './components/profile-basic-info-card.component';
import { ProfileCardComponent } from './components/profile-card.component';
import { ProfileStatisticsCardComponent } from './components/profile-statistics-card.component';
import { SvgIconComponent } from './components/svg-icon.component';
import { UserGalleryComponent } from './components/user-gallery.component';
import { UsersGridComponent } from './components/users-grid.component';
import { VipAccountCardComponent } from './components/vip-account-card.component';

// Dialogs
import { FlagUserDialogComponent } from './components/flag-user-dialog.component';
import { ItsMatchDialogComponent } from './components/its-match-dialog.component';
import { ProgressDialogComponent } from './components/progress-dialog.component';
import { ReportDialogComponent } from './components/report-dialog.component';
import { ShowMeDialogComponent } from './components/show-me-dialog.component';
import { VipDialogComponent } from './components/vip-dialog.component';
import { MobileCommonDialogComponent } from './services/core/mobile-dialog.service';

// Pages
import { SplashPageComponent } from './pages/splash-page.component';
import { SignInPageComponent } from './pages/sign-in-page.component';
import { PhoneNumberPageComponent } from './pages/phone-number-page.component';
import { VerificationCodePageComponent } from './pages/verification-code-page.component';
import { SignUpPageComponent } from './pages/sign-up-page.component';
import { HomePageComponent } from './pages/home-page.component';
import { DiscoverTabComponent } from './pages/discover-tab.component';
import { MatchesTabComponent, MatchCardWrapperComponent } from './pages/matches-tab.component';
import { ConversationsTabComponent } from './pages/conversations-tab.component';
import { ProfileTabComponent } from './pages/profile-tab.component';
import { ChatPageComponent } from './pages/chat-page.component';
import { ProfilePageComponent } from './pages/profile-page.component';
import { EditProfilePageComponent } from './pages/edit-profile-page.component';
import { SettingsPageComponent } from './pages/settings-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AppLogoComponent, DefaultButtonComponent, ChatMessageComponent, CircleButtonComponent,
    CustomBadgeComponent, GalleryImageCardComponent, LoadingCardComponent, MyCircularProgressComponent,
    NoDataComponent, NotificationCounterComponent, ProcessingComponent, ProfileBasicInfoCardComponent,
    ProfileCardComponent, ProfileStatisticsCardComponent, SvgIconComponent, UserGalleryComponent,
    UsersGridComponent, VipAccountCardComponent,
    FlagUserDialogComponent, ItsMatchDialogComponent, ProgressDialogComponent, ReportDialogComponent,
    ShowMeDialogComponent, VipDialogComponent, MobileCommonDialogComponent,
    SplashPageComponent, SignInPageComponent, PhoneNumberPageComponent, VerificationCodePageComponent,
    SignUpPageComponent, HomePageComponent, DiscoverTabComponent, MatchesTabComponent,
    MatchCardWrapperComponent, ConversationsTabComponent, ProfileTabComponent, ChatPageComponent,
    ProfilePageComponent, EditProfilePageComponent, SettingsPageComponent
  ],
  imports: [
    BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule, BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideMessaging(() => getMessaging()),
    provideFunctions(() => getFunctions()),
    MatButtonModule, MatIconModule, MatDialogModule, MatListModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatRadioModule, MatCheckboxModule, MatSliderModule,
    MatSlideToggleModule, MatBottomSheetModule, MatMenuModule, MatProgressSpinnerModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
