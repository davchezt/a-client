import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';
import { ProfileIdPage } from '../profile-id/profile-id';
import { LahanPage } from '../lahan/lahan';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  items: Array<string>;
  navigasi: string = "komoditas";
  showToolbar:boolean = false;
  result: any = [];
  lahan: any = [];
  adaLahan: boolean = false;
  komoditas: any = [];
  adaKomoditas: boolean = false;
  users: any = [];
  adaUsers: boolean = false;
  showUser: boolean = false;
  showLahan: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ref: ChangeDetectorRef, public http: HttpClient, public apiService: Api, public common: Common) {
  }

  ionViewDidLoad() {
    this.navigasi = "komoditas";
  }

  ionViewWillLoad() {
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
      this.showUser = false;
      if (this.result.type == 1) {
        this.showUser = true;
        this.showLahan = true;
        this.loadUsers();
      }
      this.loadKomoditas();
      this.loadLahan();
    }
  }

  ngOnInit() {
    // this.setItems(this.navigasi);
  }

  setItems(key: string) {
    if (key == "komoditas") {
      this.items = this.komoditas;
    } else if (key == "lahan") {
      this.items = this.lahan;
    }
    else {
      this.items = this.users;
    }
  }

  filterItems(ev: any) {
    this.setItems(this.navigasi);
    let val = ev.target.value;

    if (val && val.trim() !== '') {
      this.items = this.items.filter(function(item) {
        return item['nama'].toLowerCase().includes(val.toLowerCase());
      });
    }
  }

  segmentChanged(event) {
    this.navigasi = event.value;
    this.setItems(this.navigasi);
    // console.log(event.value);
  }

  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 10;
    this.ref.detectChanges();
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
          // this.setItems("lahan");
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
      console.log(error)
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
          this.setItems("komoditas");
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

  loadUsers() {
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    let data = this.apiService.post("v1/user", postData);
    data.subscribe((result) => {
      let data: any = [];
      data = result;
      if (data.data.length > 0) {
        if (data.data[0].id) {
          this.users = data.data;
          // console.log(this.users)
          this.adaUsers = true;
        }
        else {
          this.adaUsers = false;
        }
      }
      else {
        this.adaUsers = false;
      }
    }, (error) => {
      console.log(error)
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

  openKomoditas() {

  }

  openProfile(id) {
    this.navCtrl.push(ProfileIdPage, {user_id: id});
  }

  openLahan(id) {
    this.navCtrl.push(LahanPage, { id: id });
  }

}
