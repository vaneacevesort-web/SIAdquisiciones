import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../service/user.service';

@Component({
    selector: 'app-basic-elements',
    imports: [
        RouterLink
    ],
    templateUrl: './basic-elements.component.html'
})
export class BasicElementsComponent {
    public _userService = inject(UserService);

    ngOnInit(): void {
        console.log(this._userService.currentUserValue?.email)
        
    }

}

