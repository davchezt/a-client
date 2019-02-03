import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {
  NativeGeocoder,
  NativeGeocoderReverseResult,
  NativeGeocoderForwardResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder';

import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';

@Component({
  selector: 'page-profile-alamat',
  templateUrl: 'profile-alamat.html',
})
export class ProfileAlamatPage {
  @ViewChild(Content) content: Content;
  showToolbar: boolean = false;
  geocoderOptions: NativeGeocoderOptions = { useLocale: true, maxResults: 5, defaultLocale: "id_ID" };
  locationResult: any = [];
  isTracked: boolean = false;
  userLocation = {"latitude": null, "longitude": null};
  result:any = [];
  userData: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public ref: ChangeDetectorRef, public apiService: Api, public common: Common, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
    }
  }

  ionViewDidLoad() {
  }

  getMe() {
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    let userData = this.apiService.post("v1/user/me", postData);
    userData.subscribe((result) => {
      this.userData = result['data'];
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
    });
  }

  back() {
    this.navCtrl.pop();
  }

  save() {
    this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    // Fields
    postData.append('lokasi', this.locationResult.thoroughfare);
    postData.append('no', this.locationResult.subThoroughfare);
    postData.append('kecamatan', this.locationResult.subLocality);
    postData.append('kabupaten', this.locationResult.locality);
    postData.append('provinsi', this.locationResult.administrativeArea);
    postData.append('negara', this.locationResult.countryName);
    postData.append('kodepos', this.locationResult.postalCode);
    postData.append('kodenegara', this.locationResult.countryCode);
    // Lat-Lang
    postData.append('latitude', this.userLocation.latitude);
    postData.append('longitude', this.userLocation.longitude);
    
    let userData = this.apiService.post("v1/user/lat-lng", postData);
    userData.subscribe((result) => {
      //console.log(result);
      this.navCtrl.pop().then(() => {
        this.postLokasi();
        this.navParams.get("callback")("1");
      });
      this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
    });
  }

  postLokasi() {
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    // Field
    if (this.locationResult.length != 0) {
      postData.append('user_lokasi', this.locationResult.subLocality + ", " + this.locationResult.locality + " — " + this.locationResult.administrativeArea);
    }
    else {
      postData.append('user_lokasi', "");
    }
    let userLokasi = this.apiService.post("v1/user/lokasi", postData);
    userLokasi.subscribe((result) => {
      //console.log(result);
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
    });
  }

  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 80;
    this.ref.detectChanges();
  }

  scrollTop() {
    var that = this;
    setTimeout(function() {
      that.content.scrollToTop();
    }, 100);
  }

  locate() {
    this.common.presentLoading();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLocation.latitude = resp.coords.latitude
      this.userLocation.longitude = resp.coords.longitude
      this.reverseGeocode(resp.coords.latitude, resp.coords.longitude);
      this.common.closeLoading();
      this.isTracked = true;
    }).catch((error) => {
      console.log('Error getting location', error);
      this.common.closeLoading();
    });
  }

  forwardGeocode(location: string) {
    this.nativeGeocoder.forwardGeocode(location, this.geocoderOptions)
    .then((coordinates: NativeGeocoderForwardResult[]) => {
      console.log('The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude)
      //alert(coordinates[0].latitude);
      //alert(coordinates[0].longitude);
    })
    .catch((error: any) => {
      console.log(error)
    });
  }

  reverseGeocode(lat: any, lng: any) {
    this.nativeGeocoder.reverseGeocode(lat, lng, this.geocoderOptions)
    .then((result: NativeGeocoderReverseResult[]) => {
      console.log(JSON.stringify(result[0]));
      this.locationResult = result[0];
    })
    .catch((error: any) => {
      console.log(error)
    });
  }

}
