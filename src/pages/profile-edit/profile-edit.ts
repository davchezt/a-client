import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';

@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {
  @ViewChild(Content) content: Content;
  @ViewChild('footerInput') footerInput;
  showToolbar:boolean = false;
  hasChange: boolean = false;
  result:any = [];
  userData: any = [];
  user: any = {"nama":"", "email":"", "kontak":"", "gender":""};

  constructor(public navCtrl: NavController, public navParams: NavParams, public ref: ChangeDetectorRef, public apiService: Api, public common: Common) {
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
    this.getMe();
  }

  ionViewWillLoad() {
  }

  getMe() {
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    let userData = this.apiService.post("v1/user/me", postData);
    userData.subscribe((result) => {
      this.userData = result['data'];
      this.user.nama = this.userData.nama;
      this.user.email = this.userData.email;
      this.user.kontak = this.userData.kontak;
      this.user.gender = this.userData.kelamin;
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
    postData.append('nama', this.userData.nama);
    postData.append('email', this.userData.email);
    postData.append('kontak', this.userData.kontak);
    postData.append('gender', this.userData.kelamin);
    let userData = this.apiService.post("v1/user/profile", postData);
    userData.subscribe((result) => {
      console.log(result);
      this.navCtrl.pop().then(() => {
        this.navParams.get("callback")("1");
      });
      this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
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

  checkValue() {
    if (this.user.nama != this.userData.nama ||
      this.user.email != this.userData.email ||
      this.user.kontak != this.userData.kontak ||
      this.user.gender != this.userData.kelamin) {
      this.hasChange = true;
    }
    else {
      this.hasChange = false;
    }

  }

}
