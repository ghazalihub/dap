import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDefaultCardBorder]'
})
export class DefaultCardBorderDirective {
  @HostBinding('style.borderRadius') borderRadius = '10px';
  @HostBinding('style.overflow') overflow = 'hidden';
  @HostBinding('class') classes = 'shadow-sm border border-gray-100';
}
