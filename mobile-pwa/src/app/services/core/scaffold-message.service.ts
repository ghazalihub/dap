import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APP_PRIMARY_COLOR } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ScaffoldMessageService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, bgcolor: string = APP_PRIMARY_COLOR, duration: number = 5000) {
    this.snackBar.open(message, 'OK', {
      duration,
      panelClass: ['snackbar-text-white'],
      backgroundColor: bgcolor // Note: in Angular Material, we usually use CSS classes for colors
    });
  }
}
