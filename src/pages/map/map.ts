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

      this.initializeObservables();

    platform.ready().then(() => {
      console.log('consultando getCurrentPosition');
      let options = { timeout: 10000, enableHighAccuracy: true, maximumAge: 3600 };
      this.geolocation.getCurrentPosition(options)
        .then(({ coords: { latitude, longitude } }) => {
          api.getNearbyBusiness(latitude, longitude, 3000).subscribe(({ data }) => {
            console.log(latitude, longitude, data.nearbyBusinesses);
          });
        })
        .catch((error) => {
          console.error(error);
        });

      this.loadMap(0, 0, []);
    });
  }

  initializeObservables() {
    this.nearbyBusinesses = new Observable<Business[]>();
    this.userPosition     = this.initUserPositionObserver();
  }

  initUserPositionObserver() : Observable<Geoposition> {
    const userPosition = new Subject<Geoposition>();

    this.geolocation
      .getCurrentPosition()
      .then(p => userPosition.next(p))
      .catch(e => userPosition.next());

    return userPosition.asObservable();
  }

  getUserPosition() {

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