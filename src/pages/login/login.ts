import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import {
  NavController,
  NavParams,
  MenuController,
  Platform,
  Keyboard,
  Content,
  Events
} from "ionic-angular";
import { Observable } from "rxjs/Observable";

import { Api } from "../../providers/api/api";
import { Common } from "../../providers/common/common";

import { RegisterPage } from "../register/register";
import { DashboardTabsPage } from "../dashboard-tabs/dashboard-tabs";

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  @ViewChild(Content) content: Content;
  @ViewChild("inputPassword") inputFocus;

  result: any = [];
  data: Observable<any>;
  resposeData: any;
  userData = { username: "", password: "", login: "true" };
  showPasswordText: boolean = false;
  showToolbar: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public apiService: Api,
    public common: Common,
    private platform: Platform,
    private keyboard: Keyboard,
    public ref: ChangeDetectorRef,
    public events: Events
  ) {}

  ionViewDidLoad() {}

  ionViewDidEnter() {
    // this.menu.enable(false);
  }

  ionViewWillLeave() {
    // this.menu.enable(true);
  }

  ionViewDidLeave() {
    // this.menu.enable(true);
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.keyboard.hideFormAccessoryBar(true);
    });
  }

  scrollTop() {
    var that = this;
    setTimeout(function() {
      that.content.scrollToTop();
    }, 100);
  }

  onScroll($event: any) {
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 10;
    this.ref.detectChanges();
  }

  moveFocus(event, done?: boolean) {
    if (event.keyCode != 13) return;

    if (done) {
      this.inputFocus.setBlur();
      this.login();
    } else {
      this.inputFocus.setFocus();
    }
  }

  login() {
    if (
      this.userData.username.length == 0 ||
      this.userData.password.length == 0
    ) {
      this.common.presentToast("Semua bidang wajib di isi");
      return;
    }
    this.common.presentLoading();
    let postData = new FormData();
    postData.append("username", this.userData.username);
    postData.append("password", this.userData.password);
    postData.append("login", this.userData.login);

    this.data = this.apiService.post("v1/user/login", postData);
    this.data.subscribe(
      data => {
        this.result = data;
        if (this.result.user_data) {
          // console.log(this.result.user_data.user_id, " & ", this.result.user_data.token);
          // localStorage.setItem('userData', JSON.stringify(this.result.user_data));
          // setTimeout(() => this.goDashboard(), 500);
          this.common.closeLoading();
          this.events.publish('user:login', this.result.user_data);
        } else {
          this.common.presentToast(this.result.data);
          this.common.closeLoading();
        }
      },
      error => {
        this.common.presentToast("tidak dapat terhubung ke server");
        this.common.closeLoading();
        console.log(error);
      }
    );
  }

  goDashboard() {
    this.menu.enable(true);
    this.navCtrl.push(DashboardTabsPage);
    this.common.closeLoading();
  }

  goRegister() {
    this.navCtrl.push(RegisterPage);
  }
}
