import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';
import { LocationTrackerPage } from '../location-tracker/location-tracker';

@Component({
  selector: 'page-profile-id',
  templateUrl: 'profile-id.html',
})
export class ProfileIdPage {
  base64Image: string;
  capture:boolean = false;
  result: any = [];
  user:any = [];
  alamat: any =[];
  lahan: any = [];
  adaLahan: boolean = false;
  komoditas: any = [];
  adaKomoditas: boolean = false;
  showToolbar:boolean = false;
  items: Array<string>;
  navigasi: string = "lahan";
  userData = {"latitude":null, "longitude":null, "name":"", "pic":null, "token":"", "type":"", "user_id":"0"};
  user_id: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public apiService: Api, public common: Common, public ref: ChangeDetectorRef) {
    this.user_id = this.navParams.get("user_id");
  }

  ionViewDidLoad() {
    this.navigasi = "lahan";
  }

  ionViewWillLoad() {
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
    }
    if (!this.user_id) return;
    this.loadUser();
    this.loadFoto();
  }

  loadUser() {
    if (!this.user_id) return;
    let resultData: any = [];;
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    let userData = this.apiService.post("v1/user/" + this.user_id, postData);
    userData.subscribe((result) => {
      resultData = result;
      this.user = resultData.data;
      console.log(this.user);
      this.loadFoto();
      this.loadLahan();
      this.loadKomoditas();
    }, (error) => {
      console.log(error);
      this.common.presentToast(error);
    });
  }

  loadFoto() {
    if (!this.user_id) return;
    if (this.user.foto != null) {
      this.base64Image = this.apiService.url + this.user.foto;
    }
    else {
      this.base64Image = "assets/img/agritama.png";
    }
  }

  viewLocation() {
    if (this.user.latitude && this.user.longitude) {
      this.navCtrl.push(LocationTrackerPage, {lat: this.user.latitude, lng: this.user.longitude});
    }
  }

  loadLahan() {
    if (!this.user_id) return;
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    postData.append('id', this.user_id);
    let data = this.apiService.post("v1/lahan", postData);
    data.subscribe((result) => {
      let data: any = [];
      data = result;
      if (data.data.length > 0) {
        if (data.data[0].id) {
          this.lahan = data.data;
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
    });
  }

  loadKomoditas() {
    if (!this.user_id) return;
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    postData.append('id', this.user_id);
    let data = this.apiService.post("v1/komoditas", postData);
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

  onScroll($event: any) {
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 80;
    this.ref.detectChanges();
  }

  segmentChanged(event) {
    this.navigasi = event.value;
  }

  callback = (data?) => {
    let resultData: any = [];;
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    postData.append('update', data ? data : "1");
    let userData = this.apiService.post("v1/user/me", postData);
    userData.subscribe((result) => {
      resultData = result;
      localStorage.setItem('userData', JSON.stringify(resultData.userData));
    }, (error) => {
      console.log(error);
      this.common.presentToast(error);
    });
  }

  openWhatsApp = (phone: string) => {
    window.open("https://api.whatsapp.com/send?phone=" + phone + "&text=Halo!");
  }
  openSms = (phone: string) => {
    window.open("sms:+" + phone);
  }
  openTel = (phone: string) => {
    window.open("tel:" + phone);
  }
  openMail = (email: string) => {
    window.open("mailto:" + email);
  }

}
