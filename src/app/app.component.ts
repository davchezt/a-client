import { Component } from "@angular/core";
import { Platform, Keyboard, Events } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { ScreenOrientation } from "@ionic-native/screen-orientation";

import { HomePage } from "../pages/home/home";
import { WellcomePage } from "../pages/wellcome/wellcome";
import { Common } from "../providers/common/common";
import { Api } from "../providers/api/api";
import { Observable } from "rxjs/Observable";
import { DataProvider } from "../providers/data/data";
import { SocketProvider } from "../providers/socket/socket";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = WellcomePage;
  result: any = [];

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    keyboard: Keyboard,
    screenOrientation: ScreenOrientation,
    events: Events,
    public common: Common,
    public apiService: Api,
    private dataServices: DataProvider,
    private socketServices: SocketProvider
  ) {
    platform.ready().then(() => {
      Observable.fromEvent(window, 'beforeunload').subscribe(event => {
        this.dataServices.roomsLeave();
        this.socketServices.disconnect();
      });

      // Detect run on background
      window.addEventListener('pause', () => {
        console.log('app:pause');
      }, false);
      window.addEventListener('resume', () => {
        console.log("app:resume");
      }, false);

      // statusBar.styleDefault();

      // #AARRGGBB where AA is an alpha value
      keyboard.hideFormAccessoryBar(false);
      // lock orientation
      // screenOrientation.lock(screenOrientation.ORIENTATIONS.PORTRAIT);

      if (platform.is("android")) {
        statusBar.backgroundColorByHexString("#803b3737");
      }

      if (localStorage.getItem("userData")) {
        this.result = JSON.parse(localStorage.getItem("userData"));
        this.getData(this.result);
      }
      else {
        this.rootPage = WellcomePage;
      }
      events.subscribe("user:login", data => {
        this.getData(data);
      });
      events.subscribe("user:register", data => {
        this.getData(data);
      });
      events.subscribe("user:logout", time => {
        this.clearData();
      });

      splashScreen.hide();
    });
  }

  getData(data: any) {
    this.common.presentLoading();
    let postData = new FormData();
    postData.append("uid", data.user_id);
    postData.append("token", data.token);
    let userData = this.apiService.post("v1/user/token", postData);
    userData.subscribe(result => {
        localStorage.setItem('userData', JSON.stringify(data));
        let timeOut = localStorage.getItem('userData') ? 100 : 500;
        setTimeout(() => {
          this.common.closeLoading();
          this.rootPage = HomePage;
        }, timeOut);
      }, error => {
        this.common.closeLoading();
        this.rootPage = WellcomePage;
      }
    );
  }

  clearData() {
    this.common.presentLoading();
    if (localStorage.getItem("userData")) {
      localStorage.removeItem("userData");
      setTimeout(() => {
        this.common.closeLoading();
        this.rootPage = WellcomePage;
      }, 100);
    }
  }
}
