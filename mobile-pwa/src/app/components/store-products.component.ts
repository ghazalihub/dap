import { Component, Input, OnInit } from '@angular/core';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { UserService } from '../services/core/user.service';

@Component({
  selector: 'app-store-products',
  template: `
    <div *ngIf="isLoading" class="flex flex-col items-center justify-center p-4">
      <app-my-circular-progress></app-my-circular-progress>
      <p>{{ i18n.translate('processing') }}</p>
    </div>

    <div *ngIf="!isLoading && products.length > 0" class="flex flex-col space-y-2">
      <mat-card *ngFor="let item of products" class="p-2 border border-gray-100 rounded-lg shadow-sm">
        <mat-list-item class="flex items-center justify-between">
          <div matListItemIcon class="mr-4">
             <img src="assets/images/crow_badge.png" class="w-10 h-10">
          </div>
          <div matListItemTitle class="flex-grow">
            <h4 class="font-bold">{{ item.title }}</h4>
            <p [style.color]="priceColor" class="font-bold text-lg">{{ item.price }}</p>
          </div>
          <div matListItemMeta>
            <button mat-flat-button color="primary" class="rounded-full h-8 px-6"
                    [disabled]="userService.activeVipId === item.id" (click)="subscribe(item)">
              {{ userService.activeVipId === item.id ? i18n.translate('ACTIVE') : i18n.translate('SUBSCRIBE') }}
            </button>
          </div>
        </mat-list-item>
      </mat-card>
    </div>

    <div *ngIf="!isLoading && products.length === 0" class="text-center p-8">
       <mat-icon class="text-gray-300 text-6xl">search</mat-icon>
       <p class="text-gray-500">{{ i18n.translate('no_products_or_subscriptions') }}</p>
    </div>
  `
})
export class StoreProductsComponent implements OnInit {
  @Input() priceColor: string = '#4CAF50';

  products: any[] = [];
  isLoading = false;

  constructor(
    public i18n: AppLocalizations,
    public userService: UserService
  ) {}

  ngOnInit() {
    // Behavioral clone: Mocking product retrieval
    this.products = [
      { id: 'vip_1_month', title: '1 Month VIP', price: '$9.99' },
      { id: 'vip_6_months', title: '6 Months VIP', price: '$49.99' },
      { id: 'vip_12_months', title: '1 Year VIP', price: '$89.99' }
    ];
  }

  subscribe(item: any) {
    console.log('Subscribing to:', item.id);
    // Trigger in-app purchase logic
  }
}
