import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';

@Component({
  selector: 'page-edit-komoditas',
  templateUrl: 'edit-komoditas.html',
})
export class EditKomoditasPage {
  @ViewChild(Content) content: Content;
  showToolbar:boolean = false;
  hasChange: boolean = false;
  komoditasId: any;
  result:any = [];
  komoditasData: any = [];
  userInput: any = [];
  lahanResult:any = [];
  rumusResult:any = [];
  today: any = new Date().getTime();
  tanam: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ref: ChangeDetectorRef, public apiService: Api, public common: Common) {
    this.komoditasId = navParams.get('id');
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
      this.getKomoditas();
      this.getLahanList();
      this.getRumusList();
    }
  }

  ionViewDidLoad() {
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

  checkValue(ev: any) {
    this.hasChange = false;
    let val = ev.target.value;
    if (val.length >= 3) {
      this.hasChange = true;
    }
  }

  checkValueUsia() {
    this.hasChange = false;
    let val = this.userInput.usia;
    if (val.length >= 1) {
      this.hasChange = true;
    }
  }

  updatePredict() {
    this.getPredicTanam(this.userInput.usia);
    this.scrollTop();
  }

  onChangeKomoditas(val) {
    this.hasChange = false;
    //if (val != this.komoditasData.id_rumus) {
      this.hasChange = true;
    //}
  }

  onChangeLahan(val) {
    this.hasChange = false;
    //if (val != this.komoditasData.id_lahan) {
      this.hasChange = true;
    //}
  }

  save() {
    let res: any = [];
    this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    // Fields
    postData.append('rumus', this.userInput.id_rumus);
    postData.append('lahan', this.userInput.id_lahan);
    postData.append('jumlah', this.userInput.jumlah);
    postData.append('usia', this.userInput.usia);
    let userData = this.apiService.post("v1/komoditas/edit/" + this.komoditasId, postData);
    userData.subscribe((result) => {
      res = result;
      this.common.closeLoading();
      this.common.presentToast(res.data);
      this.navCtrl.pop().then(() => {
        this.navParams.get("callback")("komoditas");
      });
    }, (error) => {
      console.log(error);
      this.common.presentToast("terjadi kesalahan");
      this.common.closeLoading();
    });
  }

  back() {
    this.navCtrl.pop();
  }

  getKomoditas() {
    let res: any = [];
    this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    // Fields
    let userData = this.apiService.post("v1/komoditas/" + this.komoditasId, postData);
    userData.subscribe((result) => {
      res = result;
      this.komoditasData = res.data;
      this.userInput.id_lahan =  this.komoditasData.id_lahan;
      this.userInput.id_rumus =  this.komoditasData.id_rumus;
      this.userInput.jumlah =  this.komoditasData.jumlah;
      this.userInput.usia =  this.komoditasData.usia;
      this.tanam = this.komoditasData.tanam;
      //this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      //this.common.closeLoading();
    });
  }

  getLahanList() {
    let res: any = [];
    //this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    // Fields
    let userData = this.apiService.post("v1/lahan", postData);
    userData.subscribe((result) => {
      res = result;
      this.lahanResult = res.data;
      //console.log(this.lahanResult)
      //this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      //this.common.closeLoading();
    });
  }

  getRumusList() {
    let res: any = [];
    //this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    // Fields
    let userData = this.apiService.post("v1/rumus", postData);
    userData.subscribe((result) => {
      res = result;
      this.rumusResult = res.data;
      //console.log(this.rumusResult)
      this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
    });
  }

  getNowDate = () => {
    var returnDate = "";
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    
    if (mm < 10) {
        returnDate += `0${mm}/`;
    } else {
        returnDate += `${mm}/`;
    }

    if (dd < 10) {
      returnDate += `0${dd}/`;
    } else {
        returnDate += `${dd}/`;
    }

    returnDate += yyyy;
    return returnDate;
  }

  getUsia = (tanggal: string) => {
    let usia;

    let tanam = new Date(tanggal).getTime();
    let date = tanam / 1000;
    var elapsed = Math.round(this.today / 1000) - date;

    usia = elapsed / 86400;
    console.log(Math.round(usia))

    return usia;
  }

  getPredicTanam(usia: any) {
    if (usia == null) return;
    let res: any = [];
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    postData.append('usia', usia);
    // Fields
    let userData = this.apiService.post("v1/tanam", postData);
    userData.subscribe((result) => {
      res = result;
      this.tanam = res.data;
      //console.log(this.rumusResult)
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
    });
  }
}
