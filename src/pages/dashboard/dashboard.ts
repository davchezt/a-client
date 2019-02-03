import { Component, ChangeDetectorRef  } from '@angular/core';
import { NavController, NavParams, PopoverController, ModalController, ItemSliding, Events, ActionSheetController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { PopoverDashboardPage } from '../popover-dashboard/popover-dashboard';
import { PopoverPage } from '../popover/popover';
import { WeatherProvider } from '../../providers/weather/weather';
import { DeleteModalPage } from '../delete-modal/delete-modal';
import { AddLahanPage } from '../add-lahan/add-lahan';
import { Common } from '../../providers/common/common';
import { Api } from '../../providers/api/api';
import { ProfileAlamatPage } from '../profile-alamat/profile-alamat';
import { LahanPage } from '../lahan/lahan';
import { EditLahanPage } from '../edit-lahan/edit-lahan';
import { EditKomoditasPage } from '../edit-komoditas/edit-komoditas';
import { AddKomoditasPage } from '../add-komoditas/add-komoditas';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  navigasi: string = "lahan";
  isAndroid: boolean = false;
  showToolbar:boolean = false;
  userData = {"user_id":null, "token":"", "request_token":"1"};

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
  location: { city: string, country: string };
  adaWeather: boolean = false;

  lahan: any = [];
  adaLahan: boolean = false;
  komoditas: any = [];
  adaKomoditas: boolean = false;
  cuacaLahan: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, platform: Platform, public popoverCtrl: PopoverController, public modalCtrl: ModalController, public ref: ChangeDetectorRef, private weatherProvider: WeatherProvider, public events: Events, public apiService: Api, public common: Common, private geolocation: Geolocation, public actionSheetCtrl: ActionSheetController) {
    this.isAndroid = platform.is('android');
    this.navigasi = "lahan";

    if (localStorage.getItem('userData')) {
      let result = JSON.parse(localStorage.getItem('userData'));
      this.userData.user_id = parseInt(result.user_id);
      this.userData.token = result.token;
    }

    // this.getLahan();
  }

  addLahan() {
    this.presetntAddModal();
  }

  lihatLahan(item: ItemSliding) {
    this.navCtrl.push(LahanPage, { id: item['id'], callback: this.callbackLahan });
  }

  editLahan(item: ItemSliding) {
    this.navCtrl.push(EditLahanPage, { id: item['id'], callback: this.callbackLahan });
  }
  
  deleteLahan(item: ItemSliding) {
    let itemId = item['id'];
    this.presentDeleteModal(itemId, "lahan");
  }

  // Komoditas
  edit(item: ItemSliding) {
    this.navCtrl.push(EditKomoditasPage, { id: item['id'], callback: this.callbackLahan });
  }

  view(item: ItemSliding) {
    this.navCtrl.push(LahanPage, { id:item['id'] }).then((e) => {
      this.navigasi = "lahan";
    });
  }
  
  delete(item: ItemSliding) {
    let itemId = item['id'];
    this.presentDeleteModal(itemId, "komoditas");
  }

  segmentChanged(event) {
    // console.log(event.value);
  }

  ionViewDidLoad() {
    this.navigasi = "lahan";
    // console.log(this.adaKomoditas);
  }

  ionViewDidEnter() {
    // this.events.publish('user:login', Date.now());
    this.getLahan();
    this.getKomoditas();
  }

  presentDeleteModal(id: number, type: string) {
    let deleteModal = this.modalCtrl.create(DeleteModalPage, { itemId: id, itemType: type });
    deleteModal.present();
    deleteModal.onDidDismiss(() => {
      if (localStorage.getItem('userData')) {
        let result = JSON.parse(localStorage.getItem('userData'));
        this.userData.user_id = parseInt(result.user_id);
        this.userData.token = result.token;
      }
      this.getLahan();
      this.getKomoditas();
    });
  }

  presetntAddModal() {
    let addModal = this.modalCtrl.create(AddLahanPage, { pageId: 'lahan'});
    addModal.present();
    addModal.onDidDismiss(() => {
      if (localStorage.getItem('userData')) {
        let result = JSON.parse(localStorage.getItem('userData'));
        this.userData.user_id = parseInt(result.user_id);
        this.userData.token = result.token;
      }
      this.getLahan();
      this.getKomoditas();
    });
  }

  presentAddKomoditas(lid: number) {
    let addModal = this.modalCtrl.create(AddKomoditasPage, { pageId: 'komoditas', lahanId: lid });
    addModal.present();
    addModal.onDidDismiss(() => {
      if (localStorage.getItem('userData')) {
        let result = JSON.parse(localStorage.getItem('userData'));
        this.userData.user_id = parseInt(result.user_id);
        this.userData.token = result.token;
      }
      this.getLahan();
      this.getKomoditas();
    });
  }

  presentPopover(MyEvent) {
    let btnid = MyEvent.target.parentElement.getAttribute("id");
    let btnname = MyEvent.target.parentElement.getAttribute("name");
    let btntype = MyEvent.target.parentElement.getAttribute("type");
    let popover = this.popoverCtrl.create(PopoverPage, {id: btnid, name: btnname, type: btntype, callback: this.actionMore });
    popover.present({
      ev: MyEvent
    });
  }

  presentActionSheet(id_lahan, name, type) {
    // console.log(id_lahan);
    // console.log(name);
    // console.log(type);
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Lengkapi',
      buttons: [{
        text: 'Tambah Komoditas',
        role: 'destructive',
        icon: 'add',
        handler: () => {
          this.presentAddKomoditas(id_lahan);
        }
      },
      // {
      //   text: 'Lihat Lahan',
      //   icon: 'laptop',
      //   handler: () => {
      //     this.navCtrl.push(LahanPage, { id: id_lahan }).then((e) => {
      //       this.navigasi = "lahan";
      //     });
      //   }
      // },
      {
        text: 'Ubah Lahan',
        icon: 'create',
        handler: () => {
          this.navCtrl.push(EditLahanPage, { id: id_lahan, callback: this.callbackLahan });
        }
      },{
        text: 'Hapus Lahan',
        icon: 'trash',
        handler: () => {
          this.presentDeleteModal(id_lahan, "lahan");
        }
      },{
        text: 'Tutup',
        role: 'cancel',
        icon: 'close',
        cssClass: 'border-top',
        handler: () => {
        }
      }]
    });
    actionSheet.present();
  }

  presentPopoverDashboard(navigasi) {
    let popover = this.popoverCtrl.create(PopoverDashboardPage, {
      id: this.userData.user_id,
      token: this.userData.token,
      page: this.navigasi,
      callback: this.callbackLahan
    });
    popover.present({
      ev: navigasi
    });
  }

  // Cuaca
  ionViewWillEnter() {
    let result = {"latitude":null, "longitude":null};
    if (localStorage.getItem('userData')) {
      let data = JSON.parse(localStorage.getItem('userData'));
      result.latitude = data.latitude;
      result.longitude = data.longitude;
    }
    if (result.latitude != null && result.longitude != null) {
      this.adaWeather = true;
    }
    else {
      this.adaWeather = false;
    }

    if (this.adaWeather) {
      // console.log("start weather services");
      this.getCuaca(result.latitude, result.longitude);
    }
  }

  getLahan() {
    let postData = new FormData();
    postData.append('uid', this.userData.user_id);
    postData.append('token', this.userData.token);
    let data = this.apiService.post("v1/lahan", postData);
    data.subscribe((result) => {
      let data: any = [];
      data = result;
      if (data.data.length > 0) {
        if (data.data[0].id) {
          this.lahan = data.data;
          for (let lhn of data.data) {
            let lat = lhn.latitude;
            let lng = lhn.longitude;
            let idLahan = lhn.id;
            this.getCuacaLahan(idLahan, lat, lng);
          }
          this.adaLahan = true;
        }
        else {
          this.adaLahan = false;
        }
      }
      else {
        this.adaLahan = false;
      }
    }, (error) => {
      this.adaLahan = false;
    });
  }

  getKomoditas() {
    let postData = new FormData();
    postData.append('uid', this.userData.user_id);
    postData.append('token', this.userData.token);
    let data = this.apiService.post("v1/komoditas", postData);
    data.subscribe((result) => {
      let data: any = [];
      data = result;
      // console.log(data)
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
      this.adaKomoditas = false;
    });
  }

  getLuas = (luas: string) => {
    let rt: string;
    switch(luas) {
    case "T":
      rt = "Tumbak";
      break;
    case "M":
      rt = "Meter";
      break;
    default:
      rt = "Hektar";
      break;
    }
    return rt;
  }

  findCuaca = (id:any) => {
    for (let cu of this.cuacaLahan) {
      if (cu.id == id) {
        // console.log(cu);
        return cu.cuaca;
      }
    }
    return false;
  }

  locate() {
    this.common.presentLoading();
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      // resp.coords.longitude
      this.getCuaca(resp.coords.latitude, resp.coords.longitude);
      this.common.closeLoading();
    }).catch((error) => {
      console.log('Error getting location', error);
      this.common.closeLoading();
    });
  }

  getCuacaLahan(idLahan: number, lat: number, lng: number) {
    let weathers: any = [];
    let currentWeather: any = [];
    this.weatherProvider.getWeather(lat, lng)
    .subscribe((result) => {
      weathers = result;
      currentWeather = weathers.weather[0];
      var prefix = 'wi wi-';
      var code = weathers.weather[0].id;
      var icon = this.weatherProvider.weatherIcons[code].icon;

      if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
        icon = 'day-' + icon;
      }

      icon = prefix + icon;
      currentWeather.icon = icon;

      this.cuacaLahan.push({ id:idLahan, cuaca: currentWeather });
    }, (error) => {
      console.log(error);
    });
  }

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

  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 10;
    this.ref.detectChanges();
  }

  openAlamat() {
    this.navCtrl.push(ProfileAlamatPage, { callback: this.callback });
  }

  openSearch() {
    this.navCtrl.push(SearchPage, { callback: this.callback });
  }

  callback = (data?) => {
    this.common.presentLoading();
    let resultData: any = [];;
    let postData = new FormData();
    postData.append('uid', this.userData.user_id);
    postData.append('token', this.userData.token);
    postData.append('update', data ? data : "1");
    let userData = this.apiService.post("v1/user/me", postData);
    userData.subscribe((result) => {
      resultData = result;
      localStorage.setItem('userData', JSON.stringify(resultData.data));
      let res = {"latitude":null, "longitude":null};
      res.latitude = resultData.data.latitude;
      res.longitude = resultData.data.longitude;
      if (res.latitude != null && res.longitude != null) {
        this.adaWeather = true;
        this.getCuaca(res.latitude, res.longitude);
      }
      this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
    });
  }

  callbackLahan = (data?) => {
    if (data == 'komoditas') {
      this.navigasi = "komoditas";
      this.getKomoditas();
    }
    else {
      this.navigasi = "lahan";
      this.getLahan();
    }
  }

  actionMore = (data) => {
    // console.log(data);
    if (data.type == 'lahan') {
      if (data.action == 'view') {
        this.navCtrl.push(LahanPage, { id: data.id, callback: this.callbackLahan });
      }
      else if(data.action == 'edit') {
        this.navCtrl.push(EditLahanPage, { id: data.id, callback: this.callbackLahan });
      }
      else if (data.action == 'add') {
        // console.log(data.id)
        this.presentAddKomoditas(data.id);
      }
      else {
        this.presentDeleteModal(data.id, "lahan");
      }
    }
    else {
      if(data.action == 'edit') {
        this.navCtrl.push(EditKomoditasPage, { id: data.id, callback: this.callbackLahan });
      }
      else {
        this.presentDeleteModal(data.id, "komoditas");
      }
    }
  }

}
