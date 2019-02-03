import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
// import { LahanPage } from '../lahan/lahan';

@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {
  id: any;
  name: any;
  type: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    //console.log(this.navParams.data);
  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    if (this.navParams.data) {
      this.id = this.navParams.data.id;
      this.name = this.navParams.data.name;
      this.type = this.navParams.data.type;
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  openLahan() {
    this.viewCtrl.dismiss().then(() => {
      this.navParams.get("callback")({id: this.id, action: "view", type: this.type});
    });
  }

  addKomoditas() {
    this.viewCtrl.dismiss().then(() => {
      this.navParams.get("callback")({id: this.id, action: "add", type: this.type});
    });
  }

  edit() {
    this.viewCtrl.dismiss().then(() => {
      this.navParams.get("callback")({id: this.id, action: "edit", type: this.type});
    });
  }

  hapus() {
    this.viewCtrl.dismiss().then(() => {
      this.navParams.get("callback")({id: this.id, action: "delete", type: this.type});
    });
  }

}
