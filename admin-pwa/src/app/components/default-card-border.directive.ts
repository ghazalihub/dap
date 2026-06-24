import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appAdminCardBorder]'
})
export class AdminCardBorderDirective {
  @HostBinding('style.borderRadius') borderRadius = '8px';
  @HostBinding('style.overflow') overflow = 'hidden';
  @HostBinding('class') classes = 'shadow-md border border-gray-200 bg-white';
}
