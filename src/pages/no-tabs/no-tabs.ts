import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';
import { Headers, RequestOptions, Http, URLSearchParams } from '@angular/http';
import { LogerProvider } from '../../providers/loger/loger';

@Component({
  selector: 'page-no-tabs',
  templateUrl: 'no-tabs.html',
})
export class NoTabsPage {
  showToolbar:boolean = false;
  tokenData: Promise<any>;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public ref: ChangeDetectorRef, public apiService: Api, public common: Common, public http: Http, public log: LogerProvider) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NoTabsPage');
    // this.tokenLogin();
  }

  onScroll($event: any) {
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 10;
    this.ref.detectChanges();
  }

  tokenLogin() {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSJ9.6_WA3xB6j192aWBYAub9AmvzJ3m9XhRA7h2t0_STPu4"
    });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({
      "user_id": "1"
    });
    let params = new URLSearchParams();
    params.append('user_id', '1');
    
    this.http.put('https://agritama.farm/api/test.php', body, { 
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSJ9.6_WA3xB6j192aWBYAub9AmvzJ3m9XhRA7h2t0_STPu4"
      })
    }).subscribe(data => {
      this.log.success(data.json(), true);
      this.log.info(data.json().req_token, true);
    })

    this.apiService._get('v1/token', { headers: headers, params: params }).subscribe(data => {
      this.log.info(data.json(), true);
    }, err => {
      this.log.error(err, true);
    })

    this.apiService._delete('v1/token', { headers: headers, params: params }).subscribe(data => {
      this.log.warnig(data.json(), true);
    }, err => {
      this.log.error(err, true);
    })

    this.apiService._post('v1/token', body, options).subscribe(data => {
      this.log.success(data.json(), true);
    }, err => {
      this.log.error(err, true);
    })

    this.apiService._put('v1/token', body, options).subscribe(data => {
      this.log.info(data.json(), true);
    }, err => {
      this.log.error(err, true);
    })

    this.apiService._patch('v1/token', body, options).subscribe(data => {
      this.log.error(data.json(), true);
    }, err => {
      this.log.error(err, true);
    })
    
  }
}
