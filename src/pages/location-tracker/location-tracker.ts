import {
  NativeGeocoder,
  NativeGeocoderReverseResult,
  NativeGeocoderForwardResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder';

import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';

import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';

@Component({
  selector: 'page-location-tracker',
  templateUrl: 'location-tracker.html',
})
export class LocationTrackerPage {
  userLocation = {"latitude":null, "longitude":null};
  result: any = [];
  geocoderOptions: NativeGeocoderOptions = { useLocale: true, maxResults: 5, defaultLocale: "id_ID" };
  locationResult: any = [];
  isTracked: boolean = false;
  showToolbar:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiService: Api, public common: Common, public http: HttpClient, private nativeGeocoder: NativeGeocoder, public ref: ChangeDetectorRef) {
    this.userLocation.latitude = this.navParams.get('lat');
    this.userLocation.longitude = this.navParams.get('lng');
  }

  ionViewDidLoad() {
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
    }
    this.reverseGeocode(this.userLocation.latitude, this.userLocation.longitude);
  }

  ionViewWillLeave() {
    const nodeList = document.querySelectorAll('._gmaps_cdv_');

    for (let k = 0; k < nodeList.length; ++k) {
        nodeList.item(k).classList.remove('_gmaps_cdv_');
    }
  }

  onScroll($event: any) {
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 80;
    this.ref.detectChanges();
  }

  ionViewDidLeave() {
  }

  forwardGeocode(location: string) {
    this.nativeGeocoder.forwardGeocode(location, this.geocoderOptions)
    .then((coordinates: NativeGeocoderForwardResult[]) => {
      console.log('The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude)
    })
    .catch((error: any) => {
      console.log(error)
    });
  }

  reverseGeocode(lat: any, lng: any) {
    this.nativeGeocoder.reverseGeocode(lat, lng, this.geocoderOptions)
    .then((result: NativeGeocoderReverseResult[]) => {
      this.locationResult = result[0];
      this.isTracked = true;
    })
    .catch((error: any) => {
      console.log(error);
      this.isTracked = true;
    });
  }

}
