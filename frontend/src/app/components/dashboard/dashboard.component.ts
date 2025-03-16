import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationCardComponent } from '../location-card/location-card.component';
import { LocationDisplayComponent } from '../location-display/location-display.component';
import { LocationService } from '../../services/location.service';
import { Location } from '../location-card/location-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LocationCardComponent, LocationDisplayComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUserId: number;
  locations: Location[] = [];

  constructor(private locationService: LocationService) {
    const storedUserId = localStorage.getItem('userId');
    this.currentUserId = storedUserId ? parseInt(storedUserId) : 0;
    
    if (!this.currentUserId) {
      console.error('Aucun utilisateur connecté trouvé');
    }
  }

  ngOnInit() {
    if (this.currentUserId) {
      this.loadUserLocations();
    }
  }

  loadUserLocations() {
    this.locationService.getUserLocations(this.currentUserId).subscribe({
      next: (locations) => {
        this.locations = locations;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des locations:', error);
      }
    });
  }
}
