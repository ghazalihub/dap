import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { VipDialogComponent } from './vip-dialog.component';

@Component({
  selector: 'app-vip-account-card',
  template: `
    <mat-card class="rounded-xl shadow-md overflow-hidden cursor-pointer" (click)="openVipDialog()">
      <mat-list>
        <mat-list-item>
          <img matListItemIcon src="assets/images/crow_badge_small.png" class="w-8 h-8">
          <div matListItemTitle class="font-bold text-lg">
            {{ i18n.translate('vip_account') }}
          </div>
          <mat-icon matListItemMeta>arrow_forward</mat-icon>
        </mat-list-item>
      </mat-list>
    </mat-card>
  `
})
export class VipAccountCardComponent {
  constructor(
    public i18n: AppLocalizations,
    private dialog: MatDialog
  ) {}

  openVipDialog() {
    this.dialog.open(VipDialogComponent);
  }
}
