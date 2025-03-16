import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`; 

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        console.log('Login response:', response);
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('username', response.user.username);
          localStorage.setItem('userId', response.user.id.toString());
          localStorage.setItem('profilePicture', response.user.profilePicture || '');
        }      
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { username, email, password });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('profilePicture');
  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
  

  isLoggedIn(): boolean {
    return !!this.getToken(); 
  }

  getUsername(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('username');
    }
    return null;
  }

  getProfilePicture(): string | null {
    const profilePicture = localStorage.getItem('profilePicture');
    if (profilePicture) {
      return profilePicture.startsWith('http') ? profilePicture : `${environment.apiUrl}${profilePicture}`;
    }
    return null;
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  uploadProfilePicture(file: File): Observable<any> {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${environment.apiUrl}/users/${userId}/profile-picture`, formData).pipe(
      tap(response => {
        if (response.profilePicture) {
          localStorage.setItem('profilePicture', response.profilePicture);
        }
      })
    );
  }
}
