import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';

import * as $ from "jquery";

import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { DashboardTabsPage } from '../dashboard-tabs/dashboard-tabs';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';

@Component({
  selector: 'page-wellcome',
  templateUrl: 'wellcome.html',
})
export class WellcomePage {
  result: any = [];
  data: Observable<any>;
  userData = {"user_id":null, "token":"", "request_token":"1"};

  constructor(public navCtrl: NavController, public menu: MenuController, public common: Common, public apiService: Api, public http: HttpClient) {
  }

  ionViewWillLoad() {
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
      this.userData.user_id = parseInt(this.result.user_id);
      this.userData.token = this.result.token;
      // this.tokenLogin();
    }
  }

  ionViewDidLoad() {
    $('.splash-intro').html('SELAMAT DATANG DI AGRIFARM');
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    // this.menu.enable(false);
    //this.menu.close();
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    //this.menu.enable(true);
  }

  tokenLogin() {
    let postData = new FormData();
    postData.append('uid', this.userData.user_id);
    postData.append('token', this.userData.token);

    this.common.presentLoading();
    this.apiService.postData(postData, "v1/user/token").then((data) => {
      this.common.closeLoading();
      setTimeout(() => this.goDashboard(), 0);
    }, (err) => {
      this.common.closeLoading();
      setTimeout(() => this.login(), 500);
    });
  }

  goDashboard() {
    this.common.closeLoading();
    this.menu.enable(true);
    this.navCtrl.push(DashboardTabsPage);
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

  signup() {
    this.navCtrl.push(RegisterPage);
  }

}
