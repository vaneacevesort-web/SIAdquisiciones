import { Directive } from '@angular/core';

@Directive({
  selector: '[appShowForRoles]'
})
export class ShowForRolesDirective {
  @Input('appShowForRoles') allowedRoles?: Role[];
  
  constructor() { }

}
