import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  LatLng,
  Circle
} from '@ionic-native/google-maps';

import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Content, ModalController } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';
import { WeatherProvider } from '../../providers/weather/weather';
import { mapStyle } from '../lahan/mapStyle';
import { AddKomoditasPage } from '../add-komoditas/add-komoditas';
import { EditLahanPage } from '../edit-lahan/edit-lahan';
import { DeleteModalPage } from '../delete-modal/delete-modal';
import { LocationTrackerPage } from '../location-tracker/location-tracker';

@Component({
  selector: 'page-lahan',
  templateUrl: 'lahan.html',
})
export class LahanPage {
  @ViewChild(Content) content: Content;
  showToolbar: boolean = false;
  lahanId: any;
  lahan: any = [];
  navigasi: string = "lahan";
  komoditas: any = [];
  adaKomoditas: boolean = false;

  // Map
  map: GoogleMap;
  result: any = [];
  markerTitle: string = "Lokasi Lahan";
  locationResult: any = [];
  mapOptions: GoogleMapOptions;
  style:any = [];

  // Cuaca
  weather:any = {
    coord:{},
    weather:[],
    base:"",
    main:{},
    wind:{},
    clouds:{},
    dt:0,
    sys:{},
    id:0,
    name:"",
    cod:0
  };
  currentWeather:any = {};
  forecast: any = [];
  adaWeather: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiService: Api, public common: Common, public ref: ChangeDetectorRef, private weatherProvider: WeatherProvider, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController) {
    this.lahanId = navParams.get('id');
    this.navigasi = "komoditas";
    this.style = mapStyle;
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
      this.getLahan();
    }
  }

  ionViewDidLoad() {
    document.getElementsByTagName('html')[0].className += 'ion-tabs-fix';
    this.navigasi = "komoditas";
    setTimeout(() => {
      this.initMap();
    }, 500);
  }

  ionViewDidEnter() {
    this.loadKomoditas();
  }

  ionViewWillEnter() {
    // console.log('will enter')
  }

  ionViewWillLeave() {
    // console.log('will leave')
    const nodeList = document.querySelectorAll('._gmaps_cdv_');
    document.getElementsByTagName('html')[0].className = '';

    for (let k = 0; k < nodeList.length; ++k) {
        nodeList.item(k).classList.remove('_gmaps_cdv_');
    }
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
      this.lahan = res.data;
      this.loadMap(this.lahan.latitude, this.lahan.longitude);
      this.getCuaca(this.lahan.latitude, this.lahan.longitude);
      this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
    });
  }

  loadKomoditas() {
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    let data = this.apiService.post("v1/komoditas/lahan/" + this.lahanId, postData);
    data.subscribe((result) => {
      let data: any = [];
      data = result;
      if (data.data.length > 0) {
        if (data.data[0].id) {
          this.komoditas = data.data;
          this.adaKomoditas = true;
        }
        else {
          this.adaKomoditas = false;
        }
      }
      else {
        this.adaKomoditas = false;
      }
    }, (error) => {
      console.log(error)
    });
  }

  initMap() {
    let loc = new LatLng(this.lahan.latitude, this.lahan.longitude);
    this.moveCamera(this.lahan.latitude, this.lahan.longitude);
      
    this.createMarker(loc, this.markerTitle, 'orange').then((marker: Marker) => {
      this.map.addCircle({
        center: marker.getPosition(),
        radius: 10,
        fillColor: "rgba(0, 0, 255, 0.5)",
        strokeColor: "rgba(0, 0, 255, 0.75)",
        strokeWidth: 1
      }).then((circle: Circle) => {
        marker.bindTo("position", circle, "center");
      });    
      marker.showInfoWindow();
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        marker.setTitle(this.lahan.lokasi);
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  // Map
  loadMap(latitude: any, longitude: any) {
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
      },
      styles: this.style
    };

    this.map = GoogleMaps.create('map_canvas', this.mapOptions);
    this.map.setPadding(80, 0, 0, 0);
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
      draggable: true
    }
    return this.map.addMarker(markerOptions);
  }

  // Cuaca
  getCuaca = (lat: number, lng: number) => {
    this.weatherProvider.getWeather(lat, lng)
    .subscribe((result) => {
      this.weather = result;
      this.currentWeather = this.weather.weather[0];
      var prefix = 'wi wi-';
      var code = this.weather.weather[0].id;
      var icon = this.weatherProvider.weatherIcons[code].icon;

      if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
        icon = 'day-' + icon;
      }

      icon = prefix + icon;
      this.currentWeather.icon = icon;
      //console.log(this.weather);
    }, (error) => {
      console.log(error);
    });

    this.weatherProvider.getForecast(lat, lng)
    .subscribe((result) => {
      this.forecast = result;
      //console.log(result);
    }, (error) => {
      console.log(error);
    });
  }

  GetIcon = (id: number) => {
    var prefix = 'wi wi-';
    var icon = this.weatherProvider.weatherIcons[id].icon;

    // If we are not in the ranges mentioned above, add a day/night prefix.
    if (!(id > 699 && id < 800) && !(id > 899 && id < 1000)) {
      icon = 'day-' + icon;
    }

    // Finally tack on the prefix.
    icon = prefix + icon;
    return icon;
  }

  GetDay = (time: number) => {
    let day = new Date(time*1000).toISOString();
    let d = new Date(day);
    let weekday = [];
    weekday[0] = "Minggu";
    weekday[1] = "Senin";
    weekday[2] = "Selasa";
    weekday[3] = "Rabu";
    weekday[4] = "Kamis";
    weekday[5] = "Jum'at";
    weekday[6] = "Sabtu";

    let n = weekday[d.getDay()];
    return n;
  }

  GetTime = (time: number) => {
    return new Date(time * 1000);//.toISOString();
  }

  windDirection = (deg) => {
    if (deg > 11.25 && deg < 33.75){
      return "Utara Timur Laut";
    }else if (deg > 33.75 && deg < 56.25){
      return "Timur Timur Laut";
    }else if (deg > 56.25 && deg < 78.75){
      return "Timur";
    }else if (deg > 78.75 && deg < 101.25){
      return "Timur Tengara";
    }else if (deg > 101.25 && deg < 123.75){
      return "Timur Menenggara";
    }else if (deg > 123.75 && deg < 146.25){
      return "Tenggara";
    }else if (deg > 146.25 && deg < 168.75){
      return "Selatan Menenggara";
    }else if (deg > 168.75 && deg < 191.25){
      return "Selatan";
    }else if (deg > 191.25 && deg < 213.75){
      return "Selatan Barat Daya";
    }else if (deg > 213.75 && deg < 236.25){
      return "Barat Daya";
    }else if (deg > 236.25 && deg < 258.75){
      return "Barat Barat Daya";
    }else if (deg > 258.75 && deg < 281.25){
      return "Barat";
    }else if (deg > 281.25 && deg < 303.75){
      return "Barat Barat Laut";
    }else if (deg > 303.75 && deg < 326.25){
      return "Barat Laut";
    }else if (deg > 326.25 && deg < 348.75){
      return "Utara Barat Laut";
    }else{
      return "Utara"; 
    }
  }

  nameToIndo = (val) => {
    //let val = this.navParams.get("weatherInfo")
    if(val == "Rain"){
      return 'Hujan';
    } else if(val == "Clear"){
      return 'Cerah';
    } else if(val == "Clouds"){
      return 'Berawan';
    } else if(val == "Drizzle"){
      return 'Gerimis';
    } else if(val == "Snow"){
      return 'Salju';
    } else if(val == "ThunderStorm"){
      return 'Hujan badai';
    } else {
      return 'Cerah';
    }
  }

  viewLocation() {
    if (this.lahan.latitude && this.lahan.longitude) {
      this.navCtrl.push(LocationTrackerPage, {lat: this.lahan.latitude, lng: this.lahan.longitude}).then(() => {
        this.callback();
      });
    }
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Lengkapi',
      buttons: [{
        text: 'Tambah Komoditas',
        role: 'destructive',
        icon: 'add',
        handler: () => {
          this.navCtrl.push(AddKomoditasPage, {pageId: 'komoditas', lahanId: this.lahanId, callback: this.callback});
          // this.presentAddKomoditas(this.lahanId);
        }
      },{
        text: 'Ubah Lahan',
        icon: 'create',
        handler: () => {
          this.navCtrl.push(EditLahanPage, { id: this.lahanId, callback: this.callback });
        }
      },{
        text: 'Hapus Lahan',
        icon: 'trash',
        handler: () => {
          this.presentDeleteModal(this.lahanId, "lahan");
        }
      },{
        text: 'Tutup',
        role: 'cancel',
        icon: 'close',
        cssClass: 'border-top',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    actionSheet.present();
  }

  presentDeleteModal(id: number, type: string) {
    let deleteModal = this.modalCtrl.create(DeleteModalPage, { itemId: id, itemType: type });
    deleteModal.present();
    deleteModal.onDidDismiss(() => {
      this.navCtrl.pop().then(() => {
        this.navParams.get("callback")("lahan");
      });
    });
  }

  presentAddKomoditas(lid: any) {
    let addModal = this.modalCtrl.create(AddKomoditasPage, { pageId: 'komoditas', lahanId: lid });
    addModal.present();
    addModal.onDidDismiss(() => {
      if (localStorage.getItem('userData')) {
        this.result = JSON.parse(localStorage.getItem('userData'));
        this.loadKomoditas();
      }
    });
  }

  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 10;
    this.ref.detectChanges();
  }

  segmentChanged(event) {
    this.navigasi = event.value;
    var that = this;
    if (this.navigasi == 'cuaca') {
      this.content.scrollTo(0, 300, 500);
    }
    else {
      that.content.scrollTo(0, 0);
    }
    // console.log(event.value);
  }

  scrollBottom() {
    var that = this;
    setTimeout(function() {
      that.content.scrollToBottom();
    }, 300);
  }

  callback = (data?) => {
    this.getLahan();
    this.loadKomoditas();
    setTimeout(() => {
      this.initMap();
    }, 500);
  }

}
