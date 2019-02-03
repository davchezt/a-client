import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  LatLng
} from '@ionic-native/google-maps';

import {
  NativeGeocoder,
  NativeGeocoderReverseResult,
  NativeGeocoderForwardResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder';

import { Geolocation } from '@ionic-native/geolocation';

import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ViewController, Slides, FabContainer, Content } from 'ionic-angular';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';
import { CameraOptions, Camera } from '@ionic-native/camera';


@Component({
  selector: 'page-add-lahan',
  templateUrl: 'add-lahan.html',
})
export class AddLahanPage {
  @ViewChild(Slides) slides: Slides;
  @ViewChild('footerInput') footerInput;
  @ViewChild(Content) content: Content;
  @ViewChild('inputNama') inputNama;
  @ViewChild('inputLokasi') inputLokasi;
  @ViewChild('inputLuas') inputLuas;
  
  pageId: any;
  currentPage: number = 0;
  tottalPages: number;
  disableBack: boolean = true;
  disableNext: boolean = true;
  finish: boolean = false;
  hasFocus: boolean = false;
  slide = [];
  userData = {"nama_lahan":"", "lokasi_lahan":"", "lahan_latutude":"", "lahan_longitude":"", "luas_lahan":"", "satuan_lahan":"T", "foto_lahan":""};

  // Map
  map: GoogleMap;
  userLocation = {"latitude":null, "longitude":null};
  loc: LatLng;
  bIsShowImage: boolean = false;
  imgSrc: string;
  result: any = [];
  markerTitle: string = "Lokasi Anda saat ini";
  markerTitleLoc: string = "Lokasi Lahan";
  geocoderOptions: NativeGeocoderOptions = { useLocale: true, maxResults: 5, defaultLocale: "id_ID" };
  locationResult: any = [];
  isTracked: boolean = false;
  locMarker: Marker;
  mapOptions: GoogleMapOptions;
  showToolbar: boolean;
  callbackFnc: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private geolocation: Geolocation, public apiService: Api, public common: Common, public http: HttpClient, private nativeGeocoder: NativeGeocoder, private camera: Camera, public ref: ChangeDetectorRef) {
    this.pageId = this.navParams.get('pageId');
    this.callbackFnc = this.navParams.get("callback");
    this.slide = [{
        name: "nama"
      }, {
        name: "lokasi"
      }, {
        name: "luas"
      }, {
        name: "foto"
    }];
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
    }
    
    window.addEventListener('native.keyboardshow', (e) => {
      this.footerInput.nativeElement.style.bottom = (<any>e).keyboardHeight + 'px';
    });

    window.addEventListener('native.keyboardhide', () => {
      this.footerInput.nativeElement.style.bottom = '0';
    });
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
    // console.log(this.slide.length);
  }

  checkValue(event) {
    let val = event.target.value;
    if (val.length >= 1) {
      this.disableNext = false;
    }
    else {
      this.disableNext = true;
    }
  }

  scrlTop() {
    if (this.currentPage == 1) {
      this.forwardGeocode(this.userData.lokasi_lahan);
    }
    this.hasFocus = false;
    var that = this;
    setTimeout(function() {
      that.content.scrollToTop();
    }, 100);
  }

  scrlBottom() {
    this.hasFocus = true;
    var that = this;
    setTimeout(function() {
      that.content.scrollToBottom();
    }, 100);
  }

  setBlurInput() {
    if (this.currentPage == 0) { // Nama Lahan
      this.inputNama.setBlur();
    }
    if (this.currentPage == 1) { // Lokasi Lahan
      this.inputLokasi.setBlur();
    }
    if (this.currentPage == 2) { // Luas Lahan
      this.inputLuas.setBlur();
    }
  }

  onChangeSatuan(event) {
    this.disableNext = false;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  goNext() {
    this.slides.lockSwipes(false);
    let page = this.currentPage + 1;
    this.goToSlide(page);
  }

  goPrev() {
    this.slides.lockSwipes(false);
    let page = this.currentPage - 1;
    this.goToSlide(page);
  }

  goToSlide(page: number) {
    this.slides.slideTo(page, 100);
    this.slides.lockSwipes(true);
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    this.currentPage = currentIndex;
    if (this.currentPage == 0) {
      this.disableBack = true;
    }
    else {
      this.disableBack = false;
    }
    if (this.currentPage == this.slide.length - 1) {
      this.finish = true;
    }
    else {
      this.finish = false;
    }
    if (this.currentPage == 1) {
      this.loadMap(-6.9370992, 107.7813872, 'map_canvas');
      this.disableNext = true;
    }
    if (this.currentPage == 2) {
      this.disableNext = true;
      if (this.userData.luas_lahan.length != 0) {
        this.disableNext = false;
      }
    }
    if (this.currentPage == 3) {
      this.saveImage();
    }
  }

  openGalery() {
    this.common.presentLoading();
    const options: CameraOptions = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL, // FILE_URI || DATA_URL
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    
    this.camera.getPicture(options).then((imageData) => {
      this.imgSrc = 'data:image/jpeg;base64,' + imageData;
      this.userData.foto_lahan = 'data:image/jpeg;base64,' + imageData;
      this.common.closeLoading();
      // console.log(imageData);
    }, (err) => {
      this.common.closeLoading();
      this.common.presentToast(err);
    });
  }

  openCamera() {
    this.common.presentLoading();
    const options: CameraOptions = {
      quality: 75, // 100 = crash, 50 default
      destinationType: this.camera.DestinationType.DATA_URL, // FILE_URI || DATA_URL
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
      this.imgSrc = 'data:image/jpeg;base64,' + imageData;
      this.userData.foto_lahan = 'data:image/jpeg;base64,' + imageData;
      this.common.closeLoading();
      // console.log(imageData);
    }, (err) => {
      this.common.closeLoading();
      this.common.presentToast(err);
    });
  }

  save() {
    this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    // Fields
    postData.append('nama', this.userData.nama_lahan);
    postData.append('lokasi', this.userData.lokasi_lahan);
    postData.append('latitude', this.userData.lahan_latutude);
    postData.append('longitude', this.userData.lahan_longitude);
    postData.append('luas', this.userData.luas_lahan);
    postData.append('satuan', this.userData.satuan_lahan);
    postData.append('foto', this.userData.foto_lahan);
    let userData = this.apiService.post("v1/lahan/add", postData);
    userData.subscribe((result) => {
      console.log(result);
      this.common.closeLoading();
      if (this.callbackFnc) {
        this.navCtrl.pop().then(() => {
          this.callbackFnc("1");
        });
      }
      else {
        this.dismiss();
      }
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
    });
  }

  openSocial(network: string, fab: FabContainer) {
    console.log('Share in ' + network);
    fab.close();
  }

  ionViewWillLeave() {
    const nodeList = document.querySelectorAll('._gmaps_cdv_');

    for (let k = 0; k < nodeList.length; ++k) {
        nodeList.item(k).classList.remove('_gmaps_cdv_');
    }
  }

  // Map
  loadMap(latitude: any, longitude: any, canvas: string) {
    this.mapOptions = {
      camera: {
        target: {
          lat: latitude,
          lng: longitude
        },
        zoom: 18,
        tilt: 30
      },
      controls: {
        compass: true,
        //myLocationButton: true,
        indoorPicker: true,
        zoom: true
      },
      gestures: {
        scroll: true,
        tilt: true,
        rotate: true,
        zoom: true
      }
    };

    this.map = GoogleMaps.create('map_canvas', this.mapOptions);
    //this.map.on(GoogleMapsEvent.MY_LOCATION_BUTTON_CLICK).subscribe(() => {
    //  this.locate();
    //});
  }

  moveCamera(latitude: any, longitude: any) {
    let options: CameraPosition<any> = {
      target: {
        lat: latitude,
        lng: longitude
      },
      zoom: 18,
      tilt: 30
    }
    this.map.moveCamera(options);
  }

  moveMapCamera(loc: LatLng) {
    let options: CameraPosition<any> = {
      target: loc,
      zoom: 15,
      tilt: 10
    }
    this.map.moveCamera(options);
  }

  createMarker(loc: LatLng, title: string, icon?: string) {
    let markerOptions: MarkerOptions = {
      position: loc,
      title: title,
      icon: icon? icon: 'red',
      snippet: "Perkiraan lokasi lahan berdasarkan lokasi anda saat ini ",
      animation: "DROP",
    }
    return this.map.addMarker(markerOptions);
  }

  createMarkerTwoo(latitude, longitude, title: string, icon?: string) {
    let markerOptions: MarkerOptions = {
      position: {
        lat: latitude,
        lng: longitude
      },
      title: title,
      icon: icon? icon: 'red',
      snippet: "Perkiraan lokasi lahan berdasarkan hasil terbaik ",
      animation: "DROP",
    }
    return this.map.addMarker(markerOptions);
  }

  saveImage() {
    this.map.toDataURL().then(this.showImage.bind(this));
  }

  showImage(url: string) {
    this.bIsShowImage = true;
    this.imgSrc = url;
    this.userData.foto_lahan = url;
  }

  forwardGeocode(location: string) {
    this.common.presentLoading();
    this.nativeGeocoder.forwardGeocode(location, this.geocoderOptions)
    .then((coordinates: NativeGeocoderForwardResult[]) => {
      console.log('The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude);
      // input data
      this.userData.lahan_latutude = coordinates[0].latitude;
      this.userData.lahan_longitude = coordinates[0].longitude;
      
      this.moveCamera(coordinates[0].latitude, coordinates[0].longitude);
      this.reverseGeocode(coordinates[0].latitude, coordinates[0].longitude);
      
      this.createMarkerTwoo(coordinates[0].latitude, coordinates[0].longitude, this.markerTitleLoc).then((marker: Marker) => {
        this.locMarker = marker;
        marker.showInfoWindow();
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          marker.setTitle(this.userData.lokasi_lahan);
          // this.common.presentToast(marker.getTitle());
        });
      }).catch((err) => {
        console.log(err);
      });
      this.common.closeLoading();
      this.isTracked = true;
      this.disableNext = false;
    })
    .catch((error: any) => {
      console.log(error)
      this.common.closeLoading();
      this.disableNext = true;
    });
  }

  reverseGeocode(lat: any, lng: any) {
    this.nativeGeocoder.reverseGeocode(lat, lng, this.geocoderOptions)
    .then((result: NativeGeocoderReverseResult[]) => {
      console.log(JSON.stringify(result[0]));
      this.locationResult = result[0];
      this.userData.lokasi_lahan = this.locationResult.subLocality + ", " + this.locationResult.locality + " — " + this.locationResult.administrativeArea;
    })
    .catch((error: any) => {
      console.log(error)
    });
  }

  locate() {
    this.common.presentLoading();
    this.bIsShowImage = false;
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userLocation.latitude = resp.coords.latitude;
      this.userLocation.longitude = resp.coords.longitude;

      // input data
      this.userData.lahan_latutude = this.userLocation.latitude;
      this.userData.lahan_longitude = this.userLocation.longitude;

      this.loc = new LatLng(resp.coords.latitude, resp.coords.longitude);
      this.moveCamera(resp.coords.latitude, resp.coords.longitude);
      this.reverseGeocode(resp.coords.latitude, resp.coords.longitude);
      
      this.createMarker(this.loc, this.markerTitle).then((marker: Marker) => {
        this.locMarker = marker;
        marker.showInfoWindow();
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
          marker.setTitle(this.userData.lokasi_lahan);
          // this.common.presentToast(marker.getTitle());
        });
      }).catch((err) => {
        console.log(err);
      });
      this.common.closeLoading();
      this.isTracked = true;
      this.disableNext = false;
    }).catch((error) => {
      console.log('Error getting location', error);
      this.common.closeLoading();
      this.disableNext = true;
    });
  }

  uploadFile() {
    this.common.presentLoading();

    let postData = new FormData();
    postData.append('file', this.imgSrc);
    postData.append('user_id', this.result.user_id);
    postData.append('token', this.result.token);
    
    let data:Observable<any> = this.apiService.upload("/upload", postData);// this.http.post(url + "/upload", postData);
    data.subscribe((result) => {
      this.imgSrc = result.image_url;
      this.common.closeLoading();
      this.common.presentToast("Uploaded at: " + result.image_url);
    }, (error) => {
      this.common.closeLoading();
      this.common.presentToast("Tidak dapat menyimpan file di server");
    });
  }

  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 10;
    this.ref.detectChanges();
  }

}
