import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppHelper } from '../services/core/app-helper.service';
import { AuthService } from '../services/core/auth.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { MobileDialogService } from '../services/core/mobile-dialog.service';
import { ProgressDialogComponent } from '../components/progress-dialog.component';

@Component({
  selector: 'app-update-location',
  template: `
    <div class="h-screen flex flex-col bg-white overflow-y-auto">
      <header class="flex items-center p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
        <h1 class="text-lg font-bold ml-2">{{ i18n.translate('your_current_location') }}</h1>
      </header>

      <div class="flex-grow p-6 flex flex-col items-center justify-center text-center">
        <mat-icon class="text-primary text-6xl mb-6 h-24 w-24">location_on</mat-icon>

        <p class="text-2xl font-light text-gray-800 leading-snug mb-10">
          {{ i18n.translate('the_app_needs_your_permission_to_access_your_device_current_location') }}
        </p>

        <div class="w-full max-w-xs">
          <app-default-button
            [label]="i18n.translate('GET_LOCATION')"
            (clicked)="getLocation()">
          </app-default-button>
        </div>
      </div>
    </div>
  `
})
export class UpdateLocationPageComponent implements OnInit {
  isSignUpProcess = true;

  constructor(
    public i18n: AppLocalizations,
    private appHelper: AppHelper,
    private authService: AuthService,
    private mobileDialogService: MobileDialogService,
    private dialog: MatDialog,
    private router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.isSignUpProcess = navigation.extras.state['isSignUpProcess'] ?? true;
    }
  }

  ngOnInit() {}

  async getLocation() {
    const pr = this.dialog.open(ProgressDialogComponent, { data: { message: this.i18n.translate('processing') } });

    await this.appHelper.checkLocationPermission({
      onGpsDisabled: () => {
        pr.close();
        this.mobileDialogService.errorDialog(this.i18n.translate('we_were_unable_to_get_your_current_location_please_enable_gps_to_continue'));
      },
      onDenied: () => {
        pr.close();
        this.mobileDialogService.errorDialog(this.i18n.translate('location_permissions_are_denied'));
      },
      onGranted: () => {
        this.appHelper.getUserCurrentLocation({
          onSuccess: async (pos) => {
            const latitude = pos.coords.latitude;
            const longitude = pos.coords.longitude;

            // Real geocoding logic behavioral clone
            const geocoder = new google.maps.Geocoder();
            const response = await geocoder.geocode({ location: { lat: latitude, lng: longitude } });

            let country = 'Unknown';
            let locality = 'Unknown';

            if (response.results[0]) {
               const components = response.results[0].address_components;
               country = components.find(c => c.types.includes('country'))?.long_name || country;
               locality = (components.find(c => c.types.includes('locality')) ||
                           components.find(c => c.types.includes('administrative_area_level_2')))?.long_name || locality;
            }

            await this.appHelper.updateUserLocation({
              userId: this.authService.getCurrentUserId()!,
              latitude,
              longitude,
              country,
              locality
            });

            pr.close();
            this.mobileDialogService.successDialog(
              `${this.i18n.translate('location_updated_successfully')}\n\n${country}, ${locality}`
            );

            if (this.isSignUpProcess) {
              this.router.navigate(['/home']);
            } else {
              window.history.back();
            }
          },
          onFail: () => {
            pr.close();
            this.mobileDialogService.errorDialog(this.i18n.translate('we_were_unable_to_get_your_device_current_location'));
          },
          onTimeoutException: () => {
            pr.close();
            this.mobileDialogService.errorDialog(this.i18n.translate('we_are_unable_to_get_your_device_current_location'));
          }
        });
      }
    });
  }
}
