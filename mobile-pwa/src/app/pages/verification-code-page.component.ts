import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/core/auth.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { MobileDialogService } from '../services/core/mobile-dialog.service';
import { ProgressDialogComponent } from '../components/progress-dialog.component';

@Component({
  selector: 'app-verification-code',
  template: `
    <div class="h-screen w-screen bg-primary flex flex-col items-center justify-center p-8 text-white">
      <div class="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-8">
        <mat-icon class="text-primary text-5xl">phone_iphone</mat-icon>
      </div>

      <h2 class="text-2xl font-bold mb-4">{{ i18n.translate('verification_code') }}</h2>
      <p class="text-center opacity-90 mb-12">
        {{ i18n.translate('please_enter_the_sms_code_sent') }}
      </p>

      <!-- Pin Input Placeholder -->
      <div class="flex space-x-2 mb-12">
        <input *ngFor="let i of [0,1,2,3,4,5]; let idx = index"
               type="tel" maxlength="1"
               class="w-12 h-14 text-center text-2xl font-bold text-black rounded-lg outline-none"
               [(ngModel)]="otpDigits[idx]"
               (keyup)="onDigitInput($event, idx)">
      </div>

      <button mat-flat-button class="bg-white text-primary rounded-full px-12 py-3 text-lg font-bold"
              [disabled]="!isOtpComplete()"
              (click)="validateOtp()">
        VERIFY
      </button>
    </div>
  `
})
export class VerificationCodePageComponent implements OnInit {
  verificationId: string = '';
  otpDigits: string[] = ['', '', '', '', '', ''];

  constructor(
    public i18n: AppLocalizations,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private mobileDialogService: MobileDialogService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.verificationId = navigation.extras.state['verificationId'];
    }
  }

  ngOnInit() {
    if (!this.verificationId) {
      this.router.navigate(['/sign-in']);
    }
  }

  onDigitInput(event: any, index: number) {
     if (event.target.value && index < 5) {
        (event.target.nextElementSibling as HTMLInputElement)?.focus();
     }
  }

  isOtpComplete() {
    return this.otpDigits.every(d => d !== '');
  }

  async validateOtp() {
    const otp = this.otpDigits.join('');

    const prRef = this.dialog.open(ProgressDialogComponent, {
      data: { message: this.i18n.translate('processing') },
      disableClose: true
    });

    try {
      await this.authService.signInWithOTP({
        verificationId: this.verificationId,
        otp,
        checkUserAccount: () => {
          this.authService.authUserAccount({
            homeScreen: () => { prRef.close(); this.router.navigate(['/home']); },
            signUpScreen: () => { prRef.close(); this.router.navigate(['/sign-up']); },
            updateLocationScreen: () => { prRef.close(); this.router.navigate(['/update-location']); }
          });
        },
        onError: () => {
          prRef.close();
          this.mobileDialogService.errorDialog(this.i18n.translate('we_were_unable_to_verify_your_number'));
        }
      });
    } catch (e) {
      prRef.close();
      console.error(e);
    }
  }
}
