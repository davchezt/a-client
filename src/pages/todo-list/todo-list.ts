import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Common } from '../../providers/common/common';
import { Api } from '../../providers/api/api';
import { LahanPage } from '../lahan/lahan';

@Component({
  selector: 'page-todo-list',
  templateUrl: 'todo-list.html',
})
export class TodoListPage {
  showToolbar: boolean = false;
  result: any = [];
  jadwal: any = [];
  items: any = [];
  adaJadwal: boolean = false;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public ref: ChangeDetectorRef, public apiService: Api, public common: Common) {
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
    }
  }

  ionViewDidLoad() {
    this.getJadwal();
  }

  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 50;
    this.ref.detectChanges();
  }

  getJadwal() {
    let resultData: any = [];;
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    let userData = this.apiService.post("v1/kalendar/jadwal", postData);
    userData.subscribe((result) => {
      resultData = result;
      this.adaJadwal = false;
      this.jadwal = resultData.data;
      // console.log(this.jadwal)
      this.items = this.jadwal;
      if (this.jadwal.length > 0) {
        this.adaJadwal = true;
      }
    }, (error) => {
      console.log(error);
      this.common.presentToast(error);
    });
  }

  viewLahan(id) {
    this.navCtrl.push(LahanPage, { id: id });
  }

}
