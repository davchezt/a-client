import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';

@Component({
  selector: 'page-timeline',
  templateUrl: 'timeline.html',
})
export class TimelinePage {
  @ViewChild(Content) content: Content;
  @ViewChild('footerInput') footerInput;
  showToolbar: boolean = false;
  hasChange: boolean = false;
  bugFound: string = "";
  userInput: any = {"email":"", "message":""}
  result:any = [];

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
    // console.log('ionViewDidLoad TimelinePage');
  }

  checkValue() {
    if (this.userInput.email.length >= 6 && this.userInput.message.length >= 6) {
      this.hasChange = true;
    }
    else {
      this.hasChange = false;
    }
  }

  send() {
    let res: any = [];
    this.common.presentLoading();
    let postData = new FormData();
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    // Fields
    postData.append('subject', 'Bug Report!');
    postData.append('body', this.userInput.message);
    postData.append('name', this.result.name);
    postData.append('email', this.userInput.email);
    postData.append('type', 'report');
    let userData = this.apiService.post("v1/feedback", postData);
    userData.subscribe((result) => {
      res = result;
      console.log(res);
      this.common.presentToast(res.data);
      this.userInput = {"email":"", "message":""}
      this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.presentToast("Tidak dapat terhubung ke server");
      this.common.closeLoading();
    });
  }

  onScroll($event: any){
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 10;
    this.ref.detectChanges();
  }

  scrollTop() {
    var that = this;
    setTimeout(function() {
      that.content.scrollToTop();
    }, 100);
  }

}
