import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentSnapshot, DocumentData } from '@angular/fire/firestore';
import { MatchesService } from '../services/api/matches.service';
import { UserService } from '../services/core/user.service';
import { AppLocalizations } from '../services/core/app-localizations.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-matches-tab',
  template: `
    <div class="h-full flex flex-col bg-white">
      <!-- Header -->
      <div class="p-4 border-b flex items-center">
        <mat-icon class="text-primary mr-2">favorite</mat-icon>
        <h2 class="text-xl font-bold">{{ i18n.translate('matches') }}</h2>
      </div>

      <!-- Show matches -->
      <div class="flex-grow overflow-hidden relative">
        <div *ngIf="isLoading" class="h-full flex items-center justify-center">
          <app-processing [text]="i18n.translate('loading')"></app-processing>
        </div>

        <div *ngIf="!isLoading && matches.length === 0" class="h-full">
          <app-no-data
            [title]="i18n.translate('no_match')"
            message="Keep swiping to find matches!">
          </app-no-data>
        </div>

        <div *ngIf="!isLoading && matches.length > 0" class="h-full overflow-y-auto">
          <div class="grid grid-cols-2 gap-0">
             <div *ngFor="let matchDoc of matches" class="aspect-[250/320] cursor-pointer" (click)="goToChat(matchDoc)">
                <!-- Load profile async-like logic -->
                <app-match-card-wrapper [userId]="matchDoc.id"></app-match-card-wrapper>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MatchesTabComponent implements OnInit {
  matches: DocumentSnapshot<DocumentData>[] = [];
  isLoading = true;

  constructor(
    private matchesService: MatchesService,
    public i18n: AppLocalizations,
    private router: Router
  ) {}

  ngOnInit() {
    this.matchesService.getMatches().subscribe(matches => {
      this.matches = matches;
      this.isLoading = false;
    });
  }

  goToChat(matchDoc: DocumentSnapshot<DocumentData>) {
    // Navigation will be handled inside match-card-wrapper or via a service
    // For this port, we navigate to chat with the userId
    this.router.navigate(['/chat', matchDoc.id]);
  }
}

/**
 * Helper component to handle async user loading for each match card
 */
@Component({
  selector: 'app-match-card-wrapper',
  template: `
    <div *ngIf="user; else loading" class="h-full">
       <app-profile-card [user]="user" page="matches"></app-profile-card>
    </div>
    <ng-template #loading>
       <app-loading-card></app-loading-card>
    </ng-template>
  `
})
export class MatchCardWrapperComponent implements OnInit {
  @Input() userId!: string;
  user?: User;

  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.user = await this.userService.getUserObject(this.userId);
  }
}
