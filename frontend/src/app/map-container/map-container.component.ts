import { Component, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Overlay from 'ol/Overlay';
import { MapComponent } from '../components/map/map.component';
import { LocationCardComponent } from '../components/location-card/location-card.component';

interface Location {
  id: number;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-map-container',
  templateUrl: './map-container.component.html',
  styleUrls: ['./map-container.component.scss'],
  standalone: true,
  imports: [CommonModule, LocationCardComponent]
})
export class MapContainerComponent implements AfterViewInit {
  map!: Map;
  popupOverlay!: Overlay;
  vectorSource!: VectorSource;
  markerLayer!: VectorLayer;
  currentUserId: number | null = Number(localStorage.getItem('userId')) || null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  onZoomIn(): void {
    if (!this.map) return;
    const view = this.map.getView();
    const currentZoom = view.getZoom() || 10;
    view.animate({ zoom: currentZoom + 1, duration: 250 });
  }

  onZoomOut(): void {
    if (!this.map) return;
    const view = this.map.getView();
    const currentZoom = view.getZoom() || 10;
    view.animate({ zoom: currentZoom - 1, duration: 250 });
  }

  onLocationAdded(): void {
    this.loadUserLocations();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initMap();
        this.loadUserLocations();
      });
    }
  }

  async loadUserLocations(): Promise<void> {
    if (!this.currentUserId) return;

    try {
      const locations = await this.http
        .get<Location[]>(`http://localhost:3000/location/user/${this.currentUserId}`)
        .toPromise();

      this.updateMarkers(locations || []);
    } catch (error) {
      console.error('Erreur lors du chargement des locations:', error);
    }
  }

  private updateMarkers(locations: Location[]): void {
    this.vectorSource.clear();
    
    const features = locations.map(location => {
      return new Feature({
        geometry: new Point(fromLonLat([location.longitude, location.latitude])),
        name: `Location ${location.id}`,
        locationData: location
      });
    });

    features.forEach(feature => {
      feature.setStyle(new Style({
        image: new Icon({
          anchor: [0.5, 1.2],
          scale: 0.5,
          src: '/marker.png',
        })
      }));
    });

    this.vectorSource.addFeatures(features);
  }

  private initMap(): void {
    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    this.vectorSource = new VectorSource();
    this.markerLayer = new VectorLayer({
      source: this.vectorSource
    });

    const popupElement = document.createElement('div');
    popupElement.className = 'map-popup';
    popupElement.style.position = 'absolute';
    popupElement.style.background = 'white';
    popupElement.style.padding = '10px';
    popupElement.style.borderRadius = '5px';
    popupElement.style.boxShadow = '0px 0px 5px rgba(0,0,0,0.3)';
    popupElement.style.display = 'none';
    popupElement.innerHTML = '<p id="popup-content"></p>';

    document.body.appendChild(popupElement);

    this.popupOverlay = new Overlay({
      element: popupElement,
      positioning: 'bottom-center',
      offset: [0, -15],
    });

    this.map = new Map({
      target: 'ol-map',
      layers: [osmLayer, this.markerLayer],
      view: new View({
        center: [0, 0],
        zoom: 1,
      }),
      overlays: [this.popupOverlay],
    });

    this.map.on('click', (event) => {
      const features = this.map.getFeaturesAtPixel(event.pixel);
      if (features.length > 0) {
        const clickedFeature = features[0];
        const name = clickedFeature.get('name') || 'Inconnu';
        const geometry = clickedFeature.getGeometry();
        const coords = geometry instanceof Point ? toLonLat(geometry.getCoordinates()) : [];
        
        const popupContent = document.getElementById('popup-content') as HTMLElement;
        popupContent.innerHTML = `
          <strong>${name}</strong><br>
          Longitude: ${coords[0]?.toFixed(4) || 'N/A'}<br>
          Latitude: ${coords[1]?.toFixed(4) || 'N/A'}
        `;

        this.popupOverlay.setPosition(event.coordinate);
        popupElement.style.display = 'block';
      } else {
        popupElement.style.display = 'none';
      }
    });
  }
}
