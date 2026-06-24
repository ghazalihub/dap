import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { AppService } from '../services/core/app.service';
import {
  USER_FULLNAME,
  USER_GENDER,
  USER_COUNTRY,
  USER_LOCALITY,
  USER_ID,
  USER_STATUS,
  USER_PROFILE_PHOTO
} from '../constants/constants';

@Component({
  selector: 'app-admin-users',
  template: `
    <div class="h-screen flex flex-col bg-gray-100">
      <header class="bg-white p-4 border-b flex items-center justify-between">
         <h1 class="text-xl font-bold">List of Users</h1>
         <div class="w-96 relative">
            <mat-icon class="absolute left-3 top-2.5 text-gray-400">search</mat-icon>
            <input type="text" [(ngModel)]="searchQuery" (input)="filterUsers()"
                   class="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                   placeholder="Search by: Name, country, city, and id">
         </div>
      </header>

      <div class="flex-grow overflow-auto p-4">
        <mat-card class="shadow-md rounded-xl overflow-hidden bg-white">
          <table mat-table [dataSource]="filteredUsers" matSort (matSortChange)="sortData($event)" class="w-full">
            <!-- Profile Photo -->
            <ng-container matColumnDef="photo">
              <th mat-header-cell *matHeaderCellDef> Profile Photo </th>
              <td mat-cell *matHeaderCellDef>
                <div class="w-10 h-10 rounded-full overflow-hidden m-2 border-2 border-primary">
                  <img [src]="getUserPhoto(element)" class="w-full h-full object-cover">
                </div>
              </td>
            </ng-container>

            <!-- Full Name -->
            <ng-container matColumnDef="fullname">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Full name </th>
              <td mat-cell *matHeaderCellDef> {{ element.get(USER_FULLNAME) }} </td>
            </ng-container>

            <!-- Gender -->
            <ng-container matColumnDef="gender">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Gender </th>
              <td mat-cell *matHeaderCellDef> {{ element.get(USER_GENDER) }} </td>
            </ng-container>

            <!-- Country -->
            <ng-container matColumnDef="country">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Country </th>
              <td mat-cell *matHeaderCellDef> {{ element.get(USER_COUNTRY) }} </td>
            </ng-container>

            <!-- City -->
            <ng-container matColumnDef="city">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> City </th>
              <td mat-cell *matHeaderCellDef> {{ element.get(USER_LOCALITY) }} </td>
            </ng-container>

            <!-- User ID -->
            <ng-container matColumnDef="userId">
              <th mat-header-cell *matHeaderCellDef> User ID </th>
              <td mat-cell *matHeaderCellDef class="text-xs text-gray-500"> {{ cutUserId(element.get(USER_ID)) }} </td>
            </ng-container>

            <!-- Status -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
              <td mat-cell *matHeaderCellDef>
                <app-user-status [status]="element.get(USER_STATUS)"></app-user-status>
              </td>
            </ng-container>

            <!-- View -->
            <ng-container matColumnDef="view">
              <th mat-header-cell *matHeaderCellDef> View </th>
              <td mat-cell *matHeaderCellDef>
                <button mat-icon-button (click)="viewProfile(element)">
                  <mat-icon class="text-gray-400">visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 cursor-pointer" (click)="viewProfile(row)"></tr>
          </table>

          <mat-paginator [length]="totalUsers" [pageSize]="10" [pageSizeOptions]="[5, 10, 25, 100]" showFirstLastButtons></mat-paginator>
        </mat-card>
      </div>
    </div>
  `
})
export class AdminUsersPageComponent implements OnInit {
  displayedColumns: string[] = ['photo', 'fullname', 'gender', 'country', 'city', 'userId', 'status', 'view'];
  allUsers: DocumentSnapshot<DocumentData>[] = [];
  filteredUsers: DocumentSnapshot<DocumentData>[] = [];
  searchQuery: string = '';
  totalUsers = 0;

  USER_FULLNAME = USER_FULLNAME;
  USER_GENDER = USER_GENDER;
  USER_COUNTRY = USER_COUNTRY;
  USER_LOCALITY = USER_LOCALITY;
  USER_ID = USER_ID;
  USER_STATUS = USER_STATUS;

  constructor(private appService: AppService, private router: Router) {}

  ngOnInit() {
    this.appService.getUsersStream().subscribe(snapshot => {
      this.allUsers = snapshot.docs;
      this.filterUsers();
    });
  }

  filterUsers() {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredUsers = [...this.allUsers];
    } else {
      this.filteredUsers = this.allUsers.filter(item =>
        item.get(USER_FULLNAME)?.toLowerCase().includes(query) ||
        item.get(USER_COUNTRY)?.toLowerCase().includes(query) ||
        item.get(USER_LOCALITY)?.toLowerCase().includes(query) ||
        item.get(USER_ID)?.toLowerCase().includes(query)
      );
    }
    this.totalUsers = this.filteredUsers.length;
  }

  sortData(sort: any) {
    // Logic for sorting based on field and direction
    const field = sort.active;
    const isAsc = sort.direction === 'asc';

    this.filteredUsers.sort((a, b) => {
       const valA = (a.get(field) || '').toString();
       const valB = (b.get(field) || '').toString();
       return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    this.filteredUsers = [...this.filteredUsers]; // Trigger change detection
  }

  getUserPhoto(element: DocumentSnapshot<DocumentData>): string {
    return element.get(USER_PROFILE_PHOTO) || 'assets/images/placeholder.png';
  }

  cutUserId(userId: string): string {
    return userId && userId.length > 10 ? userId.substring(0, 10) + '...' : userId;
  }

  viewProfile(element: DocumentSnapshot<DocumentData>) {
    this.router.navigate(['/user-profile', element.id]);
  }
}
