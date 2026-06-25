import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { MobileDialogService } from '../services/core/mobile-dialog.service';

@Component({
  selector: 'app-delete-account-button',
  template: `
    <div class="flex justify-center w-full px-4">
      <app-default-button
        [label]="i18n.translate('delete_account')"
        (clicked)="confirmDelete()">
      </app-default-button>
    </div>
  `
})
export class DeleteAccountButtonComponent {
  constructor(
    public i18n: AppLocalizations,
    private mobileDialogService: MobileDialogService,
    private router: Router
  ) {}

  confirmDelete() {
    this.mobileDialogService.confirmDialog({
      title: this.i18n.translate('delete_account') + ' ?',
      message: this.i18n.translate('all_your_profile_data_will_be_permanently_deleted'),
      positiveAction: () => {
        this.router.navigate(['/delete-account']);
      }
    });
  }
}
