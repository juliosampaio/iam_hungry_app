import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
} from '@ionic-native/google-maps';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';

import { Business } from '../../shared/models';
import { ApiProvider } from '../../providers/api/api';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  map: GoogleMap;
  mapElement: HTMLElement;
  userPosition: Observable<Geoposition>;
  nearbyBusinesses: Observable<Business[]>;

  constructor(
    private api: ApiProvider,
    private geolocation: Geolocation,
    private googleMaps: GoogleMaps,
    public platform: Platform) {

      platform.ready().then(() => {
        this.initializeObservables();
        this.initializeSubscriptions();
        this.loadMap(0, 0, []);
      });
  }

  initializeSubscriptions() {
    this.userPosition.subscribe(({coords: {latitude, longitude}}) => {
      this.centerLocation(latitude, longitude);
    });
    this.nearbyBusinesses.subscribe(businesses => {
      this.addMarkers(businesses);
    });
  }

  initializeObservables() {
    this.userPosition     = this.initUserPositionObserver();
    this.nearbyBusinesses = this.initNearbyBusinessesObserver();
  }

  initNearbyBusinessesObserver() : Observable<Business[]> {
    const nearbyBusinesses = new Subject<Business[]>();
    this.userPosition.subscribe(({coords: {latitude, longitude}}) => {
      this.api
        .getNearbyBusiness(latitude, longitude, 3000)
        .subscribe(b => nearbyBusinesses.next(b.data.nearbyBusinesses));
    })
    return nearbyBusinesses.asObservable();
  }

  initUserPositionObserver() : Observable<Geoposition> {
    const options      = { timeout: 10000, enableHighAccuracy: true, maximumAge: 3600 };
    const userPosition = new Subject<Geoposition>();

    this.geolocation
      .getCurrentPosition(options)
      .then(p => userPosition.next(p))
      .catch(e => userPosition.next({timestamp: 0,coords: {latitude: -23.617995,longitude:-46.614015, accuracy: 0, altitude: 0, altitudeAccuracy: 0, heading: 0, speed: 0}}));

    return userPosition.asObservable();
  }

  centerLocation(lat: number, lng: number) {
    console.log(lat, lng, `location`)
    // create CameraPosition
    let position: CameraPosition<any> = {
      target: {
        lat, lng
      },
      zoom: 18,
      tilt: 30
    };

    // move the map's camera to position
    this.map.moveCamera(position);
  }

  addMarkers(businesses: Business[]) {
    this.map.clear();
    businesses.forEach(marker => {
      const coordinates = marker.coordinates.split(',').map(parseFloat);
      this.map.addMarker({
        title: marker.name,
        icon: 'blue',
        animation: 'DROP',
        position: {
          lat: coordinates[0],
          lng: coordinates[1]
        }
      })
    });
  }

  loadMap(lat, lng, markers) {
    this.mapElement = document.getElementById('map');

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: { lat, lng },
        zoom: 18,
        tilt: 30
      }
    };

    this.map = this.googleMaps.create(this.mapElement, mapOptions);

    this.map.one(GoogleMapsEvent.MAP_READY)
      .then(() => {
        markers.forEach((marker) => {
          const coordinates = marker.coordinates.split(',').map(parseFloat);
          this.map.addMarker({
            title: marker.name,
            icon: 'blue',
            animation: 'DROP',
            position: {
              lat: coordinates[0],
              lng: coordinates[1]
            }
          })
            .then(marker => {
              marker.on(GoogleMapsEvent.MARKER_CLICK)
                .subscribe(() => {
                  alert('clicked');
                });
            });
        });
      });
  }
}