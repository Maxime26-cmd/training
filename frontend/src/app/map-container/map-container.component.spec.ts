import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { MapComponent } from "../components/map/map.component";
import { MapContainerComponent } from "./map-container.component";
import { LocationCardComponent } from "../components/location-card/location-card.component";

@Component({
  selector: 'app-root',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.scss'],
  imports: [MapComponent, MapContainerComponent, LocationCardComponent],
})
export class AppComponent implements OnInit {
onLocationAdded() {
throw new Error('Method not implemented.');
}
onZoomIn() {
throw new Error('Method not implemented.');
}
onZoomOut() {
throw new Error('Method not implemented.');
}

  map!: Map;
  currentUserId: number = Number(localStorage.getItem('userId')) || 0;

  ngOnInit(): void {
    this.map = new Map({
      view: new View({
        center: [0, 0],
        zoom: 1,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'ol-map'
    });
  }
}


