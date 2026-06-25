import { Component, OnInit } from '@angular/core';
import { AppService } from '../services/core/app.service';
import { DialogService } from '../services/core/dialog.service';
import { STORE_SUBSCRIPTION_IDS } from '../constants/constants';

@Component({
  selector: 'app-admin-in-app-purchases',
  template: `
    <div class="h-screen flex flex-col bg-gray-50 overflow-y-auto">
      <header class="bg-white p-4 border-b flex items-center shadow-sm">
         <h1 class="text-xl font-bold">In-App Purchases</h1>
      </header>

      <div class="p-8 max-w-4xl mx-auto w-full space-y-8">
        <div class="text-center">
           <h2 class="text-2xl font-bold text-gray-800">VIP Subscriptions</h2>
           <p class="text-gray-500 mt-1">Add Google Play / Apple Store Subscription IDs</p>
        </div>

        <!-- Add Input -->
        <div class="flex justify-center">
          <mat-form-field appearance="outline" class="w-full max-w-md">
            <mat-label>Add Subscription ID</mat-label>
            <mat-icon matPrefix>monetization_on</mat-icon>
            <input matInput [(ngModel)]="newSubscriptionId" placeholder="E.g: vip_monthly" (keyup.enter)="addSubscription()">
            <button mat-icon-button matSuffix color="primary" (click)="addSubscription()" [disabled]="!newSubscriptionId">
              <mat-icon>add_circle</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <!-- List -->
        <div class="flex justify-center">
          <mat-card class="w-full max-w-md shadow-xl rounded-2xl bg-white overflow-hidden">
             <div *ngIf="subscriptionIds.length === 0" class="p-12 text-center text-gray-400 italic">
                No Subscription ID found!
             </div>

             <mat-list *ngIf="subscriptionIds.length > 0">
                <ng-container *ngFor="let id of subscriptionIds; let i = index">
                   <mat-list-item class="py-2">
                      <img matListItemIcon src="assets/images/crow_badge_small.png" class="w-10 h-10">
                      <div matListItemTitle class="font-bold text-lg ml-2">{{ id }}</div>
                      <button mat-icon-button matListItemMeta class="text-red-500" (click)="confirmRemove(i)">
                        <mat-icon>delete</mat-icon>
                      </button>
                   </mat-list-item>
                   <mat-divider *ngIf="i < subscriptionIds.length - 1"></mat-divider>
                </ng-container>
             </mat-list>
          </mat-card>
        </div>
      </div>

      <div class="h-20"></div>
    </div>
  `
})
export class AdminInAppPurchasesPageComponent implements OnInit {
  subscriptionIds: string[] = [];
  newSubscriptionId: string = '';

  constructor(
    private appService: AppService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.appService.appInfo$.subscribe(info => {
      if (info) {
        this.subscriptionIds = [...info.subscriptionIds];
      }
    });
  }

  async addSubscription() {
    if (!this.newSubscriptionId) return;

    const updatedIds = [...this.subscriptionIds, this.newSubscriptionId];
    await this.updateIds(updatedIds, 'Added');
    this.newSubscriptionId = '';
  }

  confirmRemove(index: number) {
    this.dialogService.confirmDialog({
      message: 'The subscription ID will be deleted!',
      positiveAction: async () => {
         const updatedIds = this.subscriptionIds.filter((_, i) => i !== index);
         await this.updateIds(updatedIds, 'Removed');
      }
    });
  }

  async updateIds(ids: string[], actionLabel: string) {
    try {
      await this.appService.updateAppData({ [STORE_SUBSCRIPTION_IDS]: ids });
      this.subscriptionIds = ids;
      alert(`Subscription ID ${actionLabel} successfully!`);
    } catch (e) {
      console.error(e);
      alert('Error updating subscriptions.');
    }
  }
}
