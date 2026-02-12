import { NgStyle } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../../../service/user.service';
import { User } from '../../../../interfaces/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgStyle,
    RouterLink,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {

  returnUrl: any;
  user: User[] = [];
  loggedin: boolean = false;
  Uemail: string = '';
  Upassword: string = '';
  userRole$: Observable<string | undefined>;

  public _userService = inject(UserService);

  constructor(private router: Router, private route: ActivatedRoute) {
    this.userRole$ = this._userService.currentUser$.pipe(
      map(user => user?.rol_users?.role?.name)
    );
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  onLoggedin(form: NgForm) {

    const user: User = {
      email: form.value.Uemail,
      password: form.value.Upassword
    };

    this._userService.login(user).subscribe({
      next: (response: any) => {
        const token = response.token;
        const userData = response.user;

        localStorage.setItem('myToken', token);
        localStorage.setItem('isLoggedin', 'true');

        this._userService.setCurrentUser(userData);
        this.userRole$.subscribe(role => {
        });
        
        this.router.navigate([this.returnUrl]);
      },
      error: (e: HttpErrorResponse) => {
        if (e.error && e.error.msg) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Usuario o contraseña incorrectos",
            showConfirmButton: false,
            timer: 3000
          });
        } else {
          console.error('Error desconocido:', e);
        }
      },
    });
  }
}
