import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Content, Platform, Navbar, Events } from 'ionic-angular';
import { Common } from '../../providers/common/common';
import { Api } from '../../providers/api/api';
import { DataProvider } from '../../providers/data/data';
import { SocketProvider } from '../../providers/socket/socket';

@Component({
  selector: 'page-room-chat',
  templateUrl: 'room-chat.html',
})
export class RoomChatPage {
  @ViewChild(Content) content: Content;
  @ViewChild("messageInput") messageInput;
  @ViewChild("footerInput") footerInput;
  @ViewChild('navbar') navBar: Navbar;

  showToolbar: boolean = false;
  roomId: any = null;
  typingMessage: any;
  message: string = "";
  isReader: boolean = false;
  isAgronomisTyping: boolean = false;
  onMessage: any;
  onRoom: any;
  outRoom: any;
  onStartTyping: any;
  onStopTyping: any;

  agronomis: any = { name: null };
  user: any = { user_id: null };
  subject: any = null;
  created: any  = null;
  chats: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ref: ChangeDetectorRef,
    public events: Events,
    public common: Common,
    public apiService: Api,
    private platform: Platform,
    private dataServices: DataProvider,
    private socketServices: SocketProvider
  ) {
    this.roomId = this.navParams.get('roomId');
    this.user = this.dataServices.user;
    this.user.user_id = parseInt(this.user.user_id);

    if (this.platform.is("android")) {
      window.addEventListener("native.keyboardshow", e => {
        this.footerInput.nativeElement.style.bottom =
          (<any>e).keyboardHeight + "px";
      });

      window.addEventListener("native.keyboardhide", () => {
        this.footerInput.nativeElement.style.bottom = "56px";
      });
    }
  }
  
  ionViewDidLoad() {
    this.onMessage = this.socketServices.on('message').subscribe(data => {
      let chat:any = data;
      if (chat.chat) {
        this.chats.push(chat.chat);
        this.scrollBottom();
      }
    });
    this.onRoom = this.socketServices.on('in-room').subscribe(data => {
      let result:any = data;
      this.isReader = result.room.length === 2 ? true : false;
      if (this.isReader) this.readMessage();
      console.log("room-chat:in-room:", result.room, "isReader:", this.isReader);
    });
    this.outRoom = this.socketServices.on('out-room').subscribe(data => {
      let result:any = data;
      this.isReader = result.room.length === 2 ? true : false;
      console.log("room-chat:out-room:", result.room, "isReader:", this.isReader);
    });
    this.onStartTyping = this.socketServices.on('start-typing').subscribe(data => {
      let message:any = data;
      if (message.user.toString() === this.agronomis.id.toString()) {
        // console.log('start-typing');
        this.isAgronomisTyping = true;
      }
    });
    this.onStopTyping = this.socketServices.on('stop-typing').subscribe(data => {
      let message:any = data;
      if (message.user.toString() === this.agronomis.id.toString()) {
        // console.log('stop-typing');
        this.isAgronomisTyping = false;
      }
    });
    this.events.subscribe('user:online', () => {
      this.agronomis.online = this.dataServices.isOnline(parseInt(this.agronomis.id));
    });
    this.events.subscribe('user:offline', () => {
      this.agronomis.online = this.dataServices.isOnline(parseInt(this.agronomis.id));
      this.isAgronomisTyping = false;
    });
    this.getRoom();
    this.readChat();
    this.navBar.backButtonClick = (ev:UIEvent) => {
      this.navCtrl.pop().then(() => {
        this.navParams.get("callback")();
      });
    }
  }

  ionViewWillLeave() {
    this.socketServices.emit('out-room', {
      room: this.roomId,
      userId: this.user.user_id
    });
    this.onMessage.unsubscribe();
    this.onRoom.unsubscribe();
    this.outRoom.unsubscribe();
    this.onStartTyping.unsubscribe();
    this.onStopTyping.unsubscribe();
  }

  dismiss() {
    this.navCtrl.pop().then(() => {
      this.navParams.get("callback")();
    });
  }

  onScroll($event: any) {
    if ($event) {
      let scrollTop = $event.scrollTop;
      this.showToolbar = scrollTop >= 80;
      this.ref.detectChanges();
    }
  }

  scrollBottom() {
    var that = this;
    this.content.resize();
    setTimeout(function() {
      if (that.content) {
        that.content.scrollToBottom();
      }
    }, 300);
  }

  isTyping(event) {
    if (event.keyCode == 13) return;

    this.socketServices.emit('start-typing', { room: this.roomId, form: this.user.user_id });
    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }
    this.typingMessage = setTimeout(() => {
      this.socketServices.emit('stop-typing', { room: this.roomId, form: this.user.user_id });
    }, 2000);
  }

  getRoom() {
    this.dataServices.getChat(this.roomId)
    .subscribe(data => {
      let room:any = data;
      this.subject = room.subject;
      this.created = room.created;
      this.chats = room.chat;
      this.chats.reverse();
      this.dataServices.getAgronomis(room.agronomis).subscribe(user => {
        this.agronomis = user;
        this.agronomis.online = this.dataServices.isOnline(room.agronomis);
      });
      if (this.chats.length >= 5) {
        this.scrollBottom();
      }
    }, error => {
      console.log(error);
    });
  }

  sendMessage() {
    this.messageInput.setBlur();
    this.postMessage();
    this.message = '';
    this.socketServices.emit('stop-typing', { room: this.roomId, from: this.user.user_id });

    this.scrollBottom();
  }

  postMessage() {
    let data = {
      "from": this.user.user_id,
      "text": this.message,
      "read": this.isReader
    };
    this.dataServices.addChat(this.roomId, data)
    .subscribe(data => {
      // console.log(data);
    }, err => {
      console.log(err);
    });
  }

  readChat() {
    this.dataServices.readChat(this.roomId).subscribe(data => {
      // console.log(data);
      this.socketServices.emit('in-room', {
        room: this.roomId,
        userId: this.user.user_id
      });
    }, err => {
      console.log(err);
    })
  }

  readMessage() {
    var that = this;
    Object.keys(this.chats).forEach(function(id) {
      that.chats[id].read = true;
      // console.log(that.chats[id].read);
    });
  }

  doRefresh(refresher) {
    this.chats = [];
    this.getRoom();
    refresher.complete();
  }

}
