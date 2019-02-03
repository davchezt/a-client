import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  @ViewChild(Content) content: Content;
  @ViewChild('footerInput') footerInput;
  showToolbar:boolean = false;
  hasChangeUsername: boolean = false;
  hasChangePassword: boolean = false;
  userData: any = {"username":"", "password":""};
  userInput: any = {"username":"", "password":"", "refpassword":""};
  result:any = [];
  navigasi: string = "username";

  constructor(public navCtrl: NavController, public navParams: NavParams, public ref: ChangeDetectorRef, public apiService: Api, public common: Common) {
    this.navigasi = "username";
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
    //console.log('ionViewDidLoad SettingsPage');
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

  segmentChanged(event) {
    // console.log(event.value);
  }

  saveUsername() {
    let res: any = [];
    this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    // Fields
    postData.append('username', this.userData.username);
    postData.append('newusername', this.userInput.username);
    let userData = this.apiService.post("v1/user/username", postData);
    userData.subscribe((result) => {
      res = result;
      console.log(res);
      if (res.user_data) {
        localStorage.setItem('userData', JSON.stringify(res.user_data));
        this.common.presentToast("Sukses!, data telah di perbaharui");
        this.userData = {"username":"", "password":""};
        this.userInput = {"username":"", "password":"", "refpassword":""};
      }
      else {
        this.common.presentToast(res.data);
      }
      this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
    });
  }

  savePassword() {
    let res: any = [];
    this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    // Fields
    postData.append('password', this.userData.password);
    postData.append('newpassword', this.userInput.password);
    let userData = this.apiService.post("v1/user/password", postData);
    userData.subscribe((result) => {
      res = result;
      console.log(result);
      if (res.data) {
        localStorage.setItem('userData', JSON.stringify(res.user_data));
        this.common.presentToast("Sukses!, data telah di perbaharui");
        this.userData = {"username":"", "password":""};
        this.userInput = {"username":"", "password":"", "refpassword":""};
      }
      else {
        this.common.presentToast(result['data']);
      }
      this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
    });
  }

  checkValue() {
    this.hasChangeUsername = false;
    if (this.userData.username.length != 0 && this.userData.username != this.userInput.username) {
      if (this.userData.username.length >= 6 && this.userInput.username.length >= 6) {
        this.hasChangeUsername = true;
      }
    }
  }

  checkValuePassword() {
    this.hasChangePassword = false;
    if (this.userData.password.length != 0 && this.userData.password.length >= 6) {
      if (this.userInput.password.length != 0 && this.userInput.refpassword.length != 0) {
        if (this.userInput.password.length >= 6 && this.userInput.refpassword.length >= 6) {
          if (this.userInput.password == this.userInput.refpassword) {
            if (this.userData.password != this.userInput.password) {
              this.hasChangePassword = true;
            }
          }
        }
      }
    }
    else {
      this.hasChangePassword = false;
    }
  }

}
