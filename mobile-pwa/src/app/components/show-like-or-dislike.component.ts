import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-show-like-or-dislike',
  template: `
    <div *ngIf="position === 'right'" class="absolute top-12 left-6 border-4 border-green-500 rounded-lg p-2 rotate-[-15deg] z-20">
      <span class="text-green-500 text-5xl font-bold">LIKE</span>
    </div>
    <div *ngIf="position === 'left'" class="absolute top-12 right-6 border-4 border-red-500 rounded-lg p-2 rotate-[15deg] z-20">
      <span class="text-red-500 text-5xl font-bold">DISLIKE</span>
    </div>
  `
})
export class ShowLikeOrDislikeComponent {
  @Input() position: 'left' | 'right' | 'none' = 'none';
}
