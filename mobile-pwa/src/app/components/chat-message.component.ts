import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  template: `
    <div class="flex items-end mb-4 px-2" [class.justify-end]="isUserSender">
      <!-- Receiver Photo -->
      <div *ngIf="!isUserSender" class="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0">
        <img [src]="userPhotoLink" class="w-full h-full object-cover">
      </div>

      <div class="max-w-[70%]">
        <div class="p-3 rounded-2xl"
             [class.bg-gray-200]="!isUserSender"
             [class.text-black]="!isUserSender"
             [class.bg-primary]="isUserSender"
             [class.text-white]="isUserSender"
             [class.rounded-br-none]="isUserSender"
             [class.rounded-bl-none]="!isUserSender">

          <div *ngIf="isImage" class="rounded-lg overflow-hidden cursor-pointer" (click)="showFullImage()">
            <img [src]="imageLink" class="w-full max-h-60 object-cover">
          </div>

          <p *ngIf="!isImage" class="text-base whitespace-pre-wrap">{{ textMessage }}</p>
        </div>

        <div class="text-[10px] text-gray-500 mt-1 px-1" [class.text-right]="isUserSender">
          {{ timeAgo }}
        </div>
      </div>

      <!-- Sender Photo -->
      <div *ngIf="isUserSender" class="w-10 h-10 rounded-full overflow-hidden ml-2 flex-shrink-0">
        <img [src]="userPhotoLink" class="w-full h-full object-cover">
      </div>
    </div>
  `
})
export class ChatMessageComponent {
  @Input() isUserSender!: boolean;
  @Input() userPhotoLink!: string;
  @Input() isImage: boolean = false;
  @Input() imageLink?: string;
  @Input() textMessage?: string;
  @Input() timeAgo!: string;

  showFullImage() {
    if (this.imageLink) {
       window.open(this.imageLink, '_blank');
    }
  }
}
