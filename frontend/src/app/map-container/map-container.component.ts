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
import { LocationCardComponent } from '../components/location-card/location-card.component';

// Interface pour représenter une localisation
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

  // Fonction pour zoomer sur la carte
  onZoomIn(): void {
    if (!this.map) return;
    const view = this.map.getView();
    const currentZoom = view.getZoom() || 10;
    view.animate({ zoom: currentZoom + 1, duration: 250 });
  }

  // Fonction pour dézoomer sur la carte
  onZoomOut(): void {
    if (!this.map) return;
    const view = this.map.getView();
    const currentZoom = view.getZoom() || 10;
    view.animate({ zoom: currentZoom - 1, duration: 250 });
  }

  // Fonction appelée lorsqu'une localisation est ajoutée
  onLocationAdded(): void {
    this.loadUserLocations();
  }

  // Initialisation de la carte après le rendu de la vue
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initMap();
        this.loadUserLocations();
      });
    }
  }

  // Chargement des localisations de l'utilisateur depuis l'API
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

  // Mise à jour des marqueurs sur la carte
  private updateMarkers(locations: Location[]): void {
    this.vectorSource.clear();
    
    const features = locations.map(location => {
      return new Feature({
        geometry: new Point(fromLonLat([location.longitude, location.latitude])),
        name: `Location ${location.id}`,
        locationData: location
      });
    });

    // Appliquer un style aux marqueurs
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

  // Initialisation de la carte OpenLayers
  private initMap(): void {
    // Couche de fond OpenStreetMap
    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    this.vectorSource = new VectorSource();
    this.markerLayer = new VectorLayer({
      source: this.vectorSource
    });

    // Création de l'élément HTML pour l'infobulle
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

    // Définition de l'overlay pour afficher les détails d'un marqueur
    this.popupOverlay = new Overlay({
      element: popupElement,
      positioning: 'bottom-center',
      offset: [0, -15],
    });

    // Initialisation de la carte
    this.map = new Map({
      target: 'ol-map',
      layers: [osmLayer, this.markerLayer],
      view: new View({
        center: [0, 0],
        zoom: 1,
      }),
      overlays: [this.popupOverlay],
    });

    // Gestion des clics sur la carte pour afficher les détails des marqueurs
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