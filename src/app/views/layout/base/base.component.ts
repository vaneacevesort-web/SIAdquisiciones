import { Component, inject, OnInit } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { UserService } from '../../../service/user.service'; 

@Component({
    selector: 'app-base',
    imports: [
        RouterOutlet,
        NavbarComponent,
        FooterComponent
    ],
    templateUrl: './base.component.html',
    styleUrl: './base.component.scss'
})
export class BaseComponent implements OnInit {

  isLoading: boolean = false;
  private router = inject(Router);
  private userService = inject(UserService);
  userRole: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.router.events.forEach((event) => { 
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });

    this.userService.currentUser$.subscribe(user => {
      this.userRole = user?.rol_users?.role?.name ?? null;
    });
  }

}
