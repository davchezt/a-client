import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { Common } from '../../providers/common/common';
import { RoomChatPage } from '../room-chat/room-chat';
import { RoomAddPage } from '../room-add/room-add';
import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-room-list',
  templateUrl: 'room-list.html',
})
export class RoomListPage {
  @ViewChild(Content) content: Content;
  showToolbar: boolean = false;
  userData: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ref: ChangeDetectorRef,
    public common: Common,
    private dataServices: DataProvider
  ) {
    this.userData = this.dataServices.user;
    this.userData.user_id = parseInt(this.userData.user_id);
  }

  ionViewWillUnload() {
    // console.log("ionViewWillUnload");
  }

  ionViewWillLoad() {
    // console.log("ionViewWillLoad");
  }

  ionViewWillEnter() {
    // this.onNewMessage = this.socketServices.getMessages().subscribe(data => {
    //   let message: any = data;
    //   if (message.chat) {
    //     this.dataServices.newMessage(message.room, message.chat);
    //   }
    //   else if (message.event) {
    //     console.log("room-list:", message);
    //   }
    // });
  }

  ionViewWillLeave() {
    // this.onNewMessage.unsubscribe();
  }

  addRoom() {
    this.navCtrl.push(RoomAddPage, { callback: this.callback });
  }

  openChat(id) {
    if (id) {
      this.navCtrl.push(RoomChatPage, { roomId: id, callback: this.callback });
    }
  }

  callback = (data?) => {
    if (data) console.log(data);
    this.dataServices.getRoom(true);
  };

  onScroll($event: any) {
    if ($event) {
      let scrollTop = $event.scrollTop;
      this.showToolbar = scrollTop >= 20;
      this.ref.detectChanges();
    }
  }

}
