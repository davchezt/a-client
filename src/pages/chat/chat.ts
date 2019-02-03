import { Component, ViewChild, ChangeDetectorRef } from "@angular/core";
import {
  NavController,
  NavParams,
  ToastController,
  MenuController,
  Content,
  Platform,
  Events,
  ModalController
} from "ionic-angular";
import { Socket } from "ng-socket-io";
import { Observable } from "rxjs/Observable";
import { Http, Headers } from "@angular/http";
import { Common } from "../../providers/common/common";
import { OnlineListPage } from "../online-list/online-list";

@Component({
  selector: "page-chat",
  templateUrl: "chat.html"
})
export class ChatPage {
  @ViewChild(Content) content: Content;
  @ViewChild("messageInput") messageInput;
  @ViewChild("footerInput") footerInput;

  showToolbar: boolean = false;

  messages = [];
  nickname = "";
  message = "";
  to = "DaVchezt";
  connected: boolean = false;
  typingMessage: any;
  typing = false;
  typingUser: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private socket: Socket,
    private toastCtrl: ToastController,
    public menu: MenuController,
    public ref: ChangeDetectorRef,
    platform: Platform,
    private http: Http,
    public common: Common,
    public events: Events,
    public modalCtrl: ModalController
  ) {
    let data = JSON.parse(localStorage.getItem('userData'));
    this.nickname = data.type == 1 ? "(Agronimis) " + data.name : data.name;
    // this.nickname = this.navParams.get("nickname");
    // if (this.nickname == null) {
    //   this.nickname = this.navParams.get("openTab");
    // }

    if (platform.is("android")) {
      window.addEventListener("native.keyboardshow", e => {
        this.footerInput.nativeElement.style.bottom =
          (<any>e).keyboardHeight + "px";
      });

      window.addEventListener("native.keyboardhide", () => {
        this.footerInput.nativeElement.style.bottom = "56px";
      });
    }

    this.getStartTyping().subscribe(message => {
      if (message['from'] != this.nickname) {
        this.typing = true;
        this.typingUser = message['from'];
      }
    });

    this.getStopTyping().subscribe(message => {
      if (message['from'] !=  this.nickname) {
        this.typing = false;
        this.typingUser = message['from'];
      }
    });
 
    this.getMessages().subscribe(message => {
      if (message['from'] == this.nickname) {
        // console.log("OK");
      }
      this.messages.push(message);
      this.scrollBottom();
    });
  }

  ionViewWillEnter() {
    this.messages = [];
    this.getData();
    this.socket.emit('enter-room');
    this.events.publish('read');
  }

  ionViewWillLeave() {
    this.events.publish('unread');
    window.addEventListener('native.keyboardshow', (e) => { console.log(e) });
    window.addEventListener('native.keyboardhide', (e) => { console.log(e) });
    this.socket.emit('leave-room');
  }

  getData() {
    this.common.presentLoading();
    this.http.get('http://localhost:8080/chat', { 
    // this.http.get('https://agrifarm-server.herokuapp.com/chat', { 
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSJ9.6_WA3xB6j192aWBYAub9AmvzJ3m9XhRA7h2t0_STPu4"
      })
    }).subscribe(data => {
      let object = data.json();
      let messagesCount = object.count;
      this.messages = object.chats;
      if (messagesCount >= 5) {
        this.scrollBottom();
      }
      // this.focus();
      this.common.closeLoading();
    }, (error) => {
      console.log(error);
      this.common.closeLoading();
    })
  }

  sendMessage() {
    this.messageInput.setBlur();
    this.socket.emit('add-message', { text: this.message });
    this.message = '';
    this.socket.emit('stop-typing', { from: this.nickname });
    this.socket.emit('new-message');

    this.scrollBottom();
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getStartTyping() {
    let observable = new Observable(observer => {
      this.socket.on('start_typing', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  getStopTyping() {
    let observable = new Observable(observer => {
      this.socket.on('stop_typing', (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  isTyping(event) {
    if (event.keyCode == 13) return;

    this.socket.emit('start-typing', { form: this.nickname });
    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }
    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop-typing', { form: this.nickname });
    }, 2000);
  }

  scrollBottom() {
    var that = this;
    this.content.resize();
    setTimeout(function() {
      that.content.scrollToBottom();
    }, 300);
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      showCloseButton: true,
      closeButtonText: "OK"
    });
    toast.present();
  }

  relative_time = (date: number) => {
    if (!date) return;
    var now = new Date().getTime() / 1000;
    var elapsed = Math.round(now - date);

    if (elapsed <= 1) {
      return "Baru saja";
    }

    var rounded, title;
    if (elapsed > 31104000) {
      rounded = elapsed / 31104000;
      title = "tahun";
    } else if (elapsed > 2592000) {
      rounded = elapsed / 2592000;
      title = "bulan";
    } else if (elapsed > 604800) {
      elapsed = elapsed / 604800;
      title = "minggu";
    } else if (elapsed > 86400) {
      rounded = elapsed / 86400;
      title = "hari";
    } else if (elapsed > 3600) {
      rounded = elapsed / 3600;
      title = "jam";
    } else if (elapsed > 60) {
      rounded = elapsed / 60;
      title = "menit";
    } else if (elapsed >= 1) {
      rounded = elapsed / 1;
      title = "detik";
    }
    if (rounded > 1) {
      rounded = Math.round(rounded);
      return rounded + " " + title + " yang lalu";
    }
  };

  getHHMM = (t: number) => {
    let d = new Date(t * 1000);
    let h = d.getHours();
    let m = d.getMinutes();
    let a = "";
    let ms = "";
    if (h > 0 && h < 12) {
      a = "AM";
    } else {
      if (h == 0) a = "AM";
      else a = "PM";
    }
    if (m < 10) ms = "0" + m;
    else ms = "" + m;
    return (h == 0 || h == 12 ? 12 : h % 12) + ":" + ms + " " + a;
  };

  onScroll($event: any) {
    if ($event) {
      let scrollTop = $event.scrollTop;
      this.showToolbar = scrollTop >= 20;
      this.ref.detectChanges();
    }
  }

  onKeypress(event) {
    if (event.keyCode == 13) console.log("enter");
    // console.log("keypress" + event.keyCode);
  }

  onKeyDown(event) {
    if (event.keyCode == 13) return;
    // console.log("keydown" + event.keyCode);
  }

  onKeyUp(event) {
    if (event.keyCode == 13) return;
    // console.log("keyup" + event.keyCode);
  }

  doRefresh(refresher) {
    this.messages = [];
    this.getData();
    refresher.complete();
  }

  viewOnline() {
    const modal = this.modalCtrl.create(OnlineListPage);
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.messageInput.value += '@' + data + ' '; 
      }
    });
  }

}
