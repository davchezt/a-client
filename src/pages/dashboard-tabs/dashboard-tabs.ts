import { Component, ViewChild } from "@angular/core";
import { NavController, NavParams, Tabs, MenuController, Events } from "ionic-angular";

import { DashboardPage } from "../dashboard/dashboard";
import { ChatPage } from "../chat/chat";
import { CalendarPage } from "../calendar/calendar";
import { SearchPage } from "../search/search";
import { RoomListPage } from "../room-list/room-list";

@Component({
  selector: "page-dashboard-tabs",
  templateUrl: "dashboard-tabs.html"
})
export class DashboardTabsPage {
  result: any = [];
  tab0 = DashboardPage;
  tab1 = SearchPage;
  tab2 = CalendarPage;
  tab3 = RoomListPage;
  // tab3 = ChatPage;

  // params = { nickname: "" };
  // nickname:any = "Agronimis";

  // Revisi
  chatCount: number = 0;
  nickname: string = "";

  @ViewChild("myTabs") tabsRef: Tabs;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menu: MenuController,
    public event: Events
  ) {
    let data = JSON.parse(localStorage.getItem('userData'));
    this.nickname = data.name;
    // event.subscribe('chat:updated', (data) => {
    //   if (this.nickname != data.sender) {
    //     this.chatCount = data.count;
    //   }
    // });
    // event.subscribe('chat:read', () => {
    //   this.chatCount = 0;
    // });
  }

  ionViewDidLoad() {}

  ionViewWillEnter() {}
}
