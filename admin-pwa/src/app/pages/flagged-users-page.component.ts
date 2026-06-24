import { Component, OnInit } from '@angular/core';
import { DocumentSnapshot, DocumentData, deleteDoc } from '@angular/fire/firestore';
import { AppService } from '../services/core/app.service';
import { FLAGGED_USER_ID, FLAG_REASON, TIMESTAMP, FLAGGED_BY_USER_ID } from '../constants/constants';

@Component({
  selector: 'app-admin-flagged-users',
  template: `
    <div class="h-screen flex flex-col bg-gray-50">
      <header class="bg-white p-4 border-b flex items-center shadow-sm">
         <h1 class="text-xl font-bold">Flagged Users Alert</h1>
      </header>

      <div class="flex-grow overflow-auto p-4">
        <mat-card class="shadow-md rounded-xl overflow-hidden bg-white">
          <table mat-table [dataSource]="flaggedUsers" class="w-full">
            <!-- Flagged User ID -->
            <ng-container matColumnDef="flaggedId">
              <th mat-header-cell *matHeaderCellDef> Flagged User ID </th>
              <td mat-cell *matHeaderCellDef>
                <div class="flex items-center cursor-pointer hover:text-primary" (click)="copyId(element.get(FLAGGED_USER_ID))">
                   <span class="mr-2 text-xs font-mono">{{ element.get(FLAGGED_USER_ID) }}</span>
                   <mat-icon class="text-gray-400 text-sm h-4 w-4">content_copy</mat-icon>
                </div>
              </td>
            </ng-container>

            <!-- Reason -->
            <ng-container matColumnDef="reason">
              <th mat-header-cell *matHeaderCellDef> Flag Reason </th>
              <td mat-cell *matHeaderCellDef class="font-medium"> {{ element.get(FLAG_REASON) }} </td>
            </ng-container>

            <!-- Time -->
            <ng-container matColumnDef="time">
              <th mat-header-cell *matHeaderCellDef> Time </th>
              <td mat-cell *matHeaderCellDef> {{ formatTime(element.get(TIMESTAMP)) }} </td>
            </ng-container>

            <!-- By User ID -->
            <ng-container matColumnDef="byId">
              <th mat-header-cell *matHeaderCellDef> Flagged By User ID </th>
              <td mat-cell *matHeaderCellDef>
                <div class="flex items-center cursor-pointer hover:text-primary" (click)="copyId(element.get(FLAGGED_BY_USER_ID))">
                   <span class="mr-2 text-xs font-mono">{{ element.get(FLAGGED_BY_USER_ID) }}</span>
                   <mat-icon class="text-gray-400 text-sm h-4 w-4">content_copy</mat-icon>
                </div>
              </td>
            </ng-container>

            <!-- Actions -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Remove </th>
              <td mat-cell *matHeaderCellDef>
                <button mat-icon-button (click)="removeFlag(element)" matTooltip="Remove Flag Alert">
                  <mat-icon class="text-red-400">delete_outline</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50"></tr>
          </table>

          <div *ngIf="flaggedUsers.length === 0" class="p-12 text-center text-gray-500 italic">
             No flagged users found.
          </div>
        </mat-card>
      </div>
    </div>
  `
})
export class AdminFlaggedUsersPageComponent implements OnInit {
  displayedColumns: string[] = ['flaggedId', 'reason', 'time', 'byId', 'actions'];
  flaggedUsers: DocumentSnapshot<DocumentData>[] = [];

  FLAGGED_USER_ID = FLAGGED_USER_ID;
  FLAG_REASON = FLAG_REASON;
  FLAGGED_BY_USER_ID = FLAGGED_BY_USER_ID;
  TIMESTAMP = TIMESTAMP;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.getFlaggedUsersAlert().subscribe(snapshot => {
      this.flaggedUsers = snapshot.docs;
    });
  }

  formatTime(timestamp: any): string {
    if (!timestamp) return '';
    return new Date(timestamp.seconds * 1000).toLocaleString();
  }

  copyId(id: string) {
    navigator.clipboard.writeText(id);
    alert('User ID Copied Successfully!');
  }

  async removeFlag(flag: DocumentSnapshot<DocumentData>) {
    if (confirm('Are you sure you want to remove this flag alert?')) {
       await deleteDoc(flag.ref);
       alert('Flag removed successfully!');
    }
  }
}
