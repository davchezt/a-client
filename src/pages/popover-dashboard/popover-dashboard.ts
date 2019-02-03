import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { AddLahanPage } from '../add-lahan/add-lahan';

@Component({
  selector: 'page-popover-dashboard',
  templateUrl: 'popover-dashboard.html',
})
export class PopoverDashboardPage {
  token: any;
  id: any;
  page: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PopoverDashboardPage');
  }

  ngOnInit() {
    if (this.navParams.data) {
      this.token = this.navParams.data.token;
      this.id = this.navParams.data.id;
      this.page = this.navParams.data.page;
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  add(page) {
    if (page == 'lahan') {
      this.presetntAddModal(page);
    }
    this.viewCtrl.dismiss();
  }

  refresh() {
    this.close();
  }

  presetntAddModal(page) {
    let addModal = this.modalCtrl.create(AddLahanPage, { pageId: page});
    addModal.present();
    addModal.onDidDismiss(() => {
      this.navParams.get("callback")("1");
    });
  }

}
