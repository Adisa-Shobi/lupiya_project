import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const AUTH_API = 'http://localhost:8080/api/auth/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }
  update(username: string, fullname: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'update',
      {
        username,
        fullname,
      },
      httpOptions
    );
  }
  register(username: string, password: string, fullname: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        password,
        fullname,
      },
      httpOptions
    );
  }
  deactivate(username: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'deactivate',
      {
        username
      },
      httpOptions
    );
  }
  logout(): Observable<any> {
    return this.http.post(
      AUTH_API + 'signout', {}, httpOptions
    );
  }
}
