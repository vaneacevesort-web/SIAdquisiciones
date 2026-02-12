import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { Injectable, signal, inject, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private myAppUrl: string;
  private myAPIUrl: string;
  private http = inject( HttpClient );
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.myAppUrl =  'http://localhost:3001/';  //'http://localhost:3001/'
    this.myAPIUrl = 'api/user';

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }

  }
  
  getUser(): Observable<User[]> {
    console.log(`${this.myAppUrl}${this.myAPIUrl}/read`, );
    return this.http.get<User[]>(`${this.myAppUrl}${this.myAPIUrl}/read`);
  }

  signIn(user: User): Observable<any>{
    return this.http.post(`${this.myAppUrl}${this.myAPIUrl}/register`, user);
  }

  login(user: User): Observable<string>{
    return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/login`, user);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  
  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getValidadores(): Observable<string>{
    return this.http.get<string>(`${this.myAppUrl}${this.myAPIUrl}/getvalidadores`);
  }

  reasignarValidador(data: any): Observable<string> {
    return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/updatevalidador`, data)
  }

   saveValidador(registro: any): Observable<string> {
      return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/savevalidador`,registro)
    }


  getValidador(id: any ): Observable<string>{
    return this.http.get<string>(`${this.myAppUrl}${this.myAPIUrl}/getvalidador/${id}`);
  }

  updateVallidador(id: any, registro: any ): Observable<string>{
    return this.http.put<string>(`${this.myAppUrl}${this.myAPIUrl}/updatedatos/${id}`,registro);
  }

  deleteVallidador(id: any): Observable<string>{
    return this.http.get<string>(`${this.myAppUrl}${this.myAPIUrl}/delete/${id}`);
  }

  validaToken(id: any): Observable<string>{
    return this.http.get<string>(`${this.myAppUrl}${this.myAPIUrl}/validatoken/${id}`);
  }
  updatePassword(data: any): Observable<string>{
    return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/updatepassword`,data);
  }
  resetPassword(data: any): Observable<string>{
    return this.http.post<string>(`${this.myAppUrl}${this.myAPIUrl}/resetpassword`,data);
  }
}
