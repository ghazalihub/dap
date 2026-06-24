import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/core/auth.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { MobileDialogService } from '../services/core/mobile-dialog.service';
import { ProgressDialogComponent } from '../components/progress-dialog.component';

@Component({
  selector: 'app-phone-number',
  template: `
    <div class="h-full flex flex-col bg-white">
      <header class="flex items-center p-4 border-b">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="text-lg font-medium ml-4">{{ i18n.translate('phone_number') }}</h1>
      </header>

      <div class="flex-grow overflow-y-auto p-6 flex flex-col items-center">
        <div class="w-24 h-24 rounded-full bg-primary flex items-center justify-center mb-4">
          <mat-icon class="text-white text-5xl">call</mat-icon>
        </div>

        <h2 class="text-xl font-bold text-center mb-6">{{ i18n.translate('sign_in_with_phone_number') }}</h2>

        <p class="text-gray-500 text-center mb-8">
          {{ i18n.translate('please_enter_your_phone_number_and_we_will_send_you_a_sms') }}
        </p>

        <form class="w-full max-w-sm" (submit)="onSubmit()">
          <div class="flex items-center border-b border-gray-300 py-2 mb-8">
            <select [(ngModel)]="phoneCode" name="phoneCode" class="bg-transparent font-medium mr-2 outline-none">
              <option value="+1">+1 (US)</option>
              <option value="+44">+44 (UK)</option>
              <!-- More codes would be added here or via a dedicated picker -->
            </select>
            <input type="tel" [(ngModel)]="phoneNumber" name="phoneNumber"
                   class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                   [placeholder]="i18n.translate('enter_your_number')">
          </div>

          <div id="recaptcha-container"></div>

          <app-default-button
            [label]="i18n.translate('CONTINUE')"
            [disabled]="!phoneNumber"
            (clicked)="onSubmit()">
          </app-default-button>
        </form>
      </div>
    </div>
  `
})
export class PhoneNumberPageComponent {
  phoneCode = '+1';
  phoneNumber = '';

  constructor(
    public i18n: AppLocalizations,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private mobileDialogService: MobileDialogService
  ) {}

  goBack() {
    this.router.navigate(['/sign-in']);
  }

  async onSubmit() {
    if (!this.phoneNumber) return;

    const prRef = this.dialog.open(ProgressDialogComponent, {
      data: { message: this.i18n.translate('processing') },
      disableClose: true
    });

    const fullNumber = this.phoneCode + this.phoneNumber;

    try {
      await this.authService.verifyPhoneNumber({
        phoneNumber: fullNumber,
        recaptchaVerifier: 'recaptcha-container', // Simplification for port
        codeSent: (verificationId) => {
          prRef.close();
          this.router.navigate(['/verification-code'], { state: { verificationId } });
        },
        onError: (type, msg) => {
          prRef.close();
          this.mobileDialogService.errorDialog(
            `${this.i18n.translate('we_were_unable_to_verify_your_number')}\nError: ${msg}`
          );
        }
      });
    } catch (e) {
      prRef.close();
      console.error(e);
    }
  }
}
