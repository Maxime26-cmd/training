import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '../location-card/location-card.component';
import { LocationService } from '../../services/location.service';

@Component({
  selector: 'app-location-display',
  templateUrl: './location-display.component.html',
  styleUrls: ['./location-display.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LocationDisplayComponent {
  @Input() location!: Location;
  @Output() locationDeleted = new EventEmitter<void>();

  constructor(private locationService: LocationService) {}

  onDelete() {
    if (this.location?.id) {
      this.locationService.deleteLocation(this.location.id).subscribe(() => {
        this.locationDeleted.emit();
      });
    }
  }
} 