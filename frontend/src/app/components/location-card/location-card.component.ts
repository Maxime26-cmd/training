import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../services/location.service';

export interface Location {
  id?: number;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-location-card',
  templateUrl: './location-card.component.html',
  styleUrls: ['./location-card.component.scss'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
})
export class LocationCardComponent {
  @Input() location?: Location;
  @Input() userId!: number;
  @Output() locationAdded = new EventEmitter<void>();
  @Output() locationUpdated = new EventEmitter<void>();
  @Output() locationDeleted = new EventEmitter<void>();

  locationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {
    this.locationForm = this.fb.group({
      latitude: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      longitude: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    });
  }

  ngOnChanges() {
    if (this.location) {
      this.locationForm.patchValue({
        latitude: this.location.latitude,
        longitude: this.location.longitude,
      });
    }
  }

  onAdd() {
    if (this.locationForm.valid) {
      const formValue = this.locationForm.value;
      this.locationService.createLocation({
        latitude: Number(formValue.latitude),
        longitude: Number(formValue.longitude),
        userId: this.userId
      }).subscribe(() => {
        this.locationAdded.emit();
        this.locationForm.reset();
      });
    }
  }

  onUpdate() {
    if (this.locationForm.valid && this.location?.id) {
      const formValue = this.locationForm.value;
      this.locationService.updateLocation(this.location.id, {
        latitude: Number(formValue.latitude),
        longitude: Number(formValue.longitude),
        userId: this.userId
      }).subscribe(() => {
        this.locationUpdated.emit();
      });
    }
  }

  onDelete() {
    if (this.location?.id) {
      this.locationService.deleteLocation(this.location.id).subscribe(() => {
        this.locationDeleted.emit();
      });
    }
  }
}
