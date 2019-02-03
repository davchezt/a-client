import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { Common } from '../../providers/common/common';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-delete-modal',
  templateUrl: 'delete-modal.html',
})
export class DeleteModalPage {
  id: number;
  type: string;
  callback: any = null;
  result:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public apiService: Api, public common: Common) {
    this.id = this.navParams.get('itemId');
    this.type = this.navParams.get('itemType');
    this.callback = this.navParams.get("callback");
    if (localStorage.getItem('userData')) {
      this.result = JSON.parse(localStorage.getItem('userData'));
    }
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad DeleteModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  delete() {
    let res: any = [];
    this.common.presentLoading();
    let postData = new FormData();
    let userData: Observable<any>;
    postData.append('uid', this.result.user_id);
    postData.append('token', this.result.token);
    if (this.type == "lahan") {
      userData = this.apiService.post("v1/lahan/delete/" + this.id, postData);
    }
    else {
      userData = this.apiService.post("v1/komoditas/delete/" + this.id, postData);
    }
    userData.subscribe((result) => {
      res = result;
      this.common.closeLoading();
      this.common.presentToast(res.data + ": data berhasil di hapus");
      this.viewCtrl.dismiss().then(() => {
        if (this.callback) {
          this.callback("lahan");
        }
      });
    }, (error) => {
      console.log(error);
      this.common.presentToast("Terjadi kesalahan");
      this.common.closeLoading();
    });
  }

}
