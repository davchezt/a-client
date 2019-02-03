import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams, Content, Platform } from 'ionic-angular';
import { Common } from '../../providers/common/common';
import { Api } from '../../providers/api/api';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'page-room-add',
  templateUrl: 'room-add.html',
})
export class RoomAddPage {
  @ViewChild(Content) content: Content;
  @ViewChild('footerInput') footerInput;
  @ViewChild('messageInput') messageInput;
  showToolbar: boolean = false;
  hasChange: boolean = false;
  hasFocus: boolean = false;
  message:any = '';
  user: any = { user_id: null };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public common: Common,
    public apiService: Api,
    private platform: Platform,
    private http: Http,
    public ref: ChangeDetectorRef,
    private socket: Socket
  ) {
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.user.user_id = parseInt(this.user.user_id);
    if (this.platform.is('android')) {
      window.addEventListener('native.keyboardshow', (e) => {
        this.footerInput.nativeElement.style.bottom = (<any>e).keyboardHeight + 'px';
      });
  
      window.addEventListener('native.keyboardhide', () => {
        this.footerInput.nativeElement.style.bottom = '0';
      });
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad RoomAddPage');
  }

  save() {
    if (this.user.user_id === null) {
      this.user = JSON.parse(localStorage.getItem('userData'));
      this.user.user_id = parseInt(this.user.user_id);
    }
    this.hasChange = false;
    this.messageInput.setBlur();
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMSJ9.6_WA3xB6j192aWBYAub9AmvzJ3m9XhRA7h2t0_STPu4"
    });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({
      "userId": this.user.user_id,
      "subject": this.message
    });
    this.http.post('http://localhost:8080/room', body, options).subscribe(data => {
      let room = data.json();
      console.log(room);
      this.socket.emit('subscribe', room.room_id); // subscribe socket
      this.dismiss();
    }, err => {
      console.log(err);
    })
  }

  checkValue() {
    this.hasFocus = true;
    if (this.message !== '') {
      this.hasChange = true;
    }
    else {
      this.hasChange = false;
    }

  }

  onScroll($event: any) {
    if ($event) {
      let scrollTop = $event.scrollTop;
      this.showToolbar = scrollTop >= 10;
      this.ref.detectChanges();
    }
  }

  scrlTop() {
    this.hasFocus = false;
    var that = this;
    setTimeout(function() {
      that.content.scrollToTop();
    }, 100);
  }

  scrlBottom() {
    this.hasFocus = true;
    var that = this;
    setTimeout(function() {
      that.content.scrollToBottom();
    }, 100);
  }

  setBlurInput() {
    this.messageInput.setBlur();
  }

  dismiss() {
    this.navCtrl.pop().then(() => {
      this.navParams.get("callback")("callback dummy data");
    });
  }

}
