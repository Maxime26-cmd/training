import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from '../components/location-card/location-card.component';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}/location`; 

  constructor(private http: HttpClient) {}

  private getCurrentUserId(): number {
    const storedUserId = localStorage.getItem('userId');
    return storedUserId ? parseInt(storedUserId) : 0;
  }

  createLocation(data: { latitude: number; longitude: number; userId: number }): Observable<Location> {
    return this.http.post<Location>(this.apiUrl, data);
  }

  updateLocation(locationId: number, data: { latitude: number; longitude: number; userId: number }): Observable<Location> {
    const userId = this.getCurrentUserId();
    return this.http.put<Location>(`${this.apiUrl}/user/${userId}/${locationId}`, data);
  }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }

  getUserLocations(userId: number): Observable<Location[]> {
    return this.http.get<Location[]>(`${this.apiUrl}/user/${userId}`);
  }

  deleteLocation(id: number): Observable<void> {
    const userId = this.getCurrentUserId();
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 