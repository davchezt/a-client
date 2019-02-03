import { Component, ChangeDetectorRef, ViewChild } from "@angular/core";
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

import { DashboardTabsPage } from "../dashboard-tabs/dashboard-tabs";
import { LoginPage } from "../login/login";

@Component({
  selector: "page-register",
  templateUrl: "register.html"
})
export class RegisterPage {
  @ViewChild(Content) content: Content;
  result: any = [];
  data: Observable<any>;
  resposeData: any;
  userData = {
    username: "",
    password: "",
    refpassword: "",
    nama: "",
    gender: "0",
    phone: "",
    register: ""
  };
  usePhone: boolean = false;
  useEmail: boolean = true;
  showPasswordText: boolean = false;
  showRefPasswordText: boolean = false;
  showToolbar: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public apiService: Api,
    public common: Common,
    public ref: ChangeDetectorRef,
    private platform: Platform,
    private keyboard: Keyboard,
    public events: Events
  ) {}

  ionViewDidLoad() {}

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    // this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    // this.menu.enable(true);
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.keyboard.hideFormAccessoryBar(false);
    });
  }

  onScroll($event: any) {
    let scrollTop = $event.scrollTop;
    this.showToolbar = scrollTop >= 10;
    this.ref.detectChanges();
  }

  scrollTop() {
    var that = this;
    setTimeout(function() {
      // that.content.scrollToTop();
      that.content.scrollTo(0, 0);
    }, 100);
  }

  signup() {
    if (
      this.userData.username.length == 0 ||
      this.userData.password.length == 0 ||
      this.userData.refpassword.length == 0 ||
      this.userData.nama.length == 0 ||
      this.userData.phone.length == 0
    ) {
      this.common.presentToast("Semua bidang wajib di isi");
      return;
    }

    if (this.userData.password.length < 8) {
      this.common.presentToast("Password tidak boleh kurang dari 8 karakter");
      return;
    }

    if (this.userData.password != this.userData.refpassword) {
      this.common.presentToast("Password tidak sama, mohon periksa ulang");
      return;
    }

    this.common.presentLoading();
    let postData = new FormData();
    postData.append("username", this.userData.username);
    postData.append("password", this.userData.password);
    postData.append("nama", this.userData.nama);
    postData.append("gender", this.userData.gender);
    postData.append("phone", this.userData.phone);
    postData.append("register", this.userData.register);
    this.data = this.apiService.post("v1/user/register", postData);
    this.data.subscribe(
      data => {
        this.result = data;
        if (this.result.user_data) {
          // localStorage.setItem("userData", JSON.stringify(this.result.user_data));
          // setTimeout(() => this.goDashboard(), 500);
          this.common.closeLoading();
          this.events.publish('user:login', this.result.user_data);
        } else {
          this.common.presentToast(this.result.data);
          this.common.closeLoading();
        }
      },
      error => {
        console.log(error);
        this.common.presentToast("Kesalahan, tidak dapat terhubung ke server");
        this.common.closeLoading();
      }
    );
  }

  goLogin() {
    this.navCtrl.push(LoginPage);
  }

  goDashboard() {
    this.menu.enable(true);
    this.navCtrl.push(DashboardTabsPage);
    this.common.closeLoading();
  }

  usePhoneToggle() {
    if (this.usePhone) {
      this.useEmail = false;
    } else {
      this.useEmail = true;
    }
  }
}
