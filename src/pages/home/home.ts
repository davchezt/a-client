import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  Nav,
  Platform /*, ToastController*/
} from "ionic-angular";
import { App, Events } from "ionic-angular";

// Pages
import { TimelinePage } from "../timeline/timeline";
import { DashboardTabsPage } from "../dashboard-tabs/dashboard-tabs";
import { NoTabsPage } from "../no-tabs/no-tabs";
// import { ChatPage } from '../chat/chat';
import { SettingsPage } from "../settings/settings";
import { ProfilePage } from "../profile/profile";
import { ContactUsPage } from "../contact-us/contact-us";

import { Common } from "../../providers/common/common";
import { Api } from "../../providers/api/api";
import { LogerProvider } from "../../providers/loger/loger";
import { Socket } from "ng-socket-io";
import { DataProvider } from "../../providers/data/data";
import { SocketProvider } from "../../providers/socket/socket";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  @ViewChild(Nav) nav: Nav;
  lastBack: any = Date.now();
  allowClose: boolean = false;
  onMessage: any;
  onUser: any;

  pages: Array<{ title: string; icon: string; component: any; openTab?: any }>;
  pagesTwo: Array<{
    title: string;
    icon: string;
    component: any;
    openTab?: any;
  }>;
  rootPage: any = DashboardTabsPage;
  addedChatNav: boolean = false;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    public common: Common,
    public events: Events,
    public apiService: Api,
    private app: App,
    public log: LogerProvider,
    private dataServices: DataProvider,
    private socketServices: SocketProvider
  ) {
    this.registerPages();
    this.registerBackButton();
  }

  ionViewWillLoad() {
    let user: any = JSON.parse(localStorage.getItem('userData'));

    // FIIXME: check for data loaded first
    this.socketServices.connect();
    let timeOut = user.user_id !== undefined ? 100:500;
    setTimeout(() => {
      user.user_id = parseInt(user.user_id);
      this.dataServices.user = user;
      this.dataServices.getRoom();
      this.socketServices.emit('online', user.user_id);
    }, timeOut);
    // SOCKET on message
    this.onMessage = this.socketServices.on('message').subscribe(data => {
      let message: any = data;
      if (message.chat) {
        this.dataServices.newMessage(message.room, message.chat);
      }
    });
    this.onUser = this.socketServices.on('user').subscribe(data => {
      let message: any = data;
      switch(message.event) {
      case 'join':
        console.log("home:join:", message);
        this.dataServices.getRoom(true);
        break;
      case 'leave':
        console.log("home:leave:", message);
        break;
      case 'online':
        console.log("home:online:", message);
        this.dataServices.clients = message.user;
        this.events.publish('user:online');
        break;
      case 'offline':
        console.log("home:offline:", message);
        this.dataServices.clients = message.user;
        this.events.publish('user:offline');
        break;
      default:
        console.log("home:unknown:", message);
        break;
      }
    });
  }

  ionViewWillUnload() {
    this.onMessage.unsubscribe();
    this.onUser.unsubscribe();
    this.dataServices.roomsLeave();
    this.socketServices.disconnect();
  }

  registerPages() {
    this.pages = [
      { title: "Beranda", icon: "home", component: DashboardTabsPage },
      { title: "Profil", icon: "person", component: ProfilePage },
      // { title: 'Jadwal', icon: 'list', component: ListsTabsPage },
      { title: "Pengaturan", icon: "settings", component: SettingsPage }
    ];

    this.pagesTwo = [
      { title: "Tentang Aplikasi", icon: "help-circle", component: NoTabsPage },
      { title: "Partnership", icon: "mail", component: ContactUsPage },
      { title: "Laporkan Masalah", icon: "bug", component: TimelinePage }
    ];
  }

  registerBackButton() {
    this.platform.registerBackButtonAction(() => {
      const overlay = this.app._appRoot._overlayPortal.getActive();
      const nav = this.app.getActiveNav();
      const closeDelay = 2000;
      const spamDelay = 500;

      if (overlay && overlay.dismiss) {
        overlay.dismiss();
      } else if (nav.canGoBack()) {
        nav.pop();
      } else if (Date.now() - this.lastBack > spamDelay && !this.allowClose) {
        this.nav.setRoot(DashboardTabsPage, { openTab: 0 });
        this.allowClose = true;
      } else if (Date.now() - this.lastBack < closeDelay && this.allowClose) {
        this.platform.exitApp();
      } else {
        this.nav.setRoot(DashboardTabsPage, { openTab: 0 });
      }
      this.lastBack = Date.now();
    }, 1);
  }

  openPage(page) {
    this.nav.setRoot(page.component, { openTab: page.openTab });
  }

  popPage(page) {
    this.navCtrl.push(page.component);
  }

  logout() {
    let time = new Date();
    this.events.publish("user:logout", time.getTime());
  }
}
