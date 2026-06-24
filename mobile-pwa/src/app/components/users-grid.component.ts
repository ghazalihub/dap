import { Component, Input, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-users-grid',
  template: `
    <div class="grid grid-cols-2 gap-0 overflow-y-auto h-full">
      <ng-container *ngFor="let item of [].constructor(itemCount); let i = index">
        <div class="aspect-[250/320]">
          <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: i }"></ng-container>
        </div>
      </ng-container>
    </div>
  `
})
export class UsersGridComponent {
  @Input() itemCount: number = 0;
  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<any>;
}
