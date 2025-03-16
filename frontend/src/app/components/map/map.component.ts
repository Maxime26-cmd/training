import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy, Input, ElementRef } from '@angular/core';
import Map from 'ol/Map';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class MapComponent implements OnChanges {
  @Input() map!: Map;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['map'] && changes['map'].currentValue) {
      this.map.setTarget(this.elementRef.nativeElement.querySelector('#ol-map'));
    }
  }
}
