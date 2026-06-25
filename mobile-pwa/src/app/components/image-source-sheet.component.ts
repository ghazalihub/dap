import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AppLocalizations } from '../services/core/app-localizations.service';

@Component({
  selector: 'app-image-source-sheet',
  template: `
    <div class="bg-white rounded-t-xl p-4">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl font-bold px-2">{{ i18n.translate('photo') }}</h2>
        <button mat-icon-button (click)="close()">
          <mat-icon class="text-gray-400">close</mat-icon>
        </button>
      </div>
      <mat-divider class="mb-4"></mat-divider>

      <div class="flex flex-col space-y-2">
        <button mat-button class="py-4 justify-start" (click)="pickImage('gallery')">
          <mat-icon class="mr-3 text-gray-500">photo_library</mat-icon>
          <span class="text-lg">{{ i18n.translate('gallery') }}</span>
        </button>

        <button mat-button class="py-4 justify-start" (click)="pickImage('camera')">
          <mat-icon class="mr-3 text-gray-500">camera_alt</mat-icon>
          <span class="text-lg">{{ i18n.translate('camera') }}</span>
        </button>
      </div>

      <div class="h-8"></div>
    </div>
  `
})
export class ImageSourceSheetComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<ImageSourceSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { onImageSelected: (file: File) => void },
    public i18n: AppLocalizations
  ) {}

  close() {
    this.bottomSheetRef.dismiss();
  }

  pickImage(source: 'gallery' | 'camera') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (source === 'camera') {
       input.setAttribute('capture', 'environment');
    }
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        this.data.onImageSelected(file);
        this.bottomSheetRef.dismiss();
      }
    };
    input.click();
  }
}
