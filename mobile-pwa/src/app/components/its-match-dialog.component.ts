import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AppLocalizations } from '../services/core/app-localizations.service';

@Component({
  selector: 'app-its-match-dialog',
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-55 flex flex-col justify-center items-center p-6 text-center z-50 overflow-y-auto">
      <!-- Matched User image -->
      <div class="w-40 h-40 rounded-full bg-primary mb-4 overflow-hidden border-4 border-primary">
        <img [src]="data.matchedUser.userProfilePhoto" class="w-full h-full object-cover">
      </div>

      <!-- Matched User first name -->
      <h2 class="text-white text-2xl font-bold mb-2">
        {{ data.matchedUser.userFullname.split(' ')[0] }}
      </h2>

      <h3 class="text-white text-3xl font-bold mb-4">
        {{ i18n.translate('likes_you_too') }}
      </h3>

      <p class="text-gray-400 text-lg mb-8">
        {{ i18n.translate('you_and') }} {{ data.matchedUser.userFullname.split(' ')[0] }} {{ i18n.translate('liked_each_other') }}
      </p>

      <!-- Send a message button -->
      <button mat-flat-button color="primary" class="w-full py-4 mb-4 text-lg" (click)="sendMessage()">
        {{ i18n.translate('send_a_message') }}
      </button>

      <!-- Keep swiping button -->
      <button *ngIf="data.showSwipeButton" mat-button class="w-full py-4 text-white text-lg" (click)="keepSwiping()">
        {{ i18n.translate('keep_passing') }}
      </button>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; width: 100vw; }
  `]
})
export class ItsMatchDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ItsMatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { matchedUser: User, showSwipeButton: boolean, onSwipeRight?: () => void },
    public i18n: AppLocalizations,
    private router: Router
  ) {}

  sendMessage() {
    this.dialogRef.close();
    this.router.navigate(['/chat', this.data.matchedUser.userId], { state: { user: this.data.matchedUser } });
  }

  keepSwiping() {
    this.dialogRef.close();
    if (this.data.onSwipeRight) {
      this.data.onSwipeRight();
    }
  }
}
