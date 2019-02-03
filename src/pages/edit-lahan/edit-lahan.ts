import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';

import { Geolocation } from '@ionic-native/geolocation';
import {
  NativeGeocoder,
  NativeGeocoderReverseResult,
  NativeGeocoderForwardResult,
  NativeGeocoderOptions
} from '@ionic-native/native-geocoder';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-edit-lahan',
  templateUrl: 'edit-lahan.html',
})
export class EditLahanPage {
  @ViewChild(Content) content: Content;
  @ViewChild('footerInput') footerInput;
  @ViewChild('namaLahan') namaLahan;
  showToolbar:boolean = false;
  lahanId: any;
  hasChange: boolean = false;
  result:any = [];
  lahan: any = {"id":"", "nama":"", "lokasi":"", "latitude":"", "longitude":"", "luas":"", "satuan":"", "foto":""};
  userInput: any = [];
  isTracked: boolean = false;
  geocoderOptions: NativeGeocoderOptions = { useLocale: true, maxResults: 5, defaultLocale: "id_ID" };
  locationResult: any = [];
  fotoScr: any;
  fotoChanged: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ref: ChangeDetectorRef, public apiService: Api, public common: Common, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder, private camera: Camera) {
    this.lahanId = navParams.get('id');
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
      this.getLahan();
    }
    window.addEventListener('native.keyboardshow', (e) => {
      this.footerInput.nativeElement.style.bottom = (<any>e).keyboardHeight + 'px';
    });

    window.addEventListener('native.keyboardhide', () => {
      this.footerInput.nativeElement.style.bottom = '0';
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EditLahanPage');
  }

  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 80;
    this.ref.detectChanges();
  }

  scrollTop() {
    var that = this;
    setTimeout(() => {
      that.content.scrollToTop();
    }, 100);
  }

  setFocusNama() {
    var that = this;
    setTimeout(() => {
      //that.namaLahan.setBlur();
      that.namaLahan.setFocus();
    }, 100);
  }

  getLahan() {
    let res: any = [];
    this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    // Fields
    let userData = this.apiService.post("v1/lahan/" + this.lahanId, postData);
    userData.subscribe((result) => {
      res = result;
      this.userInput = res.data;

      this.lahan.id = this.userInput.id;
      this.lahan.nama = this.userInput.nama;
      this.lahan.lokasi = this.userInput.lokasi;
      this.lahan.latitude = this.userInput.latitude;
      this.lahan.longitude = this.userInput.longitude;
      this.lahan.luas = this.userInput.luas;
      this.lahan.satuan = this.userInput.satuan;
      this.lahan.foto = this.userInput.foto;

      this.fotoScr = this.apiService.url + "/" + this.lahan.foto;

      //this.loadMap(this.lahanData.latitude, this.lahanData.longitude);
      //this.getCuaca(this.lahanData.latitude, this.lahanData.longitude);
      this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
    });
  }

  locate() {
    this.common.presentLoading();
    this.geolocation.getCurrentPosition().then((resp) => {
      this.userInput.latitude = resp.coords.latitude;
      this.userInput.longitude = resp.coords.longitude;
      this.reverseGeocode(resp.coords.latitude, resp.coords.longitude);
      this.common.closeLoading();
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
      this.userInput.lokasi = this.locationResult.subLocality + ", " + this.locationResult.locality + " — " + this.locationResult.administrativeArea;
      this.hasChange = true;
    })
    .catch((error: any) => {
      this.hasChange = false;
      console.log(error)
    });
  }

  checkValueLuas() {
    this.hasChange = false;
    if (this.userInput.luas != this.lahan.luas) {
        this.hasChange = true;
    }
  }

  checkValueNama() {
    this.hasChange = false;
    if (this.userInput.nama != this.lahan.nama) {
        this.hasChange = true;
    }
  }

  onChangeSatuan() {
    this.hasChange = false;
    if (this.lahan.satuan != this.userInput.satuan) {
      this.hasChange = true;
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
      this.fotoScr = 'data:image/jpeg;base64,' + imageData;
      this.fotoChanged = true;
      this.hasChange = true;
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
      this.fotoScr = 'data:image/jpeg;base64,' + imageData;
      this.fotoChanged = true;
      this.hasChange = true;
      this.common.closeLoading();
      // console.log(imageData);
    }, (err) => {
      this.common.closeLoading();
      this.common.presentToast(err);
    });
  }

  save() {
    let res: any = [];
    this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    
    postData.append('lokasi', this.locationResult.thoroughfare);
    postData.append('no', this.locationResult.subThoroughfare);
    postData.append('kecamatan', this.locationResult.subLocality);
    postData.append('kabupaten', this.locationResult.locality);
    postData.append('provinsi', this.locationResult.administrativeArea);
    postData.append('negara', this.locationResult.countryName);
    postData.append('kodepos', this.locationResult.postalCode);
    postData.append('kodenegara', this.locationResult.countryCode);
    // Lat-Lang
    postData.append('nama', this.userInput.nama);
    postData.append('lokasi', this.userInput.lokasi);
    postData.append('latitude', this.userInput.latitude);
    postData.append('longitude', this.userInput.longitude);
    postData.append('luas', this.userInput.luas);
    postData.append('satuan', this.userInput.satuan);

    if (this.fotoChanged) {
      postData.append('foto', this.fotoScr);
    }

    let userData = this.apiService.post("v1/lahan/edit/" + this.lahanId, postData);
    userData.subscribe((result) => {
      res = result;
      this.common.closeLoading();
      this.common.presentToast(res.data);
      this.navCtrl.pop().then(() => {
        this.navParams.get("callback")("lahan");
      });
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
    }); 
  }

  back() {
    this.navCtrl.pop();
  }

}
