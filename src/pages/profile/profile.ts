import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, ActionSheetController, Events  } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';

import { UploadFilePage } from '../upload-file/upload-file';
import { ProfilePicturePage } from '../profile-picture/profile-picture';
import { ProfileEditPage } from '../profile-edit/profile-edit';
import { ProfileAlamatPage } from '../profile-alamat/profile-alamat';
import { LocationTrackerPage } from '../location-tracker/location-tracker';
import { LahanPage } from '../lahan/lahan';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  base64Image: string;
  capture:boolean = false;
  result: any = [];
  alamat: any =[];
  user:any = [];
  lahan: any = [];
  adaLahan: boolean = false;
  komoditas: any = [];
  adaKomoditas: boolean = false;
  showToolbar:boolean = false;
  items: Array<string>;
  navigasi: string = "lahan";
  userData = {"latitude":null, "longitude":null, "name":"", "pic":null, "token":"", "type":"", "user_id":"0"};

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, public apiService: Api, public common: Common, public ref: ChangeDetectorRef, public actionSheetCtrl: ActionSheetController, public events: Events) {
  }

  ionViewDidLoad() {
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
    }
    this.navigasi = "lahan";
    this.loadFoto();
    this.loadAlamat();
    this.loadLahan();
    this.loadKomoditas();
  }

  loadFoto() {
    if (this.result.pic != null) {
      this.base64Image = this.apiService.url + this.result.pic;
    }
    else {
      this.base64Image = "assets/img/agritama.png";
    }
  }

  loadAlamat() {
    let resultData: any = [];;
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    let userData = this.apiService.post("v1/user/" + this.result.user_id, postData);
    userData.subscribe((result) => {
      resultData = result;
      this.user = resultData.data;
    }, (error) => {
      console.log(error);
      this.common.presentToast(error);
    });
  }

  loadLahan() {
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    let data = this.apiService.post("v1/lahan", postData);
    data.subscribe((result) => {
      let data: any = [];
      data = result;
      if (data.data.length > 0) {
        if (data.data[0].id) {
          this.lahan = data.data;
          // console.log(this.lahan)
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
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    let data = this.apiService.post("v1/komoditas", postData);
    data.subscribe((result) => {
      let data: any = [];
      data = result;
      if (data.data.length > 0) {
        if (data.data[0].id) {
          this.komoditas = data.data;
          // console.log(this.komoditas)
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

  goUpload() {
    this.navCtrl.push(UploadFilePage);
  }

  viewLocation() {
    if (this.user.latitude && this.user.longitude) {
      this.navCtrl.push(LocationTrackerPage, {lat: this.user.latitude, lng: this.user.longitude});
    }
  }

  goUploadPicture() {
    this.navCtrl.push(ProfilePicturePage, { callback: this.callback });
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Lengkapi',
      buttons: [{
          text: 'Profil',
          role: 'destructive',
          icon: 'person',
          handler: () => {
            this.navCtrl.push(ProfileEditPage, { callback: this.callback });
          }
        },{
          text: 'Alamat',
          icon: 'pin',
          handler: () => {
            this.navCtrl.push(ProfileAlamatPage, { callback: this.callback });
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

  callback = (data?) => {
    this.common.presentLoading();
    let resultData: any = [];;
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    postData.append('update', data ? data : "1");
    let userData = this.apiService.post("v1/user/me", postData);
    userData.subscribe((result) => {
      resultData = result;
      localStorage.setItem('userData', JSON.stringify(resultData.data));
      if (localStorage.getItem('userData')) {
        this.result = JSON.parse(localStorage.getItem('userData'));
      }
      this.loadFoto();
      this.loadAlamat();
      this.events.publish('user:login', Date.now());
      this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
    });
  }

  openLahan(id) {
    this.navCtrl.push(LahanPage, { id: id });
  }

}
