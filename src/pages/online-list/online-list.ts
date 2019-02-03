import { Component } from "@angular/core";
import { NavController, NavParams, ViewController } from "ionic-angular";
import { Common } from "../../providers/common/common";

@Component({
  selector: "page-online-list",
  templateUrl: "online-list.html"
})
export class OnlineListPage {
  userList = [];
  nickname = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public common: Common
  ) {
    this.userList = this.common.userInroom;
    let data = JSON.parse(localStorage.getItem('userData'));
    this.nickname = data.type == 1 ? "(Agronimis) " + data.name : data.name;
  }

  ionViewDidLoad() {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  userSelected(user) {
    if (user === this.nickname) {
      return;
    }
    this.viewCtrl.dismiss(user);
  }
}
